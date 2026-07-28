import { request } from '@/service/request'

/**
 * 取消订单
 * @param {String} cht190
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB068 = (cht190, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '取消订单',
    methodName: 'B068',
    cht190,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp',
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
export { requestB068 }
