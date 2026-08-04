import mysql,{type Pool} from 'mysql2/promise'
import type { AppEnv } from '../config/env.js'

type DataBaseEnv = Pick<
  AppEnv,
  | 'DB_HOST'
  | 'DB_PORT'
  | 'DB_USER'
  | 'DB_PASSWORD'
  | 'DB_NAME'
  | 'DB_CONNECTION_LIMIT'
>
  
export function createDatabase(env:DataBaseEnv):Pool{
  return mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: env.DB_CONNECTION_LIMIT,
    charset: 'utf8mb4',
    timezone: 'Z'
  })
}

export async function checkDatabaseConnection(pool: Pool): Promise<void> {
  await pool.query('SELECT 1')
}

export async function closeDatabase(pool: Pool): Promise<void> {
  await pool.end()
}