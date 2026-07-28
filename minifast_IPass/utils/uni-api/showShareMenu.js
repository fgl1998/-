/**
 * 小程序的原生菜单中显示分享按钮
 * @param {boolean} [withShareTicket=false] 是否使用带 shareTicket 的转发详情
 * @param {string[]} [menus=['shareAppMessage', 'shareTimeline']] 本接口为 Beta 版本，暂只在 Android 平台支持。需要显示的转发按钮名称列表，默认['shareAppMessage']。按钮名称合法值包含 "shareAppMessage"、"shareTimeline" 两种
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.showNavigationBarLoading.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.net.cn/api/plugins/share.html#showsharemenu
 * 
 * @returns {Promise}
 *
 * @example
  showShareMenu().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const showShareMenu = (withShareTicket = false, menus = ['shareAppMessage', 'shareTimeline']) => {
  return new Promise((resolve, reject) => {
    uni.showShareMenu({
      withShareTicket,
      menus,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('showShareMenu 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { showShareMenu }
