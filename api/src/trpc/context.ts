import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { resolveAuthUser } from '../auth/resolve-user'
import { UserRepository } from '../repository/user.repository'
import { UserService } from '../service/user.service'

export type AppContext = {
  /** Spot user id (`custom:id`) when Authorization was valid; otherwise null. */
  userId: string | null
  userService: UserService
}

function createServices(): UserService {
  const tableName = process.env.DYNAMODB_TABLE_NAME
  return new UserService(new UserRepository(tableName || undefined))
}

function headerValue(
  headers: Record<string, string | undefined> | undefined,
  name: string
): string | undefined {
  if (!headers) return undefined
  const direct = headers[name] ?? headers[name.toLowerCase()]
  if (direct) return direct
  const matched = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase())
  return matched?.[1]
}

export async function createContextFromAuthHeader(
  authorizationHeader: string | undefined
): Promise<AppContext> {
  let userId: string | null = null

  try {
    const authUser = await resolveAuthUser(authorizationHeader)
    userId = authUser?.userId ?? null
  } catch (error) {
    console.warn('Auth resolution failed:', error)
    userId = null
  }

  return {
    userId,
    userService: createServices()
  }
}

export async function createLambdaContext({
  event
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>): Promise<AppContext> {
  // Prefer verifying the Bearer token in tRPC so local + Lambda share one auth path.
  // If API Gateway authorizer is later enabled, its context is a fallback.
  const authorization = headerValue(event.headers, 'authorization')
  const fromToken = await createContextFromAuthHeader(authorization)
  if (fromToken.userId) return fromToken

  const requestContext = event.requestContext as APIGatewayProxyEventV2['requestContext'] & {
    authorizer?: { lambda?: { userId?: string }; userId?: string }
  }
  const authorizerUserId =
    requestContext.authorizer?.lambda?.userId ?? requestContext.authorizer?.userId ?? null

  return {
    userId: authorizerUserId,
    userService: createServices()
  }
}
