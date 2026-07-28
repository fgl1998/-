/**
 * 移除 tabBar 某一项右上角的文本
 * @param {number} index tabBar 的哪一项，从左边算起
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.removeTabBarBadge.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  removeTabBarBadge(1).then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const removeTabBarBadge = (index) => {
  return new Promise((resolve, reject) => {
    uni.removeTabBarBadge({
      index,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('removeTabBarBadge 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { removeTabBarBadge }
