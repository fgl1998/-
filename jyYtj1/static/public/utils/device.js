export const verifyDevice = (_this) => {
  const pages = getCurrentPages()
  if (pages && pages[pages.length - 1].route === 'pages/staticPage/staticPage') {
    const deviceInfo_5 = uni.getStorageSync('deviceInfo_5')
    console.log(deviceInfo_5)
    const { ace711, ace772 } = deviceInfo_5 || {}
    if (ace711 && ace772) {
      let param = {
        ace711: ace711,
        ace772: ace772,
        ace769: '4',
        apiCode: 'jy204_hrm259',
        method: 'jy204_hrm259',
      }
      _this.$utils.request(null, param, false, true, null).then((res) => {
        if (res.result.code === '-1001') {
          uni.removeStorageSync('deviceInfo_5')
          uni.setStorageSync('reLanch_times', 1)
          _this.$utils.redirectTo('/pages/staticPage/staticPage')
        }
      })
    }
    if (deviceInfo_5 && deviceInfo_5.ace711 && deviceInfo_5.ace772) {
      uni.setStorageSync('reLanch_times', 0)
    } else {
      const reLanch_times = uni.getStorageSync('reLanch_times') || 0
      console.log(reLanch_times, 'reLanch_times')

      if (reLanch_times <= 0) {
        _this.$utils.showModal('提示', '设备注册已失效，请重新注册！', false, (succ) => {})
        uni.removeStorageSync('deviceInfo_5')
        _this.$utils.redirectTo('/pages/staticPage/staticPage')
        uni.setStorageSync('reLanch_times', 1)
      }
    }
  }
}
