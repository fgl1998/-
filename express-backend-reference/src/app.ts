import cors from 'cors'
import express, { type Router } from 'express'
import helmet from 'helmet'
import { AppError } from './shared/errors/app-error.js'
import { sendSuccess } from './shared/http/api-response.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { notFoundHandler } from './middlewares/not-found.middleware.js'
import { requestContext } from './middlewares/request-context.middleware.js'

export interface AppDependencies {
  corsOrigins: string[]
  readinessCheck: () => Promise<void>
  userRouter: Router
}

export function createApp(dependencies: AppDependencies) {
  const app = express()
  app.disable('x-powered-by')

  app.use(requestContext)
  app.use(helmet())
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || dependencies.corsOrigins.includes(origin)) {
          callback(null, true)
          return
        }
        callback(
          new AppError(
            403,
            'CORS_ORIGIN_DENIED',
            '该来源不允许访问此服务'
          )
        )
      }
    })
  )
  app.use(express.json({ limit: '1mb' }))

  app.get('/health/live', (_req, res) => {
    sendSuccess(res, 200, {
      code: 'HEALTH_LIVE',
      message: '服务进程正常',
      data: { time: new Date().toISOString() }
    })
  })

  app.get('/health/ready', async (_req, res) => {
    try {
      await dependencies.readinessCheck()
    } catch {
      throw new AppError(503, 'SERVICE_NOT_READY', '服务暂未就绪')
    }
    sendSuccess(res, 200, {
      code: 'HEALTH_READY',
      message: '服务已就绪',
      data: { time: new Date().toISOString() }
    })
  })

  app.use('/api/v1/users', dependencies.userRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
