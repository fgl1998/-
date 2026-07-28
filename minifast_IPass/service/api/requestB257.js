import { request } from '@/service/request'

/**
 * 获取停机维护信息
 * @param {string} cht592 1:阳光审批平台 2:发放监管平台 3:一卡通公共服务网 4:微信小程序
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB257 = (cht592 = '4', isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '获取停机维护信息',
    methodName: 'B257',
    cht592
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
export { requestB257 }
