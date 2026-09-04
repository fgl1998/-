import {type Author,type Tag } from './article.entity.js'



export interface ArticleOutput {
  id: number
  title: string
  description: string
  body: string
  slug: string
  author: Author
  tags: Tag[]
  favorited:number
  favoritesCount:number
  createdAt: string
  updatedAt: string
}

export interface QueryFollowingArticleOutput {
  article_id: number
  slug: string
  title: string
  description: string
  body: string
  author_id: number
  author_username: string
  author_bio: string | null
  author_image: string | null
  following: number
  favorited: number
  favorites_count: number
  createdAt: string
  updatedAt: string
}

export interface QueryArticleDetailOutput {
  id: number
  slug: string
  title: string
  description: string
  body: string
  author_id: number
  author_username: string
  author_bio: string | null
  author_image: string | null
    following: number
    favorited: number
    favorites_count: number
    createdAt: string
    updatedAt: string
    tags: Tag[]
}

export interface QueryCommentOutput {
  id: number
  article_id: number
  author_id: number
  body: string
  createdAt: string
  updatedAt: string
  author_username: string
  author_bio: string | null
  author_image: string | null
  following: number
}

export interface ArticleQueryByUserIdOutput {
  id: number
  slug: string
  title: string
  description: string
  body: string
  createdAt: string
  updatedAt: string

  author_id: number
  author_username: string
  author_bio: string | null
  author_image: string | null

  favorites_count: number
}