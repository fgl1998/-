# Agent Clear History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a guarded “清除历史” action to the active UniApp Agent chat page and connect it to the authenticated backend endpoint.

**Architecture:** Keep the destructive operation outside the model/tool layer. The frontend API sends an empty authenticated POST request, while the page owns confirmation, loading state, stale-request invalidation, success reset, and failure preservation.

**Tech Stack:** UniApp, Vue Options API, CommonJS API modules, Node.js built-in test runner

## Global Constraints

- Call `POST /api/agent/clear_history` with an empty body and the current JWT supplied by the shared HTTP client.
- Never send a caller-supplied `userId`.
- Put the action on the right side of the existing top notice bar.
- Require confirmation before deletion.
- Disable sending, history loading, process reloading, and repeated clearing while deletion is active.
- On success, clear visible conversation state and show the existing welcome card without reloading history.
- On failure, preserve visible messages and show a readable error.
- Do not modify log files, LangGraph history structures, or `pages/agent/chat0.vue`.

---

## File Structure

- `uniapp-v2/api/agent.js`: expose the authenticated clear-history request.
- `uniapp-v2/pages/agent/chat.vue`: render the toolbar action and manage confirmation/deletion state.
- `uniapp-v2/tests/agent.test.js`: verify the HTTP contract and page behavior.

### Task 1: Add the clear-history API contract

**Files:**
- Modify: `uniapp-v2/api/agent.js:4-13`
- Test: `uniapp-v2/tests/agent.test.js:54-75`

**Interfaces:**
- Consumes: `client.request(path, data, options)` from `common/http.js`.
- Produces: `agentApi.clearHistory(): Promise<undefined>` for a backend response shaped as `{ success: true }`.

- [ ] **Step 1: Write the failing API test**

Add this test after the existing history API contract test:

```js
test('clear history API uses POST with current JWT and no caller-supplied user id', async () => {
  let received
  const { createAgentApi } = require('../api/agent')
  const api = createAgentApi(createHttpClient({
    baseUrl: 'http://agent.example.test',
    getToken: () => 'current-token',
    requestAdapter: async (options) => {
      received = options
      return { statusCode: 200, data: { success: true } }
    },
  }))

  assert.equal(typeof api.clearHistory, 'function')
  assert.equal(await api.clearHistory(), undefined)
  assert.equal(received.url, 'http://agent.example.test/api/agent/clear_history')
  assert.equal(received.method, 'POST')
  assert.deepEqual(received.data, {})
  assert.equal(received.header.Authorization, 'Bearer current-token')
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test --test-name-pattern="clear history API" tests/agent.test.js
```

Expected: FAIL because `api.clearHistory` is not defined.

- [ ] **Step 3: Implement the API method**

Add this method next to `history()` in `createAgentApi`:

```js
clearHistory() {
  return client.request('/api/agent/clear_history', {}, { timeout: 30000 })
},
```

The completed API object begins as:

```js
function createAgentApi(client) {
  return {
    history() {
      return client.request('/api/agent/history', {}, { timeout: 30000 })
    },
    clearHistory() {
      return client.request('/api/agent/clear_history', {}, { timeout: 30000 })
    },
    chat(message) {
      return client.request('/api/agent/chat', { message }, { timeout: 120000 })
    },
  }
}
```

- [ ] **Step 4: Run the API test to verify it passes**

Run:

