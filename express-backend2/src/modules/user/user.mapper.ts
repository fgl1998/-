import {type RowDataPacket } from 'mysql2/promise'
import  type{ User} from './user.entity.js'

export interface UserRow extends RowDataPacket {
  id: number
  name: string
  email: string
  created_at: Date
}

export function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at
  }
}