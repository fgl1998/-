import { request } from '@/service/request'

/**
 * 再次核验身份信息
 * @param {String} verifyResult
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXGetFaceInfo = (
  verifyResult,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '再次核验身份信息',
    verifyResult
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/getFaceInfo',
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
export { requestWXGetFaceInfo }