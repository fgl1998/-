/**
 * 从本地缓存中异步获取指定 key 对应的内容。
 * @param {string} key 本地缓存中的指定的 key
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/storage/storage?id=getstorage
 * 
 * @returns { Promise }
 * @example
  getStorage('test').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const getStorage = (key) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key,
      success(res) {
        let data = res.data
        if (typeof data === 'object') {
          data = JSON.parse(data)
        }
        resolve(data)
      },
      fail(err) {
        // 没有找到指定的key的缓存数据 也会显示接口调用失败
        if (isDev) {
          console.log('getStorage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { getStorage }
