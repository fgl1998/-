import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../../src/app.js'
import { createUserModule } from '../../src/modules/user/user.module.js'
import { FakeUserRepository } from '../helpers/fake-user.repository.js'

function createTestApp() {
  const repository = new FakeUserRepository()
  return createApp({
    corsOrigins: ['http://localhost:5173'],
    readinessCheck: async () => undefined,
    userRouter: createUserModule(repository)
  })
}

describe('User API', () => {
  it('creates a normalized user', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/users')
      .send({
        name: '  张三  ',
        email: ' ZhangSan@Example.COM '
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      success: true,
      code: 'USER_CREATED',
      message: '用户创建成功',
      data: {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        createdAt: '2026-08-03T08:00:00.000Z'
      }
    })
  })

  it('lists users with pagination metadata', async () => {
    const app = createTestApp()
    await request(app)
      .post('/api/v1/users')
      .send({ name: '张三', email: 'zhangsan@example.com' })

    const response = await request(app).get(
      '/api/v1/users?page=1&pageSize=10'
    )

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      success: true,
      code: 'USER_LIST_FETCHED',
      data: [{ name: '张三' }],
      meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 }
    })
  })

  it('returns one user and deletes it', async () => {
    const app = createTestApp()
    await request(app)
      .post('/api/v1/users')
      .send({ name: '张三', email: 'zhangsan@example.com' })

    const fetched = await request(app).get('/api/v1/users/1')
    expect(fetched.status).toBe(200)
    expect(fetched.body.code).toBe('USER_FETCHED')

    const removed = await request(app).delete('/api/v1/users/1')
    expect(removed.status).toBe(200)
    expect(removed.body).toMatchObject({
      success: true,
      code: 'USER_DELETED',
      data: null
    })
  })

  it('rejects invalid input before the Controller', async () => {
    const response = await request(createTestApp())
      .post('/api/v1/users')
      .send({ name: 'A', email: 'wrong' })

    expect(response.status).toBe(400)
    expect(response.body.code).toBe('VALIDATION_ERROR')
  })

  it('returns stable business and route-not-found errors', async () => {
    const app = createTestApp()

    const missingUser = await request(app)
      .get('/api/v1/users/999')
      .set('x-request-id', 'missing-user-request')
    expect(missingUser.status).toBe(404)
    expect(missingUser.body).toMatchObject({
      code: 'USER_NOT_FOUND',
      requestId: 'missing-user-request'
    })

    const missingRoute = await request(app).get('/does-not-exist')
    expect(missingRoute.status).toBe(404)
    expect(missingRoute.body.code).toBe('ROUTE_NOT_FOUND')
  })

  it('separates liveness from database readiness', async () => {
    const app = createTestApp()

    const live = await request(app).get('/health/live')
    const ready = await request(app).get('/health/ready')

    expect(live.status).toBe(200)
    expect(live.body.code).toBe('HEALTH_LIVE')
    expect(ready.status).toBe(200)
    expect(ready.body.code).toBe('HEALTH_READY')
  })
})
