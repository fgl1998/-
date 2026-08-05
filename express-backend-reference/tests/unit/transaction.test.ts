import { describe, expect, it, vi } from 'vitest'
import type { Pool, PoolConnection } from 'mysql2/promise'
import { withTransaction } from '../../src/database/transaction.js'

function createDatabaseDouble() {
  const connection = {
    beginTransaction: vi.fn().mockResolvedValue(undefined),
    commit: vi.fn().mockResolvedValue(undefined),
    rollback: vi.fn().mockResolvedValue(undefined),
    release: vi.fn()
  } as unknown as PoolConnection

  const pool = {
    getConnection: vi.fn().mockResolvedValue(connection)
  } as unknown as Pool

  return { pool, connection }
}

describe('withTransaction', () => {
  it('commits successful work and releases the connection', async () => {
    const { pool, connection } = createDatabaseDouble()

    const result = await withTransaction(pool, async (tx) => {
      expect(tx).toBe(connection)
      return 'created'
    })

    expect(result).toBe('created')
    expect(connection.beginTransaction).toHaveBeenCalledOnce()
    expect(connection.commit).toHaveBeenCalledOnce()
    expect(connection.rollback).not.toHaveBeenCalled()
    expect(connection.release).toHaveBeenCalledOnce()
  })

  it('rolls back failed work and always releases the connection', async () => {
    const { pool, connection } = createDatabaseDouble()

    await expect(
      withTransaction(pool, async () => {
        throw new Error('write failed')
      })
    ).rejects.toThrow('write failed')

    expect(connection.beginTransaction).toHaveBeenCalledOnce()
    expect(connection.commit).not.toHaveBeenCalled()
    expect(connection.rollback).toHaveBeenCalledOnce()
    expect(connection.release).toHaveBeenCalledOnce()
  })
})
