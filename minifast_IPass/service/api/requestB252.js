import { request } from '@/service/request'

/**
 * 查询年度账单
 * @param {string} aac002 身份证号。
 * @param {string} cht481 年度。
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB252 = (aac002, cht481, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询年度账单',
    methodName: 'B252',
    aac002,
    cht481
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB252 }
