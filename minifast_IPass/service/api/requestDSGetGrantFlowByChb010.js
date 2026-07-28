import { request } from '@/service/request'

/**
 * 获取补贴项目的发放进度
 * @param {string} chb010
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetGrantFlowByChb010 = (
  chb010,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取补贴项目的发放进度',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getGrantFlowByChb010',
    chb010,
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
export { requestDSGetGrantFlowByChb010 }
