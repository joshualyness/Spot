import { Entity } from 'electrodb'
import { getDocumentClient, getTableName } from '../client'

export type UserRecord = {
  userId: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
}

export function createUserEntity(tableName?: string) {
  return new Entity(
    {
      model: {
        entity: 'user',
        version: '1',
        service: 'spot'
      },
      attributes: {
        userId: {
          type: 'string',
          required: true
        },
        firstName: {
          type: 'string',
          required: true
        },
        lastName: {
          type: 'string',
          required: true
        },
        email: {
          type: 'string',
          required: true
        },
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
          pk: {
            field: 'pk',
            composite: ['userId']
          },
          sk: {
            field: 'sk',
            composite: [],
            template: 'USER'
          }
        },
        byEmail: {
          index: 'gsi1',
          pk: {
            field: 'gsi1pk',
            composite: ['email']
          },
          sk: {
            field: 'gsi1sk',
            composite: [],
            template: 'USER'
          }
        }
      }
    },
    {
      client: getDocumentClient(),
      table: tableName ?? getTableName()
    }
  )
}
