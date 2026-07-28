/**
 * 清理本地数据缓存。
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.clearStorage.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/storage/storage?id=clearstorage
 * 
 * @returns { Promise }
 * @example
  clearStorage().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const clearStorage = () => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.clearStorage({
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.log('clearStorage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { clearStorage }
