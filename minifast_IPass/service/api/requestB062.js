import { request } from '@/service/request'

/**
 * 根据业务局查询专项补贴列表
 * @param {String} chi037
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB062 = (chi037, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '根据业务局查询专项补贴列表',
    methodName: 'B062',
    chi037,
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
export { requestB062 }
