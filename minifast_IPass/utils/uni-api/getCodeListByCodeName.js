import { getStorage, setStorage, showModal } from './index'
import { requestWXGetCodeTableCache } from '@/service/api'
/**
 * getCodeListByCodeName
 * @param {string} str 要转化成 ArrayBuffer 对象的 Base64 字符串
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  copy().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const getCodeListByCodeName = (codeName) => {
  const CODE_CACHE_MAP = 'CODE_CACHE_MAP'
  const requestCodeTable = (resolve, reject) => {
    requestWXGetCodeTableCache(false).then((res) => {
      const resultData = res.data.resultData

      if (resultData.code === '-1') {
        showModal('获取码表失败：请重启后台服务器')
        return
      }

      const codeCacheMap = resultData.codeCacheMap
      const data = codeCacheMap[codeName.toLowerCase()]
      if (!data) {
        showModal(
          '码值【' +
            codeName +
            '】并未在缓存中，请检查application-scjy文件中缓存字段'
        )
        reject(codeCacheMap)
      } else {
        setStorage(CODE_CACHE_MAP, JSON.stringify(codeCacheMap))
        resolve(data)
      }
    })
  }
  return new Promise((resolve, reject) => {
    getStorage(CODE_CACHE_MAP)
      .then((res) => {
        const codeCacheMap = JSON.parse(res)
        const data = codeCacheMap[codeName.toLowerCase()]
        if (!codeCacheMap) {
          // 若手机缓存为空，则取服务上缓存
          requestCodeTable(resolve, reject)
        } else {
          if (!data) {
            showModal(
              '码值【' +
                codeName +
                '】并未在缓存中，请检查application-scjy文件中缓存字段'
            )
          } else {
            resolve(data)
          }
        }
      })
      .catch((err) => {
        requestCodeTable(resolve, reject)
      })
  })
}
export { getCodeListByCodeName }
