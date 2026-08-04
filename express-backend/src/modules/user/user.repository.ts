import type { User } from './user.entity.js'

export interface CreateUserRecord {
  name: string
  email: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserRecord): Promise<User>
}

export class DuplicateUserEmailError extends Error {
  constructor() {
    super('User email already exists')
    this.name = 'DuplicateUserEmailError'
  }
}