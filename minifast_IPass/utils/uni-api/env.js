/**
 * @typedef {Object} Obj 环境变量对象
 * @property {string} USER_DATA_PATH - 文件系统中的用户目录路径 (本地路径)
 */

/**
 * 环境变量
 * @readonly
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.env.html | 微信小程序官方文档}
 * @returns {Obj}
 * @example env()
 */
const env = () => {
  return wx.env
}

export { env }
