import type { ErrorRequestHandler } from 'express'
import { AppError } from '../shared/errors/app-error.js'
import { logger } from '../shared/logger/logger.js'

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: res.locals.requestId
    })
    return
  }

  logger.error(
    {
      err: error,
      requestId: res.locals.requestId
    },
    'unhandled request error'
  )

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误',
    details: null,
    requestId: res.locals.requestId
  })
}
