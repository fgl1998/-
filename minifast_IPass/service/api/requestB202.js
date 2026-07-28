import { request } from '@/service/request'

/**
 * 补贴项目申报自定义热门项目
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB202 = (isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '补贴项目申报自定义热门项目',
    methodName: 'B202',
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
export { requestB202 }
