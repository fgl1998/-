const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const memoryValues = new Map()
const memoryStorage = {
  getStorageSync(key) {
    return memoryValues.get(key)
  },
  setStorageSync(key, value) {
    memoryValues.set(key, value)
  },
  removeStorageSync(key) {
    memoryValues.delete(key)
  },
}

function getDefaultStorage() {
  if (typeof uni !== 'undefined' && uni) {
    return uni
  }
  return memoryStorage
}

function read(storage, key) {
  if (typeof storage.getStorageSync === 'function') {
    return storage.getStorageSync(key)
  }
  if (typeof storage.getItem === 'function') {
    return storage.getItem(key)
  }
  return undefined
}

function write(storage, key, value) {
  if (typeof storage.setStorageSync === 'function') {
    storage.setStorageSync(key, value)
    return
  }
  if (typeof storage.setItem === 'function') {
    storage.setItem(key, value)
  }
}

function remove(storage, key) {
  if (typeof storage.removeStorageSync === 'function') {
    storage.removeStorageSync(key)
    return
  }
  if (typeof storage.removeItem === 'function') {
    storage.removeItem(key)
  }
}

function createSession(options) {
  const storage = (options && options.storage) || getDefaultStorage()

  return {
    set({ token, user }) {
      write(storage, TOKEN_KEY, token || '')
      write(storage, USER_KEY, user || null)
    },
    setToken(token) {
      write(storage, TOKEN_KEY, token || '')
    },
    setUser(user) {
      write(storage, USER_KEY, user || null)
    },
    getToken() {
      return read(storage, TOKEN_KEY) || ''
    },
    getUser() {
      return read(storage, USER_KEY) || null
    },
    get() {
      return {
        token: read(storage, TOKEN_KEY) || '',
        user: read(storage, USER_KEY) || null,
      }
    },
    clear() {
      remove(storage, TOKEN_KEY)
      remove(storage, USER_KEY)
    },
  }
}

const session = createSession()

module.exports = {
  TOKEN_KEY,
  USER_KEY,
  createSession,
  ...session,
}
