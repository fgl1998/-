import { request } from '@/service/request'

/**
 * 获取补贴项目审批流程
 * @param {String} chi031
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB018 = (chi031, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '获取补贴项目审批流程',
    methodName: 'B018',
    chi031,
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
export { requestB018 }
