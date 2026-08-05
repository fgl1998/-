import type { RequestHandler } from 'express'

export interface AuthUser {
  id: number
  roles: string[]
}

/**
 * 认证中间件的扩展契约。
 * 首期不提供虚假的默认实现；接入 JWT 时由认证模块实现并注入。
 */
export type AuthenticationHandler = RequestHandler
