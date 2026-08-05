import { describe, expect, it } from 'vitest'
import {
  createUserRequestSchema,
  listUsersRequestSchema,
  userIdRequestSchema
} from '../../src/modules/user/user.schema.js'

describe('user request schemas', () => {
  it('normalizes create-user input', () => {
    const result = createUserRequestSchema.parse({
      body: {
        name: '  张三  ',
        email: ' ZhangSan@Example.COM '
      },
      params: {},
      query: {}
    })

    expect(result.body).toEqual({
      name: '张三',
      email: 'zhangsan@example.com'
    })
  })

  it('coerces a positive integer user ID', () => {
    const result = userIdRequestSchema.parse({
      body: {},
      params: { id: '42' },
      query: {}
    })

    expect(result.params.id).toBe(42)
  })

  it.each(['0', '-1', '1.5', 'abc'])('rejects invalid user ID %s', (id) => {
    const result = userIdRequestSchema.safeParse({
      body: {},
      params: { id },
      query: {}
    })

    expect(result.success).toBe(false)
  })

  it('provides safe pagination defaults', () => {
    const result = listUsersRequestSchema.parse({
      body: {},
      params: {},
      query: {}
    })

    expect(result.query).toEqual({ page: 1, pageSize: 20 })
  })

  it('rejects page sizes above 100', () => {
    const result = listUsersRequestSchema.safeParse({
      body: {},
      params: {},
      query: { pageSize: '101' }
    })

    expect(result.success).toBe(false)
  })
})
