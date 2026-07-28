import { getIsDev } from '@/utils/get'

/**
 * 重启当前小程序
 * @param {string} path 打开的页面路径，path 中 ? 后面的部分会成为 query
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/navigate/wx.restartMiniProgram.html | 微信小程序官方文档}
 * @returns {Promise<any>}
 * @example
 * restartMiniPrograms('').then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *   // 接口调用失败
 * }).finally((res) => {
 *   // 接口调用完成
 * })
 */
const restartMiniProgram = (path) => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()

  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.restartMiniProgram({
      path,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              restartMiniProgram 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}

export { restartMiniProgram }
