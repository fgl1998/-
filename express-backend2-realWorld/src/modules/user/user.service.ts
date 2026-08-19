import {userRepository} from './user.repository.js'
import {CreateUserInput,LoginInput,UpdateUserInput,CreateUserData,UpdateUserData} from './user.schema.js'
import {UserOutput,LoginOutput} from './user.dto.js'
import {EmailAlreadyExistsError, UserNotFoundError,UsernameAlreadyExistsError,InvalidCredentialsError} from './user.error.js'
import bcrypt from 'bcrypt'
import {sign,verify} from '../../utils/jwt.js'


interface UserService {
  create(input: CreateUserInput): Promise<UserOutput>
  login(input:LoginInput):Promise<LoginOutput>
  getUser(userId:number):Promise<UserOutput>
  updateUserById(userId: number, input: UpdateUserInput):Promise<UserOutput>
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
    const inputWithHashedPassword:CreateUserData = {
      ...input,
      passwordHash: await bcrypt.hash(input.password,12)
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
  async getUser(userId:number):Promise<UserOutput>{
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
  async updateUserById(userId: number, input: UpdateUserInput):Promise<UserOutput>{
    if(input.password){
      input.password = await bcrypt.hash(input.password,12)
    }
    if(input.email){
      const existingEmail = await userRepository.findByEmail(input.email)
      if(existingEmail&&existingEmail.id!==userId){
        throw new EmailAlreadyExistsError()
      }
    }
    const inputWithHashedPassword:UpdateUserData = {
      ...input,
      passwordHash: input.password
    }
    const user = await userRepository.updateUserById(userId,inputWithHashedPassword)
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