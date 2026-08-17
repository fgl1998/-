import {z} from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().trim().min(1).max(20),
  email: z.string().trim().email("邮箱格式错误"),
  password: z.string().min(6).max(20),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export interface CreateUserData {
  username: string
  email: string
  passwordHash: string
}

export const LoginSchema = z.object({
  username: z.string().trim().min(1).max(20),
  password: z.string().min(6).max(20),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const UpdateUserSchema = z.object({
  email: z.string().trim().email("邮箱格式错误").optional(),
  password: z.string().min(6).max(20).optional(),
  bio: z.string().max(100).optional(),
  image: z.string().max(100).optional(),
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
