/**
 * 将 ArrayBuffer 对象转成 Base64 字符串
 * @param {ArrayBuffer} arrayBuffer 要转换成 Base64 字符串的 ArrayBuffer 对象
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.arrayBufferToBase64.html | 微信小程序官方文档}
 * @tips
 * 基础库 1.1.0 开始支持，低版本需做 {@link https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html | 兼容处理}。
 *
 * 从基础库 2.4.0 开始，本接口停止维护。
 * @see {@link https://uniapp.dcloud.io/api/arrayBufferToBase64?id=arraybuffertobase64 | uni-app官方文档}
 * @returns {string}
 *
 * @example
 * const arrayBuffer = new Uint8Array([55, 55, 55])
 * const base64 = arrayBufferToBase64(arrayBuffer)
 */
const arrayBufferToBase64 = (arrayBuffer) => {
  return uni.arrayBufferToBase64(arrayBuffer)
}
export { arrayBufferToBase64 }
