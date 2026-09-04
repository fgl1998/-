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

function createChatPage(chat = async () => ({ answer: '找到文章了' }), initialToken = 'user-token', history = async () => ({ messages: [] })) {
  const file = path.join(root, 'pages/agent/chat.vue')
  assert.ok(fs.existsSync(file), 'Agent chat page should exist')
  const script = fs.readFileSync(file, 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]
  const state = { token: initialToken }
  const calls = []
  const toasts = []
  const routes = []
  const modules = {
    '../../api/agent': { chat: (message) => { calls.push(message); return chat(message) }, history },
    '../../common/session': { getToken: () => state.token },
  }
  const uni = {
    showToast: (options) => toasts.push(options.title),
    navigateTo: (options) => routes.push(options.url),
  }
  const component = new Function('require', 'uni', script.replace(/export\s+default/, 'return'))(
    (name) => {
      if (name === '../../common/agent-history') return require('../common/agent-history')
      assert.ok(modules[name], `Unexpected dependency: ${name}`)
      return modules[name]
    }, uni,
  )
  const vm = { ...component.data(), $nextTick: (fn) => Promise.resolve().then(fn) }
  for (const [key, method] of Object.entries(component.methods)) vm[key] = method.bind(vm)
  for (const [key, getter] of Object.entries(component.computed || {})) {
    Object.defineProperty(vm, key, { get: () => getter.call(vm) })
  }
  const ready = component.onShow.call(vm)
  return { vm, component, state, calls, toasts, routes, ready }
}

async function loadChat(...args) {
  const page = createChatPage(...args)
  await page.ready
  return page
}

test('history API uses POST with current JWT and no caller-supplied user id', async () => {
  let received
  const { createAgentApi } = require('../api/agent')
  const api = createAgentApi(createHttpClient({
    baseUrl: 'http://agent.example.test',
    getToken: () => 'current-token',
    requestAdapter: async (options) => {
      received = options
      return { statusCode: 200, data: { success: true, data: { messages: [] } } }
    },
  }))
  assert.equal(typeof api.history, 'function')
  assert.deepEqual(await api.history(), { messages: [] })
  assert.equal(received.url, 'http://agent.example.test/api/agent/history')
  assert.equal(received.method, 'POST')
  assert.deepEqual(received.data, {})
  assert.equal(received.header.Authorization, 'Bearer current-token')
})

function savedMessages(question = '历史问题', answer = '历史回答') {
  return { messages: [
    { index: 0, id: null, type: 'human', content: question, toolCalls: [], isFinalAnswer: false },
    { index: 1, id: 'server:id', type: 'ai', content: '正在选择工具', toolCalls: [{}], isFinalAnswer: false },
    { index: 2, type: 'tool', content: '内部工具 JSON', toolCalls: [], isFinalAnswer: false },
    { index: 3, id: 'server:id', type: 'ai', content: answer, toolCalls: [], isFinalAnswer: true },
  ] }
}

test('history normalization keeps every stage including empty AI calls, tool results and system messages', () => {
  assert.ok(fs.existsSync(path.join(root, 'common/agent-history.js')))
  const { normalizeHistory } = require('../common/agent-history')
  const result = savedMessages()
  result.messages[3].content = ['第一段', { type: 'text', text: '第二段' }, { type: 'reasoning', text: '内部推理' }, { type: 'image_url', image_url: {} }]
  result.messages.push({ index: 4, type: 'system', content: '系统说明' })
  result.messages.push({ index: 5, type: 'ai', content: '', toolCalls: [{ name: 'search_docs', args: { query: '登录' }, id: 'call-1' }], isFinalAnswer: false })
  result.messages.push({ index: 6, type: 'tool', name: 'search_docs', toolCallId: 'call-1', content: { documents: ['文档内容'] } })
  result.messages.push({ index: 7, type: 'ai', content: '', toolCalls: [], isFinalAnswer: false })
  result.messages.reverse()
  const messages = normalizeHistory(result)
  assert.deepEqual(messages.map((item) => item.type), ['human', 'ai', 'tool', 'ai', 'system', 'ai', 'tool', 'ai'])
  assert.equal(messages[0].role, 'user')
  assert.equal(messages[2].role, 'tool')
  assert.match(messages[3].content, /第一段\n第二段/)
  assert.match(messages[3].content, /reasoning/)
  assert.match(messages[3].content, /image_url/)
  assert.match(messages[5].toolCallsText, /search_docs/)
  assert.match(messages[5].toolCallsText, /登录/)
  assert.equal(messages[6].name, 'search_docs')
  assert.equal(messages[6].toolCallId, 'call-1')
  assert.match(messages[6].content, /文档内容/)
  assert.equal(messages[7].content, '（无文本内容）')
  assert.equal(new Set(messages.map((item) => item.id)).size, 8)
  assert.ok(messages.every((item) => /^history-/.test(item.id) && item.status === 'sent'))
  assert.throws(() => normalizeHistory({}), /历史/)
})

