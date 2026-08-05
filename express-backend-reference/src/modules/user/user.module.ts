import type { Router } from 'express'
import { createUserController } from './user.controller.js'
import type { UserRepository } from './user.repository.js'
import { createUserRouter } from './user.route.js'
import { UserService } from './user.service.js'

export function createUserModule(repository: UserRepository): Router {
  const service = new UserService(repository)
  const controller = createUserController(service)
  return createUserRouter(controller)
}
