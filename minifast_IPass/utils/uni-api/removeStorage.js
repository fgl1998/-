/**
 * 从本地缓存中异步移除指定 key。
 * @param {string} key 本地缓存中的指定的 key
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.removeStorage.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/storage/storage?id=removestorage
 * 
 * @returns { Promise }
 * @example
  removeStorage('test').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const removeStorage = (key) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.removeStorage({
      key,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.log('removeStorage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { removeStorage }
