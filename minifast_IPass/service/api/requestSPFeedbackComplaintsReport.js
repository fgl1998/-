import { request } from '@/service/request'

/**
 * 投诉回复内容满意与否
 * @param {String} chb510
 * @param {String} chb520
 * @param {String} chb522 反馈结果 0 不满意,1 满意
 * @param {String} chb523 补充说明
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestSPFeedbackComplaintsReport = (
  chb510,
  chb520,
  chb522,
  chb523,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '投诉回复内容满意与否',
    methodName: 'feedbackComplaintsReport',
    chb521: '1', // 反馈渠道 1 微信 2 网厅
    chb522,
    chb523, // 补充说明
    chb510,
    chb520,
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
export { requestSPFeedbackComplaintsReport }
