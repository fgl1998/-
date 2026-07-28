import { getIsDev } from '@/utils/get'

/**
 * @typedef {Object} Res 用户授权结果，其中 key 为 scope 值，value 为 Boolean 值，表示用户是否允许授权
 * @property {object} authSetting 用户授权结果。其中 key 为 scope 值，value 为 Boolean 值，表示用户是否允许授权。scope.userInfo 用户信息、scope.userLocation 地理位置、scope.userLocationBackground 后台定位、scope.address 通信地址、scope.record 	录音功能、scope.writePhotosAlbum、保存到相册、scope.camera 摄像头、scope.invoice 获取发票、scope.invoiceTitle 发票抬头、scope.werun 微信运动步数
 * @property {boolean} subscriptionsSetting.mainSwitch 订阅消息总开关，true为开启，false为关闭
 * @property {object} subscriptionsSetting.itemSettings 每一项订阅消息的订阅状态。itemSettings对象的键为一次性订阅消息的模板id或系统订阅消息的类型，值为'accept'、'reject'、'ban'中的其中一种。'accept'表示用户同意订阅这条消息，'reject'表示用户拒绝订阅这条消息，'ban'表示已被后台封禁。
 */

/**
 * 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
 * @param {boolean} [withSubscriptions=true] 是否同时获取用户订阅消息的订阅状态，默认不获取。注意：withSubscriptions 只返回用户勾选过订阅面板中的“总是保持以上选择，不再询问”的订阅消息。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/open-api/setting/wx.openSetting.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/other/setting.html#opensetting | uni-app官方文档}
 * @returns {Promise<Res>}
 * @example
 * openSetting().then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *   // 接口调用失败
 * }).finally((res) => {
 *   // 接口调用完成
 * })
 */
const openSetting = (withSubscriptions = true) => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.openSetting({
      withSubscriptions,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              openSetting 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { openSetting }
