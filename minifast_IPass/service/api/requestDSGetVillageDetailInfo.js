import { request } from '@/service/request'

/**
 * 补贴发放详情
 * @param {string} type 1 成功 2 失败 3 发放中
 * @param {string} aae209 发放期号
 * @param {string} chb015
 * @param {string} chb017
 * @param {string} chb018
 * @param {string} chi031
 * @param {string} start_time
 * @param {string} end_time
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetVillageDetailInfo = (
  type,
  aae209,
  chb015,
  chb017,
  chb018,
  chi031,
  start_time,
  end_time,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '补贴发放详情',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getVillageDetailInfo',
    type,
    aae209,
    limit: pageSize + '',
    page: pageNo + '',
    chb015,
    chb017,
    chb018,
    chi031,
    start_time,
    end_time,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataForDs',
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
export { requestDSGetVillageDetailInfo }
