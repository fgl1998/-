import 'dotenv/config'
import express, { type ErrorRequestHandler } from 'express'
import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket
} from 'mysql2/promise'

interface CreateUserBody {
  name?: unknown
  email?: unknown
}

type CreateUserDto = {
  name: string
  email: string
}

interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

interface UserOutput {
  id: number
  name: string
  email: string
  createdAt: string
}

interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserDto): Promise<User>
}

interface UserRow extends RowDataPacket {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}

interface MysqlErrorLike {
  code?: unknown
}

class EmailAlreadyExistsError extends Error {
  readonly statusCode = 409
  readonly code = 'EMAIL_ALREADY_EXISTS'

  constructor() {
    super('该邮箱已被使用')
    this.name = 'EmailAlreadyExistsError'
  }
}

class DuplicateUserEmailError extends Error {
  constructor() {
    super('Duplicate user email')
    this.name = 'DuplicateUserEmailError'
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isDuplicateEntry(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as MysqlErrorLike).code === 'ER_DUP_ENTRY'
  )
}

function toUser(row: UserRow): User {
  const id = Number(row.id)
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at)

  if (!Number.isSafeInteger(id)) {
    throw new Error(`用户ID超出JavaScript安全整数范围：${String(row.id)}`)
  }

  if (Number.isNaN(createdAt.getTime())) {
    throw new Error(`数据库返回了无效时间：${String(row.created_at)}`)
  }

  return {
    id,
    name: row.name,
    email: row.email,
    createdAt
  }
}

class MysqlUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<UserRow[]>(
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

  private async findById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<UserRow[]>(
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

  async create(input: CreateUserDto): Promise<User> {
    let insertResult: ResultSetHeader

    try {
      const [result] = await this.pool.execute<ResultSetHeader>(
        'INSERT INTO users(name, email) VALUES (?, ?)',
        [input.name, input.email]
      )
      insertResult = result
    } catch (error) {
      if (isDuplicateEntry(error)) {
        throw new DuplicateUserEmailError()
      }
      throw error
    }

    const createdUser = await this.findById(insertResult.insertId)

    if (!createdUser) {
      throw new Error(`创建用户后无法读取记录：${insertResult.insertId}`)
    }

    return createdUser
  }
}

class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: CreateUserDto): Promise<UserOutput> {
    const existingUser = await this.repository.findByEmail(input.email)

    if (existingUser) {
      throw new EmailAlreadyExistsError()
    }

    try {
      const user = await this.repository.create(input)

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      }
    } catch (error) {
      if (error instanceof DuplicateUserEmailError) {
        throw new EmailAlreadyExistsError()
      }
      throw error
    }
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'Z'
})

const userRepository: UserRepository = new MysqlUserRepository(pool)
const userService = new UserService(userRepository)
const app = express()

app.use(express.json())

app.post('/users', async (req, res, next) => {
  try {
    const body = req.body as CreateUserBody
    const rawName = body.name
    const rawEmail = body.email

    if (typeof rawName !== 'string') {
      res.status(400).json({
        success: false,
        code: 'INVALID_NAME',
        message: 'name 必须是字符串'
      })
      return
    }

    if (typeof rawEmail !== 'string') {
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'email 必须是字符串'
      })
      return
    }

    const input: CreateUserDto = {
      name: rawName.trim(),
      email: rawEmail.trim().toLowerCase()
    }

    if (input.name.length < 2 || input.name.length > 50) {
      res.status(400).json({
        success: false,
        code: 'INVALID_NAME',
        message: '用户名长度必须在 2 到 50 个字符之间'
      })
      return
    }

    if (!isValidEmail(input.email)) {
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: '邮箱格式不正确'
      })
      return
    }

    const user = await userService.create(input)

    res.status(201).json({
      success: true,
      code: 'USER_CREATED',
      message: '用户创建成功',
      data: user
    })
  } catch (error) {
    next(error)
  }
})

const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof EmailAlreadyExistsError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message
    })
    return
  }

  console.error('未处理的请求异常', error)

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误'
  })
}

app.use(errorHandler)

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`)
})