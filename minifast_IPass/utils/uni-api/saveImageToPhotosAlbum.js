import { getIsDev } from '@/utils/get'

/**
 * @typedef {Object} SuccessRes 调用接口成功返回的信息
 * @property {string} path - 保存到相册的图片路径，仅 App 3.0.5+ 支持
 * @property {string} errMsg -调用结果
 */

/**
 * 保存图片到系统相册
 * @param {string} filePath 图片文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/media/image.html#saveimagetophotosalbum | uni-app官方文档}
 * @returns {Promise<SuccessRes>}
 * @example
 * saveImageToPhotosAlbum('http://xxxx.png').then(res => {
 *  // 接口调用成功
 * }).catch(err => {
 *  // 接口调用失败
 * }).finally((res) => {
 *  // 接口调用完成
 * })
 */
const saveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    // 当前环境是否为开发环境
    const isDev = getIsDev()

    // #ifdef MP-ALIPAY
    // #endif
    uni.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              saveImageToPhotosAlbum 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { saveImageToPhotosAlbum }
