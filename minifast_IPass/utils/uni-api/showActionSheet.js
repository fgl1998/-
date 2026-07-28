/**
 * 显示操作菜单
 * @param {string} alertText 警示文案，微信小程序支持。
 * @param {<String>} itemList 必填，按钮的文字数组，数组长度最大为 6，微信、百度、字节跳动小程序数组长度最大为6个
 * @param {string} itemColor 默认值“#000000”，按钮的文字颜色，App-iOS、字节跳动小程序不支持
 * @param {object} popover 没有该参数传递。大屏设备弹出原生选择按钮框的指示区域，默认居中显示。App-iPad（2.6.6+）、H5（2.9.2）
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showActionSheet.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=showactionsheet
 * @returns {Promise}
 * @example
  showActionSheet(['A', 'B', 'C']).then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const showActionSheet = (itemList, alertText = '', itemColor = '#000000') => {
  return new Promise((resolve, reject) => {
    uni.showActionSheet({
      itemList,
      alertText,
      itemColor,
      success(res) {
        resolve(res.tapIndex)
      },
      fail(err) {
        // console.log('showActionSheet 接口调用失败 => ', err) // 点击取消按钮也会触发
        reject(err)
      },
    })
  })
}
export { showActionSheet }
