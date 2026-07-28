import { getIsDev } from '@/utils/get'

/**
 * 退出当前小程序。必须有点击行为才能调用成功。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.exitMiniProgram.html | 微信小程序官方文档}
 * @returns { Promise<any> }
 * @example
 * exitMiniProgram().then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *  // 接口调用失败
 * }).finally((res) => {
 *  // 接口调用完成
 * })
 */
const exitMiniProgram = () => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()

  // #ifdef MP-ALIPAY
  // #endif

  return new Promise((resolve, reject) => {
    uni.exitMiniProgram({
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              exitMiniProgram 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}

export { exitMiniProgram }
