import { request } from '@/service/request'

/**
 * 投诉举报结果反馈
 * @param {string} chb090  //投诉举报信息id
 * @param {string} chb09b  //满意度
 * @param {string} chb101  //反馈意见
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB207 = (
  chb090, 
  chb09b,
  chb101,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '投诉举报结果反馈',
    methodName: 'B207',
    chb090, 
    chb09b,
    chb101,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp',
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
export { requestB207 }
