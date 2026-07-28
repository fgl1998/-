import { request } from '@/service/request'

/**
 * 查询可订阅的模块消息
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB254 = (isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询可订阅的模块消息',
    methodName: 'B254'
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        const { code, lists } = res
        if (code == '200' && lists) {
          resolve(lists.he50List.list)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB254 }
