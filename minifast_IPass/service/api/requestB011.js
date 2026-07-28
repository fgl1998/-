import { request } from '@/service/request'

/**
 * 请求补贴项目配置文件
 * @param {String} chi031
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB011 = (chi031, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '请求补贴项目配置文件',
    methodName: 'B011',
    chi031
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
export { requestB011 }
