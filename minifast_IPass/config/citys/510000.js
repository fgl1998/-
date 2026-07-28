/* 
  配置文件
  文件中保存的是一些常用配置 请谨慎更改 更改前请确认是否存在使用
*/
import { requestUrl } from '@/config/city'

const config510000 = {
  requestUrl, // api 请求地址
  areaCode: '511000', // 行政区域编码 内江 511000
  areaName_zh: '银海', // 行政区域中文名称/简称 银海
  declarePackageName: 'packageDeclare510500', // 补贴项目存放包名
  // 控制政策文件的请求地址 true 请求发放系统 false 请求审批审批
  isRequestYGFF: true,
  // 是否开启阳光发放请求 true 开启 兼容甘孜
  isOpenYGFF: false,
  // 是否开启个人补贴查询
  isOpenPersonQuery: true,
  // 是否开启村组补贴查询
  isOpenVillageQuery: true,
  // 是否开启学校补贴查询
  isOpenSchoolQuery: false,
  // 是否开启数据加密，配合后台使用 true 开启
  isOpenDataEncrypt: false,
  // 是否开启用户行为采集
  isOpenUserBehaviorCollection: true,
  // 是否开启token校验，配合后台使用 true 开启
  isOpenTokenVerify: false,
  //是否开启审批投诉反馈功能
  isOpenSPComplaintFeedback: false,
  // 配置分享内容
  configSharePages: {
    pageTabbarHome: {
      title: '银海一卡通', // 转发标题
      path: '/pages/tabbar/home/home?type=share', // 转发路径
      query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
      imageUrl: '', // 自定义图片路径
    },
    pageTabbarSunshineDeclare: {
      title: '银海一卡通，阳光申报',
      path: '/pages/tabbar/sunshine-declare/sunshine-declare?type=share',
      query: 'type=share',
      imageUrl: '',
    },
    pageTabbarSunshine: {
      title: '银海一卡通村村响，让补贴晒一晒',
      path: '/pages/tabbar/sunshine/sunshine?type=share',
      query: 'type=share',
      imageUrl: '',
    },
    pageTabbarMy: {
      title: '银海一卡通',
      path: '/pages/tabbar/my/my?type=share',
      query: 'type=share',
      imageUrl: '',
    },
  },
  // 配置各申报页面的申报配置
  configDeclarePages: {
    // isCloseAuth: 是否关闭对申报人进行生存认证 [true|false] 默认false
    // isFixedDeclareType: 是否固定申报类型 [true|false] 默认 false
    // isJumpDeclareTypeSelect: 是否跳过申报类型选择 isFixedDeclareType 为true时有效  [true|false] 默认 false
    // fixedDeclareType: 固定的申报类型 isFixedDeclareType 为true时有效 01 自主申报 02 代为申报
    // unableDeclareTip: 自定义无法申报提示
    // isShowSSCSInfo: 是否显示社保卡信息 [true|false] 默认 false
    // isOpenSSCStateDisabledTip: 是否开启社保卡状态不正常提示 [true|false] 默认 false
    // isCheckDisability: 申报是否进行残疾人校验 [true|false] 默认 false
    // isCheckFileAndRegister: 申报是否进行建档立卡校验 [true|false] 默认 false
    // isCheckDeclare:  是否开启申报校验 [true|false] 默认 false
    declare_20589: {},
  },
  aMapKey: '2dccefa2478bba8f57c7fc435eb57396', // 高德地图密钥
}

export default config510000
