import { request } from '@/service/request'

/**
 * 根据商铺id返回申报的材料列表
 * @param {String} cht130 商铺主键
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB063 = (cht130, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '根据商铺id返回申报的材料列表',
    methodName: 'B063',
    cht130,
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
export { requestB063 }
