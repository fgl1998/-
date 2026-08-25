
  
import { CreateArticleData,UpdateArticleInput, CommentsCerateInput} from './article.schema.js'
import type { ResultSetHeader } from 'mysql2'
import {pool} from '../../database/pool.js'
import { ArticleNotFoundError } from './article.error.js'
import { ArticleRow ,TagRow, ArticleQueryRow,toArticleQuery,TagQueryRow,toTagQuery,
  toQueryArticleDetail,QueryFollowingArticleRow,
  QueryArticleDetailRow,toQueryFollowingArticle,CommentRow,toComment
} from './article.mapper.js'
import type {Article,ArticleQuery,TagQuery,QueryFollowingArticle,QueryArticleDetail,QueryComment} from './article.entity.js'


export interface ArticleRepository {
  create(input: CreateArticleData):Promise<number>
  // findById(id: number): Promise<Article | null>
  // deleteBySlug(slug: string): Promise<boolean>
  // // findByAuthorId(authorId: number): Promise<Article[]>
  // findBySlug(slug: string): Promise<Article|null>
  updateArticle(updateData:UpdateArticleInput):Promise<number>
  deleteArticle(articleId: number):Promise<boolean>

  articleList(currentUserId:number): Promise<ArticleQuery[]>
  tagList(articleIdList:number[]): Promise<TagQuery[]>

  followingArticleList(currentUserId:number): Promise<QueryFollowingArticle[]>
  articleDetail(currentUserId:number,slug: string): Promise<QueryArticleDetail|null>
  articleDetailById(currentUserId:number,articleId: number): Promise<QueryArticleDetail|null>

  favorite(currentUserId:number,articleId:number):Promise<boolean>
  unfavorite(currentUserId:number,articleId:number):Promise<boolean>

  commentCreate(currentUserId:number,input:CommentsCerateInput):Promise<number>

  getCommentById(articleId:number,currentUserId:number): Promise<QueryComment|null>

  commentList(articleId:number,currentUserId:number): Promise<QueryComment[]>
}

