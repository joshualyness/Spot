import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'
import type { EventBridgeEvent } from 'aws-lambda'
import { UserRepository } from '../../repository/user.repository'

type VerifyUserAttributeDetail = {
  additionalEventData?: {
    sub?: string
  }
  requestParameters?: {
    attributeName?: string
  }
}

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (
  event: EventBridgeEvent<'AWS API Call via CloudTrail', VerifyUserAttributeDetail>
): Promise<void> => {
  if (event.detail.requestParameters?.attributeName !== 'email') {
    console.log('EmailAuthorised: Ignoring non-email attribute verification')
    return
  }

  const userSub = event.detail.additionalEventData?.sub
  if (!userSub) {
    throw new Error('EmailAuthorised: VerifyUserAttribute event is missing additionalEventData.sub')
  }

  const userPoolId = process.env.USER_POOL_ID
  const tableName = process.env.DYNAMODB_TABLE_NAME
  if (!userPoolId || !tableName) {
    throw new Error('EmailAuthorised: USER_POOL_ID and DYNAMODB_TABLE_NAME must be configured')
  }

  const response = await cognitoClient.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `sub = "${userSub}"`,
      Limit: 1
    })
  )

  const attributes = Object.fromEntries(
    (response.Users?.[0]?.Attributes ?? []).flatMap(attribute =>
      attribute.Name && attribute.Value ? [[attribute.Name, attribute.Value]] : []
    )
  )

  const email = attributes.email
  if (!email || attributes.email_verified !== 'true') {
    throw new Error(`EmailAuthorised: Cognito user ${userSub} does not have a verified email`)
  }

  const userId = attributes['custom:id']
  if (!userId) {
    console.log(`EmailAuthorised: No custom:id for Cognito user ${userSub}, skipping`)
    return
  }

  const users = new UserRepository(tableName)
  const existing = await users.getById(userId)
  if (!existing) {
    console.log(`EmailAuthorised: No Dynamo profile for ${userId}, skipping`)
    return
  }

  await users.updateEmail(userId, email)
  console.log(`EmailAuthorised: Updated email for user ${userId}`)
}
