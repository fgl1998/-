import { tagService } from "./tag.service.js";
import { TagNotFoundError } from "./tag.error.js";
import {Request,Response,NextFunction} from 'express'
import {CreateTagInput} from './tag.schema.js'

export async function create(req:Request, res:Response, next:NextFunction) {
  try {
    const input =req.body
    const tag = await tagService.create(input.name)
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