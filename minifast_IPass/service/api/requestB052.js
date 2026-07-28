import { request } from '@/service/request'

/**
 * 用户订单列表查询
 * @param {String} chi031
 * @param {String} cht130
 * @param {String} cht190
 * @param {String} cht192
 * @param {String} aac002
 * @param {String} aac002_g
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB052 = (
  chi031,
  cht130,
  cht190,
  cht192,
  aac002,
  aac002_g,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '用户订单列表查询',
    methodName: 'B052',
    chi031,
    cht130,
    cht190,
    cht192,
    aac002,
    aac002_g,
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
export { requestB052 }
