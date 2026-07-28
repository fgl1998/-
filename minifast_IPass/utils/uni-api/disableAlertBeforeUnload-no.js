/**
 * 关闭小程序页面返回询问对话框
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.disableAlertBeforeUnload.html
 * 
 * 基础库 2.12.0 开始支持，低版本需做兼容处理
 * 
 * uniapp支持情况说明：暂无

 * @returns {Promise}
 *
 * @example
  disableAlertBeforeUnload().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const disableAlertBeforeUnload = () => {
  return new Promise((resolve, reject) => {
    uni.disableAlertBeforeUnload({
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('disableAlertBeforeUnload 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { disableAlertBeforeUnload }
