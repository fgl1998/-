import { request } from '@/service/request'

/**
 * 绑定订阅信息
 * @param {array} che500List 模版id列表订阅详情
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB255 = (che500List, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '绑定订阅信息',
    methodName: 'B255',
    che500List
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
export { requestB255 }
