import { request } from '@/service/request'

/**
 * 获取政策文件流
 * @param {string} chi050
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetPolicyFilePdf = (
  chi050,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取政策文件流',
    methodName: 'getPolicyFilePdf',
    chi050,
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
export { requestFFGetPolicyFilePdf }
