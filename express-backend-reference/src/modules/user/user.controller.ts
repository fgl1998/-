import type { RequestHandler } from 'express'
import { sendSuccess } from '../../shared/http/api-response.js'
import type {
  CreateUserRequest,
  ListUsersRequest,
  UserIdRequest
} from './user.dto.js'
import type { UserService } from './user.service.js'

export interface UserController {
  list: RequestHandler
  getById: RequestHandler
  create: RequestHandler
  remove: RequestHandler
}

export function createUserController(service: UserService): UserController {
  return {
    list: async (_req, res) => {
      const { query } = res.locals.validated as ListUsersRequest
      const result = await service.list(query)
      sendSuccess(res, 200, {
        code: 'USER_LIST_FETCHED',
        message: '用户列表查询成功',
        data: result.data,
        meta: result.meta
      })
    },

    getById: async (_req, res) => {
      const { params } = res.locals.validated as UserIdRequest
      const user = await service.getById(params.id)
      sendSuccess(res, 200, {
        code: 'USER_FETCHED',
        message: '用户查询成功',
        data: user
      })
    },

    create: async (_req, res) => {
      const { body } = res.locals.validated as CreateUserRequest
      const user = await service.create(body)
      sendSuccess(res, 201, {
        code: 'USER_CREATED',
        message: '用户创建成功',
        data: user
      })
    },

    remove: async (_req, res) => {
      const { params } = res.locals.validated as UserIdRequest
      await service.remove(params.id)
      sendSuccess(res, 200, {
        code: 'USER_DELETED',
        message: '用户删除成功',
        data: null
      })
    }
  }
}
