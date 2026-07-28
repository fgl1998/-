import { request } from '@/service/request'

/**
 * 商铺入驻
 * @param {Object} params
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB050 = (params, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '商铺入驻',
    methodName: 'B050',
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
export { requestB050 }
