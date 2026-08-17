import {userRepository} from './user.repository.js'
import {CreateUserInput,LoginInput,UpdateUserInput} from './user.schema.js'
import {UserOutput,LoginOutput} from './user.dto.js'
import {EmailAlreadyExistsError, UserNotFoundError,UsernameAlreadyExistsError,InvalidCredentialsError} from './user.error.js'
import bcrypt from 'bcrypt'
import {sign,verify} from '../../utils/jwt.js'


interface UserService {
  create(input: CreateUserInput): Promise<UserOutput>
  login(input:LoginInput):Promise<LoginOutput>
  getUser(userId:number):Promise<UserOutput | null>
  updateUserById(userId: number, input: UpdateUserInput):Promise<UserOutput | null>
}
export const userService:UserService = {

  async create(input:CreateUserInput):Promise<UserOutput>{
    let existingUser = await userRepository.findByUsername(input.username)
    if(existingUser){
      throw new UsernameAlreadyExistsError()
    }
    existingUser = await userRepository.findByEmail(input.email)
    if(existingUser){
      throw new EmailAlreadyExistsError()
    }
    const inputWithHashedPassword = {
      ...input,
      password: await bcrypt.hash(input.password,12)
    }
    const user = await userRepository.create(inputWithHashedPassword)

    return {
      id:user.id,
      username:user.username,
      email:user.email,
      bio:user.bio,
      image:user.image,
      createdAt:user.createdAt.toISOString(),
      updatedAt:user.updatedAt.toISOString() 
    }
  },

  async login(input:LoginInput):Promise<LoginOutput>{
    const existingUser = await userRepository.findByUsername(input.username)
    if(!existingUser){
      throw new InvalidCredentialsError()
    }
    const passwordMatch = await bcrypt.compare(input.password,existingUser.password_hash)
    if(!passwordMatch){
      throw new InvalidCredentialsError()
    }
    return {
      user:{
          id:existingUser.id,
          username:existingUser.username,
          email:existingUser.email,
          bio:existingUser.bio,
          image:existingUser.image,
          createdAt:existingUser.createdAt.toISOString(),
          updatedAt:existingUser.updatedAt.toISOString(),
      },
      token:sign({id:existingUser.id}),
     
    }
  },
  async getUser(userId:number):Promise<UserOutput|null>{
    const user = await userRepository.findById(userId)
    if(!user){
      throw new UserNotFoundError()
    }
    return {
      id:user.id,
      username:user.username,
      email:user.email,
      bio:user.bio,
      image:user.image,
      createdAt:user.createdAt.toISOString(),
      updatedAt:user.updatedAt.toISOString(),
    }
  },
  async updateUserById(userId: number, input: UpdateUserInput):Promise<UserOutput | null>{
    if(input.password){
      input.password = await bcrypt.hash(input.password,12)
    }
    const user = await userRepository.updateUserById(userId,input)
    if(!user){
      throw new UserNotFoundError()
    }
    return {
      id:user.id,
      username:user.username,
      email:user.email,
      bio:user.bio,
      image:user.image,
      createdAt:user.createdAt.toISOString(),
      updatedAt:user.updatedAt.toISOString(),
    }
  }
}