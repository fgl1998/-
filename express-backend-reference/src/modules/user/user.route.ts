import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import type { UserController } from './user.controller.js'
import {
  createUserRequestSchema,
  listUsersRequestSchema,
  userIdRequestSchema
} from './user.schema.js'

export function createUserRouter(controller: UserController): Router {
  const router = Router()

  router.get('/', validate(listUsersRequestSchema), controller.list)
  router.get('/:id', validate(userIdRequestSchema), controller.getById)
  router.post('/', validate(createUserRequestSchema), controller.create)
  router.delete('/:id', validate(userIdRequestSchema), controller.remove)

  return router
}
