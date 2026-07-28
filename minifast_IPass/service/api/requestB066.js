import { request } from '@/service/request'

/**
 * 账户详情
 * @param {String} cht130
 * @param {String} aac002
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB066 = (
  cht130,
  aac002,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '账户详情',
    methodName: 'B066',
    cht130,
    aac002,
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
export { requestB066 }
