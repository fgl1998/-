import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { readMigrations } from '../../src/database/migrate.js'

const tempDirectories: string[] = []

async function createMigrationDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'express-migrations-'))
  tempDirectories.push(directory)
  return directory
}

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true })
    )
  )
})

describe('readMigrations', () => {
  it('returns versioned SQL files in numeric order with checksums', async () => {
    const directory = await createMigrationDirectory()
    await writeFile(join(directory, '002_add_email.sql'), 'ALTER TABLE users')
    await writeFile(join(directory, '001_create_users.sql'), 'CREATE TABLE users')
    await writeFile(join(directory, 'notes.md'), 'ignored')

    const migrations = await readMigrations(directory)

    expect(migrations.map((migration) => migration.version)).toEqual([1, 2])
    expect(migrations.map((migration) => migration.filename)).toEqual([
      '001_create_users.sql',
      '002_add_email.sql'
    ])
    expect(migrations[0]?.checksum).toMatch(/^[a-f0-9]{64}$/)
  })

  it('rejects duplicate numeric versions', async () => {
    const directory = await createMigrationDirectory()
    await writeFile(join(directory, '001_create_users.sql'), 'first')
    await writeFile(join(directory, '001_other_change.sql'), 'second')

    await expect(readMigrations(directory)).rejects.toThrow(
      '重复的 Migration 版本：1'
    )
  })
})
