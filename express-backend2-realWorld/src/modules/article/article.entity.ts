export interface Article {
  id: number
  title: string
  description: string
  body: string
  author_id: number
  slug: string
  author: Author
  createdAt: Date
  updatedAt: Date
}

export interface Author {
  author_id: number
  username: string
  bio: string | null
  image: string | null
}
