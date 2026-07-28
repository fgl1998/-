import { request } from '@/service/request'
/**
 * 微信生存认证核实
 * @param {String} aac003 姓名
 * @param {String} aac002 身份证号
 * @param {String} [chk115='0'] 生存认证方式（0：人脸识别1：生存认证放行）
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB148 = (
  aac003,
  aac002,
  chk115 = '0',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '微信生存认证核实',
    methodName: 'B148',
    chk115,
    aac003,
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
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB148 }
