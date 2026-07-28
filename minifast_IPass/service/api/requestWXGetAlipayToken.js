import { request } from '@/service/request'

/**
 * 支付宝token
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetAlipayToken = (
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {}
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getZfbToken',
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        let { fieldData } = res
        if (fieldData) {
          resolve(fieldData)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestWXGetAlipayToken }
