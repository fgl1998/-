/**
 * 获取用户信息
 * @param {boolean} withCredentials 是否带上登录态信息。当 withCredentials 为 true 时，要求此前有调用过 wx.login 且登录态尚未过期，此时返回的数据会包含 encryptedData, iv 等敏感信息；当 withCredentials 为 false 时，不要求有登录态，返回的数据不包含 encryptedData, iv 等敏感信息。
 * @param {string} lang 显示用户信息的语言
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  getUserInfo().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const getUserInfo = (withCredentials = false, lang = 'en') => {
  return new Promise((resolve, reject) => {
    uni.getUserInfo({
      withCredentials,
      lang,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('getUserInfo 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { getUserInfo }
