import { request } from '@/service/request'
/**
 * 获取用户登录信息
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetUserInfoByDzsb = (
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {}
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/getUserInfoByDzsb',
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
export { requestWXGetUserInfoByDzsb }
