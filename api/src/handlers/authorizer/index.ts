import type {
  APIGatewayRequestAuthorizerEventV2,
  APIGatewaySimpleAuthorizerWithContextResult
} from 'aws-lambda'
import { resolveAuthUser } from '../../auth/resolve-user'

type AuthorizerContext = {
  userId: string
  cognitoUsername: string
}

export const handler = async (
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewaySimpleAuthorizerWithContextResult<AuthorizerContext | undefined>> => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization
    const authUser = await resolveAuthUser(authHeader)

    if (!authUser) {
      return { isAuthorized: false, context: undefined }
    }

    return {
      isAuthorized: true,
      context: {
        userId: authUser.userId,
        cognitoUsername: authUser.cognitoUsername
      }
    }
  } catch (error) {
    console.error('Authorization error:', error)
    return { isAuthorized: false, context: undefined }
  }
}
