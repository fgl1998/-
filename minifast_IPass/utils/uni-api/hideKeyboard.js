/**
 * 在input、textarea等focus拉起键盘之后，手动调用此接口收起键盘
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.hideKeyboard.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/key?id=hidekeyboard

 * @returns {Promise}
 *
 * @example
  hideKeyboard().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const hideKeyboard = () => {
  return new Promise((resolve, reject) => {
    uni.hideKeyboard({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('hideKeyboard 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { hideKeyboard }