test('entering chat restores history and does not reload it over local messages on ordinary onShow', async () => {
  let loads = 0
  const { vm, component } = await loadChat(undefined, 'user-token', async () => { loads++; return savedMessages() })
  assert.deepEqual(vm.messages.map((item) => item.content), ['历史问题', '正在选择工具', '内部工具 JSON', '历史回答'])
  vm.messages.push({ id: 'local-message', role: 'user', content: '本地消息' })
  await component.onShow.call(vm)
  assert.equal(loads, 1)
  assert.equal(vm.messages.length, 5)
})

test('history load locks sending and repeated loading until its result arrives', async () => {
  const pending = deferred()
  let loads = 0
  const page = createChatPage(undefined, 'user-token', () => { loads++; return pending.promise })
  assert.equal(page.vm.historyLoading, true)
  page.vm.draft = '不能抢先发送'
  assert.equal(page.vm.canSend, false)
  await page.vm.sendMessage()
  const secondShow = page.component.onShow.call(page.vm)
  assert.equal(loads, 1)
  assert.equal(page.calls.length, 0)
  pending.resolve(savedMessages())
  await Promise.all([page.ready, secondShow])
  assert.equal(page.vm.historyLoaded, true)
  assert.equal(page.vm.historyLoading, false)
  assert.equal(page.vm.canSend, true)
})

test('failed history stays retryable and malformed responses do not become an empty success', async () => {
  let loads = 0
  const page = await loadChat(undefined, 'user-token', async () => {
    if (++loads === 1) throw new Error('历史服务暂不可用')
    if (loads === 2) return {}
    return { messages: [] }
  })
  assert.equal(page.vm.historyError, '历史服务暂不可用')
  page.vm.draft = '保留草稿'
  await page.vm.sendMessage()
  assert.equal(page.calls.length, 0)
  await page.vm.loadHistory()
  assert.equal(page.vm.historyLoaded, false)
  assert.match(page.vm.historyError, /历史/)
  await page.vm.loadHistory()
  assert.equal(page.vm.historyLoaded, true)
  assert.equal(page.vm.historyError, '')
  assert.equal(page.vm.draft, '保留草稿')
})

test('unloading invalidates history and reopening restores it from the server', async () => {
  const pending = deferred()
  const page = createChatPage(undefined, 'user-token', () => pending.promise)
  page.component.onUnload.call(page.vm)
  pending.resolve(savedMessages())
  await page.ready
  assert.deepEqual(page.vm.messages, [])
  const reopened = await loadChat(undefined, 'user-token', async () => savedMessages())
  assert.equal(reopened.vm.messages.length, 4)
})

test('a late history response from another account cannot overwrite the current history', async () => {
  const pending = deferred()
  let loads = 0
  const page = createChatPage(undefined, 'old-token', () => ++loads === 1 ? pending.promise : Promise.resolve(savedMessages('新问题', '新回答')))
  page.state.token = 'new-token'
  await page.component.onShow.call(page.vm)
  pending.resolve(savedMessages('旧问题', '旧回答'))
  await page.ready
  assert.deepEqual(page.vm.messages.map((item) => item.content), ['新问题', '正在选择工具', '内部工具 JSON', '新回答'])
})

test('guests never fetch history and history 401 clears the visible conversation', async () => {
  let loads = 0
  const guest = await loadChat(undefined, '', async () => { loads++; return savedMessages() })
  assert.equal(loads, 0)
  assert.equal(guest.vm.isLoggedIn, false)
  const pending = deferred()
  const page = createChatPage(undefined, 'user-token', () => pending.promise)
  page.state.token = ''
  pending.reject(new Error('登录已过期'))
  await page.ready
  assert.equal(page.vm.isLoggedIn, false)
  assert.deepEqual(page.vm.messages, [])
  assert.equal(page.vm.historyLoading, false)
})

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
  const { vm, calls } = await loadChat()
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

