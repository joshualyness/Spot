import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminUpdateUserAttributesCommand
} from '@aws-sdk/client-cognito-identity-provider'
import type { PostConfirmationTriggerEvent } from 'aws-lambda'
import { randomUUID } from 'crypto'
import { UserRepository } from '../../repository/user.repository'

const cognitoClient = new CognitoIdentityProviderClient({})

export const handler = async (
  event: PostConfirmationTriggerEvent
): Promise<PostConfirmationTriggerEvent> => {
  const existingId = event.request.userAttributes['custom:id']
  const userId = existingId ?? randomUUID()
  const email = event.request.userAttributes.email ?? ''
  const firstName = event.request.userAttributes.given_name ?? ''
  const lastName = event.request.userAttributes.family_name ?? ''

  if (!existingId) {
    await cognitoClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: event.userPoolId,
        Username: event.userName,
        UserAttributes: [{ Name: 'custom:id', Value: userId }]
      })
    )
  }

  try {
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: event.userName,
        GroupName: 'user'
      })
    )
  } catch (error) {
    console.error(`PostConfirmation: failed to add ${event.userName} to user group`, error)
    throw error
  }

  const tableName = process.env.DYNAMODB_TABLE_NAME
  if (!tableName) {
    console.warn('PostConfirmation: DYNAMODB_TABLE_NAME not set, skipping profile creation')
    return event
  }

  const users = new UserRepository(tableName)
  await users.ensureUser({
    userId,
    email,
    firstName,
    lastName
  })

  console.log(`PostConfirmation: ensured user profile ${userId}`)
  return event
}
