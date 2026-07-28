import { request } from '@/service/request'

/**
 * 通过chi215获取base64
 * @param {String} chi215 统一存储id
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXGetFileBase64ByFileId = (
  chi215,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '通过chi215获取base64',
    fileId: chi215,
  }

  return new Promise((resolve, reject) => {
    request(
      '/upload/getFileBase64ByFileId',
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
export { requestWXGetFileBase64ByFileId }
