import { createTagRouter } from "./tag.route.js";
import { TagService } from "./tag.service.js";
import { TagController } from "./tag.controller.js";
import { MysqlTagRepository } from "./tag.mysql-repository.js";
import { Router } from "express";
import { Pool } from "mysql2/promise";

export function createTagModule(pool: Pool): Router { 
  const tagRepository = new MysqlTagRepository(pool)
  const tagService = new TagService(tagRepository)
  const tagController = new TagController(tagService)
  const tagRouter = createTagRouter(tagController)
  
  return tagRouter
}