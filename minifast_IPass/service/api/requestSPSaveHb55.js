import { request } from '@/service/request'

/**
 * 微信留言保存
 * @param {String} chb551
 * @param {String} chb552
 * @param {String} chb556
 * @param {String} chb557
 * @param {String} chb55e
 * @param {String} chb565
 * @param {String} chb015
 * @param {String} aae005
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPSaveHb55 = (
  chb551,
  chb552,
  chb556,
  chb557,
  chb55e,
  chb565,
  chb015,
  aae005,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '微信留言保存',
    methodName: 'saveHb55',
    chb565,
    chb551,
    chb552,
    chb556,
    chb557,
    chb55e,
    chb015,
    aae005,
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataTwo',
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
export { requestSPSaveHb55 }
