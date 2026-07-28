/**
 * 隐藏消息提示框
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.hideToast.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=hidetoast

 * @returns {Promise}
 *
 * @example
  hideToast().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const hideToast = () => {
  return new Promise((resolve, reject) => {
    uni.hideToast({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('hideToast 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { hideToast }
