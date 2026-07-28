import { request } from '@/service/request'

/**
 * 获取经办人信息
 * @param {String} aac002 身份证号
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestSPGetUserInfoByAac002 = (
  aac002,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '获取经办人信息',
    methodName: 'getUserInfoByAac002',
    aac002,
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
export { requestSPGetUserInfoByAac002 }
