import { request } from '@/service/request'

/**
 * 查询专项补贴项目业务局列表
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB061 = (isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询专项补贴项目业务局列表',
    methodName: 'B061',
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
export { requestB061 }
