import type { RequestHandler } from 'express'

import { AppError } from '../errors/app.error.js'

export const notFoundMiddleware: RequestHandler = (
  request,
  _response,
  next
) => {
  next(
    new AppError({
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
      message: '请求的接口不存在',
      details: {
        method: request.method,
        path: request.originalUrl
      }
    })
  )
}