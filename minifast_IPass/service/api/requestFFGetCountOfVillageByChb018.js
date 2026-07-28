import { request } from '@/service/request'

/**
 * 查询村庄关注人数
 * @param {string} chb015
 * @param {string} chb017
 * @param {string} chb018
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetCountOfVillageByChb018 = (chb015, chb017, chb018, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodNameDesc: '查询村庄关注人数',
    methodName: 'getCountOfVillageByChb018',
    chb017,
    chb018,
    chb015
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceData', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestFFGetCountOfVillageByChb018 }
