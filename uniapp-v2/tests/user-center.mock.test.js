const test = require('node:test')
const assert = require('node:assert/strict')

const {
  currentUserStats,
  followingUsers,
  followerUsers,
  myArticles,
  favoriteArticles,
  getMockProfile,
  getMockMyArticles,
} = require('../mock/user-center')

test('user center mock counts stay aligned with their lists', () => {
  assert.equal(currentUserStats.followingCount, followingUsers.length)
  assert.equal(currentUserStats.followersCount, followerUsers.length)
  assert.equal(currentUserStats.articlesCount, myArticles.length)
  assert.equal(currentUserStats.favoritesCount, favoriteArticles.length)
})

test('mock profile lookup returns a requested author and a safe fallback', () => {
  assert.equal(getMockProfile('alice').username, 'alice')
  assert.equal(getMockProfile('unknown-author').username, 'unknown-author')
  assert.ok(getMockProfile('unknown-author').bio)
})

test('mock article lists expose normalized card fields', () => {
  for (const article of [...myArticles, ...favoriteArticles]) {
    assert.ok(article.id)
    assert.ok(article.slug)
    assert.ok(article.title)
    assert.ok(article.author.username)
    assert.ok(Array.isArray(article.tags))
  }
})

test('my article mock can use the current session user as its author', () => {
  const articles = getMockMyArticles({ id: 99, username: 'tester', bio: '当前用户' })

  assert.equal(articles[0].author.id, 99)
  assert.equal(articles[0].author.username, 'tester')
  assert.equal(articles[0].author.following, false)
  assert.notEqual(articles, myArticles)
})
