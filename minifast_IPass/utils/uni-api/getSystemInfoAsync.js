import { getIsDev } from '@/utils/get'

/**
 * @typedef {Object} SuccessRes 调用接口成功返回的信息
 * @property {string} deviceId - 设备 id 。由 uni-app 框架生成并存储，清空 Storage 会导致改变
 * @property {string} deviceType - 设备类型。如phone、pad、pc、unknow
 * @property {string} deviceBrand - 设备品牌。如：apple、huawei
 * @property {string} deviceModel - 设备型号
 * @property {string} deviceOrientation - 设备方向
 * @property {number} devicePixelRatio - 设备像素比
 * @property {string} osName - 系统名称
 * @property {string} osVersion - 操作系统版本。如 ios 版本，android 版本
 * @property {string} osLanguage - 操作系统语言详见
 * @property {string} osTheme - 操作系统主题
 * @property {string} osAndroidAPILevel - Android 系统API库的版本。
 * @property {string} romName - rom 名称。MIUI 小米、EMUI	华为、HarmonyOS	华为鸿蒙、Magic OS	荣耀、ColorOS	oppo、Funtouch OS	vivo、FLymeOS	魅族、SmartisanOS	锤子
 * @property {string} romVersion - rom 版本
 * @property {string} browserName - 浏览器名称或App的webview名称
 * @property {string} browserVersion - 浏览器版本、webview 版本
 * @property {string} hostName - 小程序宿主或uniMPSDK的集成宿主名称，如：WeChat、FeiShu
 * @property {string} hostVersion - 宿主版本。如：微信版本号
 * @property {string} hostLanguage - 宿主语言
 * @property {string} hostTheme - 宿主主题
 * @property {number} hostFontSizeSetting - 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
 * @property {string} hostPackageName - 小程序宿主包名
 * @property {string} hostSDKVersion - uni小程序SDK版本、小程序客户端基础库版本
 * @property {string} uniPlatform - uni-app 运行平台，与条件编译平台相同。app	App、web	Web、mp-weixin	微信小程序
 * @property {string} uniCompileVersion - uni 编译器版本号。
 * @property {string} uniRuntimeVersion - uni 运行时版本
 * @property {string} appId - appId	manifest 中应用appid，即DCloud appid。
 * @property {string} appName - manifest 中应用名称
 * @property {string} appVersion - manifest 中应用版本名称。
 * @property {string} appVersionCode - manifest 中应用版本名号。
 * @property {string} appWgtVersion - 应用资源（wgt）的版本名称。
 * @property {string} appLanguage - 应用设置的语言
 * @property {string} ua - userAgent标识
 * @property {number} screenWidth - 屏幕宽度，单位px
 * @property {number} screenHeight - 屏幕高度，单位px
 * @property {number} windowWidth - 可使用窗口宽度，单位px
 * @property {number} windowHeight - 可使用窗口高度，单位px
 * @property {number} windowTop - 可使用窗口的顶部位置，单位px
 * @property {number} windowBottom - 可使用窗口的底部位置，单位px
 * @property {number} statusBarHeight - 手机状态栏的高度，单位px
 * @property {object} safeArea - 在竖屏正方向下的安全区域。由于此属性理解和使用比较困难，更推荐使用 safeAreaInsets 属性。
 * @property {number} safeArea.left -全区域左上角横坐标，单位px
 * @property {number} safeArea.right - 安全区域右下角横坐标，单位px
 * @property {number} safeArea.top - 安全区域左上角纵坐标，单位px
 * @property {number} safeArea.bottom - 安全区域右下角纵坐标，单位px
 * @property {number} safeArea.width - 安全区域的宽度，单位逻辑像素
 * @property {number} safeArea.height - 安全区域的高度，单位逻辑像素
 * @property {object} safeAreaInsets - 在竖屏正方向下的安全区域插入位置。与小程序定义的 safeArea 用途相同，但是规范参考 iOS 平台的 safeAreaInsets 更利于理解和使用。
 * @property {number} safeAreaInsets.left - 安全区域左侧插入位置，单位px
 * @property {number} safeAreaInsets.right - 安全区域右侧插入位置，单位px
 * @property {number} safeAreaInsets.top - 安全区顶部插入位置，单位px
 * @property {number} safeAreaInsets.bottom - 安全区域底部插入位置，单位px
 * @property {number} benchmarkLevel - 设备性能等级（仅 Android）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好）。注意：性能等级当前仅反馈真机机型，暂不支持 IDE 模拟器机型。微信小程序Android版、QQ小程序Android版。
 * @property {number} batteryLevel - 剩余电量百分比（仅 iOS 有效）。微信小程序。
 * @property {number} currentBattery - 当前电量百分比。支付宝小程序。
 * @property {number} navigationBarHeight - 导航栏的高度。百度小程序。
 * @property {number} titleBarHeight - 标题栏高度。支付宝小程序。
 * @property {boolean} albumAuthorized - 允许微信使用相册的开关（仅 iOS 有效）。微信小程序。
 * @property {boolean} cameraAuthorized - 允许微信使用摄像头的开关。微信小程序。
 * @property {boolean} locationAuthorized - 允许微信使用定位的开关。微信小程序。
 * @property {boolean} microphoneAuthorized - 允许微信使用麦克风的开关。微信小程序。
 * @property {boolean} notificationAuthorized - 允许微信通知的开关。微信小程序。
 * @property {boolean} notificationAlertAuthorized - 允许微信通知带有提醒的开关（仅 iOS 有效）。微信小程序。
 * @property {boolean} notificationBadgeAuthorized - 允许微信通知带有标记的开关（仅 iOS 有效）。微信小程序。
 * @property {boolean} notificationSoundAuthorized - 允许微信通知带有声音的开关（仅 iOS 有效）。微信小程序。
 * @property {boolean} bluetoothEnabled - 蓝牙的系统开关。微信小程序。
 * @property {boolean} locationEnabled - 地理位置的系统开关。微信小程序。
 * @property {boolean} wifiEnabled - Wi-Fi 的系统开关。微信小程序。
 * @property {string} cacheLocation -上一次缓存的位置信息。百度小程序(安卓端最低基础库版本 3.40.4 ；iOS 最低支持版本 3.70.2)
 * @property {number} storage - 设备磁盘容量。支付宝小程序
 */

/**
 * 异步获取系统信息。需要一定的微信客户端版本支持，在不支持的客户端上，会使用同步实现来返回。
 * @see {@link https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemInfoAsync.html | 微信小程序官方文档}
 * @returns { Promise<SuccessRes> }
 * @example
 * getSystemInfo().then(res => {
 *   // 接口调用成功
 * }).catch(err => {
 *  // 接口调用失败
 *}).finally((res) => {
 *  // 接口调用完成
 * })
 */
const getSystemInfoAsync = () => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()

  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.getSystemInfoAsync({
      success(res) {
        resolve(res)
      },
      fail(err) {
        if (isDev) {
          console.error(
            new Error(`
            getSystemInfoAsync 接口调用失败
              错误信息：${JSON.stringify(err)}
            `)
          )
        }
        reject(err)
      }
    })
  })
}
export { getSystemInfoAsync }
