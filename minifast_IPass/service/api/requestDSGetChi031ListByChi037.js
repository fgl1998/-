import { request } from '@/service/request'

/**
 * 获取某单位补贴项目
 * @param {string} chi037
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetChi031ListByChi037 = (
  chi037,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取某单位补贴项目',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getChi031ListByChi037',
    chi037,
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
export { requestDSGetChi031ListByChi037 }
