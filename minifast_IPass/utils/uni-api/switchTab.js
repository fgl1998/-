import { showModal } from './showModal'

/**
 * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
 * 
 * 路径后不能带参数
 * 
 * 注意： 如果调用了 uni.preloadPage(OBJECT) 不会关闭，仅触发生命周期 onHide
 * 
 * @param {string} name 跳转的tabBar页面名称 例如：'home'
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
 * 
 * 本接口从基础库版本 2.3.1 起支持在小程序插件中使用
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/router?id=switchtab
 * 
 * @returns { Promise }
 * @example
  switchTab('home').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const switchTab = (name) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    let url = ''
    if (!name) {
      const errMsg = 'switchTab 方法传入的第一个参数 name 不能为空，请检查！'
      showModal(errMsg).finally(() => {
        reject(errMsg)
      })
    } else {
      url = `/pages/tabbar/${name}/${name}`
      uni.switchTab({
        url,
        success (res) {
          resolve(res)
        },
        fail (err) {
          if (isDev) {
            console.log(
              `
                switchTab 接口调用失败
                跳转路径：${url}
              `,
              err
            )
          }

          reject(err)
        },
      })
    }
  })
}

export { switchTab }
