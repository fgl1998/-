import type { z } from 'zod'
import type {
  createUserRequestSchema,
  listUsersRequestSchema,
  userIdRequestSchema
} from './user.schema.js'

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>
export type CreateUserDto = CreateUserRequest['body']

export type UserIdRequest = z.infer<typeof userIdRequestSchema>

export type ListUsersRequest = z.infer<typeof listUsersRequestSchema>
export type ListUsersDto = ListUsersRequest['query']

export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}
