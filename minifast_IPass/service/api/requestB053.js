import { request } from '@/service/request'

/**
 * 订单支付确认
 * @param {String} cht190
 * @param {String} chi031
 * @param {String} aac002
 * @param {String} aac002
 * @param {String} aac002_f
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB053 = (
  cht190,
  chi031,
  aac002,
  aac002_f,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '订单支付确认',
    methodName: 'B053',
    cht190,
    chi031,
    aac002,
    aac002_f,
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
export { requestB053 }
