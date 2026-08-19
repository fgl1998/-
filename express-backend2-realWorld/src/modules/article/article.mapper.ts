import type { RowDataPacket } from "mysql2";
import type {Article} from './article.entity.js'

export interface ArticleRow extends RowDataPacket {
  id: number
  title: string
  description: string
  body: string
  slug: string
  created_at: Date
  updated_at: Date
  author_id: number
  username: string
  bio: string | null
  image: string | null
}

export function toArticle(row: ArticleRow):Article{
  return {
    id:row.id,
    author_id:row.author_id,
    title:row.title,
    description:row.description,
    body:row.body,
    slug:row.slug,
    author:{
      author_id:row.author_id,
      username:row.username,
      bio:row.bio,
      image:row.image
    },
    createdAt:row.created_at,
    updatedAt:row.updated_at
  }
}
