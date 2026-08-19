// article.util.ts
import { randomUUID } from 'node:crypto'

export function generateSlug(title: string): string {
  const normalizedTitle = title
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const suffix = randomUUID().slice(0, 8)

  return normalizedTitle
    ? `${normalizedTitle}-${suffix}`
    : `article-${suffix}`
}