import { showModal } from './index'
/**
 * 保留当前页面，跳转到应用内的某个页面，使用 uni.navigateBack 可以返回到原页面。
 * @param {string} name 跳转的页面名称 例如：'address'
 * @param {string} packageName 跳转的页面分包名称 例如：'packageA'
 * @param {object | string} params 路由参数 例如：{a: 1} 或者 'a=1&b=2'
 * @param {object} events 页面间通信接口，用于监听被打开页面发送到当前页面的数据。2.8.9+ 开始支持。
 * @param {string} animationType [pop-out] 窗口显示的动画效果。仅 APP 支持。
 * @param {number} animationDuration [300] 窗口动画持续时间，单位为 ms。仅 APP 支持。
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/router?id=navigateto
 * 
 * @returns { Promise }
 * @example
  navigateTo('home').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const navigateTo = (
  name,
  packageName = '',
  params = {},
  events = {},
  animationType = 'pop-in',
  animationDuration = 300
) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    let url = '' // 跳转的路径
    let paramStr = '' // 参数字符串拼接
    // 必需传入 name 参数
    if (name) {
      url = `/pages/${name}/${name}`

      // 存在包名
      if (packageName) {
        url = `/pages/${packageName}/${name}/${name}`
      }
      // 存在参数
      if (params) {
        // 对象 Object
        if (Object.prototype.toString.call(params) === '[object Object]') {
          for (const item in params) {
            let value = params[item]
            if (value) {
              if (Object.prototype.toString.call(value) === '[object Object]') {
                value = JSON.stringify(value)
              }
              paramStr += `${item}=${value}&`
            }
          }
        }
        // 字符串 String
        if (Object.prototype.toString.call(params) === '[object String]') {
          paramStr = params
        }
        // 有参数传入才加入
        if (paramStr) {
          url = `${url}?${paramStr}`
        }
      }

      uni.navigateTo({
        url,
        events,
        animationType,
        animationDuration,
        success(res) {
          resolve(res)
        },
        fail(err) {
          if (isDev) {
            console.log(`navigateTo 接口调用失败！跳转路径：${url}`, err)
          }
          reject(err)
        },
      })
    } else {
      const errMsg = 'navigateTo 方法传入的第一个参数 name 不能为空，请检查！'
      showModal(errMsg).finally(() => {
        reject(errMsg)
      })
    }
  })
}

export { navigateTo }
