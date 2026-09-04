import type { ArticleRepository } from './article.repository.js'
import { CreateArticleData,UpdateArticleInput, CommentsCerateInput} from './article.schema.js'
import { ArticleNotFoundError } from './article.error.js'
import { ArticleRow ,TagRow, ArticleQueryRow,toArticleQuery,TagQueryRow,toTagQuery,
  toQueryArticleDetail,QueryFollowingArticleRow,
  QueryArticleDetailRow,toQueryFollowingArticle,CommentRow,toComment,ArticleQueryByUserIdRow,toArticleQueryByUserId
} from './article.mapper.js'
import type {Article,ArticleQuery,TagQuery,QueryFollowingArticle,QueryArticleDetail,QueryComment,ArticleQueryByUserId} from './article.entity.js'
import type{ RowDataPacket,Pool,ResultSetHeader } from 'mysql2/promise.js'

export class MysqlArticleRepository implements ArticleRepository { 
  private readonly pool: Pool
  constructor( pool: Pool) {
    this.pool = pool
  }
  async create(input: CreateArticleData): Promise<number> { 
    const connection = await this.pool.getConnection()

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
        // console.log(
        //   `
        // insert into article_tags(article_id,tag_id) values ${placeholders}
        // `,
        // valueList
        // );
        
        const [tagResult] = await connection.execute<ResultSetHeader>(
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
  }
  async updateArticle(input: UpdateArticleInput):Promise<number>{
    const connection = await this.pool.getConnection()

    try {
      await connection.beginTransaction()
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
      await connection.commit()

      return input.articleId
      
    } catch (error) {
      await connection.rollback()
      throw error
    } finally{
      connection.release()
    }
  }

  async deleteArticle(articleId:number):Promise<boolean>{
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
      DELETE FROM articles
      WHERE id = ?
      `,
      [articleId]
    )
    return result.affectedRows === 1
  }

  async articleList(currentUserId:number,keyWord:string,limit:number,offset:number):Promise<ArticleQuery[]>{
    const [rows] = await this.pool.query<ArticleQueryRow[]>(
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
      WHERE a.title LIKE ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [currentUserId,keyWord,limit,offset]
    )
    return rows.map(row=>toArticleQuery(row))

  }

  async articleCount(keyWord:string): Promise<number> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM articles
      WHERE title LIKE ?
      `,
      [keyWord]
    )

    return Number(rows[0]?.total ?? 0)
  }
  async tagList(articleIdList:number[]):Promise<TagQuery[]>{
    if(!articleIdList.length) return []
    const placeholders = articleIdList.map(id=>"?").join(", ")
    const [rows] =await this.pool.execute<TagQueryRow[]>(
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

  async  followingArticleList(currentUserId:number):Promise<QueryFollowingArticle[]> {
    const [rows] =await this.pool.execute<QueryFollowingArticleRow[]>(
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
        SELECT 1 FROM favorites WHERE favorites.user_id=? AND favorites.article_id=articles.id
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
  }

  async getArticleListByUserId(userId:number):Promise<ArticleQueryByUserId[]>{
    const [rows] = await this.pool.execute<ArticleQueryByUserIdRow[]>(
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

        (
        SELECT COUNT(*) FROM favorites WHERE favorites.article_id=articles.id
        ) AS favorites_count

      FROM articles
      JOIN users ON users.id=articles.author_id
      WHERE articles.author_id=?
      `,
      [userId]
    ) 
    return rows.map(row=>toArticleQueryByUserId(row))
  }
  async getFavoriteArticleListByUserId(userId:number):Promise<ArticleQueryByUserId[]>{
    const [rows] = await this.pool.execute<ArticleQueryByUserIdRow[]>(
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

        (
        SELECT COUNT(*) FROM favorites WHERE favorites.article_id=articles.id
        ) AS favorites_count

      FROM favorites
  
			JOIN articles ON articles.id=favorites.article_id
			JOIN users ON users.id=articles.author_id
      WHERE favorites.user_id=  ?
      `,
      [userId]
    ) 
    return rows.map(row=>toArticleQueryByUserId(row))
  }

  async articleDetail(currentUserId:number,slug:string):Promise<QueryArticleDetail|null>{
    console.log(currentUserId,slug);
    
    const [rows] =await this.pool.execute<QueryArticleDetailRow[]>(
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
  }
  async articleDetailById(currentUserId:number,articleId:number):Promise<QueryArticleDetail|null>{
    console.log(currentUserId,articleId,'6666');
    
    
    const [rows] =await this.pool.execute<QueryArticleDetailRow[]>(
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
  }

  async favorite(currentUserId:number,articleId:number):Promise<void>{ 
    console.log(currentUserId,articleId,'333');
    
    const [result] =await this.pool.execute<ResultSetHeader>(
      `
      INSERT IGNORE INTO favorites (user_id,article_id) VALUES (?,?)
      `,
      [currentUserId,articleId]
    )
  }
  async unfavorite(currentUserId:number,articleId:number):Promise<void>{ 
    const [result] =await this.pool.execute<ResultSetHeader>(
      `
      DELETE FROM favorites WHERE user_id=? AND article_id=?
      `,
      [currentUserId,articleId]
    )
  }

  async commentCreate(currentUserId:number, input:CommentsCerateInput):Promise<number> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
      INSERT INTO comments (author_id,article_id,body) VALUES (?,?,?)
      `,
      [currentUserId,input.articleId,input.body]
    )
    return result.insertId
  }
  async getCommentById(commentId:number,currentUserId:number):Promise<QueryComment|null>{ 
    const [rows] = await this.pool.execute<CommentRow[]>(
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
      EXISTS(
        SELECT 1 FROM follows 
        WHERE follows.follower_id=? AND follows.following_id=comments.author_id
      ) AS following

      FROM comments
      JOIN users
        ON users.id = comments.author_id
      WHERE comments.id=?
      LIMIT 1
      `
      //  WHERE comments.id=?
      ,
      [currentUserId,commentId]
    )
    return rows[0]?toComment(rows[0]):null
  }
  async commentList(articleId:number,currentUserId:number):Promise<QueryComment[]>{ 
    const [rows] =await this.pool.execute<CommentRow[]>(
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
  }
  async commentDelete(commentId:number):Promise<boolean>{
    const [result] = await this.pool.execute<ResultSetHeader>(
      `
      DELETE FROM comments WHERE id=? 
      `,
      [commentId]
    )
    return result.affectedRows === 1
  }

}