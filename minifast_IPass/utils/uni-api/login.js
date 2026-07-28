import { getIsDev } from '@/utils/get'

/**
 * @typedef {Object} Res 图片信息
 * @property {string} authResult - 登录服务商提供的登录信息，服务商不同返回的结果不完全相同
 * @property {string} code - 用户登录凭证。开发者需要在开发者服务器后台，使用 code 换取 openid 和 session_key 等信息
 * @property {string} appleInfo - 苹果登录返回的信息
 * @property {string} errMsg - 描述信息
 */

/**
 * 登录
 * @param {string} provider 登录服务提供商，通过 uni.getProvider 获取，如果不设置则弹出登录列表选择界面
 * @param {string|string[]} scopes [auth_base] 授权类型。支持 auth_base（静默授权）/ auth_user（主动授权） / auth_zhima（芝麻信用。支付宝小程序支持
 * @param {number} timeout 超时时间，单位ms。微信小程序、百度小程序支持
 * @param {object} univerifyStyle 一键登录页面样式。App 3.0.0+ 支持
 * @param {boolean} onlyAuthorize 微信登录仅请求授权认证
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.io/api/plugins/login?id=login | uni-app官方文档}
 * @returns {Promise<Res>}
 * @example
 * login().then(res => {
 *  // 登录成功
 * }).catch(err => {
 *  // 登录失败
 * }).finally((res) => {
 *  // 接口调用完成
 * })
 */
const login = (provider, scopes, timeout, univerifyStyle, onlyAuthorize) => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.login({
      provider,
      scopes,
      timeout,
      univerifyStyle,
      onlyAuthorize,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              login 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { login }
