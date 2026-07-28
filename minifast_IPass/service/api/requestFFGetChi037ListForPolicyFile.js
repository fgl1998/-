import { request } from '@/service/request'

/**
 * 查询政策文件部门
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetChi037ListForPolicyFile = (
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '查询政策文件部门',
    methodName: 'getChi037ListForPolicyFile',
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
export { requestFFGetChi037ListForPolicyFile }
