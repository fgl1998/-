import { request } from '@/service/request'

/**
 * 获取地址
 * @param {Object} params
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXGetAddress = (
  params,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    ...params,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontAddressRestService/getAdderss',
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
export { requestWXGetAddress }
