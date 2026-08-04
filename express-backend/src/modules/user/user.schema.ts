import { z } from 'zod'

const emptyObjectSchema = z.object({}).default({})

export const createUserRequestSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, '用户名至少需要2个字符')
      .max(50, '用户名不能超过50个字符'),
    email: z
      .string()
      .trim()
      .email('邮箱格式不正确')
      .toLowerCase()
  }),
  params: emptyObjectSchema,
  query: emptyObjectSchema
})