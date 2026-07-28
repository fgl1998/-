/**
 * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。开启高精度定位，接口耗时会增加，可指定 highAccuracyExpireTime 作为超时时间。地图相关使用的坐标格式应为 gcj02。
 * @param {string} type wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
 * @param {boolen} altitude 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
 * @param {boolen} isHighAccuracy 开启高精度定位
 * @param {number} highAccuracyExpireTime 高精度定位超时时间(ms)，指定时间内返回最高精度，该值3000ms以上高精度定位才有效果
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io

 * @returns {Promise}
 *
 * @example
  getLocation().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const getLocation = (
  type = 'wgs84',
  altitude = false,
  isHighAccuracy = false,
  highAccuracyExpireTime = 3000
) => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type,
      altitude,
      isHighAccuracy,
      highAccuracyExpireTime,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('getLocation 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { getLocation }
