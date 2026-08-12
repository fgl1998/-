import {createUserSchema} from './user.schema.js'
import {z} from 'zod'
export interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}

// export interface CreateUserInput{
//   name:string
//   email:string
// }

export type CreateUserInput = z.infer<typeof createUserSchema>