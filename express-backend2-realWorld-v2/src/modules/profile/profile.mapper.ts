import type { RowDataPacket } from "mysql2";
import type { Profile, User } from "./profile.entity.js";

export interface ProfileRow extends RowDataPacket { 
  id: number
  username: string
  image:string
  bio:string
  following:number
  created_at:Date
}

export function toProfile(row:ProfileRow):Profile{
  return {
    id:row.id,
    username:row.username,
    image:row.image,
    bio:row.bio,
    following:row.following,
    createdAt:row.created_at
  }
}

export interface UserRow extends RowDataPacket {
  id:number
}

export function toUser(row: UserRow):User{
  return {
    id:row.id,
  }
}