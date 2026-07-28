import { request } from '@/service/request'

/**
 * 检测申报人是否在放行申请中
 * @param {String} aac002
 * @param {String} aac003
 * @param {String} chi031
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPCheckExamine = (
  aac002,
  aac003,
  chi031,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '检测申报人是否在放行申请中',
    methodName: 'checkExamine',
    aac002,
    aac003,
    chi031,
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataTwo',
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
export { requestSPCheckExamine }
