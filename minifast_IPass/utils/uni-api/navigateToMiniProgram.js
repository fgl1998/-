import { getIsDev } from '@/utils/get'

/**
 * 打开另一个小程序
 * @param {string} appId 要打开的小程序 appId（百度小程序则填写App Key）
 * @param {string} [path=''] 打开的页面路径，如果为空则打开首页
 * @param {object} [extraData={}] 需要传递给目标小程序的数据，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到这份数据。
 * @param {string} [envVersion='release'] 要打开的小程序版本，有效值： develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.navigateToMiniProgram.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/other/open-miniprogram.html#navigatetominiprogram | uni-app官方文档}
 * @returns { Promise<any> }
 * @example
 * navigateToMiniProgram('wx7857fb8164d33dca').then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *  // 接口调用失败
 * }).finally((res) => {
 *  // 接口调用完成
 * })
 */
const navigateToMiniProgram = (appId, path = '', extraData = {}, envVersion = 'release') => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()

  // #ifdef MP-ALIPAY
  // #endif

  return new Promise((resolve, reject) => {
    if (!appId) {
      const errMsg = 'navigateToMiniProgram 方法传入的第一个参数 appId 不能为空，请检查！'
      console.error(new Error(errMsg))
      return
    }

    uni.navigateToMiniProgram({
      appId,
      path,
      extraData,
      envVersion,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              navigateToMiniProgram 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}

export { navigateToMiniProgram }
