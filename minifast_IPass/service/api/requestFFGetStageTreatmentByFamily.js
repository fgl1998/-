import { request } from '@/service/request'

/**
 * 家庭补贴详细查询
 * @param {string} aac002s
 * @param {string} type 类型 01 02 03
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetStageTreatmentByFamily = (
  aac002s,
  type,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '家庭补贴详细查询',
    methodName: 'getStageTreatmentByFamily',
    aac002s,
    type,
    page: pageNo + '',
    limit: pageSize + '',
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
export { requestFFGetStageTreatmentByFamily }
