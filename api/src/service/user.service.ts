import { UserRepository, type CreateUserInput } from '../repository/user.repository'
import type { UserRecord } from '../db/entities/user'

export class UserService {
  constructor(private readonly users: UserRepository) {}

  getById(userId: string): Promise<UserRecord | null> {
    return this.users.getById(userId)
  }

  ensureUser(input: CreateUserInput): Promise<UserRecord> {
    return this.users.ensureUser(input)
  }

  updateNames(userId: string, firstName: string, lastName: string): Promise<UserRecord> {
    return this.users.updateNames(userId, firstName, lastName)
  }
}
