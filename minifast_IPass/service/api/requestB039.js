import { request } from '@/service/request'

/**
 * 获取当前定位周围的基层网点
 * @param {String} longitude
 * @param {String} latitude
 * @param {number} [distance=10000]
 * @param {string} [chm032='']
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB039 = (
  longitude,
  latitude,
  distance = 10000,
  chm032 = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '获取当前定位周围的基层网点',
    methodName: 'B039',
    longitude: longitude + '',
    latitude: latitude + '',
    distance: distance + '',
    chm032,
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
export { requestB039 }
