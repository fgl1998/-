import { request } from '@/service/request'

/**
 * 查询商铺所有商品列表
 * @param {String} cht130 商铺主键
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB058 = (cht130, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询商铺所有商品列表',
    methodName: 'B058',
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
export { requestB058 }
