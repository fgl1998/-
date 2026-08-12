import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'name不能为空'),

  email: z
    .string()
    .trim()
    .email('email格式不正确')
    .toLowerCase()
})