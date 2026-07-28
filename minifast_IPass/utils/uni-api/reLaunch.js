import { showModal } from './showModal'
/**
 * 关闭所有页面，打开到应用内的某个页面。如果跳转的页面路径是 tabBar 页面则不能带参数
 * 
 * 注意： 如果调用了 uni.preloadPage(OBJECT) 不会关闭，仅触发生命周期 onHide
 * 
 * @param {string} name 跳转的页面名称 例如：'address'
 * @param {string} packageName 跳转的页面分包名称 例如：'packageA'
 * @param {object | string} params 路由参数 例如：{a: 1} 或者 'a=1&b=2'
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
 * 
 * 基础库 1.1.0 开始支持，低版本需做兼容处理。
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/router?id=relaunch
 * 
 * @returns { Promise }
 * @example
  reLaunch('home').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const reLaunch = (name, packageName = '', params = null) => {
  let url = '' // 跳转的路径
  let paramStr = '' // 参数字符串拼接
  return new Promise((resolve, reject) => {
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
            const value = params[item]
            if (value) {
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

      uni.reLaunch({
        url,
        success(res) {
          resolve(res)
        },
        fail(err) {
          console.log(
            `
              reLaunch 接口调用失败
              跳转路径：${url}
            `,
            err
          )
          reject(err)
        },
      })
    } else {
      const errMsg = 'reLaunch 方法传入的第一个参数 name 不能为空，请检查！'
      showModal(errMsg).finally(() => {
        reject(errMsg)
      })
    }
  })
}

export { reLaunch }
