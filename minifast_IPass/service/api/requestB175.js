import { request } from '@/service/request'

/**
 * 银行合作网点浏览人次
 * @param {string} chm040 网点id
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB175 = (chm040, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '增加银行合作网点浏览人次',
    methodName: 'B175',
    chm040,
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
export { requestB175 }
