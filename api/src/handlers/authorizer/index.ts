import {
  CognitoIdentityProviderClient,
  ListUsersCommand
} from '@aws-sdk/client-cognito-identity-provider'
import type { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerWithContextResult } from 'aws-lambda'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const ISSUER_URL = process.env.ISSUER_URL!
const JWKS_URI = process.env.JKWS_URI!
const USER_POOL_ID = process.env.USER_POOL_ID!

const cognitoClient = new CognitoIdentityProviderClient({})
const jwks = jwksClient({ jwksUri: JWKS_URI })

type AuthorizerContext = {
  userId: string
  cognitoUsername: string
}

const getSigningKey = async (kid: string): Promise<string> => {
  const key = await jwks.getSigningKey(kid)
  return key.getPublicKey()
}

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthorizerContext | undefined>> => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization
    const token = authHeader?.replace(/^Bearer\s+/i, '')

    if (!token) {
      throw new Error('Missing authorization token')
    }

    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new Error('Invalid token structure')
    }

    const signingKey = await getSigningKey(decoded.header.kid)
    const verifiedToken = jwt.verify(token, signingKey, {
      issuer: ISSUER_URL
    }) as JwtPayload

    if (!verifiedToken.sub) {
      throw new Error('Missing sub claim')
    }

    const listResult = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: USER_POOL_ID,
        Filter: `sub = "${verifiedToken.sub}"`
      })
    )

    const user = listResult.Users?.[0]
    if (!user) {
      throw new Error(`User not found for sub: ${verifiedToken.sub}`)
    }

    const userId = user.Attributes?.find(attribute => attribute.Name === 'custom:id')?.Value
    if (!userId) {
      throw new Error(`Missing custom:id for sub: ${verifiedToken.sub}`)
    }
    if (!user.Username) {
      throw new Error(`Missing username for sub: ${verifiedToken.sub}`)
    }

    return {
      isAuthorized: true,
      context: {
        userId,
        cognitoUsername: user.Username
      }
    }
  } catch (error) {
    console.error('Authorization error:', error)
    return { isAuthorized: false, context: undefined }
  }
}
