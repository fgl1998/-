import express,{type ErrorRequestHandler} from 'express';
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())

interface User {
  id:number|string
  name:string
  email:string
  createdAt:Date
}
interface CreateUserInput {
  name:string
  email:string
}

interface UserRespository{
  create(input:CreateUserInput):Promise<User>
  findByEmail(email:string):Promise<User|null>
}

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

// class userService{
//   respository
//   constructor(respository){
//     this.respository=respository
//   }
//   create(input:CreateUserInput){

//   }

// }
function emailAlreadyExistsError(){
  const error=new Error('该邮箱已被使用')
  error.code = 'EMAIL_ALREADY_EXISTS'
  return error
}

const userService = {
  async create(input:CreateUserInput){
    const existingUser=await userRespository.findByEmail(input.email)
    if(existingUser){
      throw emailAlreadyExistsError()
    }
    return userRespository.create(input)

  }
}
// new UserService(userRepository)
//                 等价目的
// createUserService(userRepository)
// 对你目前这个阶段，工厂函数更容易理解。等以后出现多个Service方法、私有状态、依赖注入容器时，再使用class也不迟。
function createUserService2(repository: UserRespository) {
  return {
    async create(
      input: CreateUserInput
    ): Promise<User> {
      const existingUser =
        await repository.findByEmail(input.email)

      if (existingUser) {
        throw emailAlreadyExistsError()
      }

      return repository.create(input)
    }
  }
}

// const userService =
//   createUserService(UserRespository)

const users:User[]=[]
let nextUserId=1
const userRespository:UserRespository={
  async create(input:CreateUserInput):Promise<User>{
    const user:User={
      id:nextUserId,
      name:input.name,
      email:input.email,
      createdAt:new Date()
    }
    users.push(user)
    nextUserId+=1
    return user
  },
  async findByEmail(email:string):Promise<User|null>{
    const user=users.find(user=>user.email===email)
    return user??null
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

app.use((error, req, res, next) => { 
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


const port = 3000

app.listen(port, () => {
  console.log(`服务已启动：http://localhost:${port}`)
})
