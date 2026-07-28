import { request } from '@/service/request'

/**
 * 社保卡未办卡详情
 * @param {string} chb015
 * @param {string} chb017
 * @param {string} chb018
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetNoCardList = (
  chb015,
  chb017,
  chb018,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '社保卡未办卡详情',
    methodName: 'getNoCardList',
    limit: pageSize + '',
    page: pageNo + '',
    chb015,
    chb017,
    chb018,
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
export { requestFFGetNoCardList }
