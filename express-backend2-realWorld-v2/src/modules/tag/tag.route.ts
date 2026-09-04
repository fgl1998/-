import { Router } from "express";
import {CreateTagInput,CreateTagSchema} from './tag.schema.js'
import {validateBody} from '../../middleware/validate.js'
import type { TagController } from "./tag.controller.js";


export function createTagRouter(tagService:TagController):Router{ 
  const tagRouter = Router()

  tagRouter.post('/list',tagService.list)

  return tagRouter
}

