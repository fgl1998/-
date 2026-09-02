import { AppError } from './app.error.js'

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: '登录状态无效或已过期',
    })
  }
}

export class AgentExecutionError extends AppError {
  constructor(cause?: unknown) {
    super({
      statusCode: 502,
      code: 'AGENT_EXECUTION_FAILED',
      message: 'Agent暂时无法完成请求',
      cause,
    })
  }
}

export class RealWorldApiError extends AppError {
  constructor(cause?: unknown) {
    super({
      statusCode: 502,
      code: 'REALWORLD_API_FAILED',
      message: 'RealWorld服务请求失败',
      cause,
    })
  }
}