import { request } from '@/service/request'

/**
 * 查询是否跳过人脸识别
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPJudgeFaceRecognition = (
  aac002,
  aac003,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '查询是否跳过人脸识别',
    methodName: 'judgeFaceRecognition',
    aac002,
    aac003,
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
export { requestSPJudgeFaceRecognition }
