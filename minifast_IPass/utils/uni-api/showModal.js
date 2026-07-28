/**
 * 显示模态弹窗，类似于标准 html 的消息框：alert、confirm。
 * @param {string} content 提示的内容
 * @param {string} title 提示的标题，默认值“提示”
 * @param {boolean} showCancel 是否显示取消按钮，默认值“false”
 * @param {string} cancelText 取消按钮的文字，默认值“取消”
 * @param {string} cancelColor 取消按钮的文字颜色，默认值“#000000”
 * @param {string} confirmText 确定按钮的文字，默认值“确定”
 * @param {string} confirmColor 确定按钮的文字颜色，默认值“#576B95”
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/ui/prompt?id=showmodal
 * 
 * @returns { Promise }
 * @example
  showModal('提示内容').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const showModal = (
  content,
  title = '提示',
  showCancel = false,
  cancelText = '取消',
  cancelColor = '#000000',
  confirmText = '确定',
  confirmColor = '#576B95'
) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.showModal({
      title,
      content,
      showCancel,
      cancelText,
      cancelColor,
      confirmText,
      confirmColor,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          if (isDev) {
            console.log(`showModal 接口调用成功，您点击了${cancelText}按钮`)
          }
          reject(false)
        }
      },
      fail(err) {
        if (isDev) {
          console.log('showModal 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}

export { showModal }