test('a completed chat reloads all stages without duplicating the local question and answer', async () => {
  let loads = 0
  const pending = deferred()
  const page = await loadChat(undefined, 'user-token', () => ++loads === 1 ? Promise.resolve({ messages: [] }) : pending.promise)
  page.vm.draft = '查文档'
  const sending = page.vm.sendMessage()
  await Promise.resolve()
  assert.equal(loads, 2)
  assert.equal(page.vm.sending, true)
  pending.resolve(savedMessages('查文档', '文档回答'))
  await sending
  assert.deepEqual(page.vm.messages.map((item) => item.type), ['human', 'ai', 'tool', 'ai'])
  assert.equal(page.vm.messages.filter((item) => item.role === 'user').length, 1)
  assert.equal(page.vm.messages[3].content, '文档回答')
  assert.equal(page.vm.sending, false)
})

test('failed process reload keeps the answer and retries history without sending the question again', async () => {
  let loads = 0
  const page = await loadChat(undefined, 'user-token', async () => {
    if (++loads === 1) return { messages: [] }
    if (loads === 2) throw new Error('过程读取失败')
    return savedMessages('查文档', '找到文章了')
  })
  page.vm.draft = '查文档'
  await page.vm.sendMessage()
  assert.equal(page.vm.messages[0].status, 'sent')
  assert.equal(page.vm.messages[1].content, '找到文章了')
  assert.match(page.vm.processError, /过程读取失败/)
  await page.vm.reloadProcess()
  assert.deepEqual(page.calls, ['查文档'])
  assert.equal(page.vm.messages.length, 4)
  assert.equal(page.vm.processError, '')
})

test('a late process reload cannot restore messages after unload or account switch', async () => {
  for (const switchAccount of [false, true]) {
    let loads = 0
    const pending = deferred()
    const page = await loadChat(undefined, 'user-token', () => ++loads === 2 ? pending.promise : Promise.resolve({ messages: [] }))
    page.vm.draft = '旧问题'
    const sending = page.vm.sendMessage()
    await Promise.resolve()
    assert.equal(loads, 2)
    if (switchAccount) {
      page.state.token = 'new-token'
      await page.component.onShow.call(page.vm)
    } else page.component.onUnload.call(page.vm)
    pending.resolve(savedMessages('旧问题', '旧回答'))
    await sending
    assert.deepEqual(page.vm.messages, [])
    assert.equal(page.vm.sending, false)
  }
})

test('chat refuses empty, overlong and unauthenticated submissions', async () => {
  const { vm, calls, toasts } = await loadChat()
  vm.draft = '   '
  await vm.sendMessage()
  vm.draft = '问'.repeat(2001)
  await vm.sendMessage()
  assert.equal(calls.length, 0)
  assert.ok(toasts.some((text) => /2000/.test(text)))
  const guest = await loadChat(undefined, '')
  guest.vm.draft = '查文章'
  await guest.vm.sendMessage()
  assert.equal(guest.calls.length, 0)
  assert.equal(guest.vm.isLoggedIn, false)
  assert.deepEqual(guest.routes, ['/pages/login/login'])
})

test('waiting for an answer blocks repeated sends and keeps a visible pending question', async () => {
  const pending = deferred()
  const { vm, calls } = await loadChat(() => pending.promise)
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
  const { vm, calls } = await loadChat(async () => {
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
    const { vm } = await loadChat(async () => result)
    vm.draft = '查询文章'
    await vm.sendMessage()
    assert.equal(vm.messages[0].status, 'failed')
    assert.equal(vm.messages.length, 1)
    assert.equal(vm.sending, false)
  }
})

test('retrying an earlier failed question inserts its answer beside that question', async () => {
  let attempt = 0
  const { vm } = await loadChat(async (message) => {
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
  const { vm, component } = await loadChat(() => pending.promise)
  vm.draft = '查询文章'
  const sending = vm.sendMessage()
  component.onUnload.call(vm)
  pending.resolve({ answer: '迟到的结果' })
  await sending
  assert.deepEqual(vm.messages, [])
  assert.equal(vm.sending, false)
  const reopened = await loadChat()
  assert.deepEqual(reopened.vm.messages, [])
})

test('account changes clear messages and old responses cannot enter the new conversation', async () => {
  const pending = deferred()
  const { vm, component, state } = await loadChat(() => pending.promise)
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
  const { vm, state } = await loadChat(() => pending.promise)
  vm.draft = '查询文章'
  const sending = vm.sendMessage()
  state.token = ''
  pending.reject(new Error('登录已过期'))
  await sending
  assert.equal(vm.isLoggedIn, false)
  assert.deepEqual(vm.messages, [])
  assert.equal(vm.sending, false)
})
