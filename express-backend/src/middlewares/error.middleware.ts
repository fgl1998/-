import type { ErrorRequestHandler } from 'express'
import { AppError } from '../shared/errors/app-error.js'

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
      details: error.details
    })
    return
  }

  console.error('未处理的请求异常', error)

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误',
    details: null
  })
}