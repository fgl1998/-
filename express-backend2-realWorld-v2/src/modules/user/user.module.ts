import { createUserRouter } from "./user.route.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { MysqlUserRepository } from "./user.mysql-repository.js";
import type { Pool } from "mysql2/promise";
import type { Router } from "express";

export function createUserModule(pool: Pool): Router { 
  const repository = new MysqlUserRepository(pool)
  const service = new UserService(repository)
  const controller = new UserController(service)
  return createUserRouter(controller)
}