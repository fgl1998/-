/**
 * 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容。除非用户主动删除或因存储空间原因被系统清理，否则数据都一直可用。单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB。
 * @param {string} key 本地缓存中的指定的 key
 * @param {any} data 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/storage/storage?id=setstorage
 * 
 * @returns { Promise }
 * @example
  setStorage('test', 'aaa').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const setStorage = (key, data) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key,
      data,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if(isDev) {
          console.log('setStorage 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { setStorage }
