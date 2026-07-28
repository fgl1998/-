/**
 * 使用微信内置地图查看位置
 * @param {number} latitude 纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
 * @param {number} longitude 经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
 * @param {string} name 位置名
 * @param {string} address 地址的详细说明
 * @param {number} scale 缩放比例
 * 
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.openLocation.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/location/open-location?id=openlocation
 * @returns {Promise}
 *
 * @example
  openLocation().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const openLocation = (latitude, longitude, name, address, scale = 18) => {
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.openLocation({
      latitude,
      longitude,
      name,
      address,
      scale,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.error('openLocation 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { openLocation }
