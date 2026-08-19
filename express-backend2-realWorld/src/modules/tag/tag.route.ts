import { Router } from "express";
import {CreateTagInput,CreateTagSchema} from './tag.schema.js'
import {validateBody} from '../../middleware/validate.js'
import {tagService} from './tag.service.js'

export const tagRouter = Router()

tagRouter.post('/tag/create',validateBody(CreateTagSchema),tagService.create)

