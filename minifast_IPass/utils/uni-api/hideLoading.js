/**
 * 隐藏 loading 提示框
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideLoading.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=hideloading

 * @returns {Promise}
 *
 * @example
  hideLoading().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const hideLoading = () => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  // console.log('==========hideLoading===============');
  return new Promise((resolve, reject) => {
    uni.hideLoading({
      success(res) {
        resolve(res)
      },
      fail(err) {
        if(isDev) {
          console.log('hideLoading 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { hideLoading }
