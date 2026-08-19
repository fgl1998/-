import { validateBody } from "../../middleware/validate.js"
import { CreateArticleSchema ,DeleteArticleSchema} from "./article.schema.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import {create,deleteBySlug} from "./article.controller.js"
import {Router} from 'express'

export const articleRouter = Router()

articleRouter.post('/article/create',authMiddleware,validateBody(CreateArticleSchema),create)
articleRouter.post('/article/delete',authMiddleware,validateBody(DeleteArticleSchema),deleteBySlug)
