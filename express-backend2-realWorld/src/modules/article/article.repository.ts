
import { CreateArticleData } from './article.schema.js'
import type { ResultSetHeader } from 'mysql2'
import {pool} from '../../database/pool.js'
import { ArticleNotFoundError } from './article.error.js'
import { ArticleRow ,TagRow, ArticleQueryRow,toArticleQuery,TagQueryRow,toTagQuery} from './article.mapper.js'
import type {Article,ArticleQuery,TagQuery} from './article.entity.js'


export interface ArticleRepository {
  // create(input: CreateArticleData):Promise<Article>
  // findById(id: number): Promise<Article | null>
  // deleteBySlug(slug: string): Promise<boolean>
  // // findByAuthorId(authorId: number): Promise<Article[]>
  // findBySlug(slug: string): Promise<Article|null>

  articleList(currentUserId:number): Promise<ArticleQuery[]>
  tagList(articleIdList:number[]): Promise<TagQuery[]>
}


export const articleRepository:ArticleRepository = { 
  // async create(input: CreateArticleData): Promise<Article> { 

  //   try {
  //      const [result] = await pool.execute<ResultSetHeader>(
  //     `
  //     insert into articles(title,description,body,author_id,slug) values(?,?,?,?,?)
  //     `,
  //     [input.title,input.description,input.body,input.authorId,input.slug]
  //     )
      
  //     const tagIdList:number[] = JSON.parse(input.tags)

  //     if(tagIdList.length){
  //       const placeholders = tagIdList.map(tagId=>"(?,?)").join(", ")
  //       const valueList = tagIdList.flatMap(tagId=>[result.insertId,tagId])
  //       console.log(
  //         `
  //       insert into article_tags(article_id,tag_id) values ${placeholders}
  //       `,
  //       valueList
  //       );
        
  //       const [tagResult] = await pool.execute<ResultSetHeader>(
  //         `
  //         insert into article_tags(article_id,tag_id) values ${placeholders}
  //         `,
  //         valueList
  //       )
       
  //     }

  //     const createdArticle = await this.findById(result.insertId)

  //     if(!createdArticle){
  //       throw new ArticleNotFoundError()
  //     }
  //     return createdArticle
  //   } catch (error) {
  //     throw error
  //   }
  // },
  // async findById(id: number): Promise<Article | null> { 
  //   const [rows] = await pool.execute<ArticleRow[]>(
  //     `
  //     SELECT
  //       articles.id,               
  //       articles.slug,
  //       articles.title,
  //       articles.description,
  //       articles.body,
  //       articles.author_id,
  //       articles.created_at,
  //       articles.updated_at,
  //       users.id AS author_id,
  //       users.username AS username,
  //       users.bio AS bio,
  //       users.image AS image
  //     FROM articles
  //     JOIN users ON articles.author_id = users.id
  //     WHERE articles.id = ?
  //     `,
  //     [id]
  //   )
  //   if(!rows[0]){
  //     return null
  //   }

  //   const [tags] = await pool.execute<TagRow[]>(
  //     `
  //     SELECT tags.id, tags.name
  //     FROM tags
  //     JOIN article_tags ON tags.id = article_tags.tag_id
  //     WHERE article_tags.article_id = ?
  //     `,
  //     [id]
  //   )

  //   const newRows = {
  //     ...rows[0],
  //     author:{
  //       author_id:rows[0].author_id,
  //       username:rows[0].username,
  //       bio:rows[0].bio,
  //       image:rows[0].image
  //     },
  //   }
  //   return toArticle(newRows,tags)
  // },
  // async deleteBySlug(slug: string): Promise<boolean> { 
  //   const [result] = await pool.execute<ResultSetHeader>(
  //     `
  //     DELETE FROM articles
  //     WHERE slug = ?
  //     `,
  //     [slug]
  //   )
  //   return result.affectedRows > 0
  // },
  // async findBySlug(slug: string):Promise<Article|null>{
  //   const [rows] =await pool.execute<ArticleRow[]>(
  //     `
  //     SELECT
  //       id,               
  //       slug,
  //       title,
  //       description,
  //       body,
  //       author_id,
  //       created_at,
  //       updated_at
  //     FROM articles
  //     WHERE slug = ?
  //       `,
  //       [slug]
  //   )
  //   return rows[0] ? toArticle(rows[0],[]) : null
  // },

  async articleList(currentUserId:number):Promise<ArticleQuery[]>{
    const [rows] = await pool.query<ArticleQueryRow[]>(
      `
      SELECT
        a.id,
        a.slug,
        a.title,
        a.description,
        a.body,
        a.created_at,
        a.updated_at,
        
        a.author_id,
        u.username AS author_username,
        u.bio AS author_bio,
        u.image AS author_image,

        EXISTS(
          SELECT 1
          FROM favorites f
          WHERE f.user_id = ?
          AND f.article_id = a.id
        ) AS favorited,

        (
        SELECT COUNT(*)
        FROM favorites f
        WHERE f.article_id = a.id
        ) AS favorites_count

      FROM articles a
      JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [currentUserId,10,0]
    )

    return rows.map(row=>toArticleQuery(row))

  },

  async tagList(articleIdList):Promise<TagQuery[]>{
    if(!articleIdList.length) return []
    const placeholders = articleIdList.map(id=>"?").join(", ")
    const [rows] =await pool.execute<TagQueryRow[]>(
      `
      SELECT 
        att.tag_id,
        att.article_id,
        t.name AS tag_name
      FROM article_tags att
      JOIN tags t ON att.tag_id = t.id
      WHERE att.article_id IN (${placeholders})
      `,
      articleIdList
    )
    return rows.map(row=>toTagQuery(row))
  }
}