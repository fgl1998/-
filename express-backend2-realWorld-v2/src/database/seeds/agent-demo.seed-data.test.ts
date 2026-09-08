import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEMO_ARTICLES,
  DEMO_READERS,
  DEMO_TAGS,
  assertSeedEnvironment,
  parseSeedAuthorId,
  validateDemoDataset,
} from './agent-demo.seed-data.js'

test('parseSeedAuthorId accepts an optional positive integer', () => {
  assert.equal(parseSeedAuthorId(undefined), undefined)
  assert.equal(parseSeedAuthorId('16'), 16)
})

test('parseSeedAuthorId rejects invalid identifiers', () => {
  for (const value of ['', '0', '-1', '1.5', 'abc']) {
    assert.throws(
      () => parseSeedAuthorId(value),
      /SEED_AUTHOR_ID must be a positive integer/,
    )
  }
})

test('assertSeedEnvironment blocks production unless explicitly allowed', () => {
  assert.doesNotThrow(() => assertSeedEnvironment('development', undefined))
  assert.doesNotThrow(() => assertSeedEnvironment(undefined, undefined))
  assert.doesNotThrow(() => assertSeedEnvironment('production', 'true'))
  assert.throws(
    () => assertSeedEnvironment('production', undefined),
    /Refusing to seed production/,
  )
})

test('demo dataset contains five unique Vue articles and eight readers', () => {
  assert.equal(DEMO_ARTICLES.length, 5)
  assert.equal(DEMO_READERS.length, 8)
  assert.equal(new Set(DEMO_ARTICLES.map(article => article.slug)).size, 5)
  assert.ok(DEMO_ARTICLES.every(article => article.slug.startsWith('agent-demo-')))
  assert.ok(DEMO_ARTICLES.every(article => article.title.includes('Vue')))
})

test('demo article interactions provide the expected analysis distribution', () => {
  assert.deepEqual(
    DEMO_ARTICLES.map(article => article.favoriteReaderIndexes.length),
    [8, 5, 3, 1, 0],
  )
  assert.deepEqual(
    DEMO_ARTICLES.map(article => article.comments.length),
    [4, 3, 2, 3, 1],
  )

  assert.doesNotThrow(() => validateDemoDataset())

  const availableTags = new Set(DEMO_TAGS)
  for (const article of DEMO_ARTICLES) {
    assert.ok(article.tags.every(tag => availableTags.has(tag)))
    assert.ok(
      article.favoriteReaderIndexes.every(
        readerIndex => readerIndex >= 0 && readerIndex < DEMO_READERS.length,
      ),
    )
    assert.ok(
      article.comments.every(
        comment =>
          comment.readerIndex >= 0 &&
          comment.readerIndex < DEMO_READERS.length,
      ),
    )
  }
})
