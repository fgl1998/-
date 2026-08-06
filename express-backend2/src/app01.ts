import 'dotenv/config'
import express ,{type ErrorRequestHandler} from 'express'
import mysql, {type Pool,type ResultSetHeader,type RowDataPacket} from 'mysql2/promise'
import cors from 'cors'



const app = express()
app.use(cors())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port:Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'Z'
})

app.use(express.json())

interface User{
  id: number,
  name: string,
  email: string,
  createdAt: Date
}
interface CreateUserInput{
  name: string,
  email: string
}

interface UserRepository{
  findByEmail(email:string):Promise<User|null>
  findById(id:number|string):Promise<User|null>
  create(input:CreateUserInput):Promise<User>
}

const users:User[]=[]
let nextUserId = 1
const userRepository:UserRepository = {
  async findByEmail(email:string):Promise<User|null>{
    const user = users.find(user=>user.email===email)
    return user??null
  },

  async findById(id:number|string){

    const user = users.find(user=>user.id===id)
    return user??null
  },

  async create(input:CreateUserInput):Promise<User>{
    const user:User = {
      id:nextUserId,
      name: input.name,
      email: input.email,
      createdAt: new Date()
    }
    nextUserId +=1
    users.push(user)
    return user
  }
}

class UserService {
  repository:UserRepository
  constructor(repository:UserRepository) {
    this.repository = repository
  }

  async create(input:CreateUserInput) {
    const existingUser = await this.repository.findByEmail(input.email)

    if (existingUser) {
      throw emailAlreadyExistsError()
    }

    return this.repository.create(input)
  }
}


function isValidEmail(value:string):boolean{
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function emailAlreadyExistsError(){
  const error  = new Error('该邮箱已被使用')
  error.code = 'EMAIL_ALREADY_EXISTS'
  return error
}


function parseCreateUserInput(body:unknown):CreateUserInput|null{
  if(
      typeof body !== 'object' ||
    body === null ||
    !('name' in body) ||
    !('email' in body) ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string'
  ){
    return null
  }
   const name = body.name.trim()
  const email = body.email.trim().toLowerCase()

  if (name.length < 2 || name.length > 50) {
    return null
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null
  }

  return { name, email }
}

const userService = new UserService(userRepository)

app.post('/users/add',async (req,res,next)=>{
  try {

    const input = parseCreateUserInput(req.body)
    if (!input) {
      res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: '请求参数错误'
      })
      return
    }

    const createdUser = await userService.create(input)

    res.status(201).json({
      success: true,
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: createdUser
    })
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next)=>{
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
})

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`)
})