import requestConstant from './requestUrl'
import request from './app_request'

const setCodeCache = (key, value) => {
  let codeCache = getCodeCache() || {}
  codeCache[key] = value || []
  uni.setStorageSync(requestConstant.codeCacheKey, codeCache)
}

const getCodeCache = () => {
  return uni.getStorageSync(requestConstant.codeCacheKey) || {}
}

const getCode = (key) => {
  let code = getCodeCache()
  return code[key.toUpperCase() || '']
}

// 先获取所有码值
const getAllDictText = function () {
  let arr = requestConstant.codeList
  let codeUpArr = arr.map((item) => item.toUpperCase())
  let postArr = codeUpArr.map((item) => getDictText(item))
  Promise.all(postArr).then((res) => {
    let cacheStorage = getCodeCache() || {}
    codeUpArr.forEach((item, index) => {
      cacheStorage[item] = res[index]
    })
    setCodeCache(cacheStorage)
  })
}

// 获取码值
const getDictText = function (code) {
  return new Promise((resolve, reject) => {
    let cacheStorage = getCodeCache()
    let codeUp = code.toUpperCase()
    request.post(requestConstant.codeRequestType, null, null, { codeType: codeUp }, false).then((res) => {
      setCodeCache(codeUp, res.data.codeList)
      resolve(res.data.codeList)
    })
  })
}

// 转换单个码值获多个码值（多个是用,分割） （缓存内必须先有）
const getCodeLabel = (code, value) => {
  if (!value) {
    return ''
  }
  let cacheStorage = getCodeCache()
  let codeUp = code.toUpperCase()
  if (!cacheStorage) {
    getAllDictText()
    return value
  }
  if (!cacheStorage[codeUp] || cacheStorage[codeUp].length == 0) {
    getDictText(codeUp)
    return value
  }
  let val = value.toString().split(',')
  let valArr = val.map((one) => {
    let arr = cacheStorage[codeUp]
    let res = arr.find((item) => item.value === one)
    if (res) {
      return res.label
    }
    return value
  })
  return valArr.join(',')
}

const setWorkType = (value) => {
  uni.setStorageSync('workType', value || '')
}

const getWorkType = () => {
  const workType = uni.getStorageSync('workType')
  return workType && workType != undefined && workType != 'undefined' ? workType : ''
}

export default {
  getAllDictText,
  getDictText,
  getCodeLabel,
  setWorkType,
  getWorkType,
  getCode,
}
