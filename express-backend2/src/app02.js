import 'dotenv/config'
import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
app.use(cors())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  timezone: 'Z'
})

app.use(express.json())

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function emailAlreadyExistsError(){
  const error  = new Error('该邮箱已被使用')
  error.code = 'EMAIL_ALREADY_EXISTS'
  return error
}

async function createUser(input){
  const [existingRows] = await pool.execute(
    `select id,name,email,created_at from users where email=?`,
    [input.email]
  )
  if(existingRows.length>0){
    throw emailAlreadyExistsError()
  }

  let insertResult
  try {
    const [result] = await pool.execute(
      `insert info users(name,email) values(?,?)`,
      [input.name,input.email]
    )
    insertResult = result
  } catch (error) {
    if(error?.code==='ER_DUP_ENTRY'){
      throw emailAlreadyExistsError()
    }
    throw error
  }

  const [createRows] = await pool.execute(
    `select id,name,email,created_at from users where id=? limit 1`,
    [insertResult.insertId]
  )

  const createdUser = createRows[0]
  
  return createdUser
}


app.post('/users/add',async (req,res,next)=>{
  try {
    const rawName = req.body.name
    const rowEmail = req.body.email

    if(typeof rawName !== 'string'){
      res.status(400).json({
        success: false,
        code: 'INVALID_NAME',
        message: 'name 必须是字符串'
      })
      return
    }

    if(typeof rowEmail !== 'string'){
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'email 必须是字符串'
      })
      return
    }

    const name = rawName.trim()
    const email = rowEmail.trim().toLowerCase()
    if(name.length<2||name.length>50){
      res.status(400).json({
        success: false,
        code: 'INVALID_NAME',
        message: 'name 长度必须在2-50之间'
      })
      return
    }

    if(!isValidEmail(email)){
      res.status(400).json({
        success: false,
        code: 'INVALID_EMAIL',
        message: 'email 格式不正确'
      })
      return
    }

    const createdUser =await createUser({name,email})

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