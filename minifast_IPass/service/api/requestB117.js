import { request } from '@/service/request'

/**
 * 获取个人相关的村庄信息
 * @param {String} aac002 身份证号
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB117 = (aac002, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodNameDesc: '获取个人相关的村庄信息',
    methodName: 'B117',
    aac002,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp',
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        let fieldData = res
        if (fieldData) {
          resolve(fieldData)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB117 }
