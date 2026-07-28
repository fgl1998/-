import { request } from '@/service/request'

/**
 * 学校待遇明细
 * @param {string} orgid
 * @param {string} che015
 * @param {string} chi031
 * @param {string} start_time
 * @param {string} end_time
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetSchoolDetailInfo = (
  orgid,
  che015,
  chi031,
  start_time,
  end_time,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '学校待遇明细',
    methodName: 'getSchoolDetailInfo',
    orgid,
    che015,
    chi031,
    start_time,
    end_time,
    limit: pageSize + '',
    page: pageNo + '',
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
export { requestFFGetSchoolDetailInfo }
