import { request } from '@/service/request'
/**
 * 查询热度最高的补贴项目信息
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB162 = (isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodNameDesc: '查询热度最高的补贴项目信息',
    methodName: 'B162',
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
export { requestB162 }
