import { request } from '@/service/request'

/**
 * 审批系统重置密码
 * @param {String} aac002 身份证号
 * @param {String} password 密码
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB208 = (aac002, password, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '重置密码',
    methodName: 'B208',
    aac002,
    password
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB208 }
