import type {
  Pool,
  ResultSetHeader,
  RowDataPacket
} from 'mysql2/promise'
import type { User } from './user.entity.js'
import { toUser, type UserRow } from './user.mapper.js'
import {
  DuplicateUserEmailError,
  type CreateUserRecord,
  type FindUserPageInput,
  type UserRepository
} from './user.repository.js'

interface MysqlUserRow extends RowDataPacket, UserRow {}

interface CountRow extends RowDataPacket {
  total: number | string
}

interface MysqlErrorLike {
  code?: unknown
}

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as MysqlErrorLike).code === 'ER_DUP_ENTRY'
  )
}

export class MysqlUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findPage(input: FindUserPageInput): Promise<User[]> {
    const [rows] = await this.pool.execute<MysqlUserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `,
      [input.limit, input.offset]
    )
    return rows.map(toUser)
  }

  async count(): Promise<number> {
    const [rows] = await this.pool.query<CountRow[]>(
      'SELECT COUNT(*) AS total FROM users'
    )
    return Number(rows[0]?.total ?? 0)
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<MysqlUserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<MysqlUserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

  async create(input: CreateUserRecord): Promise<User> {
    let result: ResultSetHeader

    try {
      const [insertResult] = await this.pool.execute<ResultSetHeader>(
        'INSERT INTO users(name, email) VALUES (?, ?)',
        [input.name, input.email]
      )
      result = insertResult
    } catch (error) {
      if (isDuplicateEntry(error)) throw new DuplicateUserEmailError()
      throw error
    }

    const user = await this.findById(result.insertId)
    if (!user) {
      throw new Error(`创建用户后无法读取记录：${result.insertId}`)
    }
    return user
  }

  async deleteById(id: number): Promise<boolean> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  }
}
