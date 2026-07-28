import { request } from '@/service/request'

/**
 * 查询店铺信息
 * @param {String} chi031
 * @param {String} chi037
 * @param {String} cht131
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB067 = (
  chi031,
  chi037,
  cht131,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '查询店铺信息',
    methodName: 'B067',
    chi031,
    chi037,
    cht131,
    pageSize: pageSize + '',
    pageNo: pageNo + '',
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
export { requestB067 }
