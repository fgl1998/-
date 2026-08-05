import { AppError } from '../../shared/errors/app-error.js'
import type { PaginationMeta } from '../../shared/http/api-response.js'
import type {
  CreateUserDto,
  ListUsersDto,
  UserOutput
} from './user.dto.js'
import { toUserOutput } from './user.mapper.js'
import {
  DuplicateUserEmailError,
  type UserRepository
} from './user.repository.js'

export interface UserListResult {
  data: UserOutput[]
  meta: PaginationMeta
}

function emailAlreadyExists(): AppError {
  return new AppError(
    409,
    'EMAIL_ALREADY_EXISTS',
    '该邮箱已被使用'
  )
}

function userNotFound(): AppError {
  return new AppError(404, 'USER_NOT_FOUND', '用户不存在')
}

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async list(input: ListUsersDto): Promise<UserListResult> {
    const offset = (input.page - 1) * input.pageSize
    const [users, total] = await Promise.all([
      this.repository.findPage({ offset, limit: input.pageSize }),
      this.repository.count()
    ])

    return {
      data: users.map(toUserOutput),
      meta: {
        page: input.page,
        pageSize: input.pageSize,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / input.pageSize)
      }
    }
  }

  async getById(id: number): Promise<UserOutput> {
    const user = await this.repository.findById(id)
    if (!user) throw userNotFound()
    return toUserOutput(user)
  }

  async create(input: CreateUserDto): Promise<UserOutput> {
    const existingUser = await this.repository.findByEmail(input.email)
    if (existingUser) throw emailAlreadyExists()

    try {
      return toUserOutput(await this.repository.create(input))
    } catch (error) {
      if (error instanceof DuplicateUserEmailError) {
        throw emailAlreadyExists()
      }
      throw error
    }
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.repository.deleteById(id)
    if (!deleted) throw userNotFound()
  }
}
