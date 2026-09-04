import type { TagService } from "./tag.service.js";
import {Request,Response,NextFunction} from 'express'


export class TagController { 

  private readonly tagService:TagService

  constructor(tagService:TagService){
    this.tagService = tagService
  }

  create = async(req:Request, res:Response, next:NextFunction)=>{
    try {
      const input =req.body
      const tag = await this.tagService.create(input.name)
      res.status(201).json({
        success: true,
        code: 'TAG_CREATED',
        message: '标签创建成功',
        data: tag
      })
    } catch (error) {
      next(error)
    }
  }

  list = async(req:Request, res:Response, next:NextFunction)=>{ 
    try {
      const tags = await this.tagService.list()
      res.status(200).json({
        success: true,
        code: 'TAG_LIST',
        message: '标签列表获取成功',
        data: tags
      })
    } catch (error) {
      next(error)
    }
  }

}