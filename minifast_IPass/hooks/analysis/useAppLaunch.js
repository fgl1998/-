import store from '@/store'
import config from '@/config'
import { M_UPDATE_USER_BEHAVIOR_DATA } from '@/store/constants'
import { getSystemInfoSync } from '@/utils/uni-api'
import { requestWXInsertUserVist } from '@/service/api'

// #ifdef MP-WEIXIN
import aMapWxJssdk from '@/utils/map/amap-wx.js'
// #endif

const { isOpenUserBehaviorCollection } = config

/**
 *
 * https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html
 */
const getSceneDesc = (scene) => {
  let str = ''
  switch (scene) {
    case 1000:
      str = '其他'
      break
    case 1001:
      str =
        '发现页小程序「最近使用」列表（基础库2.2.4-2.29.0版本包含「我的小程序」列表，2.29.1版本起仅为「最近使用」列表）'
      break
    case 1005:
      str = '微信首页顶部搜索框的搜索结果页'
      break
    case 1006:
      str = '发现栏小程序主入口搜索框的搜索结果页'
      break
    case 1007:
      str = '单人聊天会话中的小程序消息卡片'
      break
    case 1008:
      str = '群聊会话中的小程序消息卡片'
      break
    case 1010:
      str = '收藏夹'
      break
    case 1011:
      str = '扫描二维码'
      break
    case 1012:
      str = '长按图片识别二维码'
      break
    case 1013:
      str = '扫描手机相册中选取的二维码'
      break
    case 1014:
      str = '小程序订阅消息（与1107相同）'
      break
    case 1017:
      str = '前往小程序体验版的入口页'
      break
    case 1019:
      str = '微信钱包（微信客户端7.0.0版本改为支付入口）'
      break
    case 1020:
      str = '公众号 profile 页相关小程序列表（已废弃）'
      break
    case 1022:
      str = '聊天顶部置顶小程序入口（微信客户端6.6.1版本起废弃）'
      break
    case 1023:
      str = '安卓系统桌面图标'
      break
    case 1024:
      str = '小程序 profile 页'
      break
    case 1025:
      str = '扫描一维码'
      break
    case 1026:
      str = '发现栏小程序主入口，「附近的小程序」列表'
      break
    case 1027:
      str = '微信首页顶部搜索框搜索结果页「使用过的小程序」列表'
      break
    case 1028:
      str = '我的卡包'
      break
    case 1029:
      str = '小程序中的卡券详情页'
      break
    case 1030:
      str = '自动化测试下打开小程序'
      break
    case 1031:
      str = '长按图片识别一维码'
      break
    case 1032:
      str = '扫描手机相册中选取的一维码'
      break
    case 1034:
      str = '微信支付完成页'
      break
    case 1035:
      str = '公众号自定义菜单'
      break
    case 1036:
      str = 'App 分享消息卡片'
      break
    case 1037:
      str = '小程序打开小程序'
      break
    case 1038:
      str = '从另一个小程序返回'
      break
    case 1039:
      str = '摇电视'
      break
    case 1042:
      str = '添加好友搜索框的搜索结果页'
      break
    case 1043:
      str = '公众号模板消息'
      break
    case 1044:
      str = '带shareTicket的小程序消息卡片'
      break
    case 1045:
      str = '朋友圈广告'
      break
    case 1046:
      str = '朋友圈广告详情页'
      break
    case 1047:
      str = '扫描小程序码'
      break
    case 1048:
      str = '长按图片识别小程序码'
      break
    case 1049:
      str = '扫描手机相册中选取的小程序码'
      break
    case 1052:
      str = '卡券的适用门店列表'
      break
    case 1053:
      str = '搜一搜的结果页'
      break
    case 1054:
      str = '顶部搜索框小程序快捷入口（微信客户端版本6.7.4起废弃）'
      break
    case 1056:
      str = '聊天顶部音乐播放器右上角菜单'
      break
    case 1058:
      str = '公众号文章'
      break
    case 1065:
      str = 'URL scheme'
      break
    case 1067:
      str = '公众号文章'
      break
    case 1069:
      str = '移动应用通过openSDK进入微信，打开小程序'
      break
    case 1073:
      str = '客服消息列表下发的小程序消息卡片'
      break
    case 1074:
      str = '公众号会话下发的小程序消息卡片'
      break
    case 1082:
      str = '公众号会话下发的文字链'
      break
    default:
      break
  }
  return str
}
/**
 * app 启动参数处理
 */
const useAppLaunch = (e) => {
  if (!isOpenUserBehaviorCollection) {
    return
  }

  // #ifdef MP-WEIXIN
  const aMap = new aMapWxJssdk.AMapWX({
    key: config.aMapKey,
  })
  // #endif
  // https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
  const {
    scene,
    apiCategory,
    mode,
    path,
    query,
    referrerInfo,
    shareTicket,
    forwardMaterials,
    chatType,
  } = e

  const systemInfo = getSystemInfoSync()

  const {
    appId, // manifest中应用appid
    appName, // manifest中应用名称
    appVersion, // manifest中应用版本名称
    appVersionCode, // manifest 中应用版本名号
    deviceId, // 设备 id 。由 uni-app 框架生成并存储，清空 Storage 会导致改变
    deviceBrand, // 设备品牌。如：apple、huawei
    deviceModel, // 设备型号
    deviceType, // 设备类型。如phone、pad、pc、unknow
    SDKVersion, // 客户端基础库版本
  } = systemInfo

  const basicData = {
    openId: store.state.userInfo.openid || '',
    scene: scene + '', // 场景值
    appId, // manifest中应用appid
    appName, // manifest中应用名称
    appVersion, // manifest中应用版本名称
    appVersionCode, // manifest 中应用版本名号
    deviceId, // 设备 id 。由 uni-app 框架生成并存储，清空 Storage 会导致改变
    deviceBrand, // 设备品牌。如：apple、huawei
    deviceModel, // 设备型号
    deviceType, // 设备类型。如phone、pad、pc、unknow
    SDKVersion,
  }
  const submitData = () => {
    store.commit(M_UPDATE_USER_BEHAVIOR_DATA, basicData)
    requestWXInsertUserVist({ ...basicData, ...basicData.addressInfo }, false, false).then(
      (res) => {
        const { data } = res
        store.commit(M_UPDATE_USER_BEHAVIOR_DATA, { id: data })
      }
    )
  }

  // #ifdef MP-WEIXIN
  aMap.getRegeo({
    success(res) {
      const { latitude, longitude, name, regeocodeData } = res[0]
      const { adcode, city, citycode, district, province, towncode, township } =
        regeocodeData.addressComponent
      basicData.addressInfo = {
        aac021: name, // 完整地址
        yab003: adcode ? adcode.substring(0, 2) + '0000' : '000000', // 省份
        yab003Desc: province,
        aab301: adcode ? adcode.substring(0, 4) + '00' : citycode, // 市州
        aab301Desc: city,
        chb015: adcode, // 区县
        chb015Desc: district,
        chb017: towncode, // 乡镇/街道
        chb017Desc: township,
        lng: longitude + '', // 经度
        lat: latitude + '', // 纬度
      }
      submitData()
    },
    fail(err) {
      console.error(JSON.stringify(err))
      submitData()
    },
  })
  // #endif
  // #ifdef H5
  submitData()
  // #endif
}

export { useAppLaunch }
