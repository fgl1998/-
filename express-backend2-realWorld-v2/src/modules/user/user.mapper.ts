import {type ResultSetHeader,RowDataPacket } from 'mysql2/promise'

import { type User } from './user.entity.js'

export interface UserRow extends RowDataPacket {
  id: number
  username: string
  email: string
  password_hash: string
  image: string|null
  bio: string|null
  created_at: Date
  updated_at: Date
}

export function toUser(row: UserRow):User{
  return {
    id:row.id,
    username:row.username,
    email:row.email,
    password_hash:row.password_hash,
    image:row.image,
    bio:row.bio,
    createdAt:row.created_at,
    updatedAt:row.updated_at
  }
}