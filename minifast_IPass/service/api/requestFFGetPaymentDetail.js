import { request } from '@/service/request'

/**
 * 查询补贴详情
 * @param {string} [aae036_1=''] 月份 默认值 `''`。
 * @param {string} [aac002s=''] 身份证号 默认值 `''`。
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestFFGetPaymentDetail = (
  aae036_1 = '',
  aac002s = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '查询补贴详情',
    methodName: 'getPaymentDetail',
    aae036_1,
    aac002s
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceData',
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
export { requestFFGetPaymentDetail }
