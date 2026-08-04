import type {Response} from 'express'

export interface SuccessResponse<T>{
  code: string
  message: string
  data: T
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  response: SuccessResponse<T>
): Response {
  return res.status(statusCode).json({
    success: true,
    code: response.code,
    message: response.message,
    data: response.data
  })
}