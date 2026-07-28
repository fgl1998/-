import { getIsDev } from '@/utils/get'

/**
 * 检查登录状态是否过期
 *
 * 检查登录态是否过期。 通过 wx.login 接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。开发者只需要调用 wx.checkSession 接口检测当前用户登录态是否有效。登录态过期后开发者可以再调用 wx.login 获取新的用户登录态。调用成功说明当前 session_key 未过期，调用失败说明 session_key 已过期。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.checkSession.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/plugins/login.html#uni-checksession | uni-app官方文档}
 * @returns {Promise<any>}
 * @example
 * login().then(res => {
 *  // 登录成功
 * }).catch(err => {
 *  // 登录失败
 * }).finally((res) => {
 *  // 接口调用完成
 * })
 */
const checkSession = () => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              checkSession 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { checkSession }
