import type { RequestHandler } from 'express'
import { sendSuccess } from '../../shared/http/api-response.js'
import type { CreateUserRequest } from './user.dto.js'
import type { UserService } from './user.service.js'

export interface UserController {
  create: RequestHandler
}

export function createUserController(
  service: UserService
): UserController {
  return {
    create: async (_req, res) => {
      const { body } = res.locals.validated as CreateUserRequest
      const user = await service.create(body)

      sendSuccess(res, 201, {
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: user
      })
    }
  }
}