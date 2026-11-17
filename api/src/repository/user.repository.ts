import { createUserEntity, type UserRecord } from '../db/entities/user'

export type CreateUserInput = {
  userId: string
  email: string
  firstName?: string
  lastName?: string
}

function toUserRecord(data: {
  userId: string
  firstName: string
  lastName: string
  email: string
  createdAt?: string
  updatedAt?: string
}): UserRecord {
  return {
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString()
  }
}

export class UserRepository {
  private _users?: ReturnType<typeof createUserEntity>

  constructor(private readonly tableName?: string) {}

  private get users() {
    if (!this._users) {
      this._users = createUserEntity(this.tableName)
    }
    return this._users
  }

  async getById(userId: string): Promise<UserRecord | null> {
    const result = await this.users.get({ userId }).go()
    return result.data ? toUserRecord(result.data) : null
  }

  async getByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.users.query.byEmail({ email }).go()
    const first = result.data[0]
    return first ? toUserRecord(first) : null
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    const result = await this.users
      .create({
        userId: input.userId,
        email: input.email,
        firstName: input.firstName ?? '',
        lastName: input.lastName ?? ''
      })
      .go()

    return toUserRecord(result.data)
  }

  async ensureUser(input: CreateUserInput): Promise<UserRecord> {
    const existing = await this.getById(input.userId)
    if (existing) return existing
    return this.create(input)
  }

  async updateNames(userId: string, firstName: string, lastName: string): Promise<UserRecord> {
    const result = await this.users
      .patch({ userId })
      .set({ firstName, lastName })
      .go({ response: 'all_new' })

    if (!result.data) {
      throw new Error(`User not found: ${userId}`)
    }

    return toUserRecord(result.data)
  }

  async updateEmail(userId: string, email: string): Promise<UserRecord> {
    const result = await this.users.patch({ userId }).set({ email }).go({ response: 'all_new' })

    if (!result.data) {
      throw new Error(`User not found: ${userId}`)
    }

    return toUserRecord(result.data)
  }
}
