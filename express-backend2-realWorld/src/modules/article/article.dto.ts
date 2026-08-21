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