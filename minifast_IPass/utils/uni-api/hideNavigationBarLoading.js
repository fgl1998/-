/**
 * 在当前页面隐藏导航条加载动画
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideNavigationBarLoading.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/navigationbar?id=hidenavigationbarloading
 * 
 * 不支持 app 和 字节跳动小程序 App平台调用此API时会关闭屏幕中间悬浮显示的loading
 * 
 * @returns {Promise}
 *
 * @example
  hideNavigationBarLoading().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const hideNavigationBarLoading = (str) => {
  return new Promise((resolve, reject) => {
    uni.hideNavigationBarLoading({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('hideNavigationBarLoading 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { hideNavigationBarLoading }
