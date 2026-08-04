import type { UserOutput } from './user.dto.js'
import type { User } from './user.entity.js'

export interface UserRow {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}

export function toUser(row: UserRow): User {
  const id = Number(row.id)
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at
      : new Date(row.created_at)

  if (!Number.isSafeInteger(id)) {
    throw new Error(`用户ID超出JavaScript安全整数范围：${String(row.id)}`)
  }

  if (Number.isNaN(createdAt.getTime())) {
    throw new Error(`数据库返回了无效时间：${String(row.created_at)}`)
  }

  return {
    id,
    name: row.name,
    email: row.email,
    createdAt
  }
}

export function toUserOutput(user: User): UserOutput {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString()
  }
}