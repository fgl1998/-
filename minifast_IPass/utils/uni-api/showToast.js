/**
 * 显示消息提示框
 * @param {string} title 提示的内容，在有icon图标时最多显示7个字符
 * @param {string} icon 图标，目前支持：success、loading、none（默认值）、error、warn（自定义新增）
 * @param {boolean} mask 是否显示透明蒙层，防止触摸穿透 默认 true
 * @param {number} duration 提示的延迟时间，默认值 1500ms
 * @param {string} position 纯文本轻提示显示位置，填写有效值后只有 title 属性生效， 有效值详见下方说明。仅 APP 支持
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=showtoast
 * 
 * @returns { Promise }
 * @example
  showToast('我是轻提示', 'success').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const showToast = (
  title,
  icon = 'none',
  mask = true,
  duration = 1500,
  position = 'center'
) => {
  return new Promise((resolve, reject) => {
    // 自定义图标的本地路径，image 的优先级高于 icon
    let image = ''
    // 成功的图标
    if (icon === 'success') {
      image = '/static/images/showToast/success.png'
    }
    // 加载中的图标 未找到动态的loading图 暂用系统loading
    if (icon === 'loading') {
      // image = ''
    }
    // 警告的图标
    if (icon === 'warn') {
      image = '/static/images/showToast/warn.png'
    }
    // 错误的图标
    if (icon === 'error') {
      image = '/static/images/showToast/error.png'
    }
    uni.showToast({
      title,
      image,
      icon,
      duration,
      mask,
      position,
      success(res) {
        resolve(res)
      },
      fail(err) {
        console.log('showToast 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}

export { showToast }
