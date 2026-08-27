const test = require('node:test')
const assert = require('node:assert/strict')

const { createSession, TOKEN_KEY, USER_KEY } = require('../common/session')

function createStorage() {
  const values = new Map()
  return {
    getStorageSync(key) {
      return values.get(key)
    },
    setStorageSync(key, value) {
      values.set(key, value)
    },
    removeStorageSync(key) {
      values.delete(key)
    },
  }
}

test('session stores and reads token and user through injected storage', () => {
  const storage = createStorage()
  const session = createSession({ storage })
  const user = { id: 7, username: 'realworld' }

  session.set({ token: 'jwt-token', user })

  assert.equal(storage.getStorageSync(TOKEN_KEY), 'jwt-token')
  assert.deepEqual(session.get(), { token: 'jwt-token', user })
  assert.equal(session.getToken(), 'jwt-token')
  assert.deepEqual(session.getUser(), user)
})

test('session clear removes both token and user through injected storage', () => {
  const storage = createStorage()
  const session = createSession({ storage })
  session.set({ token: 'jwt-token', user: { id: 7 } })

  session.clear()

  assert.equal(storage.getStorageSync(TOKEN_KEY), undefined)
  assert.equal(storage.getStorageSync(USER_KEY), undefined)
  assert.deepEqual(session.get(), { token: '', user: null })
})

test('session module can be imported without a global uni object', () => {
  assert.equal(typeof createSession, 'function')
})
