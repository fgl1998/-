/**
 * 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
 * @param {string} [type='heavy'] 震动强度类型，有效值为：heavy、medium、light
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  vibrateShort().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const vibrateShort = (type = 'heavy') => {
  return new Promise((resolve, reject) => {
    uni.vibrateShort({
      type,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.error('vibrateShort 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { vibrateShort }
