import { request } from '@/service/request'

/**
 * 重置网厅密码
 * @param {String} aac002 身份证号
 * @param {String} password 密码
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXWxUpdatePassword = (
  aac002,
  password,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '重置网厅密码',
    methodName: 'wxUpdatePassword',
    aac002,
    password,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataYhcms',
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
export { requestWXWxUpdatePassword }
