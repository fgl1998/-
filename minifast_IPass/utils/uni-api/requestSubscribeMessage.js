import { getIsDev } from '@/utils/get'
/**
 * @typedef {Object} Res 图片信息
 * @property {string} errMsg - 接口调用成功时errMsg值为'requestSubscribeMessage:ok'
 * @property {string} TEMPLATE_ID - [TEMPLATE_ID]是动态的键，即模板id，值包括'accept'、'reject'、'ban'。'accept'表示用户同意订阅该条id对应的模板消息，'reject'表示用户拒绝订阅该条id对应的模板消息，'ban'表示已被后台封禁。例如 { errMsg: "requestSubscribeMessage:ok", zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: "accept"} 表示用户同意订阅zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE这条消息
 */

/**
 * 调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果。当用户勾选了订阅面板中的“总是保持以上选择，不再询问”时，模板消息会被添加到用户的小程序设置页，通过 wx.getSetting 接口可获取用户对相关模板消息的订阅状态。
 * @param {string[]} tmplIds 需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息（注意：iOS客户端7.0.6版本、Android客户端7.0.7版本之后的一次性订阅/长期订阅才支持多个模板消息，iOS客户端7.0.5版本、Android客户端7.0.6版本之前的一次订阅只支持一个模板消息）消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/other/requestSubscribeMessage.html#requestsubscribemessage | uni-app官方文档}
 * @returns {Promise<Res>}
 * @example
 * requestSubscribeMessage(['bfLEtF9hYdYH0EBZr3B-JvD0VhfJriP9ofim6u-VByk']).then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *   // 接口调用失败
 * }).finally((res) => {
 *   // 接口调用完成
 * })
 */
const requestSubscribeMessage = (tmplIds) => {
  return new Promise((resolve, reject) => {
    // 当前环境是否为开发环境
    const isDev = getIsDev()
    // #ifdef MP-ALIPAY
    // #endif
    uni.requestSubscribeMessage({
      tmplIds,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              requestSubscribeMessage 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}

export { requestSubscribeMessage }
