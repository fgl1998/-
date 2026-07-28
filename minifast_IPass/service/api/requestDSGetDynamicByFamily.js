import { request } from '@/service/request'

/**
 * 家庭最新动态
 * @param {array} aac002s 身份证号
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetDynamicByFamily = (
  aac002s,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '家庭最新动态',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getDynamicByFamily',
    aac002s,
    page: pageNo + '',
    limit: pageSize + '',
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataForDs',
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
export { requestDSGetDynamicByFamily }
