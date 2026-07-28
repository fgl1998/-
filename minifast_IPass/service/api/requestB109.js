import { request } from '@/service/request'

/**
 * 保存访问情况
 * @param {String} aac002
 * @param {String} aac003
 * @param {String} chb015
 * @param {String} chb017
 * @param {String} chb018
 * @param {String} chw244
 * @param {String} chw243
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB109 = (
  aac002,
  aac003,
  chb015,
  chb017,
  chb018,
  chw244,
  chw243,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '保存访问情况',
    methodName: 'B109',
    aac002,
    aac003,
    chb015,
    chb017,
    chb018,
    chw244,
    chw243,
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
export { requestB109 }
