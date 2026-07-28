import { request } from '@/service/request'

/**
 * 一卡通概况查询
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetMyEcard = (
  aac002,
  aac003,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '一卡通概况查询',
    methodName: 'getMyEcard',
    aac002,
    aac003,
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
export { requestFFGetMyEcard }
