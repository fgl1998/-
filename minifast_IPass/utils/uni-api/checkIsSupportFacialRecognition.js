/**
 * 检查设备是否支持人脸检测
 * @param {string} checkAliveType 人脸核验的交互方式 2 人脸核验的交互方式
 * @returns {promise}
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/community/business/doc/000442d352c1202bd498ecb105c00d
 *
 * uniapp支持情况说明：https://uniapp.dcloud.io
 * 
 * @returns {Promise}
 *
 * @example
  checkIsSupportFacialRecognition().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const checkIsSupportFacialRecognition = (checkAliveType = '2') => {
  return new Promise((resolve, reject) => {
    uni.checkIsSupportFacialRecognition({
      checkAliveType,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.error('checkIsSupportFacialRecognition 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}

export { checkIsSupportFacialRecognition }
