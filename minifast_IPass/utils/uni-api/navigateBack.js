/**
 * 关闭当前页面，返回上一页面或多级页面。
 * 
 * 可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。
 * @param {number} delta [1] 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
 * @param {string} animationType [pop-out] 窗口显示的动画效果。仅 APP 支持。
 * @param {number} animationDuration [300] 窗口动画持续时间，单位为 ms。仅 APP 支持。
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/router?id=navigateback
 * 
 * @returns { Promise }
 * @example
  navigateBack().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const navigateBack = (
  delta = 1,
  animationType = 'pop-out',
  animationDuration = 300
) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta,
      animationType,
      animationDuration,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if(isDev) {
          console.log('navigateBack 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}

export { navigateBack }
