import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

let documentClient: DynamoDBDocumentClient | undefined

export function getDocumentClient(): DynamoDBDocumentClient {
  if (documentClient) return documentClient

  const client = new DynamoDBClient({})
  documentClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true
    }
  })
  return documentClient
}

export function getTableName(): string {
  const tableName = process.env.DYNAMODB_TABLE_NAME
  if (!tableName) {
    throw new Error('DYNAMODB_TABLE_NAME is not set')
  }
  return tableName
}
