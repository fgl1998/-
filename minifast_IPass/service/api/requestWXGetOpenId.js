import { request } from '@/service/request'
/**
 * 获取用户登录信息
 * @param {String} code 小程序code
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetOpenId = (
  code,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    code,
    userType: '1',
    appIndex: '0',
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/getOpenId',
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
export { requestWXGetOpenId }
