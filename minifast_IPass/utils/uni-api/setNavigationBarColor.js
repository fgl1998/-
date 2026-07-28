/**
 * 设置页面导航条颜色。如果需要进入页面就设置颜色，请延迟执行，防止被框架内设置颜色逻辑覆盖
 * @param {string} backgroundColor 背景颜色值，有效值为十六进制颜色
 * @param {string} frontColor 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000。App、H5、微信小程序、百度小程序
 * @param {object} animation 动画效果，{duration,timingFunc} 微信小程序、百度小程序
 *    @duration {number}  动画变化时间，单位 ms。默认 0
 *    @timingFunc {string} 动画变化方式 linear（默认）、easeIn、easeOut、easeInOut
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.setNavigationBarColor.html
 * 
 * 基础库 1.4.0 开始支持，低版本需做兼容处理
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/navigationbar?id=setnavigationbarcolor
 * @returns {Promise}
 *
 * @example
  setNavigationBarColor('#f0f034').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const setNavigationBarColor = (
  backgroundColor,
  frontColor = '#ffffff',
  animation = {
    duration: 0,
    timingFunc: 'linear',
  }
) => {
  return new Promise((resolve, reject) => {
    uni.setNavigationBarColor({
      frontColor,
      backgroundColor,
      animation,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('setNavigationBarColor 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { setNavigationBarColor }
