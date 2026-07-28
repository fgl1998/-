import { getIsDev } from '@/utils/get'
/**
 * @typedef {Object} SuccessRes 调用接口成功返回的信息
 * @property {string} tempFilePath - 生成文件的临时路径 (本地路径)
 */

/**
 * 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。在自定义组件下，第二个参数传入自定义组件实例，以操作组件内 <canvas> 组件。
 * @param {number} x 指定的画布区域的左上角横坐标。默认值： 0
 * @param {number} y 指定的画布区域的左上角纵坐标。默认值： 0
 * @param {number} width 指定的画布区域的宽度。默认值： canvas宽度-x
 * @param {number} height 指定的画布区域的高度。默认值： canvas高度-y
 * @param {number} destWidth 输出的图片的宽度。默认值： width * 屏幕像素密度
 * @param {number} destHeight 输出的图片的高度。默认值： height * 屏幕像素密度
 * @param {string} canvasId 画布标识，传入 canvas 组件的 canvas-id
 * @param {object} [canvas=null] 画布标识，传入 canvas 组件实例 （canvas type="2d" 时使用该属性）。默认值：null
 * @param {'jpg'|'png'} [fileType='jpg'] 目标文件的类型。默认值：jpg
 * @param {number} [quality=1] 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。默认值：1
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.net.cn/api/canvas/canvasToTempFilePath.html | uni-app官方文档}
 * @returns {Promise<SuccessRes>}
 * @example
 * canvasToTempFilePath().then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *   // 接口调用失败
 * }).finally((res) => {
 *   // 接口调用完成
 * })
 */
const canvasToTempFilePath = (
  x,
  y,
  width,
  height,
  destWidth,
  destHeight,
  canvasId,
  canvas = null,
  fileType = 'jpg',
  quality = 1
) => {
  return new Promise((resolve, reject) => {
    // 当前环境是否为开发环境
    const isDev = getIsDev()
    // #ifdef MP-ALIPAY
    // #endif
    uni.canvasToTempFilePath({
      x,
      y,
      width,
      height,
      destWidth,
      destHeight,
      canvasId,
      canvas,
      fileType,
      quality,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
              canvasToTempFilePath 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { canvasToTempFilePath }
