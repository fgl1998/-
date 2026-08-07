import 'dotenv/config'
import express,{type ErrorRequestHandler} from 'express';
import cors from 'cors';
import mysql,{type Pool,type ResultSetHeader,type RowDataPacket} from 'mysql2/promise'

const app = express()
app.use(cors())
app.use(express.json())

interface User {
  id:number|string
  name:string
  email:string
  createdAt:Date
}

interface UserRow extends RowDataPacket {
  id: number
  name: string
  email: string
  created_at: Date
}
interface CreateUserInput {
  name:string
  email:string
}
interface UserOutput {
  id: number|string
  name: string
  email: string
  createdAt: string
}


interface UserRespository{
  create(input:CreateUserInput):Promise<User>
  findByEmail(email:string):Promise<User|null>
  findById(id:number):Promise<User|null>
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

function parseCreateUserInput(body:unknown):CreateUserInput|null{
  if(
    typeof body!=='object'||
    body===null||
    !('name' in body)||
    typeof body.name!=='string'||
    !('email' in body)||
    typeof body.email!=='string'
  ){
    return null
  }
  const name=body.name.trim()
  const email=body.email.trim().toLowerCase()
  if(name.length<2||name.length>50){
    return null
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null
  }
  return {
    name,
    email
  }
}

// }
function emailAlreadyExistsError(){
  const error=new Error('该邮箱已被使用')
  error.code = 'EMAIL_ALREADY_EXISTS'
  return error
}

const userService = {
  async create(input:CreateUserInput):Promise<UserOutput>{
    const existingUser=await userRespository.findByEmail(input.email)
    if(existingUser){
      throw emailAlreadyExistsError()
    }
    try {
      const user = await userRespository.create(input)
      return {
        id:user.id,
        name:user.name,
        email:user.email,
        createdAt:user.createdAt.toISOString()
      }
    } catch (error) {
      throw error
    }

  }
}

function toUser(row:UserRow):User{
  const id=Number(row.id)
  const createdAt=
    row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at)
    return {
      id,
      name:row.name,
      email:row.email,
      createdAt
    }
}

const userRespository:UserRespository={
  async create(input:CreateUserInput):Promise<User>{
    let insertResult:ResultSetHeader
    try {
      const [result] = await pool.execute<ResultSetHeader>(
      `
        INSERT INTO users (name, email)
        VALUES (?, ?)
      `,
      [input.name, input.email]
    )
    insertResult=result
    } catch (error) {
      throw error
    }
    const createdUser = await userRespository.findById(insertResult.insertId)
    if(!createdUser){
      throw new Error(`创建用户后无法读取记录：${insertResult.insertId}`)
    }
    return createdUser
  },
  async findByEmail(email:string):Promise<User|null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    )
    return rows[0]?toUser(rows[0]):null
  },
  async findById(id:number):Promise<User|null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )
    return rows[0]?toUser(rows[0]):null
  }
}


app.post('/users/add',async(req,res,next)=>{

  try {
     const input=parseCreateUserInput(req.body)
      if (!input) {
          res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            message: '请求参数错误'
          })
          return
        }
      const createdUser =await userService.create(input)
      res.status(201).json({
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: createdUser
      })
  } catch (error) {
    next(error)
  }
})
const errorHandler:ErrorRequestHandler = (error, req, res, next) => { 
  if(error?.code==='EMAIL_ALREADY_EXISTS'){
    res.status(400).json({
      success: false,
      code: error.code,
      message: error.message
    })
    return
  }
  console.error('未处理的请求异常',error)
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误'
  })
}
app.use(errorHandler)


const port = 3000

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`)
})
