import { request } from '@/service/request'

/**
 * 请求智能咨询
 * @param {String} idCard 身份证号
 * @param {String} user_id 用户流水号
 * @param {String} question 查询字符串
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetZnzxAnswer = (
  idCard,
  user_id,
  question,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '请求智能咨询',
    methodName: 'getZnzxAnswer',
    question,
    aac002: idCard,
    chz172: user_id,
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataForOther',
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
export { requestWXGetZnzxAnswer }
