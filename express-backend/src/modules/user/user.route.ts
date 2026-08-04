import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware.js'
import type { UserController } from './user.controller.js'
import { createUserRequestSchema } from './user.schema.js'

export function createUserRouter(controller: UserController): Router {
  const router = Router()

  router.post(
    '/',
    validate(createUserRequestSchema),
    controller.create
  )

  return router
}