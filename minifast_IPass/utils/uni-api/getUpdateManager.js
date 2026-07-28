/**
 * @typedef {Object} UpdateManager 更新管理器对象
 * @property {function} applyUpdate - 强制小程序重启并使用新版本。在小程序新版本下载完成后（即收到 onUpdateReady 回调）调用。
 * @property {function} onCheckForUpdate - 监听向微信后台请求检查更新结果事件。微信在小程序每次启动（包括热启动）时自动检查更新，不需由开发者主动触发。
 * @property {function} onUpdateFailed - 监听小程序更新失败事件。小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
 * @property {function} onUpdateReady - 监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
 */

/**
 * 本API返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/base/update/wx.getUpdateManager.html | 微信小程序官方文档}
 * @see {@link https://uniapp.dcloud.io/api/other/update?id=getupdatemanager | uni-app官方文档}
 * @support
 * @returns {UpdateManager}
 * @example
 * const updateManager = uni.getUpdateManager();
 * updateManager.onCheckForUpdate(function (res) {
 *  // 请求完新版本信息的回调
 *  console.log(res.hasUpdate);
 * });
 * updateManager.onUpdateReady(function (res) {
 *  uni.showModal({
 *    title: '更新提示',
 *    content: '新版本已经准备好，是否重启应用？',
 *    success(res) {
 *      if (res.confirm) {
 *        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
 *       updateManager.applyUpdate();
 *      }
 *    }
 *  });
 * });
 * updateManager.onUpdateFailed(function (res) {
 *  // 新的版本下载失败
 * });
 */
const getUpdateManager = () => {
  return uni.getUpdateManager()
}
export { getUpdateManager }
