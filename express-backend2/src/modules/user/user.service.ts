import type{UserOutput} from './user.dto.js'
import { userRepository } from './user.respository.js'
import { EmailAlreadyExistsError } from './user.error.js'
import {type CreateUserInput} from './user.schema.js'

export interface UserService{
  create(input:CreateUserInput):Promise<UserOutput>
}

export const userService:UserService = {
  async create(input:CreateUserInput):Promise<UserOutput>{
    const existingUser = await userRepository.findByEmail(input.email)
    if(existingUser){
      // throw new AppError('Email already exists', 'EMAIL_ALREADY_EXISTS', 400)
      throw new EmailAlreadyExistsError()
    }
    const user = await userRepository.create({
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