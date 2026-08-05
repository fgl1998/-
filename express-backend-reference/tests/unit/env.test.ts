import { describe, expect, it } from 'vitest'
import { loadEnv } from '../../src/config/env.js'

const requiredEnv = {
  DB_USER: 'root',
  DB_NAME: 'express_backend'
}

describe('loadEnv', () => {
  it('uses safe development defaults', () => {
    const env = loadEnv(requiredEnv)

    expect(env.NODE_ENV).toBe('development')
    expect(env.PORT).toBe(3000)
    expect(env.DB_HOST).toBe('127.0.0.1')
    expect(env.DB_PORT).toBe(3306)
    expect(env.DB_CONNECTION_LIMIT).toBe(10)
  })

  it('normalizes the comma-separated CORS allowlist', () => {
    const env = loadEnv({
      ...requiredEnv,
      CORS_ORIGINS: ' http://a.test, http://b.test ,, '
    })

    expect(env.CORS_ORIGINS).toEqual([
      'http://a.test',
      'http://b.test'
    ])
  })

  it('rejects missing database identity', () => {
    expect(() => loadEnv({ DB_NAME: 'express_backend' })).toThrowError(
      /DB_USER/
    )
    expect(() => loadEnv({ DB_USER: 'root' })).toThrowError(/DB_NAME/)
  })

  it('coerces numeric environment values', () => {
    const env = loadEnv({
      ...requiredEnv,
      PORT: '8080',
      DB_PORT: '3307',
      DB_CONNECTION_LIMIT: '20'
    })

    expect(env.PORT).toBe(8080)
    expect(env.DB_PORT).toBe(3307)
    expect(env.DB_CONNECTION_LIMIT).toBe(20)
  })
})
