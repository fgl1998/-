import type {
  ErrorRequestHandler,
  RequestHandler,
} from 'express'

import { AppError } from '../errors/app.error.js'

export const notFoundMiddleware: RequestHandler = (
  request,
  _response,
  next,
) => {
  next(
    new AppError({
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
      message: `接口不存在：${request.method} ${request.originalUrl}`,
    }),
  )
}

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  next,
) => {
  if (response.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    const errorData: Record<string, unknown> = {
      code: error.code,
      message: error.message,
    }

    if (error.details !== undefined) {
      errorData.details = error.details
    }

    response.status(error.statusCode).json({
      success: false,
      error: errorData,
    })

    return
  }

  console.error('Unhandled error:', error)

  response.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '服务器内部错误',
    },
  })
}