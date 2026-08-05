import type { User } from './user.entity.js'

export interface FindUserPageInput {
  offset: number
  limit: number
}

export interface CreateUserRecord {
  name: string
  email: string
}

export interface UserRepository {
  findPage(input: FindUserPageInput): Promise<User[]>
  count(): Promise<number>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserRecord): Promise<User>
  deleteById(id: number): Promise<boolean>
}

export class DuplicateUserEmailError extends Error {
  constructor() {
    super('User email already exists')
    this.name = 'DuplicateUserEmailError'
  }
}
