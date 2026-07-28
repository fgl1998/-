/**
 * 在当前页面显示导航条加载动画
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.showNavigationBarLoading.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/navigationbar?id=shownavigationbarloading
 * 
 * 不支持 app 和 字节跳动小程序 App平台调用此API时会在屏幕中间悬浮显示loading
 * 
 * @returns {Promise}
 *
 * @example
  showNavigationBarLoading().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const showNavigationBarLoading = () => {
  return new Promise((resolve, reject) => {
    uni.showNavigationBarLoading({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('showNavigationBarLoading 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { showNavigationBarLoading }
