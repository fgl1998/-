import { request } from '@/service/request'
/**
 * 解密手机号
 * @param {String} code 动态令牌code
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXGetRealPhone = (code, isShowLoading = true, isShowErrorToast = true) => {
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/getRealPhone',
      { code },
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
export { requestWXGetRealPhone }
