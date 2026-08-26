import { validateBody } from "../../middleware/validate.js"
import { CreateArticleSchema ,DeleteArticleSchema,GetArticleByIdSchema,
  DetailArticleSchema,UpdateArticleSchema,ArticleDeleteByArticleIdSchema,
  ArticleFavoriteSchema,CommentsCerateSchema,CommentListSchema,CommentDeleteSchema
} from "./article.schema.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import {create,list,feed,detail,update,deleteByArticleId,favorite,unfavorite,commentCreate,commentList,commentDelete} from "./article.controller.js"
import {Router} from 'express'

export const articleRouter = Router()

articleRouter.post('/create',authMiddleware,validateBody(CreateArticleSchema),create)
articleRouter.post('/update',authMiddleware,validateBody(UpdateArticleSchema),update)
articleRouter.post('/deleteByArticleId',authMiddleware,validateBody(ArticleDeleteByArticleIdSchema),deleteByArticleId)
articleRouter.post('/list',authMiddleware,list)
articleRouter.post('/feed',authMiddleware,feed)
articleRouter.post('/detail',authMiddleware,validateBody(DetailArticleSchema),detail)
articleRouter.post('/favorite',authMiddleware,validateBody(ArticleFavoriteSchema),favorite)
articleRouter.post('/unfavorite',authMiddleware,validateBody(ArticleFavoriteSchema),unfavorite)
articleRouter.post('/comment/create',authMiddleware,validateBody(CommentsCerateSchema),commentCreate)
articleRouter.post('/comment/list',authMiddleware,validateBody(CommentListSchema),commentList)
articleRouter.post('/comment/delete',authMiddleware,validateBody(CommentDeleteSchema),commentDelete)

