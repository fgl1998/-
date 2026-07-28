/**
 * 从本地缓存中同步获取指定 key 对应的内容。
 * @param {string} key 本地缓存中的指定的 key
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.getStorage.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/storage/storage?id=getstorage
 * 
 * @returns { Promise }
 * @example
  getStorageSync('test')
*/
const getStorageSync = (key) => {
  return uni.getStorageSync(key)
}
export { getStorageSync }
