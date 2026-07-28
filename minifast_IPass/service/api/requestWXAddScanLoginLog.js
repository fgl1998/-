import { request } from '@/service/request'

/**
 * 扫码登录 确定登陆
 * @param {String} id
 * @param {String} aac002
 * @param {Array} aac003
 * @param {Array} openid
 * @param {Array} type
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXAddScanLoginLog = (
  id,
  aac002,
  aac003,
  openid,
  type,
  encryptKey,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '扫码登录 确定登陆',
    id,
    aac002,
    aac003,
    openid,
    type,
    encryptKey
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontScanLoginLogRestService/addScanLoginLog',
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
export { requestWXAddScanLoginLog }
