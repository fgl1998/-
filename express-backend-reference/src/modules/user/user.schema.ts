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

export const userIdRequestSchema = z.object({
  body: emptyObjectSchema,
  params: z.object({
    id: z.coerce.number().int().positive()
  }),
  query: emptyObjectSchema
})

export const listUsersRequestSchema = z.object({
  body: emptyObjectSchema,
  params: emptyObjectSchema,
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(20)
  })
})
