import { validateBody } from "../../middleware/validate.js"
import { CreateArticleSchema ,DeleteArticleSchema,GetArticleByIdSchema,
  DetailArticleSchema,UpdateArticleSchema,ArticleDeleteByArticleIdSchema,
  ArticleFavoriteSchema,CommentsCerateSchema,CommentListSchema,CommentDeleteSchema,
  ArticleListSchema,UserIdSchema
} from "./article.schema.js"
import { authMiddleware } from "../../middleware/auth.middleware.js"
import {Router} from 'express'
import type { ArticleController } from "./article.controller.js"

export  function createArticleRouter(articleController:ArticleController){
  const articleRouter = Router()

  articleRouter.post('/create',authMiddleware,validateBody(CreateArticleSchema),articleController.create)
  articleRouter.post('/update',authMiddleware,validateBody(UpdateArticleSchema),articleController.update)
  articleRouter.post('/deleteByArticleId',authMiddleware,validateBody(ArticleDeleteByArticleIdSchema),articleController.deleteByArticleId)
  articleRouter.post('/list',authMiddleware,validateBody(ArticleListSchema),articleController.list)
  articleRouter.post('/feed',authMiddleware,articleController.feed)
  articleRouter.post('/detail',authMiddleware,validateBody(DetailArticleSchema),articleController.detail)
  articleRouter.post('/favorite',authMiddleware,validateBody(ArticleFavoriteSchema),articleController.favorite)
  articleRouter.post('/unfavorite',authMiddleware,validateBody(ArticleFavoriteSchema),articleController.unfavorite)
  articleRouter.post('/comment/create',authMiddleware,validateBody(CommentsCerateSchema),articleController.commentCreate)
  articleRouter.post('/comment/list',authMiddleware,validateBody(CommentListSchema),articleController.commentList)
  articleRouter.post('/comment/delete',authMiddleware,validateBody(CommentDeleteSchema),articleController.commentDelete)
  articleRouter.post('/getArticleListByUserId',validateBody(UserIdSchema),articleController.getArticleListByUserId)
  articleRouter.post('/getFavoriteArticleListByUserId',validateBody(UserIdSchema),articleController.getFavoriteArticleListByUserId)

  return articleRouter
}

