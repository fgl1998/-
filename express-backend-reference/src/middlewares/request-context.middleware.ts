import { randomUUID } from 'node:crypto'
import type { RequestHandler } from 'express'
import { logger } from '../shared/logger/logger.js'

export const requestContext: RequestHandler = (req, res, next) => {
  const incomingRequestId = req.header('x-request-id')?.trim()
  const requestId = incomingRequestId || randomUUID()
  const startedAt = process.hrtime.bigint()

  res.locals.requestId = requestId
  res.setHeader('x-request-id', requestId)

  res.once('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000

    logger.info(
      {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2))
      },
      'request completed'
    )
  })

  next()
}
