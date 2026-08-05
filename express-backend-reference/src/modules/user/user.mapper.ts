import type { User } from './user.entity.js'
import type { UserOutput } from './user.dto.js'

export interface UserRow {
  id: number | string
  name: string
  email: string
  created_at: Date | string
}

export function toUser(row: UserRow): User {
  const id = Number(row.id)

  if (!Number.isSafeInteger(id)) {
    throw new Error(`用户ID超出JavaScript安全整数范围：${String(row.id)}`)
  }

  return {
    id,
    name: row.name,
    email: row.email,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at
        : new Date(row.created_at)
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
