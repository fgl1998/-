import type { Pool, RowDataPacket } from 'mysql2/promise'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { loadEnv } from '../../src/config/env.js'
import { runMigrations } from '../../src/database/migrate.js'
import {
  closeDatabase,
  createDatabase
} from '../../src/database/mysql.js'
import { withTransaction } from '../../src/database/transaction.js'

interface CountRow extends RowDataPacket {
  total: number
}

describe('real MySQL transaction', () => {
  let pool: Pool

  beforeAll(async () => {
    const env = loadEnv(process.env)
    if (!env.DB_NAME.toLowerCase().endsWith('_test')) {
      throw new Error(
        `集成测试数据库名必须以 _test 结尾，当前为：${env.DB_NAME}`
      )
    }
    pool = createDatabase(env)
    await runMigrations(pool)
  })

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
  })

  afterAll(async () => {
    if (pool) await closeDatabase(pool)
  })

  async function countUsers(): Promise<number> {
    const [rows] = await pool.query<CountRow[]>(
      'SELECT COUNT(*) AS total FROM users'
    )
    return rows[0]?.total ?? 0
  }

  it('commits successful work', async () => {
    await withTransaction(pool, async (connection) => {
      await connection.execute(
        'INSERT INTO users(name, email) VALUES (?, ?)',
        ['事务提交', 'commit@example.com']
      )
    })

    await expect(countUsers()).resolves.toBe(1)
  })

  it('rolls back failed work', async () => {
    await expect(
      withTransaction(pool, async (connection) => {
        await connection.execute(
          'INSERT INTO users(name, email) VALUES (?, ?)',
          ['事务回滚', 'rollback@example.com']
        )
        throw new Error('force rollback')
      })
    ).rejects.toThrow('force rollback')

    await expect(countUsers()).resolves.toBe(0)
  })
})
