/**
 * 动态设置当前页面的标题
 * @param {string} title 页面标题
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarTitle.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbartitle
 * @returns {Promise}
 *
 * @example
  setNavigationBarTitle('测试标题').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const setNavigationBarTitle = (title) => {
  return new Promise((resolve, reject) => {
    uni.setNavigationBarTitle({
      title,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('setNavigationBarTitle 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { setNavigationBarTitle }
