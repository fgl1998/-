import { requestWXGetCodeTableCache } from '@/service/api'
import { getStorage, setStorage, showModal } from '@/utils/uni-api'
/**
 * getCodeListByCodeName 获取码表并缓存
 * @param {string} codeName 码表名
 * @support 

 * @returns {Promise}
 *
 * @example
  getCodeListByCodeName().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const getCodeListByCodeName = (codeName, type = 'ygsp') => {
  const CODE_CACHE_MAP = 'CODE_CACHE_MAP'
  let typeStr = ''
  if (type === 'ygsp') {
    typeStr = 'yGSPCodeTableCache'
  } else {
    typeStr = 'yGFFCodeTableCache'
  }
  codeName = codeName.toLowerCase()
  const requestCodeTable = (resolve, reject) => {
    requestWXGetCodeTableCache(false)
      .then((res) => {
        const codeCacheMap = res.codeCacheMap
        const data = codeCacheMap[typeStr][codeName]
        if (!data) {
          showModal(
            '码值【' +
              codeName +
              '】并未在缓存中，请联系管理员检查application-nj文件中缓存字段！'
          )
          reject(codeCacheMap)
        } else {
          setStorage(CODE_CACHE_MAP, JSON.stringify(codeCacheMap))
          resolve(data)
        }
      })
      .catch((err) => {
        showModal('获取码表失败，请重启后台服务器！')
      })
  }
  return new Promise((resolve, reject) => {
    getStorage(CODE_CACHE_MAP)
      .then((res) => {
        const codeCacheMap = JSON.parse(res)
        if (!codeCacheMap) {
          // 若手机缓存为空，则取服务上缓存
          requestCodeTable(resolve, reject)
        } else {
          const data = codeCacheMap[typeStr][codeName]
          if (!data) {
            requestCodeTable(resolve, reject)
          } else {
            resolve(data)
          }
        }
      })
      .catch(() => {
        requestCodeTable(resolve, reject)
      })
  })
}
export { getCodeListByCodeName }
