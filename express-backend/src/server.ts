import 'dotenv/config'
import {checkDatabaseConnection,createDatabase} from './database/mysql.js'
import {loadEnv} from './config/env.js'   
import { createUserModule } from './modules/user/user.module.js'
import { MysqlUserRepository } from './modules/user/user.mysql-repository.js'
import { createApp } from './app.js'

const env = loadEnv(process.env)
const pool = createDatabase(env)
checkDatabaseConnection(pool)

const repository = new MysqlUserRepository(pool)
const userRouter = createUserModule(repository)
const app = createApp(userRouter)