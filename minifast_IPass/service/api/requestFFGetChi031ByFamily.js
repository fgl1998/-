import { request } from '@/service/request'

/**
 * 家庭享受的补贴项目
 * @param {array} aac002s
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetChi031ByFamily = (
  aac002s,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '家庭享受的补贴项目',
    methodName: 'getChi031ByFamily',
    aac002s,
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
export { requestFFGetChi031ByFamily }
