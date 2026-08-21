import type { RowDataPacket } from "mysql2";
import type {Article,ArticleQuery,TagQuery} from './article.entity.js'


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

// export function toArticle(row: ArticleRow,tagRow:TagRow[]):Article{
//   return {
//     id:row.id,
//     author_id:row.author_id,
//     title:row.title,
//     description:row.description,
//     body:row.body,
//     slug:row.slug,
//     author:{
//       author_id:row.author_id,
//       username:row.username,
//       bio:row.bio,
//       image:row.image
//     },
//     tags:tagRow,
//     createdAt:row.created_at,
//     updatedAt:row.updated_at
//   }
// }

export interface TagRow extends RowDataPacket {
  id: number;
  name: string;
}

export interface ArticleQueryRow extends RowDataPacket {
  id: number
  slug: string
  title: string
  description: string
  body: string
  created_at: Date
  updated_at: Date

  author_id: number
  author_username: string
  author_bio: string | null
  author_image: string | null

  favorited: number
  favorites_count: number
}

export function toArticleQuery(row: ArticleQueryRow):ArticleQuery{
  return {
    id:row.id,
    slug:row.slug,
    title:row.title,
    description:row.description,
    body:row.body,
    createdAt:row.created_at,
    updatedAt:row.updated_at,
    favorited:row.favorited,
    favoritesCount:row.favorites_count,
    author:{
      author_id:row.author_id,
      username:row.author_username,
      image:row.author_image,
      bio:row.author_bio
    }
  }
}

export interface TagQueryRow extends RowDataPacket {
  article_id: number
  tag_id: number
  tag_name: string
}

export function toTagQuery(row: TagQueryRow):TagQuery{
  return {
    article_id:row.article_id,
    tag_id:row.tag_id,
    tag_name:row.tag_name
  }
}
