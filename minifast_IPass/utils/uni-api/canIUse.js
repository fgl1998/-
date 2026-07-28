/**
 * 判断应用的 API，回调，参数，组件等是否在当前版本可用。
 * @param {string} str 使用 ${API}.${method}.${param}.${options} 或者 ${component}.${attribute}.${option} 方式来调用
 *
 * ${API} 代表 API 名字
 *
 * ${method} 代表调用方式，有效值为return, success, object, callback
 *
 * ${param} 代表参数或者返回值
 *
 * ${options} 代表参数的可选值
 *
 * ${component} 代表组件名字
 *
 * ${attribute} 代表组件属性
 *
 * ${option} 代表组件属性的可选值
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html | 微信小程序官方文档}
 * @tips 基础库 1.1.1 开始支持,低版本需做 {@link https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html | 兼容处理}
 * @see {@link https://uniapp.dcloud.net.cn/api/caniuse.html | uni-app官方文档}
 * @tips App、web 端暂不支持 ${API}.${method}.${param}.${options} 方式调用，只支持 ${API}
 * @returns {boolean} 当前版本是否可用
 * @example
 * // 对象的属性或方法
 * canIUse('console.log')
 * canIUse('CameraContext.onCameraFrame')
 * canIUse('CameraFrameListener.start')
 * canIUse('Image.src')
 *
 * // wx接口参数、回调或者返回值
 * canIUse('openBluetoothAdapter')
 * canIUse('getSystemInfoSync.return.safeArea.left')
 * canIUse('getSystemInfo.success.screenWidth')
 * canIUse('showToast.object.image')
 * canIUse('onCompassChange.callback.direction')
 * canIUse('request.object.method.GET')
 *
 * // 组件的属性
 * canIUse('live-player')
 * canIUse('text.selectable')
 * canIUse('button.open-type.contact')
 */
const canIUse = (str) => {
  return uni.canIUse(str)
}
export { canIUse }
