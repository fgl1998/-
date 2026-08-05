import type { Pool } from 'mysql2/promise'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { loadEnv } from '../../src/config/env.js'
import { runMigrations } from '../../src/database/migrate.js'
import {
  closeDatabase,
  createDatabase
} from '../../src/database/mysql.js'
import { MysqlUserRepository } from '../../src/modules/user/user.mysql-repository.js'
import { DuplicateUserEmailError } from '../../src/modules/user/user.repository.js'

describe('MysqlUserRepository', () => {
  let pool: Pool
  let repository: MysqlUserRepository

  beforeAll(async () => {
    const env = loadEnv(process.env)
    if (!env.DB_NAME.toLowerCase().endsWith('_test')) {
      throw new Error(
        `集成测试数据库名必须以 _test 结尾，当前为：${env.DB_NAME}`
      )
    }
    pool = createDatabase(env)
    await runMigrations(pool)
    repository = new MysqlUserRepository(pool)
  })

  beforeEach(async () => {
    await pool.query('DELETE FROM users')
  })

  afterAll(async () => {
    if (pool) await closeDatabase(pool)
  })

  it('creates and reads a user through parameterized SQL', async () => {
    const created = await repository.create({
      name: "测试'用户",
      email: 'sql@example.com'
    })

    await expect(repository.findById(created.id)).resolves.toMatchObject({
      name: "测试'用户",
      email: 'sql@example.com'
    })
    await expect(
      repository.findByEmail('sql@example.com')
    ).resolves.toMatchObject({ id: created.id })
  })

  it('supports count, newest-first pagination and deletion', async () => {
    const first = await repository.create({
      name: '第一位用户',
      email: 'first@example.com'
    })
    const second = await repository.create({
      name: '第二位用户',
      email: 'second@example.com'
    })

    await expect(repository.count()).resolves.toBe(2)
    await expect(
      repository.findPage({ offset: 0, limit: 1 })
    ).resolves.toMatchObject([{ id: second.id }])
    await expect(repository.deleteById(first.id)).resolves.toBe(true)
    await expect(repository.deleteById(first.id)).resolves.toBe(false)
  })

  it('translates the MySQL unique constraint into a module error', async () => {
    await repository.create({
      name: '原用户',
      email: 'duplicate@example.com'
    })

    await expect(
      repository.create({
        name: '重复用户',
        email: 'duplicate@example.com'
      })
    ).rejects.toBeInstanceOf(DuplicateUserEmailError)
  })
})
