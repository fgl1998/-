import type { User } from "./user.entity.js"
import type { CreateUserInput } from "./user.dto.js"
import { type RowDataPacket,type ResultSetHeader } from "mysql2"
import {type UserRow,toUser} from "./user.mapper.js"
import { pool } from "./user.database.js"
import { AppError } from "../../errors/app-error.js"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(input: CreateUserInput): Promise<User>
  findById(id: number): Promise<User | null>
}

export const userRepository:UserRepository = {
  async findByEmail(email: string) {
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at from users where email=? limit 1
      `,
      [email]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async findById(id: number){
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at from users where id=? limit 1
      `,
      [id]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async create(input: CreateUserInput) {
    try {
      const [result] = await pool.execute<ResultSetHeader>(
      `
      insert into users(name,email) values(?,?)
      `,
        [input.name, input.email]
      )
      const createdUser = await userRepository.findById(result.insertId)
      if(!createdUser){
        throw new Error('Failed to load created user')
      }
      return createdUser
    } catch (error) {
      if(error instanceof Error&&(error as any).code==='ER_DUP_ENTRY'){
        throw new AppError('Email already exists', 'EMAIL_ALREADY_EXISTS', 400)
      }
      throw error
    }
  }
}