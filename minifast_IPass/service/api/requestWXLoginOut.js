import { request } from '@/service/request'

/**
 * 退出登录
 * @param {String} userId
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXLoginOut = (
  userId,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    userId,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/loginOut',
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
export { requestWXLoginOut }
