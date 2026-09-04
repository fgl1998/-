import {type User } from './user.entity.js'
import { type CreateUserInput,type CreateUserData,type LoginInput,type UpdateUserInput,type UpdateUserData } from './user.schema.js'
import { UserRow,toUser } from './user.mapper.js'
import { type ResultSetHeader } from 'mysql2'
import { UserNotFoundError, EmailAlreadyExistsError,InvalidCredentialsError,UsernameAlreadyExistsError } from './user.error.js'
import type { UserRepository } from './user.repository.js'
import type {Pool} from 'mysql2/promise'

export class MysqlUserRepository implements UserRepository { 
  private readonly pool:Pool
  constructor( pool:Pool) {
    this.pool = pool
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<UserRow[]>(
      `
      select id,username,email,password_hash,image,bio,created_at,updated_at 
      from users 
      where email=? limit 1
      `,
      [email]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await this.pool.execute<UserRow[]>(
      `
      select id,username,email,password_hash,image,bio,created_at,updated_at from users where id=? limit 1
      `,
      [id]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

  async findByUsername(username: string): Promise<User | null> { 
    const [rows] = await this.pool.execute<UserRow[]>(
      `
      select id,username,email,password_hash,image,bio,created_at,updated_at from users where username=? limit 1
      `,
      [username]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

  async create(input: CreateUserData):Promise<User> { 
    // try {
    //并发？
      
    // } catch (error) {
      
    // }
    try {
       const [result] = await this.pool.execute<ResultSetHeader>(
      `
      insert into users(username,email,password_hash) values(?,?,?)
      `,
        [input.username,input.email,input.passwordHash]
      )
      const createdUser = await this.findById(result.insertId)
      if(!createdUser){
        throw new UserNotFoundError()
      }
      return createdUser
    } catch (error) {
      if(error instanceof Error&&(error as any).code==='ER_DUP_ENTRY'){
        // throw new EmailAlreadyExistsError()
        if (error.message.includes('uk_users_username')) {
          throw new UsernameAlreadyExistsError()
        }

        if (error.message.includes('uk_users_email')) {
          throw new EmailAlreadyExistsError()
        }
      }
      throw error
    }
  }
  
  async updateUserById(id: number, input: UpdateUserData):Promise<User|null> { 
    const fileds:string[] = []
    const values:any[] = []

    if(input.passwordHash!==undefined){
      fileds.push('password_hash=?')
      values.push(input.passwordHash)
    }
    if(input.email!==undefined){
      fileds.push('email=?')
      values.push(input.email)
    }
    if(input.bio!==undefined){
      fileds.push('bio=?')
      values.push(input.bio)
    }
    if(input.image!==undefined){
      fileds.push('image=?')
      values.push(input.image)
    }
    try {
        const [result] = await this.pool.execute<ResultSetHeader>(
        `
        update users set ${fileds.join(',')} where id=?
        `,
        [...values,id]
      )
      const updatedUser = await this.findById(id)
      return updatedUser
    } catch (error) {
      if(error instanceof Error&&(error as any).code==='ER_DUP_ENTRY'){
        // throw new EmailAlreadyExistsError()
        if (error.message.includes('uk_users_email')) {
          throw new EmailAlreadyExistsError()
        }
      }
      throw error
    }
  
  }
}