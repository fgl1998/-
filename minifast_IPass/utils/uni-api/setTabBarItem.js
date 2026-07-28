/**
 * 动态设置 tabBar 某一项的内容。2.7.0 起图片支持临时文件和网络文件。字节跳动小程序	不支持
 * @param {number} index tabBar 的哪一项。从左边0算起
 * @param {string} text tab 上的按钮文字。
 * @param {string} iconPath 图片路径。icon 大小限制为 40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效
 * @param {string} selectedIconPath 选中时的图片路径。icon 大小限制为 40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
 * @param {string} pagePath 页面绝对路径。必须在 pages 中先定义，被替换掉的 pagePath 不会变成普通页面（仍然需要使用 uni.swichTab 跳转）App（2.8.4+）、H5（2.8.4+）支持
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/tab-bar/wx.setTabBarItem.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/tabbar?id=settabbaritem
 * 
 * @returns { Promise }
 * @example
  setTabBarItem(0,'test','static/images/tabbar/home_green.png','static/images/tabbar/home_green_active.png').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const setTabBarItem = (index, text, iconPath, selectedIconPath, pagePath) => {
  return new Promise((resolve, reject) => {
    uni.setTabBarItem({
      index,
      text,
      iconPath,
      selectedIconPath,
      pagePath,
      success(res) {
        resolve(res)
      },
      fail(err) {
        // console.log('setTabBarItem 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}
export { setTabBarItem }
