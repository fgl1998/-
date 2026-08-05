import 'dotenv/config'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Server } from 'node:http'
import { createApp } from './app.js'
import { loadEnv } from './config/env.js'
import {
  checkDatabaseConnection,
  closeDatabase,
  createDatabase
} from './database/mysql.js'
import { createUserModule } from './modules/user/user.module.js'
import { MysqlUserRepository } from './modules/user/user.mysql-repository.js'
import { createLogger } from './shared/logger/logger.js'

function closeHttpServer(server: Server): Promise<void> {
  return new Promise((resolveClose, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolveClose()
    })
  })
}

export async function startServer(): Promise<Server> {
  const env = loadEnv(process.env)
  const log = createLogger(env.LOG_LEVEL)
  const pool = createDatabase(env)

  await checkDatabaseConnection(pool)

  const repository = new MysqlUserRepository(pool)
  const app = createApp({
    corsOrigins: env.CORS_ORIGINS,
    readinessCheck: () => checkDatabaseConnection(pool),
    userRouter: createUserModule(repository)
  })
  const server = app.listen(env.PORT, () => {
    log.info({ port: env.PORT }, 'server started')
  })

  let shuttingDown = false
  const shutdown = async (signal: string) => {
    if (shuttingDown) return
    shuttingDown = true
    log.info({ signal }, 'graceful shutdown started')

    const deadline = setTimeout(() => {
      log.fatal('graceful shutdown timed out')
      process.exit(1)
    }, 10_000)
    deadline.unref()

    try {
      await closeHttpServer(server)
      await closeDatabase(pool)
      clearTimeout(deadline)
      log.info('graceful shutdown completed')
    } catch (error) {
      clearTimeout(deadline)
      log.error({ err: error }, 'graceful shutdown failed')
      process.exitCode = 1
    }
  }

  process.once('SIGINT', () => void shutdown('SIGINT'))
  process.once('SIGTERM', () => void shutdown('SIGTERM'))

  return server
}

const entryFile = process.argv[1]
if (entryFile && resolve(entryFile) === fileURLToPath(import.meta.url)) {
  startServer().catch((error: unknown) => {
    console.error('服务启动失败', error)
    process.exitCode = 1
  })
}
