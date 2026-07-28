import { request } from '@/service/request'

/**
 * 请求投诉具体回复情况
 * @param {String} chb580 发放公示举报号
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestFFGetHb59List = (
  chb580,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '请求投诉具体回复情况',
    methodName: 'getHb59List',
    chb580,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceData',
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
export { requestFFGetHb59List }
