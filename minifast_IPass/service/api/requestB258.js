import { request } from '@/service/request'

/**
 * 查询宣传列表
 * @param {string} aae100 数据有效性
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB258 = (aae100 = '1', isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询宣传列表',
    methodName: 'B258',
    aae100
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
export { requestB258 }
