import { request } from '@/service/request'

/**
 * 申报
 * @param {string} shieldYtj 是否禁用一体机
 * @param {object} declareInfo 申报数据
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB001 = (shieldYtj, declareInfo, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '申报',
    methodName: 'B001',
    shieldYtj,
    ...declareInfo
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB001 }
