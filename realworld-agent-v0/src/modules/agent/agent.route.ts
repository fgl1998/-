import {
  Router,
  type RequestHandler
} from 'express'

import type { AgentController } from './agent.controller.js'

export interface CreateAgentRouterOptions {
  authMiddleware: RequestHandler
  agentController: AgentController
}

export function createAgentRouter(
  options: CreateAgentRouterOptions
): Router {
  const router = Router()

  router.post(
    '/chat',
    options.authMiddleware,
    options.agentController.chat
  )

  router.post(
    '/history',
    options.authMiddleware,
    options.agentController
      .getHistory
  )

  return router
}