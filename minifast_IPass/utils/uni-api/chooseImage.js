/**
 * 从本地相册选择图片或使用相机拍照
 * @param {number} count 最多可以选择的图片张数 默认 9
 * @param {Array.<string>} sizeType 所选的图片的尺寸 默认 ['original', 'compressed']
 * @param {Array.<string>} sourceType 选择图片的来源 默认 ['album', 'camera']
 * @returns {promise}
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.chooseImage.html
 *
 * uniapp支持情况说明：https://uniapp.dcloud.io
 * 
 * @returns {Promise}
 *
 * @example
  chooseImage().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const chooseImage = (
  count = 9,
  sizeType = ['original', 'compressed'],
  sourceType = ['album', 'camera']
) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count,
      sizeType,
      sourceType,
      success (res) {
        resolve(res)
      },
      fail (err) {
        if (isDev) {
          console.log('chooseImage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}

export { chooseImage }
