const DB_NAME = 'image_cache_db'
const STORE_NAME = 'images'
const DB_VERSION = 1

// 默认缓存 7 天
const DEFAULT_EXPIRE_MS = 1 * 24 * 60 * 60 * 1000

function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'url',
        })
        store.createIndex('expireAt', 'expireAt', { unique: false })
        store.createIndex('updateTime', 'updateTime', { unique: false })
      }
    }
  })
}

// 根据 url 查缓存
export async function getImageCache(url) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(url)

    request.onsuccess = () => {
      resolve(request.result || null)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 存缓存
export async function setImageCache(url, blob, expireMs = DEFAULT_EXPIRE_MS) {
  const db = await openDB()
  const now = Date.now()

  const data = {
    url,
    blob,
    updateTime: now,
    expireAt: now + expireMs,
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put(data)

    request.onsuccess = () => {
      resolve(true)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 删除单条缓存
export async function deleteImageCache(url) {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(url)

    request.onsuccess = () => {
      resolve(true)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 清空所有缓存
export async function clearImageCache() {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => {
      resolve(true)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 清理过期缓存
export async function clearExpiredImageCache() {
  const db = await openDB()
  const now = Date.now()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.openCursor()

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        const value = cursor.value
        if (!value || value.expireAt <= now) {
          cursor.delete()
        }
        cursor.continue()
      } else {
        resolve(true)
      }
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

// 下载图片并转 blob
export async function fetchImageBlob(url) {
  const response = await fetch(url, {
    mode: 'cors',
    credentials: 'omit',
  })

  if (!response.ok) {
    throw new Error(`图片下载失败: ${response.status}`)
  }

  return await response.blob()
}

/**
 * 统一获取可显示图片地址
 * 逻辑：
 * 1. 先查 IndexedDB
 * 2. 有且未过期 -> 用本地 blob
 * 3. 没有或已过期 -> 下载并更新本地缓存
 * 4. 返回 blob url 或原始 url
 */
export async function getImageUrlWithCache(url, options = {}) {
  const { expireMs = DEFAULT_EXPIRE_MS, fallbackToOriginal = true } = options

  if (!url) return ''

  try {
    const cached = await getImageCache(url)

    if (cached && cached.blob && cached.expireAt > Date.now()) {
      return URL.createObjectURL(cached.blob)
    }

    // 有旧缓存但已过期，先删掉
    if (cached && cached.expireAt <= Date.now()) {
      await deleteImageCache(url)
    }

    const blob = await fetchImageBlob(url)
    await setImageCache(url, blob, expireMs)

    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('[image cache] getImageUrlWithCache error:', err)
    return fallbackToOriginal ? url : ''
  }
}
