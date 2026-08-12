import express,{type ErrorRequestHandler} from "express"
import cors from "cors"
import mysql,{type RowDataPacket,type Pool,type ResultSetHeader} from "mysql2/promise"

interface CreateUserBody{
  name:unknown
  email:unknown
}
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

interface UserRepository{
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

class EmailAlreadyExistsError extends Error{
  readonly code = 'EMAIL_ALREADY_EXISTS'
  readonly statusCode = 409
  constructor(){
    super('该邮箱已被使用')
    this.name = 'EmailAlreadyExistsError'
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

class DuplicateUserEmailError extends Error{
  constructor(){
    super('Duplicate user email')
    this.name = 'DuplicateUserEmailError'
  }
}

const userRepository:UserRepository={
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
    const existingEmail = await userRepository.findByEmail(input.email)
    if(existingEmail){
      throw new EmailAlreadyExistsError()
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

    const createdUser = await userRepository.findById(insertResult.insertId)
    if(!createdUser){
      throw new Error(`创建用户后无法读取记录：${insertResult.insertId}`)
    }
    return createdUser
    
    } catch (error) {
      if(error instanceof Error&&(error as any).code==='ER_DUP_ENTRY'){
        throw new EmailAlreadyExistsError()
      }
      throw error
    }

  }
}

const userService:UserService={
  async create(input:CreateUserInput):Promise<UserOutput>{
    const user = await userRepository.create(input)
    return {
      id:user.id,
      name:user.name,
      email:user.email,
      createdAt:user.createdAt.toISOString()
    }
  }
}

const app = express()
app.use(cors())
app.use(express.json())

app.post('/users/create',async (req,res,next)=>{
  try {
    const body = req.body as CreateUserBody
    const rowName=body.name
    const rowEmail=body.email
    if(typeof rowName !== 'string'){
      res.status(400).json({
        success:false,
        code:'INVALID_NAME',
        message:'name 必须是字符串'
      })
      return
    }
    if(typeof rowEmail !== 'string'){
      res.status(400).json({
        success:false,
        code:'INVALID_EMAIL',
        message:'email 必须是字符串'
      })
      return
    }

    const input:CreateUserInput = {
      name:rowName.trim(),
      email:rowEmail.trim().toLowerCase()
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
      success:true,
      code: 'USER_CREATED',
      message: '用户创建成功',
      data:user
    })
    
  } catch (error) {
    next(error)
    
  } 
})

const errorHandler:ErrorRequestHandler = (error,req,res,next)=>{
  if (error instanceof EmailAlreadyExistsError) {
      res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message,
      })
      return
    }
  console.error(error)
  res.status(500).json({
    success:false,
    code:'INTERNAL_SERVER_ERROR',
    message:'服务器内部错误'
  })
}
app.use(errorHandler)
app.listen(3000,()=>{
  console.log('服务器启动成功，端口3000')
})




