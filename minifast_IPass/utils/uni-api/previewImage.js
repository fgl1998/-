/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 * @param {Array} urls 需要预览的图片链接列表。2.2.3 起支持云文件ID。
 * @param {String} current 当前显示图片的链接
 * @returns {promise}
 * @example
 */
const previewImage = (urls, current) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.previewImage({
      urls,
      current,
      success (res) {
        resolve(res)
      },
      fail (err) {
        if (isDev) {
          console.log('previewImage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}

export { previewImage }
