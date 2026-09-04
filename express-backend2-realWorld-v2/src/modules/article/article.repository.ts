
  
import { CreateArticleData,UpdateArticleInput, CommentsCerateInput} from './article.schema.js'
import type {Article,ArticleQuery,TagQuery,QueryFollowingArticle,QueryArticleDetail,QueryComment,ArticleQueryByUserId} from './article.entity.js'

export interface ArticleRepository {
  create(input: CreateArticleData):Promise<number>

  updateArticle(updateData:UpdateArticleInput):Promise<number>

  deleteArticle(articleId: number):Promise<boolean>

  articleList(currentUserId:number,keyWord:string,limit:number,offset:number): Promise<ArticleQuery[]>

  articleCount(keyWord:string): Promise<number>

  tagList(articleIdList:number[]): Promise<TagQuery[]>

  followingArticleList(currentUserId:number): Promise<QueryFollowingArticle[]>

  getArticleListByUserId(userId:number): Promise<ArticleQueryByUserId[]>

  getFavoriteArticleListByUserId(userId:number): Promise<ArticleQueryByUserId[]>

  articleDetail(currentUserId:number,slug: string): Promise<QueryArticleDetail|null>

  articleDetailById(currentUserId:number,articleId: number): Promise<QueryArticleDetail|null>

  favorite(currentUserId:number,articleId:number):Promise<void>

  unfavorite(currentUserId:number,articleId:number):Promise<void>

  commentCreate(currentUserId:number,input:CommentsCerateInput):Promise<number>

  getCommentById(articleId:number,currentUserId:number): Promise<QueryComment|null>

  commentList(articleId:number,currentUserId:number): Promise<QueryComment[]>
  
  commentDelete(commentId:number):Promise<boolean>
}

