import { request } from '@/service/request'
import config from '@/config'

/**
 * 查询公示数据
 * @param {string} chi031
 * @param {string} chb015
 * @param {string} chb017
 * @param {string} chb018
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPQueryPublicTitle = (
  chi031,
  chb015,
  chb017,
  chb018,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '查询公示数据',
    methodName: 'queryPublicTitle',
    pageSize: pageSize + '',
    pageNo: pageNo + '',
    aab301: config.areaCode,
    chb015,
    chb017,
    chb018,
    chb57a: '1',
    chi031,
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
export { requestSPQueryPublicTitle }
