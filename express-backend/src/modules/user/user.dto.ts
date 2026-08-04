import type { z } from 'zod'
import type { createUserRequestSchema } from './user.schema.js'

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>
export type CreateUserDto = CreateUserRequest['body']

export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}