import { request } from '@/service/request'
/**
 * 乐山修改保存户籍地址
 * @param {Object} params
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB163 = (params, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodNameDesc: '乐山修改保存户籍地址',
    methodName: 'B163',
    ...params,
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
export { requestB163 }
