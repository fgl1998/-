import type { Response } from 'express'

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface SuccessResponse<T> {
  code: string
  message: string
  data: T
  meta?: PaginationMeta
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  response: SuccessResponse<T>
): Response {
  return res.status(statusCode).json({
    success: true,
    ...response
  })
}
