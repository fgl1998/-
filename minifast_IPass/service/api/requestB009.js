import { request } from '@/service/request'

/**
 * 用于作废在审核中的申报的数据
 * @param {String} chb000
 * @param {String} cpb103 意见
 * @param {Array} hi21List
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB009 = (chb000, cpb103, hi21List, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '用于作废在审核中的申报的数据',
    methodName: 'B009',
    chb000,
    cpb103,
    hi21List: JSON.stringify(hi21List)
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB009 }
