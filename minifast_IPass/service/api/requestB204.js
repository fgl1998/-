import { request } from '@/service/request'

/**
 * 获得业务列表
 * @param {string} dto 有效性
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB204 = (
  dto = '1', 
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '业务列表',
    methodName: 'B204',
    dto
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
export { requestB204 }
