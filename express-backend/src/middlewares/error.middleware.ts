import type { ErrorRequestHandler } from 'express'
import { AppError } from '../utils/app-error.js'

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
      code: error.statusCode,
      message: error.message,
      data: null
    })
    return
  }

  console.error(error)

  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  })
}