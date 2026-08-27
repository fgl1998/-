const test = require('node:test')
const assert = require('node:assert/strict')

const { normalizeArticle, normalizeComment } = require('../common/article')

test('normalizeArticle returns stable fields for a list article with nested author and string tag', () => {
  const article = normalizeArticle({
    id: 11,
    slug: 'list-article',
    title: 'List article',
    description: 'A summary',
    body: 'Article body',
    author: { author_id: 7, username: 'alice', bio: 'Writer', image: 'https://example.test/alice.png' },
    tags: 'javascript',
    favorited: 1,
    favoritesCount: '12',
    createdAt: '2026-08-27T10:00:00.000Z',
    updatedAt: '2026-08-27T11:00:00.000Z',
  })

  assert.deepEqual(article, {
    id: 11,
    slug: 'list-article',
    title: 'List article',
    description: 'A summary',
    body: 'Article body',
    author: { id: 7, username: 'alice', bio: 'Writer', image: 'https://example.test/alice.png' },
    tags: ['javascript'],
    favorited: true,
    favoritesCount: 12,
    createdAt: '2026-08-27T10:00:00.000Z',
    updatedAt: '2026-08-27T11:00:00.000Z',
  })
  assert.equal(article.author.id, 7)
})

test('normalizeArticle converts detail author, snake case fields, and tag objects into the stable shape', () => {
  const article = normalizeArticle({
    article_id: 12,
    slug: 'detail-article',
    title: 'Detail article',
    description: 'Detail summary',
    body: 'Detail body',
    author_id: 8,
    author_username: 'bob',
    author_bio: 'Editor',
    author_image: 'https://example.test/bob.png',
    tags: [{ tag_name: 'node' }, { tag_name: 'testing' }],
    favorited: false,
    favorites_count: '3',
    created_at: '2026-08-26T10:00:00.000Z',
    updated_at: '2026-08-26T11:00:00.000Z',
  })

  assert.deepEqual(article, {
    id: 12,
    slug: 'detail-article',
    title: 'Detail article',
    description: 'Detail summary',
    body: 'Detail body',
    author: { id: 8, username: 'bob', bio: 'Editor', image: 'https://example.test/bob.png' },
    tags: ['node', 'testing'],
    favorited: false,
    favoritesCount: 3,
    createdAt: '2026-08-26T10:00:00.000Z',
    updatedAt: '2026-08-26T11:00:00.000Z',
  })
})

test('normalizeArticle keeps required field types stable when optional values are missing', () => {
  const article = normalizeArticle({ tags: ['vue', { tag_name: 'uni-app' }], favorited: 0, favorites_count: 'not-a-number' })

  assert.equal(typeof article.favorited, 'boolean')
  assert.equal(typeof article.favoritesCount, 'number')
  assert.deepEqual(article.tags, ['vue', 'uni-app'])
  assert.equal(article.favoritesCount, 0)
})

test('normalizeComment returns stable fields and constructs its author from snake case fields', () => {
  const comment = normalizeComment({
    comment_id: 31,
    article_id: 12,
    body: 'Useful post',
    author_id: 8,
    author_username: 'bob',
    author_bio: 'Editor',
    author_image: 'https://example.test/bob.png',
    created_at: '2026-08-27T12:00:00.000Z',
    updated_at: '2026-08-27T12:01:00.000Z',
  })

  assert.deepEqual(comment, {
    id: 31,
    articleId: 12,
    body: 'Useful post',
    author: { id: 8, username: 'bob', bio: 'Editor', image: 'https://example.test/bob.png' },
    createdAt: '2026-08-27T12:00:00.000Z',
    updatedAt: '2026-08-27T12:01:00.000Z',
  })
})
