import { request } from '@/service/request'

/**
 * 预览 pdf
 * @param {string} newFileName 文件名称
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXDeletePolicyFilePdf = (
  newFileName,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    newFileName,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/deletePolicyFilePdf',
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
export { requestWXDeletePolicyFilePdf }
