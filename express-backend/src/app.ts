import express, { type Router } from 'express'
import { errorHandler } from './middlewares/error.middleware.js'

export function createApp(userRouter: Router) {
  const app = express()

  app.disable('x-powered-by')
  app.use(express.json({ limit: '1mb' }))
  app.use('/api/v1/users', userRouter)
  app.use(errorHandler)

  return app
}