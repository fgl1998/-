import type { Router } from 'express'
import {MysqlArticleRepository} from './article.mysql-repository.js'
import {ArticleService} from './article.service.js'
import {ArticleController} from './article.controller.js'
import {createArticleRouter} from './article.route.js'
import type {Pool} from 'mysql2/promise'

export function createArticleModule(pool: Pool): Router {
  const mysqlArticleRepository = new MysqlArticleRepository(pool)
  const service = new ArticleService(mysqlArticleRepository)
  const controller = new ArticleController(service)
  return createArticleRouter(controller)
}
