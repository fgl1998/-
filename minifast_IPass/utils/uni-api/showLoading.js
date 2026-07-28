/**
 * 显示 loading 提示框。需主动调用 uni.hideLoading 才能关闭提示框
 * @param {string} title 提示的内容，默认值 '加载中...'
 * @param {boolean} mask 是否显示透明蒙层，防止触摸穿透。默认值 true
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showLoading.html
 * 
 * 基础库 1.1.0 开始支持，低版本需做兼容处理。
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=showloading

 * @returns {Promise}
 *
 * @example
  showLoading().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const showLoading = (title = '加载中', mask = true) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title,
      mask,
      success (res) {
        resolve(res)
      },
      fail (err) {
        if (isDev) {
          console.log('showLoading 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { showLoading }
