import { request } from '@/service/request'

/**
 * 补贴项目申报的当前流程图
 * @param {String} cpb100
 * @param {String} chb000
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB026 = (
  cpb100,
  chb000,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '补贴项目申报的当前流程图',
    methodName: 'B026',
    cpb100,
    chb000,
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
export { requestB026 }
