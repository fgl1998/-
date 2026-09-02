  import type { ArticleOutput,QueryFollowingArticleOutput,QueryArticleDetailOutput,QueryCommentOutput,ArticleQueryByUserIdOutput } from '../article/article.dto.js'
  import { articleRepository } from '../article/article.repository.js'
  import type { CreateArticleInput,CreateArticleData,
    UpdateArticleInput,CommentsCerateInput,ArticleListInput } from '../article/article.schema.js'
  import {ArticleNotFoundError,CommentNotFoundError} from './article.error.js'
  import { generateSlug } from '../../utils/article.util.js'
  import {ForbiddenError} from '../../errors/common.error.js'
  import type { Tag } from '../article/article.entity.js'

  import { createPageResult, getPagination,PageResult } from '../../utils/pagination.js'
  
  
  export interface ArticleService {
    create(currentUserId:number,input:CreateArticleInput):Promise<QueryArticleDetailOutput|null>
    update(currentUserId:number,input:UpdateArticleInput):Promise<QueryArticleDetailOutput|null>
    deleteByArticleId(currentUserId:number,articleId:number):Promise<boolean>

    list(currentUserId:number,input:ArticleListInput):Promise<PageResult<ArticleOutput>>
    feed(currentUserId:number):Promise<QueryFollowingArticleOutput[]>
    detail(currentUserId:number,slug:string):Promise<QueryArticleDetailOutput|null>

    getFavoriteArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>
    getArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>

    favorite(currentUserId:number,articleId:number):Promise<{favorited:true}>
    unfavorite(currentUserId:number,articleId:number):Promise<{favorited:false}>

    commentCreate(currentUserId:number,input:CommentsCerateInput):Promise<QueryCommentOutput|null>
    commentList(articleId:number,currentUserId:number):Promise<QueryCommentOutput[]>
    commentDelete(commentId:number,currentUserId:number):Promise<boolean>
  }
  export const articleService:ArticleService = {
    async create(currentUserId,input:CreateArticleInput):Promise<QueryArticleDetailOutput|null>{
      const inputWithSlug:CreateArticleData = {
        ...input,
        authorId:currentUserId,
        slug:generateSlug(input.title)
      }
      const articleId = await articleRepository.create(inputWithSlug)
      const article = await articleRepository.articleDetailById(currentUserId,articleId)

      if(!article||!article.id) return null
      
      const articleTagList = await articleRepository.tagList([article.id])
       return {
        ...article,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
        tags:articleTagList,
      }
    },

    async update(currentUserId:number,input:UpdateArticleInput):Promise<QueryArticleDetailOutput|null> {
      const article = await articleRepository.articleDetailById(currentUserId,input.articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      if(article.author_id !== currentUserId){
        throw new ForbiddenError()
      }

      const articleId = await articleRepository.updateArticle(input)
      const articleNew = await articleRepository.articleDetailById(currentUserId,articleId)
      if(!articleNew) return null
      const articleTagList = await articleRepository.tagList([articleId])

      return {
        ...articleNew,
        createdAt:articleNew.createdAt.toISOString(),
        updatedAt:articleNew.updatedAt.toISOString(),
        tags:articleTagList,
      }

      
    },

    async deleteByArticleId(currentUserId:number,articleId:number):Promise<boolean>{
      const article = await articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      if(article.author_id !== currentUserId){
        throw new ForbiddenError()
      }
      return await articleRepository.deleteArticle(articleId)
    },

    async list(currentUserId:number,input:ArticleListInput):Promise<PageResult<ArticleOutput>>{
      let {page,pageSize,keyWord} = input
      const {limit,offset} = getPagination(page,pageSize)
      // const articleList = await articleRepository.articleList(currentUserId,limit,offset)
      if(keyWord===undefined){
        keyWord=''
      }
      const [articleList,total] = await Promise.all([
        articleRepository.articleList(currentUserId,keyWord,limit,offset),
        articleRepository.articleCount(keyWord)
      ])
      const articleIdList = articleList.map(article=>article.id)
      const tagList = await articleRepository.tagList(articleIdList)

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
    },

    async feed(currentUserId:number):Promise<QueryFollowingArticleOutput[]>{ 
      const articleList = await articleRepository.followingArticleList(currentUserId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    },

    async detail(currentUserId:number,slug:string):Promise<QueryArticleDetailOutput|null>{
      const article = await articleRepository.articleDetail(currentUserId,slug)
      if(!article||!article.id) return null
      
      const articleTagList = await articleRepository.tagList([article.id])
      console.log(articleTagList,'articleTagList');
      
      return {
        ...article,
        createdAt:article.createdAt.toISOString(),
        updatedAt:article.updatedAt.toISOString(),
        tags:articleTagList,
      }
    },

    async favorite(currentUserId:number,articleId:number):Promise<{favorited:true}>{
      const article = await articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      await articleRepository.favorite(currentUserId,articleId)
      return {favorited:true}
    },
    async unfavorite(currentUserId:number,articleId:number):Promise<{favorited:false}>{
      const article = await articleRepository.articleDetailById(currentUserId,articleId)
      if(!article){
        throw new ArticleNotFoundError()
      }
      await articleRepository.unfavorite(currentUserId,articleId)
      return {favorited:false}
    },

    async commentCreate(currentUserId:number,input:CommentsCerateInput):Promise<QueryCommentOutput|null>{
      const commentId = await articleRepository.commentCreate(currentUserId,input)
      const comment = await articleRepository.getCommentById(commentId,currentUserId)
      if(!comment) {
        throw new CommentNotFoundError()
      }
      return {
        ...comment,
        createdAt:comment.createdAt.toISOString(),
        updatedAt:comment.updatedAt.toISOString(),
      }
    },

    async commentList(articleId:number,currentUserId:number):Promise<QueryCommentOutput[]>{ 
      const commentList = await articleRepository.commentList(articleId,currentUserId)
      return commentList.map(comment=>{
        return {
          ...comment,
          createdAt:comment.createdAt.toISOString(),
          updatedAt:comment.updatedAt.toISOString(),
        }
      })
    },

    async commentDelete(commentId:number,currentUserId:number):Promise<boolean>{
      const comment = await articleRepository.getCommentById(commentId,currentUserId)
      if(!comment){
        throw new CommentNotFoundError()
      }
      if(comment.author_id !== currentUserId){
        throw new ForbiddenError()
      }
      return articleRepository.commentDelete(commentId)
    },
    async getArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>{
      const articleList = await articleRepository.getArticleListByUserId(userId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    },
    async getFavoriteArticleListByUserId(userId:number):Promise<ArticleQueryByUserIdOutput[]>{
      const articleList = await articleRepository.getFavoriteArticleListByUserId(userId)
      return articleList.map(article=>{
        return {
          ...article,
          createdAt:article.createdAt.toISOString(),
          updatedAt:article.updatedAt.toISOString(),
        }
      })
    }

  }