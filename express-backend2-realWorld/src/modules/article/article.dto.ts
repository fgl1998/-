import {type Author,type Tag } from './article.entity.js'

export interface ArticleOutput {
  id: number
  title: string
  description: string
  body: string
  slug: string
  author: Author
  tags: Tag[]
  createdAt: string
  updatedAt: string
}