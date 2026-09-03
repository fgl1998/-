import type { RequestHandler } from 'express'

import { AppError } from '../../common/errors/app.error.js'
import { UnauthorizedError } from '../../common/errors/agent.error.js'

import { AgentChatSchema } from './agent.schema.js'
import type { AgentService } from './agent.service.js'

export interface AgentControllerDependencies {
  agentService: AgentService
}

export class AgentController {
  private readonly agentService: AgentService

  constructor(dependencies: AgentControllerDependencies) {
    this.agentService = dependencies.agentService
  }

  //为何使用箭头函数
  readonly chat: RequestHandler = async (
    request,
    response,
    next
  ) => {
    try {
      if (!request.auth) {
        throw new UnauthorizedError()
      }

      const result = AgentChatSchema.safeParse(request.body)

      if (!result.success) {
        throw new AppError({
          statusCode: 400,
          code: 'INVALID_AGENT_MESSAGE',
          message: 'Agent 请求参数错误',
          details: result.error.issues
        })
      }

      const data = await this.agentService.chat(
        request.auth.id,
        request.auth.token,
        result.data
      )

      response.status(200).json({
        success: true,
        data
      })
    } catch (error) {
      next(error)
    }
  }
}