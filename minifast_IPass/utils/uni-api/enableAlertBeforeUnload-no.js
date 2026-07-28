/**
 * 开启小程序页面返回询问对话框，只有点击返回按钮才有效果
 * @param {string} message 询问对话框内容
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.enableAlertBeforeUnload.html
 * 
 * 基础库 2.12.0 开始支持，低版本需做兼容处理
 * 
 * uniapp支持情况说明：暂无

 * @returns {Promise}
 *
 * @example
  enableAlertBeforeUnload('您确定要离开此页面吗？').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const enableAlertBeforeUnload = (message) => {
  return new Promise((resolve, reject) => {
    uni.enableAlertBeforeUnload({
      message,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('enableAlertBeforeUnload 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { enableAlertBeforeUnload }
