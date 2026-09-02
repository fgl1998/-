import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { UnauthorizedError } from '../errors/agent.error.js'

const JwtPayloadSchema = z.object({
  id: z
    .number()
    .int()
    .positive(),

  exp: z
    .number()
    .int()
    .positive(),
})

function extractBearerToken(
  authorizationHeader: string | undefined,
): string {
  if (!authorizationHeader) {
    throw new UnauthorizedError()
  }

  const parts = authorizationHeader
    .trim()
    .split(/\s+/)

  if (parts.length !== 2) {
    throw new UnauthorizedError()
  }

  const [scheme, token] = parts

  if (
    scheme?.toLowerCase() !== 'bearer' ||
    !token
  ) {
    throw new UnauthorizedError()
  }

  return token
}

export function createAuthMiddleware(
  jwtSecret: string,
): RequestHandler {
  return (request, _response, next) => {
    try {
       const authorization =
        request.headers.authorization

      if (!authorization) {
        throw new UnauthorizedError()
      }
      

      const [type, token] = authorization.split(' ')
      

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedError()
      }

      const payload = jwt.verify(
        token,
        jwtSecret
        // {
        //   algorithms: ['HS256'],
        // },
      )
      
      const authPayload = JwtPayloadSchema.parse(payload)
      
      request.auth = {
        userId: authPayload.id,
        token,
      }

      next()
    } catch {
      next(new UnauthorizedError())
    }
  }
}