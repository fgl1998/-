export interface Article {
  id: number
  title: string
  description: string
  body: string
  author_id: number
  slug: string
  author: Author
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}

export interface Tag{
  tag_id: number
  tag_name: string
  article_id: number
}
export interface Author {
  author_id: number
  username: string
  bio: string | null
  image: string | null
}

export interface ArticleQuery {
  id: number
  slug: string
  title: string
  description: string
  body: string
  createdAt: Date
  updatedAt: Date
  favorited: number
  favoritesCount: number
  author: {
    author_id: number
    username: string
    bio: string | null
    image: string | null
  }
}

export interface TagQuery{
  article_id: number
  tag_id: number
  tag_name: string
}
