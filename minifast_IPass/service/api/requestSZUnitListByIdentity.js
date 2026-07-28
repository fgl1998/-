import { request } from '@/service/request'

/**
 * 根据身份证查询户籍地址
 * @param {String} guest 姓名
 * @param {String} identity 身份证
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSZUnitListByIdentity = (
  guest,
  identity,
  isShowLoading = true,
  isShowErrorToast = false
) => {
  const data = {
    methodNameDesc: '根据身份证查询户籍地址',
    methodName: 'unitListByIdentity',
    guest,
    identity
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getHttpClientSz',
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
export { requestSZUnitListByIdentity }
