import { request } from '@/service/request'

/**
 * 微信留言回复（群众）
 * @param {String} chb550
 * @param {String} chb563
 * @param {String} chb565
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPSaveHb56 = (
  chb550,
  chb563,
  chb565,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '微信留言回复（群众）',
    methodName: 'saveHb56',
    chb565,
    chb563,
    chb550,
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
export { requestSPSaveHb56 }
