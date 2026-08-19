import {type Author } from './article.entity.js'

export interface ArticleOutput {
  id: number
  title: string
  description: string
  body: string
  slug: string
  author: Author
  createdAt: string
  updatedAt: string
}