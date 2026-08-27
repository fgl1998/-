const { BASE_URL } = require('../config/env')
const session = require('./session')

const LOGIN_PATH = '/pages/login/login'

function createRequestAdapter() {
  return function requestAdapter(options) {
    if (typeof uni === 'undefined' || !uni || typeof uni.request !== 'function') {
      return Promise.reject(new Error('当前环境不可用：请注入 requestAdapter'))
    }

    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: resolve,
        fail: reject,
      })
    })
  }
}

function getCurrentRoute() {
  if (typeof getCurrentPages !== 'function') {
    return ''
  }
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return (currentPage && currentPage.route) || ''
}

function navigateToLogin(url) {
  if (typeof uni !== 'undefined' && uni && typeof uni.reLaunch === 'function') {
    uni.reLaunch({ url })
  }
}

function createUnauthorizedHandler(options) {
  const settings = options || {}
  const clearSession = settings.clearSession || session.clear
  const currentRoute = settings.getCurrentRoute || getCurrentRoute
  const redirect = settings.navigateToLogin || navigateToLogin
  const loginPath = settings.loginPath || LOGIN_PATH

  return function handleUnauthorized() {
    clearSession()
    if (currentRoute().replace(/^\//, '') === loginPath.replace(/^\//, '')) {
      return
    }
    redirect(loginPath)
  }
}

function joinUrl(baseUrl, path) {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  return `${baseUrl.replace(/\/$/, '')}/${String(path || '').replace(/^\//, '')}`
}

function createError(message, details) {
  const error = new Error(message || '请求失败')
  if (details) {
    Object.assign(error, details)
  }
  return error
}

function createHttpClient(options) {
  const settings = options || {}
  const requestAdapter = settings.requestAdapter || createRequestAdapter()
  const getToken = settings.getToken || session.getToken
  const onUnauthorized = settings.onUnauthorized || createUnauthorizedHandler()
  const baseUrl = settings.baseUrl || BASE_URL

  async function request(path, data, requestOptions) {
    const extraOptions = requestOptions || {}
    const token = getToken()
    const header = { ...(extraOptions.header || {}) }
    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    let response
    try {
      response = await requestAdapter({
        url: joinUrl(baseUrl, path),
        method: 'POST',
        data: data || {},
        header,
      })
    } catch (error) {
      throw createError((error && error.message) || '网络请求失败')
    }

    const body = (response && response.data) || {}
    const statusCode = response && response.statusCode
    if (statusCode < 200 || statusCode >= 300) {
      if (statusCode === 401) {
        await onUnauthorized()
      }
      throw createError(body.message || `HTTP 请求失败（${statusCode || '未知状态'}）`, {
        code: body.code,
        statusCode,
      })
    }

    if (body.success === false) {
      throw createError(body.message || '业务请求失败', { code: body.code, statusCode })
    }

    return body.data
  }

  return { request }
}

const http = createHttpClient()

module.exports = {
  LOGIN_PATH,
  createHttpClient,
  createUnauthorizedHandler,
  request: http.request,
}
