import { AppError } from '../../shared/errors/app-error.js'
import type { CreateUserDto, UserOutput } from './user.dto.js'
import { toUserOutput } from './user.mapper.js'
import {
  DuplicateUserEmailError,
  type UserRepository
} from './user.repository.js'

function emailAlreadyExists(): AppError {
  return new AppError(
    409,
    'EMAIL_ALREADY_EXISTS',
    '该邮箱已被使用'
  )
}

export class UserService {
  private readonly repository: UserRepository
  constructor(repository: UserRepository) {
    this.repository = repository
  }
  // constructor(private readonly repository: UserRepository) {}

  async create(input: CreateUserDto): Promise<UserOutput> {
    const existingUser = await this.repository.findByEmail(input.email)

    if (existingUser) {
      throw emailAlreadyExists()
    }

    try {
      const createdUser = await this.repository.create(input)
      return toUserOutput(createdUser)
    } catch (error) {
      if (error instanceof DuplicateUserEmailError) {
        throw emailAlreadyExists()
      }
      throw error
    }
  }
}