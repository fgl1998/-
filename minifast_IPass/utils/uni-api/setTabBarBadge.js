/**
 * 为 tabBar 某一项的右上角添加文本
 * @param {number} index tabBar 的哪一项，从左边算起
 * @param {string} text 显示的文本，超过 4 个字符则显示成 ...
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarBadge.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  setTabBarBadge(1,'2').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const setTabBarBadge = (index, text) => {
  return new Promise((resolve, reject) => {
    uni.setTabBarBadge({
      index,
      text,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('setTabBarBadge 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { setTabBarBadge }
