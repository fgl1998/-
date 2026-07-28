import { request } from '@/service/request'

/**
 * 投诉回复内容满意与否
 * @param {String} chb580 发放公示举报号
 * @param {String} chb590 投诉举报处理号
 * @param {String} chb593 群众是否满意 0 不满意,1 满意
 * @param {String} chb594 群众不满意原因
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestFFSaveChb594 = (
  chb580,
  chb590,
  chb593,
  chb594,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '投诉回复内容满意与否',
    methodName: 'saveChb594',
    chb580,
    chb590,
    chb593,
    chb594,
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
export { requestFFSaveChb594 }
