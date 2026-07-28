import { request } from '@/service/request'

/**
 * 更新用户信息
 * @param {String} tel
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXUpdateWxUser = (
  tel,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    tel
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/updateWxUser',
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
export { requestWXUpdateWxUser }
