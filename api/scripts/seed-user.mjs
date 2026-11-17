import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity } from 'electrodb'

const tableName = process.env.DYNAMODB_TABLE_NAME
if (!tableName) throw new Error('DYNAMODB_TABLE_NAME required')

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true }
})

const users = new Entity(
  {
    model: { entity: 'user', version: '1', service: 'spot' },
    attributes: {
      userId: { type: 'string', required: true },
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      email: { type: 'string', required: true },
      createdAt: {
        type: 'string',
        readOnly: true,
        default: () => new Date().toISOString()
      },
      updatedAt: {
        type: 'string',
        watch: '*',
        set: () => new Date().toISOString(),
        readOnly: true
      }
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['userId'] },
        sk: { field: 'sk', composite: [], template: 'USER' }
      },
      byEmail: {
        index: 'gsi1',
        pk: { field: 'gsi1pk', composite: ['email'] },
        sk: { field: 'gsi1sk', composite: [], template: 'USER' }
      }
    }
  },
  { client, table: tableName }
)

const userId = process.argv[2] || 'live-demo-user'
const email = process.argv[3] || `${userId}@spot.local`

const existing = await users.get({ userId }).go()
if (existing.data) {
  console.log(JSON.stringify({ existing: existing.data }, null, 2))
  process.exit(0)
}

const created = await users
  .create({
    userId,
    email,
    firstName: 'Jamie',
    lastName: 'Spot'
  })
  .go()

console.log(JSON.stringify({ created: created.data }, null, 2))
