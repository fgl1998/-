import { Router } from "express";
import {CreateTagInput,CreateTagSchema} from './tag.schema.js'
import {validateBody} from '../../middleware/validate.js'
import {tagService} from './tag.service.js'
import {list,create} from './tag.controller.js'
export const tagRouter = Router()

tagRouter.post('/create',validateBody(CreateTagSchema),create)
tagRouter.post('/list',list)

