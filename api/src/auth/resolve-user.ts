import {
  CognitoIdentityProviderClient,
  ListUsersCommand
} from '@aws-sdk/client-cognito-identity-provider'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

export type AuthUser = {
  userId: string
  cognitoUsername: string
  cognitoSub: string
}

const cognitoClient = new CognitoIdentityProviderClient({})

let jwks: ReturnType<typeof jwksClient> | undefined

function getJwks() {
  const jwksUri = process.env.JKWS_URI || process.env.JWKS_URI
  if (!jwksUri) {
    throw new Error('JKWS_URI is not set')
  }
  if (!jwks) {
    jwks = jwksClient({ jwksUri })
  }
  return jwks
}

async function getSigningKey(kid: string): Promise<string> {
  const key = await getJwks().getSigningKey(kid)
  return key.getPublicKey()
}

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) return null
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

/**
 * Local-only bypass for Expo/dev before Cognito is deployed.
 * Enabled when ALLOW_LOCAL_AUTH=true (local server sets this by default).
 * Use: Authorization: Bearer local:<userId>
 */
function resolveLocalAuth(token: string): AuthUser | null {
  if (process.env.ALLOW_LOCAL_AUTH !== 'true') return null
  if (!token.startsWith('local:')) return null

  const userId = token.slice('local:'.length).trim()
  if (!userId) return null

  return {
    userId,
    cognitoUsername: userId,
    cognitoSub: userId
  }
}

async function resolveCognitoAuth(token: string): Promise<AuthUser> {
  const issuerUrl = process.env.ISSUER_URL
  const userPoolId = process.env.USER_POOL_ID
  if (!issuerUrl || !userPoolId) {
    throw new Error('ISSUER_URL and USER_POOL_ID must be set for Cognito auth')
  }

  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
    throw new Error('Invalid token structure')
  }

  const signingKey = await getSigningKey(decoded.header.kid)
  const verifiedToken = jwt.verify(token, signingKey, {
    issuer: issuerUrl
  }) as JwtPayload

  if (!verifiedToken.sub) {
    throw new Error('Missing sub claim')
  }

  const listResult = await cognitoClient.send(
    new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `sub = "${verifiedToken.sub}"`,
      Limit: 1
    })
  )

  const user = listResult.Users?.[0]
  if (!user?.Username) {
    throw new Error(`User not found for sub: ${verifiedToken.sub}`)
  }

  const userId = user.Attributes?.find(attribute => attribute.Name === 'custom:id')?.Value
  if (!userId) {
    throw new Error(`Missing custom:id for sub: ${verifiedToken.sub}`)
  }

  return {
    userId,
    cognitoUsername: user.Username,
    cognitoSub: verifiedToken.sub
  }
}

/** Resolve the signed-in Spot user from an Authorization header value. */
export async function resolveAuthUser(
  authorizationHeader: string | undefined
): Promise<AuthUser | null> {
  const token = extractBearerToken(authorizationHeader)
  if (!token) return null

  const local = resolveLocalAuth(token)
  if (local) return local

  return resolveCognitoAuth(token)
}
