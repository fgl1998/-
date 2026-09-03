const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createHttpClient } = require('../common/http')

const root = path.resolve(__dirname, '..')

function deferred() {
  let resolve
  let reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

function loadChat(chat = async () => ({ answer: '找到文章了' }), initialToken = 'user-token') {
  const file = path.join(root, 'pages/agent/chat.vue')
  assert.ok(fs.existsSync(file), 'Agent chat page should exist')
  const script = fs.readFileSync(file, 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]
  const state = { token: initialToken }
  const calls = []
  const toasts = []
  const routes = []
  const modules = {
    '../../api/agent': { chat: (message) => { calls.push(message); return chat(message) } },
    '../../common/session': { getToken: () => state.token },
  }
  const uni = {
    showToast: (options) => toasts.push(options.title),
    navigateTo: (options) => routes.push(options.url),
  }
  const component = new Function('require', 'uni', script.replace(/export\s+default/, 'return'))(
    (name) => { assert.ok(modules[name], `Unexpected dependency: ${name}`); return modules[name] }, uni,
  )
  const vm = { ...component.data(), $nextTick: (fn) => Promise.resolve().then(fn) }
  for (const [key, method] of Object.entries(component.methods)) vm[key] = method.bind(vm)
  for (const [key, getter] of Object.entries(component.computed || {})) {
    Object.defineProperty(vm, key, { get: () => getter.call(vm) })
  }
  component.onShow.call(vm)
  return { vm, component, state, calls, toasts, routes }
}

test('Agent API posts only the current message to its own server with current JWT and timeout', async () => {
  const file = path.join(root, 'api/agent.js')
  assert.ok(fs.existsSync(file), 'Agent API module should exist')
  const { createAgentApi } = require(file)
  const { AGENT_BASE_URL, BASE_URL } = require('../config/env')
  assert.match(AGENT_BASE_URL, /^https?:\/\//)
  assert.notEqual(AGENT_BASE_URL, BASE_URL)
  let token = 'first-token'
  const calls = []
  const api = createAgentApi(createHttpClient({
    baseUrl: AGENT_BASE_URL,
    getToken: () => token,
    requestAdapter: async (options) => {
      calls.push(options)
      return { statusCode: 200, data: { success: true, data: { answer: '文章结果' } } }
    },
  }))
  assert.deepEqual(await api.chat('第一问'), { answer: '文章结果' })
  token = 'second-token'
  await api.chat('第二问')
  assert.equal(calls[0].url, `${AGENT_BASE_URL}/api/agent/chat`)
  assert.equal(calls[0].timeout, 120000)
  assert.equal(calls[0].method, 'POST')
  assert.deepEqual(calls.map((call) => call.data), [{ message: '第一问' }, { message: '第二问' }])
  assert.deepEqual(calls.map((call) => call.header.Authorization), ['Bearer first-token', 'Bearer second-token'])
})

test('chat sends trimmed questions, displays answers, and never sends earlier messages', async () => {
  const { vm, calls } = loadChat()
  vm.draft = '  找 Node.js 文章  '
  await vm.sendMessage()
  assert.deepEqual(calls, ['找 Node.js 文章'])
  assert.equal(vm.draft, '')
  assert.deepEqual(vm.messages.map((item) => [item.role, item.content]), [
    ['user', '找 Node.js 文章'], ['assistant', '找到文章了'],
  ])
  vm.draft = '另一道独立问题'
  await vm.sendMessage()
  assert.deepEqual(calls, ['找 Node.js 文章', '另一道独立问题'])
  assert.equal(vm.messages.length, 4)
  assert.equal(vm.sending, false)
})

test('chat refuses empty, overlong and unauthenticated submissions', async () => {
  const { vm, calls, toasts } = loadChat()
  vm.draft = '   '
  await vm.sendMessage()
  vm.draft = '问'.repeat(2001)
  await vm.sendMessage()
  assert.equal(calls.length, 0)
  assert.ok(toasts.some((text) => /2000/.test(text)))
  const guest = loadChat(undefined, '')
  guest.vm.draft = '查文章'
  await guest.vm.sendMessage()
  assert.equal(guest.calls.length, 0)
  assert.equal(guest.vm.isLoggedIn, false)
  assert.deepEqual(guest.routes, ['/pages/login/login'])
})

test('waiting for an answer blocks repeated sends and keeps a visible pending question', async () => {
  const pending = deferred()
  const { vm, calls } = loadChat(() => pending.promise)
  vm.draft = '查文章'
  const sending = vm.sendMessage()
  assert.equal(vm.sending, true)
  assert.equal(vm.messages[0].status, 'pending')
  vm.draft = '不应重复提交'
  await vm.sendMessage()
  assert.deepEqual(calls, ['查文章'])
  pending.resolve({ answer: '查询完成' })
  await sending
  assert.equal(vm.sending, false)
})

test('failed questions remain retryable and retry does not duplicate the user bubble', async () => {
  let attempt = 0
  const { vm, calls } = loadChat(async () => {
    if (++attempt === 1) throw new Error('服务暂不可用')
    return { answer: '恢复了' }
  })
  vm.draft = '查询文章'
  await vm.sendMessage()
  const question = vm.messages[0]
  assert.equal(question.status, 'failed')
  assert.equal(question.error, '服务暂不可用')
  assert.equal(vm.sending, false)
  await vm.retryMessage(question)
  assert.deepEqual(calls, ['查询文章', '查询文章'])
  assert.equal(vm.messages.filter((item) => item.role === 'user').length, 1)
  assert.equal(question.status, 'sent')
  assert.equal(vm.messages[1].content, '恢复了')
})

test('missing or empty answers are shown as retryable errors', async () => {
  for (const result of [null, {}, { answer: '' }, { answer: '   ' }]) {
    const { vm } = loadChat(async () => result)
    vm.draft = '查询文章'
    await vm.sendMessage()
    assert.equal(vm.messages[0].status, 'failed')
    assert.equal(vm.messages.length, 1)
    assert.equal(vm.sending, false)
  }
})

test('retrying an earlier failed question inserts its answer beside that question', async () => {
  let attempt = 0
  const { vm } = loadChat(async (message) => {
    if (++attempt === 1) throw new Error('暂时失败')
    return { answer: `${message}的回答` }
  })
  vm.draft = '第一问'
  await vm.sendMessage()
  const firstQuestion = vm.messages[0]
  vm.draft = '第二问'
  await vm.sendMessage()
  await vm.retryMessage(firstQuestion)
  assert.deepEqual(vm.messages.map((item) => item.content), ['第一问', '第一问的回答', '第二问', '第二问的回答'])
})

test('unloading clears temporary messages and discards a late answer', async () => {
  const pending = deferred()
  const { vm, component } = loadChat(() => pending.promise)
  vm.draft = '查询文章'
  const sending = vm.sendMessage()
  component.onUnload.call(vm)
  pending.resolve({ answer: '迟到的结果' })
  await sending
  assert.deepEqual(vm.messages, [])
  assert.equal(vm.sending, false)
  const reopened = loadChat()
  assert.deepEqual(reopened.vm.messages, [])
})

test('account changes clear messages and old responses cannot enter the new conversation', async () => {
  const pending = deferred()
  const { vm, component, state } = loadChat(() => pending.promise)
  vm.draft = '旧账号问题'
  const sending = vm.sendMessage()
  state.token = 'new-user-token'
  component.onShow.call(vm)
  pending.resolve({ answer: '旧账号结果' })
  await sending
  assert.deepEqual(vm.messages, [])
  assert.equal(vm.sending, false)
})

test('token expiry during a request updates the page to logged out without retaining messages', async () => {
  const pending = deferred()
  const { vm, state } = loadChat(() => pending.promise)
  vm.draft = '查询文章'
  const sending = vm.sendMessage()
  state.token = ''
  pending.reject(new Error('登录已过期'))
  await sending
  assert.equal(vm.isLoggedIn, false)
  assert.deepEqual(vm.messages, [])
  assert.equal(vm.sending, false)
})
