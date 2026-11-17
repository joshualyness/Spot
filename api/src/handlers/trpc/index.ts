import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda'
import { createLambdaContext } from '../../trpc/context'
import { appRouter } from '../../trpc/router'

const trpcHandler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createLambdaContext
})

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  const result = await trpcHandler(event, context)
  return {
    ...result,
    headers: {
      ...(result.headers ?? {}),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization,content-type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
  }
}
