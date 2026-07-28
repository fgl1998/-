import { request } from '@/service/request'

/**
 * 增加跳转次数
 * @param {string} chp210 宣传主键
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB260 = (chp210, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '增加跳转次数',
    methodName: 'B260',
    chp210
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
export { requestB260 }
