import { mkdirSync } from 'node:fs'
import {
  dirname,
  resolve
} from 'node:path'

import { SqliteSaver } from '@langchain/langgraph-checkpoint-sqlite'

/**
 * 创建 SQLite 持久化 Checkpointer。
 *
 * databasePath 相对于启动项目时的工作目录。
 * 例如：
 * ./data/agent-checkpoints.sqlite
 */
export function createSqliteCheckpointer(
  databasePath: string
): SqliteSaver {
  const absoluteDatabasePath =
    resolve(databasePath)

  /*
   * SQLite 可以创建数据库文件，
   * 但不会自动创建上级目录。
   */
  mkdirSync(
    dirname(absoluteDatabasePath),
    {
      recursive: true
    }
  )

  return SqliteSaver.fromConnString(
    absoluteDatabasePath
  )
}