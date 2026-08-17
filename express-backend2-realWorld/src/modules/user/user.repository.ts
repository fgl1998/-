import {type User } from './user.entity.js'
import { type CreateUserInput,type CreateUserData,type LoginInput,type UpdateUserInput } from './user.schema.js'
import {pool} from '../../database/pool.js'
import { UserRow,toUser } from './user.mapper.js'
import { type ResultSetHeader } from 'mysql2'
import { UserNotFoundError, EmailAlreadyExistsError,InvalidCredentialsError } from './user.error.js'
import bcrypt from 'bcrypt'
import { fi } from 'zod/v4/locales'


export interface UserRepository  {
  create(input: CreateUserInput): Promise<User>
  findById(id: number): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  // update(id:number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  updateUserById(id: number, input: UpdateUserInput):Promise<User | null>
}

export const userRepository:UserRepository = { 
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,username,email,created_at from users where email=? limit 1
      `,
      [email]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,username,email,password_hash,image,bio,created_at,updated_at from users where id=? limit 1
      `,
      [id]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async findByUsername(username: string): Promise<User | null> { 
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,username,email,password_hash,image,bio,created_at,updated_at from users where username=? limit 1
      `,
      [username]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async create(input: CreateUserInput):Promise<User> { 
    // try {
    //并发？
      
    // } catch (error) {
      
    // }
    const [result] = await pool.execute<ResultSetHeader>(
      `
      insert into users(username,email,password_hash) values(?,?,?)
      `,
      [input.username,input.email,input.password]
    )
    const createdUser = await this.findById(result.insertId)
    if(!createdUser){
      throw new UserNotFoundError()
    }
    return createdUser
  },
  async updateUserById(id: number, input: UpdateUserInput):Promise<User | null> { 
    const fileds:string[] = []
    const values:any[] = []

    if(input.password){
      fileds.push('password_hash=?')
      values.push(input.password)
    }
    if(input.email){
      fileds.push('email=?')
      values.push(input.email)
    }
    if(input.bio){
      fileds.push('bio=?')
      values.push(input.bio)
    }
    if(input.image){
      fileds.push('image=?')
      values.push(input.image)
    }
    const [result] = await pool.execute<ResultSetHeader>(
      `
      update users set ${fileds.join(',')} where id=?
      `,
      [...values,id]
    )
    const updatedUser = await this.findById(id)
    return updatedUser
  }
 
}