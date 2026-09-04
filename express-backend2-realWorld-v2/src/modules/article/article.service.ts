  import type { ArticleOutput,QueryFollowingArticleOutput,QueryArticleDetailOutput,QueryCommentOutput,ArticleQueryByUserIdOutput } from '../article/article.dto.js'
  import type { CreateArticleInput,CreateArticleData,
    UpdateArticleInput,CommentsCerateInput,ArticleListInput } from '../article/article.schema.js'
  import {ArticleNotFoundError,CommentNotFoundError} from './article.error.js'
  import { generateSlug } from '../../utils/article.util.js'
  import {ForbiddenError} from '../../errors/common.error.js'
  import type { Tag } from '../article/article.entity.js'

  import { createPageResult, getPagination,PageResult } from '../../utils/pagination.js'

  import type {ArticleRepository} from './article.repository.js'


  export class ArticleService {
    private readonly articleRepository:ArticleRepository
    constructor(articleRepository:ArticleRepository){
      this.articleRepository=articleRepository
    }

    async create(currentUserId:number,input:CreateArticleInput):Promise<QueryArticleDetailOutput|null>{
      const inputWithSlug:CreateArticleData = {
        ...input,
        authorId:currentUserId,
        slug:generateSlug(input.title)
      }
      const articleId = await this.articleRepository.create(inputWithSlug)
      const article = await this.articleRepository.articleDetailById(currentUserId,articleId)

      if(!article||!article.id) return null
      
      const articleTagList = await this.articleRepository.tagList([article.id])
       return {
        ...article,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
        tags:articleTagList,
      }
    }

    async update(currentUserId:number,input:UpdateArticleInput):Promise<QueryArticleDetailOutput|null> {
      const article = await this.articleRepository.articleDetailById(currentUserId,input.articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      if(article.author_id !== currentUserId){
        throw new ForbiddenError()
      }

      const articleId = await this.articleRepository.updateArticle(input)
      const articleNew = await this.articleRepository.articleDetailById(currentUserId,articleId)
      if(!articleNew) return null
      const articleTagList = await this.articleRepository.tagList([articleId])

      return {
        ...articleNew,
        createdAt:articleNew.createdAt.toISOString(),
        updatedAt:articleNew.updatedAt.toISOString(),
        tags:articleTagList,
      }

      
    }

    async deleteByArticleId(currentUserId:number,articleId:number):Promise<boolean>{
      const article = await this.articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      if(article.author_id !== currentUserId){
        throw new ForbiddenError()
      }
      return await this.articleRepository.deleteArticle(articleId)
    }

    async list(currentUserId:number,input:ArticleListInput):Promise<PageResult<ArticleOutput>>{
      let {page,pageSize,keyWord} = input
      const {limit,offset} = getPagination(page,pageSize)
      // const articleList = await this.articleRepository.articleList(currentUserId,limit,offset)
      if(keyWord===undefined){
        keyWord=''
      }
      const [articleList,total] = await Promise.all([
        this.articleRepository.articleList(currentUserId,keyWord,limit,offset),
        this.articleRepository.articleCount(keyWord)
      ])
      const articleIdList = articleList.map(article=>article.id)
      const tagList = await this.articleRepository.tagList(articleIdList)

      const map = new Map<number,Tag[]>()
      for(const tag of tagList){ 
        const tags = map.get(tag.article_id)||[]
        tags.push(tag)
        map.set(tag.article_id,tags)
      }
      const articleListWithTag = articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
          tags:map.get(article.id)||[],
        }
      })

      return createPageResult<ArticleOutput>(articleListWithTag,total,page,pageSize)
    }

    async feed(currentUserId:number):Promise<QueryFollowingArticleOutput[]>{ 
      const articleList = await this.articleRepository.followingArticleList(currentUserId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    }

    async detail(currentUserId:number,slug:string):Promise<QueryArticleDetailOutput|null>{
      const article = await this.articleRepository.articleDetail(currentUserId,slug)
      if(!article||!article.id) return null
      
      const articleTagList = await this.articleRepository.tagList([article.id])
      console.log(articleTagList,'articleTagList');
      
      return {
        ...article,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
        tags:articleTagList,
      }
    }

    async favorite(currentUserId:number,articleId:number):Promise<{favorited:true}>{
      const article = await this.articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      await this.articleRepository.favorite(currentUserId,articleId)
      return {favorited:true}
    }
    async unfavorite(currentUserId:number,articleId:number):Promise<{favorited:false}>{
      const article = await this.articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      await this.articleRepository.unfavorite(currentUserId,articleId)
      return {favorited:false}
    }

    async commentCreate(currentUserId:number,input:CommentsCerateInput):Promise<QueryCommentOutput|null>{
      const commentId = await this.articleRepository.commentCreate(currentUserId,input)
      const comment = await this.articleRepository.getCommentById(commentId,currentUserId)
      if(!comment) {
        throw new CommentNotFoundError()
      }
      return {
        ...comment,
        createdAt:comment.createdAt.toISOString(),
        updatedAt:comment.updatedAt.toISOString(),
      }
    }

    async commentList(articleId:number,currentUserId:number):Promise<QueryCommentOutput[]>{ 
      const commentList = await this.articleRepository.commentList(articleId,currentUserId)
      return commentList.map(comment=>{
        return {
          ...comment,
          createdAt:comment.createdAt.toISOString(),
          updatedAt:comment.updatedAt.toISOString(),
        }
      })
    }

    async commentDelete(commentId:number,currentUserId:number):Promise<boolean>{
      const comment = await this.articleRepository.getCommentById(commentId,currentUserId)
      if(!comment){
        throw new CommentNotFoundError()
      }
      if(comment.author_id !== currentUserId){
        throw new ForbiddenError()
      }
      return this.articleRepository.commentDelete(commentId)
    }
    async getArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>{
      const articleList = await this.articleRepository.getArticleListByUserId(userId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    }
    async getFavoriteArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>{
      const articleList = await this.articleRepository.getFavoriteArticleListByUserId(userId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    }
  }

  
