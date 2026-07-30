import type { RequestHandler } from 'express'
import { AppError } from '../utils/app-error.js'

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      404,
      `接口不存在：${req.method} ${req.originalUrl}`
    )
  )
}