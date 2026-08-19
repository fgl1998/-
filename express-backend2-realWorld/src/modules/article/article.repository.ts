
import { CreateArticleData } from './article.schema.js'
import type { ResultSetHeader } from 'mysql2'
import {pool} from '../../database/pool.js'
import { ArticleNotFoundError } from './article.error.js'
import { ArticleRow,toArticle ,TagRow} from './article.mapper.js'
import type {Article} from './article.entity.js'


export interface ArticleRepository {
  create(input: CreateArticleData):Promise<Article>
  findById(id: number): Promise<Article | null>
  deleteBySlug(slug: string): Promise<boolean>
  // findByAuthorId(authorId: number): Promise<Article[]>
  findBySlug(slug: string): Promise<Article|null>
}


export const articleRepository:ArticleRepository = { 
  async create(input: CreateArticleData): Promise<Article> { 

    try {
       const [result] = await pool.execute<ResultSetHeader>(
      `
      insert into articles(title,description,body,author_id,slug) values(?,?,?,?,?)
      `,
      [input.title,input.description,input.body,input.authorId,input.slug]
      )
      
      const tagIdList:number[] = JSON.parse(input.tags)

      if(tagIdList.length){
        const placeholders = tagIdList.map(tagId=>"(?,?)").join(", ")
        const valueList = tagIdList.flatMap(tagId=>[result.insertId,tagId])
        console.log(
          `
        insert into article_tags(article_id,tag_id) values ${placeholders}
        `,
        valueList
        );
        
        const [tagResult] = await pool.execute<ResultSetHeader>(
          `
          insert into article_tags(article_id,tag_id) values ${placeholders}
          `,
          valueList
        )
       
      }

      const createdArticle = await this.findById(result.insertId)

      if(!createdArticle){
        throw new ArticleNotFoundError()
      }
      return createdArticle
    } catch (error) {
      throw error
    }
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

    const [tags] = await pool.execute<TagRow[]>(
      `
      SELECT tags.id, tags.name
      FROM tags
      JOIN article_tags ON tags.id = article_tags.tag_id
      WHERE article_tags.article_id = ?
      `,
      [id]
    )

    const newRows = {
      ...rows[0],
      author:{
        author_id:rows[0].author_id,
        username:rows[0].username,
        bio:rows[0].bio,
        image:rows[0].image
      },
    }
    return toArticle(newRows,tags)
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
  async findBySlug(slug: string):Promise<Article|null>{
    const [rows] =await pool.execute<ArticleRow[]>(
      `
      SELECT
        id,               
        slug,
        title,
        description,
        body,
        author_id,
        created_at,
        updated_at
      FROM articles
      WHERE slug = ?
        `,
        [slug]
    )
    return rows[0] ? toArticle(rows[0],[]) : null
  }
}