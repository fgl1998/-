import { request } from '@/service/request'

/**
 * 转化编码
 * @param {string} chi031
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetBhi031ByChi031 = (
  chi031,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '转化编码',
    methodName: 'getBhi031ByChi031',
    chi031,
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
export { requestFFGetBhi031ByChi031 }
