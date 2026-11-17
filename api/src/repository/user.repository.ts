import { createUserEntity, type UserRecord } from '../db/entities/user'

export type CreateUserInput = {
  userId: string
  email: string
  firstName?: string
  lastName?: string
}

export type UpdateUserInput = {
  firstName?: string
  lastName?: string
  email?: string
}

/** Process-local store used when DYNAMODB_TABLE_NAME is unset (local tRPC server). */
const memoryUsers = new Map<string, UserRecord>()

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

function seedMemoryUser(userId: string): UserRecord {
  const existing = memoryUsers.get(userId)
  if (existing) return existing

  const created = toUserRecord({
    userId,
    email: `${userId}@spot.local`,
    firstName: 'Alex',
    lastName: 'Spot'
  })
  memoryUsers.set(userId, created)
  return created
}

export class UserRepository {
  private readonly useMemory: boolean
  private _users?: ReturnType<typeof createUserEntity>

  constructor(private readonly tableName?: string) {
    this.useMemory = !tableName
  }

  private get users() {
    if (!this._users) {
      this._users = createUserEntity(this.tableName)
    }
    return this._users
  }

  async getById(userId: string): Promise<UserRecord | null> {
    if (this.useMemory) {
      return memoryUsers.get(userId) ?? seedMemoryUser(userId)
    }

    const result = await this.users.get({ userId }).go()
    return result.data ? toUserRecord(result.data) : null
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    if (this.useMemory) {
      const created = toUserRecord({
        userId: input.userId,
        email: input.email,
        firstName: input.firstName ?? '',
        lastName: input.lastName ?? ''
      })
      memoryUsers.set(input.userId, created)
      return created
    }

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

  /** Used by Cognito post-confirmation to create the profile once. */
  async ensureUser(input: CreateUserInput): Promise<UserRecord> {
    const existing = await this.getById(input.userId)
    if (existing) return existing
    return this.create(input)
  }

  async update(userId: string, input: UpdateUserInput): Promise<UserRecord> {
    if (this.useMemory) {
      const existing = memoryUsers.get(userId) ?? seedMemoryUser(userId)
      const updated = toUserRecord({
        ...existing,
        firstName: input.firstName ?? existing.firstName,
        lastName: input.lastName ?? existing.lastName,
        email: input.email ?? existing.email,
        updatedAt: new Date().toISOString()
      })
      memoryUsers.set(userId, updated)
      return updated
    }

    const patch = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined)
    ) as UpdateUserInput

    if (Object.keys(patch).length === 0) {
      const existing = await this.getById(userId)
      if (!existing) throw new Error(`User not found: ${userId}`)
      return existing
    }

    const result = await this.users.patch({ userId }).set(patch).go({ response: 'all_new' })
    if (!result.data) {
      throw new Error(`User not found: ${userId}`)
    }

    return toUserRecord(result.data)
  }

  async delete(userId: string): Promise<void> {
    if (this.useMemory) {
      memoryUsers.delete(userId)
      return
    }

    await this.users.delete({ userId }).go()
  }
}
