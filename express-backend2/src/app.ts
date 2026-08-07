import express from "express"
import cors from "cors"
import mysql,{type RowDataPacket,type Pool,type ResultSetHeader} from "mysql2/promise"
interface CreateUserInput{
  name:string
  email:string
}

interface User{
  id:number
  name:string
  email:string
  createdAt:Date
}

interface UserOutput{
  id:number
  name:string
  email:string
  createdAt:string
}

const sql=`
select id,name,email,created_at
from users
where email=?
limit 1
`
interface UserRow extends RowDataPacket{
  id:number
  name:string
  email:string
  created_at:Date
}

function toUser(row:UserRow):User{
  return {
    id:row.id,
    name:row.name,
    email:row.email,
    createdAt:row.created_at
  }
}

interface UserRespository{
  findByEmail(email:string):Promise<User|null>
  findById(id:number):Promise<User|null>
  create(input:CreateUserInput):Promise<User>
}

interface UserService{
  create(input:CreateUserInput):Promise<UserOutput>
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

const userRespository:UserRespository={
  async findByEmail(email:string):Promise<User|null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at
      from users
      where email=?
      limit 1
      `,
      [email]
    )
    return rows[0]? toUser(rows[0]) : null
  },
  async findById(id:number):Promise<User|null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at
      from users
      where id=?
      limit 1
      `,
      [id]
    )
    return rows[0]? toUser(rows[0]) : null
  },

  async create(input:CreateUserInput):Promise<User>{
    const existingEmail = await userRespository.findByEmail(input.email)
    if(existingEmail){
      throw new Error('邮箱已存在')
    }
    let insertResult:ResultSetHeader
    try {
       const [result] = await pool.execute<ResultSetHeader>(
      `
      insert into users(name,email)
      values(?,?)
      `,
      [input.name,input.email]
    )
    insertResult = result

    const createdUser = await userRespository.findById(insertResult.insertId)
    if(!createdUser){
      throw new Error(`创建用户后无法读取记录：${insertResult.insertId}`)
    }
    return createdUser
    
    } catch (error) {
      throw error
    }

  }
}

const userService:UserService={
  async create(input:CreateUserInput):Promise<UserOutput>{
    const user = await userRespository.create(input)
    return {
      id:user.id,
      name:user.name,
      email:user.email,
      createdAt:user.createdAt.toISOString()
    }
  }
}




