const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')

function deferred() {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

function loadPage(relativePath, injectedModules, uni = {}) {
  const absolutePath = path.join(root, relativePath)
  const source = fs.readFileSync(absolutePath, 'utf8')
  const match = source.match(/<script>([\s\S]*?)<\/script>/)
  assert.ok(match, `${relativePath} should contain a script block`)

  const localRequire = (request) => {
    if (Object.prototype.hasOwnProperty.call(injectedModules, request)) {
      return injectedModules[request]
    }
    return require(path.resolve(path.dirname(absolutePath), request))
  }
  const component = new Function('require', 'uni', match[1].replace(/export\s+default/, 'return'))(localRequire, uni)
  const instance = { ...component.data() }
  for (const [name, method] of Object.entries(component.methods || {})) {
    instance[name] = method.bind(instance)
  }
  return { component, instance }
}

function createSessionState(token, user) {
  const state = { token, user }
  const writes = []
  return {
    state,
    writes,
    module: {
      get() {
        return { token: state.token, user: state.user }
      },
      getToken() {
        return state.token
      },
      getUser() {
        return state.user
      },
      setUser(nextUser) {
        writes.push(nextUser)
        state.user = nextUser
      },
      clear() {
        state.token = ''
        state.user = null
      },
    },
  }
}

function rawArticle(id, title) {
  return {
    id,
    slug: `article-${id}`,
    title,
    description: `${title} summary`,
    body: `${title} body`,
    author: { author_id: id, username: `user-${id}` },
    tags: [],
    favorited: 0,
    favoritesCount: 0,
    createdAt: '2026-08-27T00:00:00.000Z',
  }
}

function rawComment(id, body) {
  return {
    id,
    article_id: 7,
    author_id: 1,
    author_username: 'alice',
    body,
    createdAt: '2026-08-27T00:00:00.000Z',
  }
}

test('my page ignores a getUser response that resolves after logout', async () => {
  const request = deferred()
  const session = createSessionState('token-a', { id: 1, username: 'alice' })
  const { instance } = loadPage('pages/my/my.vue', {
    '../../api/user': { getUser: () => request.promise },
    '../../common/session': session.module,
  }, { reLaunch() {}, showToast() {} })

  const refresh = instance.restoreAndRefresh()
  instance.handleLogout()
  request.resolve({ id: 1, username: 'alice-new' })
  await refresh

  assert.deepEqual(session.state, { token: '', user: null })
  assert.deepEqual(session.writes, [])
  assert.deepEqual(instance.userInfo, {})
})

test('my page starts a new generation for a changed token and ignores the old account response', async () => {
  const requestA = deferred()
  const requestB = deferred()
  let requestCount = 0
  const session = createSessionState('token-a', { id: 1, username: 'alice' })
  const { instance } = loadPage('pages/my/my.vue', {
    '../../api/user': {
      getUser() {
        requestCount += 1
        return requestCount === 1 ? requestA.promise : requestB.promise
      },
    },
    '../../common/session': session.module,
  }, { reLaunch() {}, showToast() {} })

  const refreshA = instance.restoreAndRefresh()
  session.state.token = 'token-b'
  session.state.user = { id: 2, username: 'bob-cached' }
  const refreshB = instance.restoreAndRefresh()
  requestA.resolve({ id: 1, username: 'alice-new' })
  requestB.resolve({ id: 2, username: 'bob-new' })
  await Promise.all([refreshA, refreshB])

  assert.equal(requestCount, 2)
  assert.deepEqual(session.writes, [{ id: 2, username: 'bob-new' }])
  assert.deepEqual(instance.userInfo, { id: 2, username: 'bob-new' })
})

test('my page refreshes following and follower counts from profile APIs', async () => {
  const session = createSessionState('token-a', { id: 7, username: 'alice' })
  const { instance } = loadPage('pages/my/my.vue', {
    '../../api/user': { getUser: async () => ({ id: 7, username: 'alice' }) },
    '../../api/profile': {
      followingList: async (userId) => userId === 7 ? [{ id: 2 }, { id: 3 }] : [],
      followedList: async (userId) => userId === 7 ? [{ id: 4 }] : [],
    },
    '../../common/session': session.module,
  }, { reLaunch() {}, showToast() {} })

  await instance.restoreAndRefresh()

  assert.equal(instance.stats.followingCount, 2)
  assert.equal(instance.stats.followersCount, 1)
  assert.equal(instance.relationStatsLoading, false)
  assert.equal(instance.relationStatsError, '')
})

test('my page clears old relation counts when a new account profile refresh fails', async () => {
  const session = createSessionState('token-b', { id: 8, username: 'bob' })
  const { instance } = loadPage('pages/my/my.vue', {
    '../../api/user': { getUser: async () => { throw new Error('资料加载失败') } },
    '../../api/profile': { followingList: async () => [], followedList: async () => [] },
    '../../common/session': session.module,
  }, { reLaunch() {}, showToast() {} })
  instance.activeSessionToken = 'token-a'
  instance.stats.followingCount = 9
  instance.stats.followersCount = 6

  await instance.restoreAndRefresh()

  assert.equal(instance.stats.followingCount, '--')
  assert.equal(instance.stats.followersCount, '--')
  assert.equal(instance.relationStatsLoading, false)
  assert.ok(instance.relationStatsError)
})

test('comment creation queues a fresh list request behind an in-flight list request', async () => {
  const firstList = deferred()
  const secondList = deferred()
  let listCalls = 0
  const { instance } = loadPage('pages/article/detail.vue', {
    '../../api/article': {
      listComments() {
        listCalls += 1
        return listCalls === 1 ? firstList.promise : secondList.promise
      },
      createComment: async () => rawComment(2, 'new comment'),
    },
    '../../common/session': {},
  }, { showToast() {} })
  instance.article = rawArticle(7, 'Article')
  instance.commentBody = 'new comment'

  const initialLoad = instance.loadComments()
  const creation = instance.submitComment()
  await flushPromises()
  assert.equal(listCalls, 1)

  firstList.resolve([rawComment(1, 'stale')])
  await flushPromises()
  assert.equal(listCalls, 2)

  secondList.resolve([rawComment(1, 'stale'), rawComment(2, 'new comment')])
  await Promise.all([initialLoad, creation])
  assert.equal(instance.commentBody, '')
  assert.deepEqual(instance.comments.map((comment) => comment.id), [1, 2])
})

test('comment deletion queues a fresh list request and blocks concurrent creation', async () => {
  const firstList = deferred()
  const secondList = deferred()
  const deletion = deferred()
  let listCalls = 0
  let createCalls = 0
  const { instance } = loadPage('pages/article/detail.vue', {
    '../../api/article': {
      listComments() {
        listCalls += 1
        return listCalls === 1 ? firstList.promise : secondList.promise
      },
      deleteComment: () => deletion.promise,
      createComment: async () => {
        createCalls += 1
      },
    },
    '../../common/session': {},
  }, { showToast() {} })
  instance.article = rawArticle(7, 'Article')
  instance.currentUser = { id: 1 }
  instance.commentBody = 'must wait'
  const ownComment = { ...rawComment(1, 'delete me'), author: { id: 1, username: 'alice' } }

  const initialLoad = instance.loadComments()
  const remove = instance.deleteComment(ownComment)
  const create = instance.submitComment()
  await flushPromises()
  assert.equal(createCalls, 0)

  deletion.resolve(true)
  await flushPromises()
  firstList.resolve([rawComment(1, 'stale')])
  await flushPromises()
  assert.equal(listCalls, 2)

  secondList.resolve([])
  await Promise.all([initialLoad, remove, create])
  assert.deepEqual(instance.comments, [])
})

test('home page queues reset during append and discards the invalidated append response', async () => {
  const appendRequest = deferred()
  const resetRequest = deferred()
  const calls = []
  const session = createSessionState('token-a', { id: 1 })
  const { instance } = loadPage('pages/index/index.vue', {
    '../../api/article': {
      list(input) {
        calls.push(input)
        return calls.length === 1 ? appendRequest.promise : resetRequest.promise
      },
    },
    '../../common/session': session.module,
  })
  instance.isLoggedIn = true
  instance.activeToken = 'token-a'
  instance.articles = [rawArticle(1, 'existing')]
  instance.page = 2

  const append = instance.loadArticles(false)
  const reset = instance.loadArticles(true)
  appendRequest.resolve({ items: [rawArticle(2, 'stale append')], totalPages: 2 })
  await flushPromises()
  assert.equal(calls.length, 2)
  assert.deepEqual(calls.map((call) => call.page), [2, 1])
  assert.deepEqual(instance.articles.map((article) => article.id), [1])

  resetRequest.resolve({ items: [rawArticle(3, 'fresh reset')], totalPages: 1 })
  await Promise.all([append, reset])
  assert.deepEqual(instance.articles.map((article) => article.id), [3])
})

test('home page retries the failed request mode instead of always resetting', async () => {
  const calls = []
  const session = createSessionState('token-a', { id: 1 })
  const { instance } = loadPage('pages/index/index.vue', {
    '../../api/article': {
      list(input) {
        calls.push(input)
        return calls.length === 1
          ? Promise.reject(new Error('append failed'))
          : Promise.resolve({ items: [rawArticle(3, 'page three')], totalPages: 3 })
      },
    },
    '../../common/session': session.module,
  })
  instance.isLoggedIn = true
  instance.activeToken = 'token-a'
  instance.articles = [rawArticle(1, 'existing')]
  instance.page = 3

  await instance.loadArticles(false)
  await instance.retryLoad()

  assert.deepEqual(calls.map((call) => call.page), [3, 3])
})

test('home page ignores an old-token response and then installs the queued new-token reset', async () => {
  const requestA = deferred()
  const requestB = deferred()
  const calls = []
  const session = createSessionState('token-a', { id: 1 })
  const { instance } = loadPage('pages/index/index.vue', {
    '../../api/article': {
      list(input) {
        calls.push({ ...input, token: session.state.token })
        return calls.length === 1 ? requestA.promise : requestB.promise
      },
    },
    '../../common/session': session.module,
  })
  instance.isLoggedIn = true
  instance.activeToken = 'token-a'

  const refreshA = instance.loadArticles(true)
  session.state.token = 'token-b'
  session.state.user = { id: 2 }
  const refreshB = instance.loadArticles(true)
  requestA.resolve({ items: [rawArticle(1, 'account A')], totalPages: 1 })
  await flushPromises()
  assert.equal(calls.length, 2)
  assert.deepEqual(instance.articles, [])

  requestB.resolve({ items: [rawArticle(2, 'account B')], totalPages: 1 })
  await Promise.all([refreshA, refreshB])
  assert.deepEqual(calls.map((call) => call.token), ['token-a', 'token-b'])
  assert.deepEqual(instance.articles.map((article) => article.id), [2])
})

test('relation page loads the current user following list from the profile API', async () => {
  const calls = []
  const session = createSessionState('token-a', { id: 7, username: 'alice' })
  const { component, instance } = loadPage('pages/profile/relation.vue', {
    '../../api/profile': {
      followingList(userId) {
        calls.push({ method: 'followingList', userId })
        return Promise.resolve([{ id: 2, username: 'bob', bio: null }])
      },
      followedList() {
        throw new Error('wrong endpoint')
      },
    },
    '../../common/session': session.module,
  }, { setNavigationBarTitle() {}, reLaunch() {}, showToast() {} })

  await component.onLoad.call(instance, { type: 'following' })

  assert.deepEqual(calls, [{ method: 'followingList', userId: 7 }])
  assert.deepEqual(instance.users.map((user) => user.username), ['bob'])
  assert.equal(instance.loading, false)
  assert.equal(instance.errorMessage, '')
})

test('relation page loads followers and exposes a retryable error state', async () => {
  let attempts = 0
  const session = createSessionState('token-a', { id: 7, username: 'alice' })
  const { component, instance } = loadPage('pages/profile/relation.vue', {
    '../../api/profile': {
      followingList() {
        throw new Error('wrong endpoint')
      },
      followedList() {
        attempts += 1
        return attempts === 1
          ? Promise.reject(new Error('粉丝加载失败'))
          : Promise.resolve([{ id: 3, username: 'carol', bio: 'hello' }])
      },
    },
    '../../common/session': session.module,
  }, { setNavigationBarTitle() {}, reLaunch() {}, showToast() {} })

  await component.onLoad.call(instance, { type: 'followers' })
  assert.equal(instance.errorMessage, '粉丝加载失败')
  assert.deepEqual(instance.users, [])

  await instance.loadUsers()
  assert.equal(attempts, 2)
  assert.equal(instance.errorMessage, '')
  assert.deepEqual(instance.users.map((user) => user.username), ['carol'])
})

test('relation page discards an old-account response and reloads with the new session user', async () => {
  const requestA = deferred()
  const requestB = deferred()
  const calls = []
  const session = createSessionState('token-a', { id: 7, username: 'alice' })
  const { component, instance } = loadPage('pages/profile/relation.vue', {
    '../../api/profile': {
      followingList(userId) {
        calls.push(userId)
        return userId === 7 ? requestA.promise : requestB.promise
      },
      followedList() {
        throw new Error('wrong endpoint')
      },
    },
    '../../common/session': session.module,
  }, { setNavigationBarTitle() {}, reLaunch() {}, showToast() {} })

  const loadA = component.onLoad.call(instance, { type: 'following' })
  session.state.token = 'token-b'
  session.state.user = { id: 8, username: 'bob' }
  const loadB = instance.loadUsers()
  assert.deepEqual(calls, [7, 8])

  requestA.resolve([{ id: 2, username: 'old-user' }])
  await flushPromises()
  assert.deepEqual(instance.users, [])

  requestB.resolve([{ id: 3, username: 'new-user' }])
  await Promise.all([loadA, loadB])
  assert.deepEqual(instance.users.map((user) => user.username), ['new-user'])
  assert.equal(instance.userId, 8)
})
