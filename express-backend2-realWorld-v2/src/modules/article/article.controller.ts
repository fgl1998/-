import type { Request, Response, NextFunction } from 'express'
import type { ArticleService } from './article.service.js'
import { UserUnauthrized } from '../../errors/common.error.js'




export class ArticleController { 
  private readonly articleService:ArticleService
  constructor(articleService:ArticleService){
    this.articleService = articleService
  }

  create = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const authorId = req.userId
    const article = await this.articleService.create(authorId,input)
    return res.status(201).json({
      success: true,
      code: 'ARTICLE_CREATED',
      message: '文章创建成功',
      data: article
    })
  } catch (error) {
    next(error)
  }
}

update = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const article = await this.articleService.update(req.userId,input)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_UPDATED',
      data: article
    })
  } catch (error) {
    next(error)
  }
}

deleteByArticleId = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await this.articleService.deleteByArticleId(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_DELETED',
    })
  }catch (error) {
    next(error)
  }
}

list = async (req:Request,res:Response,next:NextFunction)=> { 

  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await this.articleService.list(req.userId,input)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_FOUND',
      message: '文章获取成功',
      data: list
    })
    
  } catch (error) {
    next(error)
    
  }
}

feed = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await this.articleService.feed(req.userId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_FOLLOWING_FOUND',
      message: '文章获取成功',
      data: list
    })
  } catch (error) {
    next(error)
  }
}

detail = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const detail = await this.articleService.detail(req.userId,input.slug)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_DETAIL_FOUND',
      message: '文章详情获取成功',
      data: detail
    })
  } catch (error) {
    next(error)
  }
}

favorite = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await this.articleService.favorite(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_FAVORITED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

unfavorite = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await this.articleService.unfavorite(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_UNFAVORITED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

commentCreate = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await this.articleService.commentCreate(req.userId,input)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_CREATED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

commentList = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await this.articleService.commentList(input.articleId,req.userId)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}

commentDelete = async (req:Request,res:Response,next:NextFunction)=>{
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await this.articleService.commentDelete(input.commentId,req.userId)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_DELETED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

getFavoriteArticleListByUserId = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const input = req.body
    const list = await this.articleService.getFavoriteArticleListByUserId(input.userId)
    return res.status(200).json({
      success: true,
      code: 'FAVORITE_ARTICLE_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}
getArticleListByUserId = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const input = req.body
    console.log(this,9999);
    
    const list = await this.articleService.getArticleListByUserId(input.userId)
    return res.status(200).json({
      success: true,
      code: 'FAVORITE_ARTICLE_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}
  
}
