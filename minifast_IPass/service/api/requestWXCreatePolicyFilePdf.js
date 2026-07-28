import { request } from '@/service/request'

/**
 * 预览 pdf
 * @param {string} chi050 必填。文件码值，可通过 downFile 获得
 * @param {string} chi056 默认值：pdf。pdf 名称
 * @param {string} type 默认值：ygsp。请求系统类型
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXCreatePolicyFilePdf = (
  chi050,
  chi056,
  type,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const isRequestYGFF = type == 'ygsp' ? false : true
  const data = {
    chi050,
    chi056,
    isRequestYGFF,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/createPolicyFilePdf',
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
export { requestWXCreatePolicyFilePdf }
