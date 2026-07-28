import { request } from '@/service/request'

/**
 * 获取补贴项目数据
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPQueryChi031 = (
  isShowLoading = true,
  isShowErrorToast = true,
  queryType = '1',
  aae100 = '1'
) => {
  const data = {
    methodNameDesc: '获取补贴项目数据',
    methodName: 'queryChi031',
    queryType,
    aae100
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
export { requestSPQueryChi031 }
