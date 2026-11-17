import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2 } from 'aws-lambda'
import { UserRepository } from '../repository/user.repository'
import { UserService } from '../service/user.service'

export type AppContext = {
  userId: string | null
  userService: UserService
}

function createServices(): UserService {
  const tableName = process.env.DYNAMODB_TABLE_NAME
  const users = new UserRepository(tableName || undefined)
  return new UserService(users)
}

export function createContextFromUserId(userId: string | null): AppContext {
  return {
    userId,
    userService: createServices()
  }
}

export function createLambdaContext({
  event
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>): AppContext {
  const requestContext = event.requestContext as APIGatewayProxyEventV2['requestContext'] & {
    authorizer?: { lambda?: { userId?: string }; userId?: string }
  }
  const authorizer = requestContext.authorizer
  const userId = authorizer?.lambda?.userId ?? authorizer?.userId ?? null
  return createContextFromUserId(userId)
}

export function createLocalContext(userId: string | null = null): AppContext {
  return createContextFromUserId(userId)
}
