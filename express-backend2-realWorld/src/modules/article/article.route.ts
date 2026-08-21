import { validateBody } from "../../middleware/validate.js"
import { CreateArticleSchema ,DeleteArticleSchema,GetArticleByIdSchema} from "./article.schema.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import {create,deleteBySlug,getArticleById,list} from "./article.controller.js"
import {Router} from 'express'

export const articleRouter = Router()

articleRouter.post('/article/create',authMiddleware,validateBody(CreateArticleSchema),create)
articleRouter.post('/article/delete',authMiddleware,validateBody(DeleteArticleSchema),deleteBySlug)
articleRouter.post('/article/get',authMiddleware,validateBody(GetArticleByIdSchema),getArticleById)
articleRouter.post('/list',authMiddleware,list)

