import 'dotenv/config'
import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { loadEnv } from '../config/env.js'
import {
  checkDatabaseConnection,
  closeDatabase,
  createDatabase
} from './mysql.js'

export interface Migration {
  version: number
  filename: string
  sql: string
  checksum: string
}

interface AppliedMigrationRow extends RowDataPacket {
  version: number
  filename: string
  checksum: string
}

const migrationFilenamePattern = /^(\d+)_([a-z0-9_]+)\.sql$/i

export async function readMigrations(
  directory: string
): Promise<Migration[]> {
  const filenames = (await readdir(directory)).filter((filename) =>
    migrationFilenamePattern.test(filename)
  )
  const migrations = await Promise.all(
    filenames.map(async (filename) => {
      const match = migrationFilenamePattern.exec(filename)
      if (!match?.[1]) {
        throw new Error(`非法的 Migration 文件名：${filename}`)
      }

      const sql = await readFile(resolve(directory, filename), 'utf8')
      return {
        version: Number(match[1]),
        filename,
        sql,
        checksum: createHash('sha256').update(sql).digest('hex')
      }
    })
  )

  migrations.sort((a, b) => a.version - b.version)

  for (let index = 1; index < migrations.length; index += 1) {
    if (migrations[index - 1]?.version === migrations[index]?.version) {
      throw new Error(`重复的 Migration 版本：${migrations[index]?.version}`)
    }
  }

  return migrations
}

export async function runMigrations(
  pool: Pool,
  directory = resolve(dirname(fileURLToPath(import.meta.url)), 'migrations')
): Promise<number> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT UNSIGNED NOT NULL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      checksum CHAR(64) NOT NULL,
      executed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `)

  const [rows] = await pool.query<AppliedMigrationRow[]>(
    'SELECT version, filename, checksum FROM schema_migrations'
  )
  const appliedByVersion = new Map(rows.map((row) => [row.version, row]))
  const migrations = await readMigrations(directory)
  let appliedCount = 0

  for (const migration of migrations) {
    const applied = appliedByVersion.get(migration.version)
    if (applied) {
      if (
        applied.filename !== migration.filename ||
        applied.checksum !== migration.checksum
      ) {
        throw new Error(
          `Migration ${migration.version} 已执行，但文件名或校验和发生变化`
        )
      }
      continue
    }

    await pool.query(migration.sql)
    await pool.execute(
      `
        INSERT INTO schema_migrations(version, filename, checksum)
        VALUES (?, ?, ?)
      `,
      [migration.version, migration.filename, migration.checksum]
    )
    appliedCount += 1
  }

  return appliedCount
}

async function main(): Promise<void> {
  const env = loadEnv(process.env)
  const pool = createDatabase(env)

  try {
    await checkDatabaseConnection(pool)
    const appliedCount = await runMigrations(pool)
    console.log(`Migration 执行完成，本次新增 ${appliedCount} 个版本`)
  } finally {
    await closeDatabase(pool)
  }
}

const entryFile = process.argv[1]
if (entryFile && resolve(entryFile) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error('Migration 执行失败', error)
    process.exitCode = 1
  })
}