export const articleRepository:ArticleRepository = { 
  async create(input: CreateArticleData): Promise<number> { 
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()
       const [result] = await connection.execute<ResultSetHeader>(
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

      await connection.commit()

      return result.insertId
    } catch (error) {
      await connection.rollback()
      throw error
    } finally{
      connection.release()
    }
  },
  async updateArticle(input: UpdateArticleInput):Promise<number>{
    const connection = await pool.getConnection()

    try {
      connection.beginTransaction()
      const fields = []
      const values = []

      if(input.title!==undefined){
        fields.push("title = ?")
        values.push(input.title)
      }
      if(input.description!==undefined){
        fields.push("description = ?")
        values.push(input.description)
      }
      if(input.body!==undefined){
        fields.push("body = ?")
        values.push(input.body)
      }
      if(fields.length){
         const [result] = await connection.execute<ResultSetHeader>(
          `
          update articles set ${fields.join(', ')} where id = ?
          `,
          [...values,input.articleId]
          )

      }
     

      if(input.tags!==undefined&&input.tags!=='[]'){
        await connection.execute<ResultSetHeader>(
          `
          DELETE FROM article_tags
          WHERE article_id = ?
          `,
          [input.articleId]
        )
        const tagIdList:number[] = JSON.parse(input.tags)
        const placeholders = tagIdList.map(tagId=>"(?,?)").join(", ")
        const valueList = tagIdList.flatMap(tagId=>[input.articleId,tagId])

        const [tagResult] = await connection.execute<ResultSetHeader>(
          `
          insert into article_tags(article_id,tag_id) values ${placeholders}
          `,
          valueList
        )
      }
      if(input.tags==='[]'){
        await connection.execute<ResultSetHeader>(
          `
          DELETE FROM article_tags
          WHERE article_id = ?
          `,
          [input.articleId]
        )
      }
      connection.commit()

      return input.articleId
      
    } catch (error) {
      connection.rollback()
      throw error
    } finally{
      connection.release()
    }
  },

  async deleteArticle(articleId:number):Promise<boolean>{
    const [result] = await pool.execute<ResultSetHeader>(
      `
      DELETE FROM articles
      WHERE id = ?
      `,
      [articleId]
    )
    return result.affectedRows === 1
  },
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
  },

  async  followingArticleList(currentUserId):Promise<QueryFollowingArticle[]> {
    const [rows] =await pool.execute<QueryFollowingArticleRow[]>(
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
        users.username AS author_username,
        users.bio AS author_bio,
        users.image AS author_image,
        1 AS following,

      EXISTS(
        SELECT 1 FROM favorites WHERE favorites.user_id=? AND articles.author_id=articles.id
      ) AS favorited,

      (
        SELECT COUNT(*) FROM favorites WHERE favorites.article_id=articles.id
      ) AS favorites_count

      from 
      follows
      JOIN articles ON articles.author_id=follows.following_id
      JOIN users ON users.id=articles.author_id
      WHERE follows.follower_id=?      
      `,
      [currentUserId,currentUserId]
    )
    return rows.map(row=>toQueryFollowingArticle(row))
  },

  async articleDetail(currentUserId:number,slug:string):Promise<QueryArticleDetail|null>{
    console.log(currentUserId,slug);
    
    const [rows] =await pool.execute<QueryArticleDetailRow[]>(
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

        users.username AS author_username,
        users.bio AS author_bio,
        users.image AS author_image,

      EXISTS(
        SELECT 1 FROM follows WHERE follows.follower_id=? AND follows.following_id=articles.author_id
      ) AS following,
      EXISTS(
        SELECT 1 FROM favorites WHERE favorites.user_id=? AND favorites.article_id=articles.id
      ) AS favorited,
      (
        SELECT COUNT(*) FROM favorites WHERE favorites.article_id=articles.id
      )AS favorites_count

      FROM articles
      JOIN users ON users.id=articles.author_id

      WHERE  articles.slug=?
      `,
      [currentUserId,currentUserId,slug]
    )
    console.log(rows[0],'rows');
    
    return rows[0]?toQueryArticleDetail(rows[0]):null
  },
  async articleDetailById(currentUserId:number,articleId:number):Promise<QueryArticleDetail|null>{
    console.log(currentUserId,articleId,'6666');
    
    
    const [rows] =await pool.execute<QueryArticleDetailRow[]>(
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

        users.username AS author_username,
        users.bio AS author_bio,
        users.image AS author_image,

      EXISTS(
        SELECT 1 FROM follows WHERE follows.follower_id=? AND follows.following_id=articles.author_id
      ) AS following,
      EXISTS(
        SELECT 1 FROM favorites WHERE favorites.user_id=? AND favorites.article_id=articles.id
      ) AS favorited,
      (
        SELECT COUNT(*) FROM favorites WHERE favorites.article_id=articles.id
      )AS favorites_count

      FROM articles
      JOIN users ON users.id=articles.author_id

      WHERE  articles.id=?
      `,
      [currentUserId,currentUserId,articleId]
    )
    return rows[0]?toQueryArticleDetail(rows[0]):null
  },

  async favorite(currentUserId:number,articleId:number):Promise<boolean>{ 
    console.log(currentUserId,articleId,'333');
    
    const [result] =await pool.execute<ResultSetHeader>(
      `
      INSERT IGNORE INTO favorites (user_id,article_id) VALUES (?,?)
      `,
      [currentUserId,articleId]
    )
    return result.affectedRows === 1
  },
  async unfavorite(currentUserId:number,articleId:number):Promise<boolean>{ 
    const [result] =await pool.execute<ResultSetHeader>(
      `
      DELETE FROM favorites WHERE user_id=? AND article_id=?
      `,
      [currentUserId,articleId]
    )
    return result.affectedRows === 1
  },

  async commentCreate(currentUserId:number, input:CommentsCerateInput):Promise<number> {
    console.log(currentUserId,input.articleId,input.body,'33333');
    
    
    const [result] = await pool.execute<ResultSetHeader>(
      `
      INSERT INTO comments (author_id,article_id,body) VALUES (?,?,?)
      `,
      [currentUserId,input.articleId,input.body]
    )
    return result.insertId
  },
  async getCommentById(commentId:number,currentUserId:number):Promise<QueryComment|null>{ 
    const [rows] = await pool.execute<CommentRow[]>(
      `
      SELECT
        comments.id,
        comments.article_id,
        comments.author_id,
        comments.body,
        comments.created_at,
        comments.updated_at,
      EXISTS(
        SELECT 1 FROM follows 
        WHERE follows.follower_id=? AND follows.following_id=comments.author_id
      ) AS following

      FROM comments
      WHERE id=?
      LIMIT 1
      `
      ,
      [currentUserId,commentId]
    )
    return rows[0]?toComment(rows[0]):null
  },
  async commentList(articleId:number,currentUserId:number):Promise<QueryComment[]>{ 
    const [rows] =await pool.execute<CommentRow[]>(
      `
      SELECT
        comments.id,
        comments.article_id,
        comments.author_id,
        comments.body,
        comments.created_at,
        comments.updated_at,

        users.username AS author_username,
        users.bio AS author_bio,
        users.image AS author_image,

        EXISTS (
          SELECT 1
          FROM follows
          WHERE follows.follower_id = ?
            AND follows.following_id = comments.author_id
        ) AS following

      FROM comments
      JOIN users
        ON users.id = comments.author_id
      WHERE comments.article_id = ?
      `,
      [currentUserId, articleId]
    )
    return rows.map(row=>toComment(row))
  },
}