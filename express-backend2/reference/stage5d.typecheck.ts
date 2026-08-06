import mysql, {
  type Pool,
  type ResultSetHeader,
  type RowDataPacket
} from 'mysql2/promise'

interface CreateUserInput {
  name: string
  email: string
}

interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
}

interface UserRow extends RowDataPacket {
  id: number
  name: string
  email: string
  created_at: Date
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at
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

    const row = rows[0]
    return row ? toUser(row) : null
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

    const row = rows[0]
    return row ? toUser(row) : null
  }

  async create(input: CreateUserInput): Promise<User> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO users(name, email) VALUES (?, ?)',
      [input.name, input.email]
    )

    const user = await this.findById(result.insertId)

    if (!user) {
      throw new Error(`创建用户后无法读取记录：${result.insertId}`)
    }

    return user
  }
}

const pool: Pool = mysql.createPool({
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

export const userRepository: UserRepository = new MysqlUserRepository(pool)
