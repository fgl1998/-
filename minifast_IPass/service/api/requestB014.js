import { request } from '@/service/request'

/**
 * 补贴项目需要显示的配置字段
 * @param {String} chi031 补贴项目
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB014 = (chi031, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '补贴项目需要显示的配置字段',
    methodName: 'B014',
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
export { requestB014 }
