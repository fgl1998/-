import { request } from '@/service/request'

/**
 * 登录
 * @param {String} openid
 * @param {String} idCard
 * @param {String} userName
 * @param {String} tel
 * @param {String} avatarUrl 头像地址
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXLogin = (
  openid,
  idCard,
  userName,
  tel,
  avatarUrl,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    openid,
    loginId: idCard,
    idCard,
    userName,
    tel,
    portraiturl: avatarUrl,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/login',
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
export { requestWXLogin }
