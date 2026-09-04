import type { RowDataPacket } from "mysql2";
import { Tag } from "./tag.entity.js";

export interface TagRow extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export function toTag(row: TagRow):Tag{
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}