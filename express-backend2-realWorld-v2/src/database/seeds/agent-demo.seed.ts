import bcrypt from 'bcrypt'
import type {
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise.js'

import { pool } from '../pool.js'
import {
  DEMO_ARTICLES,
  DEMO_AUTHOR,
  DEMO_READERS,
  DEMO_TAGS,
  assertSeedEnvironment,
  parseSeedAuthorId,
  validateDemoDataset,
} from './agent-demo.seed-data.js'

interface UserIdentityRow extends RowDataPacket {
  id: number
  username: string
  email: string
}

interface IdRow extends RowDataPacket {
  id: number
}

interface SeedUser {
  username: string
  email: string
  password: string
  bio: string
}

interface SeedSummary {
  authorId: number
  authorUsername: string
  usesExistingAuthor: boolean
  articleCount: number
  favoriteCount: number
  commentCount: number
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

async function upsertSeedUser(
  connection: PoolConnection,
  user: SeedUser,
): Promise<number> {
  const [rows] = await connection.execute<UserIdentityRow[]>(
    `
      SELECT id, username, email
      FROM users
      WHERE username = ? OR email = ?
    `,
    [user.username, user.email],
  )

  const exactMatch = rows.find(
    row => row.username === user.username && row.email === user.email,
  )

  if (rows.length > 0 && (rows.length !== 1 || !exactMatch)) {
    throw new Error(
      `Seed user identity conflicts with an existing account: ${user.username}`,
    )
  }

  const passwordHash = await bcrypt.hash(user.password, 12)

  if (exactMatch) {
    await connection.execute(
      `
        UPDATE users
        SET password_hash = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [passwordHash, user.bio, exactMatch.id],
    )
    return exactMatch.id
  }

  const [result] = await connection.execute<ResultSetHeader>(
    `
      INSERT INTO users (username, email, password_hash, bio)
      VALUES (?, ?, ?, ?)
    `,
    [user.username, user.email, passwordHash, user.bio],
  )

  return result.insertId
}

async function resolveAuthor(
  connection: PoolConnection,
  configuredAuthorId: number | undefined,
): Promise<{ id: number; username: string; usesExistingAuthor: boolean }> {
  if (configuredAuthorId === undefined) {
    const id = await upsertSeedUser(connection, DEMO_AUTHOR)
    return {
      id,
      username: DEMO_AUTHOR.username,
      usesExistingAuthor: false,
    }
  }

  const [rows] = await connection.execute<UserIdentityRow[]>(
    `
      SELECT id, username, email
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [configuredAuthorId],
  )

  const author = rows[0]
  if (!author) {
    throw new Error(`SEED_AUTHOR_ID user does not exist: ${configuredAuthorId}`)
  }

  return {
    id: author.id,
    username: author.username,
    usesExistingAuthor: true,
  }
}

async function upsertTags(
  connection: PoolConnection,
): Promise<Map<string, number>> {
  const tagIds = new Map<string, number>()

  for (const tagName of DEMO_TAGS) {
    await connection.execute(
      `
        INSERT INTO tags (name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE name = VALUES(name)
      `,
      [tagName],
    )

    const [rows] = await connection.execute<IdRow[]>(
      `
        SELECT id
        FROM tags
        WHERE name = ?
        LIMIT 1
      `,
      [tagName],
    )

    const tag = rows[0]
    if (!tag) {
      throw new Error(`Failed to resolve demo tag: ${tagName}`)
    }
    tagIds.set(tagName, tag.id)
  }

  return tagIds
}

async function upsertArticle(
  connection: PoolConnection,
  authorId: number,
  article: (typeof DEMO_ARTICLES)[number],
): Promise<number> {
  const createdAt = daysAgo(article.createdDaysAgo)
  const [result] = await connection.execute<ResultSetHeader>(
    `
      INSERT INTO articles (
        author_id,
        title,
        description,
        body,
        slug,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        id = LAST_INSERT_ID(id),
        author_id = VALUES(author_id),
        title = VALUES(title),
        description = VALUES(description),
        body = VALUES(body),
        created_at = VALUES(created_at),
        updated_at = VALUES(updated_at)
    `,
    [
      authorId,
      article.title,
      article.description,
      article.body,
      article.slug,
      createdAt,
      createdAt,
    ],
  )

  return result.insertId
}

async function replaceArticleInteractions(
  connection: PoolConnection,
  articleId: number,
  article: (typeof DEMO_ARTICLES)[number],
  readerIds: readonly number[],
  tagIds: ReadonlyMap<string, number>,
): Promise<void> {
  await connection.execute('DELETE FROM comments WHERE article_id = ?', [articleId])
  await connection.execute('DELETE FROM favorites WHERE article_id = ?', [articleId])
  await connection.execute('DELETE FROM article_tags WHERE article_id = ?', [articleId])

  for (const tagName of article.tags) {
    const tagId = tagIds.get(tagName)
    if (tagId === undefined) {
      throw new Error(`Missing tag ID for demo tag: ${tagName}`)
    }
    await connection.execute(
      'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
      [articleId, tagId],
    )
  }

  for (const readerIndex of article.favoriteReaderIndexes) {
    const readerId = readerIds[readerIndex]
    if (readerId === undefined) {
      throw new Error(`Missing demo reader at index: ${readerIndex}`)
    }
    await connection.execute(
      'INSERT INTO favorites (user_id, article_id, created_at) VALUES (?, ?, ?)',
      [readerId, articleId, daysAgo(Math.max(article.createdDaysAgo - 1, 0))],
    )
  }

  for (const comment of article.comments) {
    const readerId = readerIds[comment.readerIndex]
    if (readerId === undefined) {
      throw new Error(`Missing demo reader at index: ${comment.readerIndex}`)
    }
    const createdAt = daysAgo(comment.createdDaysAgo)
    await connection.execute(
      `
        INSERT INTO comments (
          article_id,
          author_id,
          body,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [articleId, readerId, comment.body, createdAt, createdAt],
    )
  }
}

async function seedAgentDemo(): Promise<SeedSummary> {
  assertSeedEnvironment(process.env.NODE_ENV, process.env.ALLOW_DEMO_SEED)
  validateDemoDataset()

  const configuredAuthorId = parseSeedAuthorId(process.env.SEED_AUTHOR_ID)
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const author = await resolveAuthor(connection, configuredAuthorId)
    const readerIds: number[] = []
    for (const reader of DEMO_READERS) {
      readerIds.push(await upsertSeedUser(connection, reader))
    }

    const tagIds = await upsertTags(connection)
    for (const article of DEMO_ARTICLES) {
      const articleId = await upsertArticle(connection, author.id, article)
      await replaceArticleInteractions(
        connection,
        articleId,
        article,
        readerIds,
        tagIds,
      )
    }

    await connection.commit()

    return {
      authorId: author.id,
      authorUsername: author.username,
      usesExistingAuthor: author.usesExistingAuthor,
      articleCount: DEMO_ARTICLES.length,
      favoriteCount: DEMO_ARTICLES.reduce(
        (total, article) => total + article.favoriteReaderIndexes.length,
        0,
      ),
      commentCount: DEMO_ARTICLES.reduce(
        (total, article) => total + article.comments.length,
        0,
      ),
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

try {
  const summary = await seedAgentDemo()
  console.log('Agent demo seed completed.')
  console.log(`Author: ${summary.authorUsername} (id=${summary.authorId})`)
  if (!summary.usesExistingAuthor) {
    console.log(`Password: ${DEMO_AUTHOR.password}`)
  }
  console.log(`Articles: ${summary.articleCount}`)
  console.log(`Favorites: ${summary.favoriteCount}`)
  console.log(`Comments: ${summary.commentCount}`)
} catch (error) {
  console.error('Agent demo seed failed:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