```bash
node --test --test-name-pattern="clear history API" tests/agent.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit the API contract**

```bash
git add uniapp-v2/api/agent.js uniapp-v2/tests/agent.test.js
git commit -m "feat: add agent history clearing API"
```

### Task 2: Add confirmation and page-state behavior

**Files:**
- Modify: `uniapp-v2/pages/agent/chat.vue:9-217`
- Modify: `uniapp-v2/tests/agent.test.js:16-50`
- Test: `uniapp-v2/tests/agent.test.js`

**Interfaces:**
- Consumes: `agentApi.clearHistory(): Promise<undefined>` from Task 1 and `uni.showModal`/`uni.showToast`.
- Produces: page methods `confirmClearHistory(): Promise<void>` and `clearHistory(): Promise<void>`, plus computed `canClearHistory: boolean`.

- [ ] **Step 1: Extend the page test harness**

Change the helper signature and mocks so tests can control the delete request and confirmation dialog:

```js
function createChatPage(
  chat = async () => ({ answer: '找到文章了' }),
  initialToken = 'user-token',
  history = async () => ({ messages: [] }),
  clearHistoryRequest = async () => undefined,
) {
  const file = path.join(root, 'pages/agent/chat.vue')
  assert.ok(fs.existsSync(file), 'Agent chat page should exist')
  const script = fs.readFileSync(file, 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]
  const state = { token: initialToken }
  const calls = []
  const clearHistoryCalls = []
  const toasts = []
  const routes = []
  const modals = []
  const modules = {
    '../../api/agent': {
      chat: (message) => {
        calls.push(message)
        return chat(message)
      },
      history,
      clearHistory: () => {
        clearHistoryCalls.push(true)
        return clearHistoryRequest()
      },
    },
    '../../common/session': { getToken: () => state.token },
  }

  const uni = {
    showToast: (options) => toasts.push(options.title),
    showModal: (options) => modals.push(options),
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
  return {
    vm,
    component,
    state,
    calls,
    clearHistoryCalls,
    modals,
    toasts,
    routes,
    ready,
  }
}
```

- [ ] **Step 2: Write failing page tests**

Add these tests after the history-loading tests:

```js
test('clear history asks for confirmation and cancellation keeps the conversation', async () => {
  const page = await loadChat(undefined, 'user-token', async () => savedMessages())
  const originalContents = page.vm.messages.map((message) => message.content)

  const clearing = page.vm.confirmClearHistory()
  assert.equal(page.modals.length, 1)
  page.modals[0].success({ confirm: false, cancel: true })
  await clearing

  assert.equal(page.clearHistoryCalls.length, 0)
  assert.deepEqual(page.vm.messages.map((message) => message.content), originalContents)
})

test('confirmed clear history resets the page to the welcome state', async () => {
  const page = await loadChat(undefined, 'user-token', async () => savedMessages())
  page.vm.draft = '未发送草稿'

  const clearing = page.vm.confirmClearHistory()
  page.modals[0].success({ confirm: true, cancel: false })
  await clearing

  assert.equal(page.clearHistoryCalls.length, 1)
  assert.deepEqual(page.vm.messages, [])
  assert.equal(page.vm.draft, '')
  assert.equal(page.vm.historyLoaded, true)
  assert.equal(page.vm.historyError, '')
  assert.equal(page.vm.processError, '')
  assert.equal(page.vm.clearingHistory, false)
  assert.ok(page.toasts.includes('历史已清除'))
})

test('failed clear history preserves messages and reports the error', async () => {
  const page = await loadChat(
    undefined,
    'user-token',
    async () => savedMessages(),
    async () => { throw new Error('清除服务暂不可用') },
  )
  const originalContents = page.vm.messages.map((message) => message.content)

  const clearing = page.vm.confirmClearHistory()
  page.modals[0].success({ confirm: true, cancel: false })
  await clearing

  assert.deepEqual(page.vm.messages.map((message) => message.content), originalContents)
  assert.equal(page.vm.clearingHistory, false)
  assert.ok(page.toasts.includes('清除服务暂不可用'))
})

test('clear history blocks duplicate clearing and other conversation requests', async () => {
  const pending = deferred()
  const page = await loadChat(
    undefined,
    'user-token',
    async () => savedMessages(),
    () => pending.promise,
  )

  const first = page.vm.confirmClearHistory()
  page.modals[0].success({ confirm: true, cancel: false })
  await Promise.resolve()

  assert.equal(page.vm.clearingHistory, true)
  assert.equal(page.vm.canSend, false)
  await page.vm.confirmClearHistory()
  await page.vm.reloadProcess()
  page.vm.draft = '清除期间不能发送'
  await page.vm.sendMessage()
  assert.equal(page.modals.length, 1)
  assert.equal(page.clearHistoryCalls.length, 1)
  assert.equal(page.calls.length, 0)

  pending.resolve()
  await first
  assert.equal(page.vm.clearingHistory, false)
})
```

- [ ] **Step 3: Run the page tests to verify they fail**

Run:

```bash
node --test --test-name-pattern="clear history" tests/agent.test.js
```

Expected: FAIL because `confirmClearHistory`, `canClearHistory`, and `clearingHistory` do not exist.

- [ ] **Step 4: Add clear-history state and computed guards**

Add to `data()`:

```js
clearingHistory: false,
```

Update `canSend` and add `canClearHistory`:

```js
canSend() {
  const message = this.draft.trim()
  return this.isLoggedIn
    && this.historyLoaded
    && !this.historyLoading
    && !this.sending
    && !this.clearingHistory
    && message.length > 0
    && message.length <= 2000
},
canClearHistory() {
  return this.isLoggedIn
    && this.historyLoaded
    && !this.historyLoading
    && !this.sending
    && !this.clearingHistory
},
```

Set `this.clearingHistory = false` in `resetConversation()`. Add `this.clearingHistory` to the early-return guards in `loadHistory`, `reloadProcess`, `sendMessage`, and `retryMessage`.

Use this complete reset method:

```js
resetConversation() {
  // 清理页面状态，不删除服务端历史；重新进入时会再次读取。
  this.requestGeneration += 1
  this.messages = []
  this.draft = ''
  this.sending = false
  this.clearingHistory = false
  this.historyLoading = false
  this.historyLoaded = false
  this.historyError = ''
  this.processError = ''
  this.scrollTarget = ''
},
```

Use these exact guards at the beginning of the four affected methods:

```js
// loadHistory
if (!this.pageActive || this.sending || this.clearingHistory || this.historyLoading || this.historyLoaded) return

// reloadProcess
if (!this.pageActive || this.sending || this.clearingHistory || this.historyLoading) return

// sendMessage
if (!this.pageActive || this.sending || this.clearingHistory || this.historyLoading) return

// retryMessage
if (!this.pageActive || this.sending || this.clearingHistory || this.historyLoading) return
```

- [ ] **Step 5: Implement confirmation and deletion**

Add these methods after `goLogin()`:

```js
async confirmClearHistory() {
  if (!this.canClearHistory) return

  const confirmed = await new Promise((resolve) => {
    uni.showModal({
      title: '清除历史',
      content: '将删除当前账号的全部助手对话，且无法恢复。确定继续吗？',
      confirmText: '清除',
      confirmColor: '#d75555',
      success: (result) => resolve(Boolean(result.confirm)),
      fail: () => resolve(false),
    })
  })

  if (!confirmed || !this.canClearHistory) return
  await this.clearHistory()
},
async clearHistory() {
  if (!this.canClearHistory) return
  const token = this.syncSession()
  if (!token) {
    this.goLogin()
    return
  }

  const generation = ++this.requestGeneration
  this.clearingHistory = true

  try {
    await agentApi.clearHistory()
    if (!this.isCurrentRequest(generation, token)) return

    this.messages = []
    this.draft = ''
    this.historyLoaded = true
    this.historyError = ''
    this.processError = ''
    this.scrollTarget = ''
    uni.showToast({ title: '历史已清除', icon: 'success' })
  } catch (error) {
    if (!this.isCurrentRequest(generation, token)) return
    uni.showToast({
      title: (error && error.message) || '清除历史失败，请重试',
      icon: 'none',
    })
  } finally {
    if (this.pageActive && generation === this.requestGeneration) {
      this.clearingHistory = false
      this.syncSession()
    }
  }
},
```

- [ ] **Step 6: Run the page behavior tests**

Run:

```bash
node --test --test-name-pattern="clear history" tests/agent.test.js
```

Expected: all matching tests PASS.

- [ ] **Step 7: Commit the page behavior**

```bash
git add uniapp-v2/pages/agent/chat.vue uniapp-v2/tests/agent.test.js
git commit -m "feat: clear agent conversation history"
```

### Task 3: Add and verify the toolbar control

**Files:**
- Modify: `uniapp-v2/pages/agent/chat.vue:9-10`
- Modify: `uniapp-v2/pages/agent/chat.vue:221-259`
- Test: `uniapp-v2/tests/agent.test.js`

**Interfaces:**
- Consumes: `canClearHistory`, `clearingHistory`, and `confirmClearHistory()` from Task 2.
- Produces: an accessible top-toolbar button labeled “清除历史”.

- [ ] **Step 1: Write the failing template regression test**

```js
test('chat page exposes a guarded clear-history toolbar action', () => {
  const source = fs.readFileSync(path.join(root, 'pages/agent/chat.vue'), 'utf8')
  assert.match(source, /class="clear-history-button"/)
  assert.match(source, /:disabled="!canClearHistory"/)
  assert.match(source, /@click="confirmClearHistory"/)
  assert.match(source, /clearingHistory \? '清除中…' : '清除历史'/)
})
```

- [ ] **Step 2: Run the template test to verify it fails**

Run:

```bash
node --test --test-name-pattern="toolbar action" tests/agent.test.js
```

Expected: FAIL because the toolbar button is absent.

- [ ] **Step 3: Replace the notice with a toolbar**

Replace the current notice element with:

```vue
<view class="chat-toolbar">
  <text class="chat-notice">工具与中间过程默认收起，点击展开可查看完整内容。</text>
  <button
    class="clear-history-button"
    :disabled="!canClearHistory"
    @click="confirmClearHistory"
  >
    {{ clearingHistory ? '清除中…' : '清除历史' }}
  </button>
</view>
```

- [ ] **Step 4: Add toolbar styling**

Replace the single `.chat-notice` rule with:

```scss
.chat-toolbar { display: flex; flex-shrink: 0; align-items: center; padding: 16rpx 24rpx; background: #edf3fa; }
.chat-notice { flex: 1; min-width: 0; color: #7c8798; font-size: 22rpx; line-height: 1.5; }
.clear-history-button { flex-shrink: 0; margin: 0 0 0 20rpx; padding: 8rpx 18rpx; color: #d75555; font-size: 23rpx; line-height: 1.5; background: #fff; border-radius: 999rpx; }
.clear-history-button::after { border-color: #efcaca; border-radius: 999rpx; }
.clear-history-button[disabled] { color: #b9bec6; background: #f5f7fa; }
```

Also include `clearingHistory` in the textarea disabled expression:

```vue
:disabled="sending || historyLoading || clearingHistory"
```

- [ ] **Step 5: Run the full frontend Agent test suite**

Run:

```bash
node --test tests/agent.test.js
```

Expected: all tests PASS with zero failures.

- [ ] **Step 6: Run backend type checking as an integration guard**

Run from `realworld-agent-v2`:

```bash
node node_modules/typescript/bin/tsc --noEmit
```

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 7: Review the final diff and commit**

Run:

```bash
git diff --check
git diff -- uniapp-v2/api/agent.js uniapp-v2/pages/agent/chat.vue uniapp-v2/tests/agent.test.js
```

Verify that no log files or `chat0.vue` changed, then commit:

```bash
git add uniapp-v2/api/agent.js uniapp-v2/pages/agent/chat.vue uniapp-v2/tests/agent.test.js
git commit -m "feat: add clear history control"
```
