import mysql,{type RowDataPacket,type Pool,type ResultSetHeader} from 'mysql2/promise'
import express,{type ErrorRequestHandler} from "express"
import dotenv from 'dotenv'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

//Service输入
interface CreateUserInput{
  name:string
  email:string
}

// 内部实体
interface User{
  id:number
  name:string
  email:string
  createdAt:Date
}

//API输出
interface UserOutput{
  id:number
  name:string
  email:string
  createdAt:string
}

//根据sql确定数据库行类型
// select id,name,email,created_at from users where email=? limit 1
interface UserRow extends RowDataPacket{
  id:number
  name:string
  email:string
  created_at:Date
}

//数据库类型转化为业务类型
function toUser(row:UserRow):User{
  return {
    id:row.id,
    name:row.name,
    email:row.email,
    createdAt:row.created_at
  }
}

interface UserRepository{
  create(input:CreateUserInput):Promise<User>
  findByEmail(email:string):Promise<User | null>
  findById(id:number):Promise<User | null>
}

interface CreateUserBody{
  name:unknown
  email:unknown
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


const userRespository:UserRepository = {
  async create(input:CreateUserInput):Promise<User>{

    try {
      const [result] = await pool.execute<ResultSetHeader>(
        `
        insert into users(name,email) values(?,?) 
        `,
        [input.name,input.email]
      )
      const createdUser = await userRespository.findById(result.insertId)
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
  },
  async findByEmail(email:string):Promise<User | null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at from users where email=? limit 1
      `,
      [email]
    )
    return rows[0] ? toUser(rows[0]) : null
  },
  async findById(id:number):Promise<User | null>{
    const [rows] = await pool.execute<UserRow[]>(
      `
      select id,name,email,created_at from users where id=? limit 1
      `,
      [id]
    )
    return rows[0] ? toUser(rows[0]) : null
  }

} 

const userService:UserService = {
  async create(input:CreateUserInput):Promise<UserOutput>{
    const existingUser = await userRespository.findByEmail(input.email)
    if(existingUser){
      // throw new Error('Email already exists')
      throw new AppError('Email already exists', 'EMAIL_ALREADY_EXISTS', 400)
    }
    const user = await userRespository.create({
      name:input.name,
      email:input.email
    })
    return {
      id:user.id,
      name:user.name,
      email:user.email,
      createdAt:user.createdAt.toISOString()
    }
  }
}



app.post('/users/create',async (req,res,next)=>{ 
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
      return res.status(400).json({
      success:false,
      code:'INVALID_EMAIL',
      message:'email 必须是字符串'
    })
  }
  const input:CreateUserInput = {
    name:rowName.trim(),
    email:rowEmail.trim().toLowerCase()
  }

  try {
    const user = await userService.create(input)
    return res.status(201).json({
      success:true,
      data:user
    })
  } catch (error) {
    next(error)
  }
})

const errorHandler:ErrorRequestHandler = (error,req,res,next)=>{ 
  console.log(error);
  
  if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message
      })
    }
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

// 在我们现在这套后端异常设计里，try/catch 的一个主要用途，是把当前层能够识别的底层错误转换成更明确的应用错误，
// 让最终错误中间件能正确返回对应状态码；无法识别的错误不要乱转，最终返回 500。
//最后的错误处理中间件可以做一个 区分，不认识的统一返回500，认识的分类处理

class AppError extends Error{ 
  constructor(
    message:string,
    public code:string,
    public statusCode:number
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
