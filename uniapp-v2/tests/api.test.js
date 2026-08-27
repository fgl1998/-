const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { createUserApi } = require('../api/user')
const { createArticleApi } = require('../api/article')
const { createTagApi } = require('../api/tag')

function createClient() {
  const calls = []
  return {
    calls,
    request(path, data) {
      calls.push({ path, data })
      return Promise.resolve({ path, data })
    },
  }
}

test('user API describes login and current-user request bodies through the shared client', async () => {
  const client = createClient()
  const userApi = createUserApi(client)

  await userApi.login('alice', 'secret')
  await userApi.getUser()

  assert.deepEqual(client.calls, [
    { path: '/api/users/login', data: { username: 'alice', password: 'secret' } },
    { path: '/api/users/getUser', data: {} },
  ])
})

test('article API describes every article and comment request through the shared client', async () => {
  const client = createClient()
  const articleApi = createArticleApi(client)

  await articleApi.create({
    title: 'Hello',
    description: 'Summary',
    body: 'Body',
    tags: '[1,2]',
  })
  await articleApi.list({ page: 2, pageSize: 20 })
  await articleApi.detail('hello-world')
  await articleApi.favorite(12)
  await articleApi.unfavorite(12)
  await articleApi.listComments(12)
  await articleApi.createComment(12, 'Useful post')
  await articleApi.deleteComment(31)

  assert.deepEqual(client.calls, [
    {
      path: '/api/articles/create',
      data: { title: 'Hello', description: 'Summary', body: 'Body', tags: '[1,2]' },
    },
    { path: '/api/articles/list', data: { page: 2, pageSize: 20 } },
    { path: '/api/articles/detail', data: { slug: 'hello-world' } },
    { path: '/api/articles/favorite', data: { articleId: 12 } },
    { path: '/api/articles/unfavorite', data: { articleId: 12 } },
    { path: '/api/articles/comment/list', data: { articleId: 12 } },
    { path: '/api/articles/comment/create', data: { articleId: 12, body: 'Useful post' } },
    { path: '/api/articles/comment/delete', data: { commentId: 31 } },
  ])
})

test('tag API loads the selectable tag list through the shared client', async () => {
  const client = createClient()
  const tagApi = createTagApi(client)

  await tagApi.list()

  assert.deepEqual(client.calls, [
    { path: '/api/tags/list', data: {} },
  ])
})

test('profile API loads following and follower lists with the current user id', async () => {
  const profileApiPath = path.resolve(__dirname, '../api/profile.js')
  assert.ok(fs.existsSync(profileApiPath), 'api/profile.js should exist')
  const { createProfileApi } = require(profileApiPath)
  const client = createClient()
  const profileApi = createProfileApi(client)

  await profileApi.followingList(7)
  await profileApi.followedList(7)

  assert.deepEqual(client.calls, [
    { path: '/api/profiles/followingList', data: { userId: 7 } },
    { path: '/api/profiles/followedList', data: { userId: 7 } },
  ])
})
