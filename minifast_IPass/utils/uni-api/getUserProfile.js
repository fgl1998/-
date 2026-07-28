import { getIsDev } from '@/utils/get'
/**
 * 获取用户信息。页面产生点击事件（例如 button 上 bindtap 的回调中）后才可调用，每次请求都会弹出授权窗口，用户同意后返回 userInfo。该接口用于替换 wx.getUserInfo
 *
 * @support
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
 *
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/system/phone?id=makephonecall
 * @returns {Promise}
 *
 * @example
  getUserProfile('13211111111').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const getUserProfile = () => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '获取个人信息用于展示头像',
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error('getUserProfile 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { getUserProfile }
