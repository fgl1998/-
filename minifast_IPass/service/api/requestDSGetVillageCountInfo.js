import { request } from '@/service/request'

/**
 * 村村响概况查询
 * @param {string} aae209
 * @param {string} chb017
 * @param {string} chb018
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetVillageCountInfo = (
  aae209,
  chb017,
  chb018,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '村村响概况查询',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getVillageCountInfo',
    chb017,
    chb018,
    aae209,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataForDs',
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestDSGetVillageCountInfo }
