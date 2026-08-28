import type { Request, Response, NextFunction } from 'express'
import { articleService } from './article.service.js'
import { UserUnauthrized } from '../../errors/common.error.js'

export async function create(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const authorId = req.userId
    const article = await articleService.create(authorId,input)
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

export async function update(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const article = await articleService.update(req.userId,input)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_UPDATED',
      data: article
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteByArticleId(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.deleteByArticleId(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_DELETED',
    })
  }catch (error) {
    next(error)
  }
}

export async function list(req:Request,res:Response,next:NextFunction) { 

  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await articleService.list(req.userId,input)
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

export async function feed(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await articleService.feed(req.userId)
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

export async function detail(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const detail = await articleService.detail(req.userId,input.slug)
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

export async function favorite(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.favorite(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_FAVORITED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

export async function unfavorite(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.unfavorite(req.userId,input.articleId)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_UNFAVORITED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

export async function commentCreate(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.commentCreate(req.userId,input)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_CREATED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

export async function commentList(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const list = await articleService.commentList(input.articleId,req.userId)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}

export async function commentDelete(req:Request,res:Response,next:NextFunction){
  try {
     const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.commentDelete(input.commentId,req.userId)
    return res.status(200).json({
      success: true,
      code: 'COMMENT_DELETED',
      data: result
    })
  }catch (error) {
    next(error)
  }
}

export async function getFavoriteArticleListByUserId(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    const list = await articleService.getFavoriteArticleListByUserId(input.userId)
    return res.status(200).json({
      success: true,
      code: 'FAVORITE_ARTICLE_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}
export async function getArticleListByUserId(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    const list = await articleService.getArticleListByUserId(input.userId)
    return res.status(200).json({
      success: true,
      code: 'FAVORITE_ARTICLE_LIST_FOUND',
      data: list
    })
  }catch (error) {
    next(error)
  }
}
