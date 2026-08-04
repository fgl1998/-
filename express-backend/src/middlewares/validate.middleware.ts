import type { RequestHandler } from 'express'
import type { z } from 'zod'
import { AppError } from '../shared/errors/app-error.js'

function normalizeIssues(issues: z.core.$ZodIssue[]) {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message
  }))
}

export function validate<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })

    if (!result.success) {
      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          '请求参数校验失败',
          normalizeIssues(result.error.issues)
        )
      )
      return
    }

    res.locals.validated = result.data
    next()
  }
}