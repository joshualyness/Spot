import {
  UserRepository,
  type CreateUserInput,
  type UpdateUserInput
} from '../repository/user.repository'
import type { UserRecord } from '../db/entities/user'

export class UserService {
  constructor(private readonly users: UserRepository) {}

  getUser(userId: string): Promise<UserRecord | null> {
    return this.users.getById(userId)
  }

  updateUser(userId: string, input: UpdateUserInput): Promise<UserRecord> {
    return this.users.update(userId, input)
  }

  deleteUser(userId: string): Promise<void> {
    return this.users.delete(userId)
  }

  /** Cognito post-confirmation only — not exposed on tRPC. */
  ensureUser(input: CreateUserInput): Promise<UserRecord> {
    return this.users.ensureUser(input)
  }
}
