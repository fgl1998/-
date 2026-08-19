
import { CreateArticleData } from './article.schema.js'
import type { ResultSetHeader } from 'mysql2'
import {pool} from '../../database/pool.js'
import { ArticleNotFoundError } from './article.error.js'
import { ArticleRow,toArticle } from './article.mapper.js'
import type {Article} from './article.entity.js'


export interface ArticleRepository {
  create(input: CreateArticleData):Promise<Article>
  findById(id: number): Promise<Article | null>
  deleteBySlug(slug: string): Promise<boolean>
  findByAuthorId(authorId: number): Promise<Article[]>
}

export const articleRepository:ArticleRepository = { 
  async create(input: CreateArticleData): Promise<Article> { 
    const [result] = await pool.execute<ResultSetHeader>(
      `
      insert into articles(title,description,body,author_id,slug) values(?,?,?,?,?)
      `,
      [input.title,input.description,input.body,input.authorId,input.slug]
    )
    const createdArticle = await this.findById(result.insertId)
    if(!createdArticle){
      throw new ArticleNotFoundError()
    }
    return createdArticle
  },
  async findById(id: number): Promise<Article | null> { 
    const [rows] = await pool.execute<ArticleRow[]>(
      `
      SELECT
        articles.id,               
        articles.slug,
        articles.title,
        articles.description,
        articles.body,
        articles.author_id,
        articles.created_at,
        articles.updated_at,
        users.id AS author_id,
        users.username AS username,
        users.bio AS bio,
        users.image AS image
      FROM articles
      JOIN users ON articles.author_id = users.id
      WHERE articles.id = ?
      `,
      [id]
    )
    if(!rows[0]){
      return null
    }
    const newRows = {
      ...rows[0],
      author:{
        author_id:rows[0].author_id,
        username:rows[0].username,
        bio:rows[0].bio,
        image:rows[0].image
      }
    }
    return toArticle(newRows)
  },
  async deleteBySlug(slug: string): Promise<boolean> { 
    const [result] = await pool.execute<ResultSetHeader>(
      `
      DELETE FROM articles
      WHERE slug = ?
      `,
      [slug]
    )
    return result.affectedRows > 0
  },
  async findByAuthorId(authorId: number):Promise<Article[]>{
    const [rows] = pool.execute<ArticleRow[]>(
      `
      SELECT
        articles.id,               
        articles.slug,
        articles.title,
        articles.description,
        articles.body,
        articles.author_id,
        articles.created_at,
        articles.updated_at,
        users.id AS author_id,
        users.username AS username,
        users.bio AS bio,
        users.image AS image
      WHERE articles.author_id = ?
        `,
        [authorId]
    )
    console.log(rows[0],'rows[0]');
    

  }
}