import {type User } from './user.entity.js'
import {type CreateUserData,type LoginInput,type UpdateUserInput,type UpdateUserData } from './user.schema.js'

export interface UserRepository  {
  create(input: CreateUserData): Promise<User>
  findById(id: number): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  updateUserById(id: number, input: UpdateUserData):Promise<User|null>
}

