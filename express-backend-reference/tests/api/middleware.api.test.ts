import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { errorHandler } from '../../src/middlewares/error.middleware.js'
import { requestContext } from '../../src/middlewares/request-context.middleware.js'
import { validate } from '../../src/middlewares/validate.middleware.js'

function createTestApp() {
  const app = express()
  app.use(requestContext)
  app.use(express.json())
  app.post(
    '/validate',
    validate(
      z.object({
        body: z.object({
          email: z.string().trim().email().toLowerCase()
        }),
        params: z.object({}),
        query: z.object({})
      })
    ),
    (_req, res) => {
      res.json(res.locals.validated)
    }
  )
  app.get('/unexpected', () => {
    throw new Error('database password must stay private')
  })
  app.use(errorHandler)
  return app
}

describe('HTTP infrastructure', () => {
  it('stores normalized and validated input for the controller', async () => {
    const response = await request(createTestApp())
      .post('/validate')
      .send({ email: ' USER@Example.COM ' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      body: { email: 'user@example.com' },
      params: {},
      query: {}
    })
  })

  it('returns normalized validation issues with a request ID', async () => {
    const response = await request(createTestApp())
      .post('/validate')
      .set('x-request-id', 'request-from-client')
      .send({ email: 'not-an-email' })

    expect(response.status).toBe(400)
    expect(response.headers['x-request-id']).toBe('request-from-client')
    expect(response.body).toMatchObject({
      success: false,
      code: 'VALIDATION_ERROR',
      message: '请求参数校验失败',
      requestId: 'request-from-client'
    })
    expect(response.body.details[0]).toMatchObject({
      path: 'body.email',
      code: 'invalid_format'
    })
  })

  it('does not expose unknown exception messages', async () => {
    const response = await request(createTestApp()).get('/unexpected')

    expect(response.status).toBe(500)
    expect(response.headers['x-request-id']).toBeTruthy()
    expect(response.body).toMatchObject({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误',
      details: null
    })
    expect(JSON.stringify(response.body)).not.toContain('database password')
  })
})
