import type { User } from '../../src/modules/user/user.entity.js'
import {
  DuplicateUserEmailError,
  type CreateUserRecord,
  type FindUserPageInput,
  type UserRepository
} from '../../src/modules/user/user.repository.js'

export class FakeUserRepository implements UserRepository {
  public readonly users: User[]
  public lastPageInput: FindUserPageInput | null = null
  public failNextCreateWithDuplicate = false
  private nextId: number

  constructor(seed: User[] = []) {
    this.users = [...seed]
    this.nextId = Math.max(0, ...seed.map((user) => user.id)) + 1
  }

  async findPage(input: FindUserPageInput): Promise<User[]> {
    this.lastPageInput = input
    return [...this.users]
      .sort((a, b) => b.id - a.id)
      .slice(input.offset, input.offset + input.limit)
  }

  async count(): Promise<number> {
    return this.users.length
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }

  async create(input: CreateUserRecord): Promise<User> {
    if (this.failNextCreateWithDuplicate) {
      this.failNextCreateWithDuplicate = false
      throw new DuplicateUserEmailError()
    }

    const user: User = {
      id: this.nextId++,
      ...input,
      createdAt: new Date('2026-08-03T08:00:00.000Z')
    }
    this.users.push(user)
    return user
  }

  async deleteById(id: number): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) return false
    this.users.splice(index, 1)
    return true
  }
}
