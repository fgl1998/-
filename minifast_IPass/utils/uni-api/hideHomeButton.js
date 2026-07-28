/**
 * 隐藏返回首页按钮。
 * 
 * 微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮，开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideHomeButton.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/navigationbar?id=hidehomebutton
 *
 * 支持微信小程序 字节跳动小程序 1.48.0+ QQ小程序 1.10.0+
 * @returns {Promise}
 *
 * @example
  hideHomeButton().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const hideHomeButton = (str) => {
  return new Promise((resolve, reject) => {
    uni.hideHomeButton({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('hideHomeButton 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { hideHomeButton }
