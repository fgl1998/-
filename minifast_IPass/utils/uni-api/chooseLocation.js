/**
 * 打开地图选择位置
 * @param {String} latitude 目标地纬度，仅微信小程序2.9.0+支持
 * @param {String} longitude 目标地经度，仅微信小程序2.9.0+支持
 * @param {String} keyword 搜索关键字，仅App平台支持
 * @returns {promise}
 */
const chooseLocation = (latitude, longitude, keyword) => {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      latitude,
      longitude,
      keyword,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

export { chooseLocation }
