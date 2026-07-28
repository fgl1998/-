import { request } from '@/service/request'

/**
 * 通过身份证号码查询某个补贴项目建档立卡信息
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {String} chi031 补贴项目编码
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPGetHo07Info = (
  aac002,
  aac003,
  chi031,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '通过身份证号码查询某个补贴项目建档立卡信息',
    methodName: 'getHo07Info',
    aac002,
    aac003,
    chi031,
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataTwo',
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
export { requestSPGetHo07Info }
