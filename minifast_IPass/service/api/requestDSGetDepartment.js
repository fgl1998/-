import { request } from '@/service/request'

/**
 * 获取主管单位数据
 * @param {String} [chb015=''] 通过区县筛选业务局
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetDepartment = (
  chb015 = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取主管单位数据',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getDepartment',
    chb015,
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
export { requestDSGetDepartment }
