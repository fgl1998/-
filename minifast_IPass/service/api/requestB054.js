import { request } from '@/service/request'

/**
 * 结算列表查询
 * @param {String} aac002
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB054 = (aac002, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '结算列表查询',
    methodName: 'B054',
    aac002,
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
export { requestB054 }
