import { getIsDev } from '@/utils/get'

/**
 * @typedef {Object} ImageInfo 图片信息
 * @property {number} width - 图片原始宽度，单位px。不考虑旋转。
 * @property {number} height - 图片原始高度，单位px。不考虑旋转。
 * @property {string} path - 返回图片的本地路径
 * @property {string} orientation - 返回图片的方向。up 默认、down 180度旋转、left 逆时针旋转90度、right 顺时针旋转90度、up-mirrored	同up，但水平翻转、down-mirrored	同down，但水平翻转、left-mirrored	同left，但垂直翻转、right-mirrored	同right，但垂直翻转
 * @property {string} type - 返回图片的格式。unknown 未知格式、jpeg jpeg压缩格式、png	png压缩格式、gif gif压缩格式、tiff tiff压缩格式
 */

/**
 * 获取图片信息。小程序下获取网络图片信息需先配置download域名白名单才能生效。
 * @param {string} src 图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.getImageInfo.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.io/api/media/image?id=getimageinfo | uni-app官方文档}
 * @returns {Promise<ImageInfo>}
 * @example
 * getImageInfo('https://www.gahrss.cn/static/images/packageScan/annual-account/icon-sponor-511600-03.png').then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *   // 接口调用失败
 * }).finally((res) => {
 *   // 接口调用完成
 * })
 */
const getImageInfo = (src) => {
  return new Promise((resolve, reject) => {
    // 当前环境是否为开发环境
    const isDev = getIsDev()

    // #ifdef MP-ALIPAY
    // #endif
    uni.getImageInfo({
      src,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              getImageInfo 接口调用失败，图片地址： ${src}
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}

export { getImageInfo }
