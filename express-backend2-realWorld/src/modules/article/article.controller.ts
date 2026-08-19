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

export async function deleteBySlug(req:Request,res:Response,next:NextFunction){
  try {
    const input = req.body
    if(!req.userId){
      throw new UserUnauthrized()
    }
    const result = await articleService.deleteBySlug(req.userId,input.slug)
    return res.status(200).json({
      success: true,
      code: 'ARTICLE_DELETED',
      message: '文章删除成功',
      data: result
    })
  } catch (error) {
    next(error)
  }
}