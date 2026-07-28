/* 
  配置文件
  文件中保存的是一些常用配置 请谨慎更改 更改前请确认是否存在使用
*/
import { requestUrl } from '@/config/city'

const config510500 = {
  requestUrl,
  areaCode: '510500', // 行政区域编码 泸州 510500
  areaName_zh: '泸州', // 行政区域中文名称/简称 泸州
  declarePackageName: 'packageDeclare510500', // 补贴项目存放包名
  // 控制政策文件的请求地址 true 请求发放系统 false 请求审批审批
  isRequestYGFF: false,
  // 是否开启阳光发放请求 true 开启 兼容甘孜
  isOpenYGFF: true,
  // 是否开启个人补贴查询
  isOpenPersonQuery: true,
  // 是否开启村组补贴查询
  isOpenVillageQuery: true,
  // 是否开启学校补贴查询
  isOpenSchoolQuery: true,
  // 是否开启数据加密，配合后台使用 true 开启
  isOpenDataEncrypt: true,
  // 是否开启用户行为采集
  isOpenUserBehaviorCollection: true,
  // 服务网点是否使用百度地图
  isUseBMap: true,
  // 投诉举报记录是否查询阳光发放系统的数据 true 需要查询发放系统 false 只查询审批系统
  complaintAndReportRecordIsQueryYGFF: true,
  // 是否开启token校验，配合后台使用 true 开启
  isOpenTokenVerify: true,
  // 是否强制绑定户籍地址
  isForceBindingAddress: true,
  // 是否显示停机提示
  isShowShutDownTips: false,
  // 是否显错误提示 isShowShutDownTips 为true是请关闭
  isShowErrorTip: true,
  // 智能咨询是否无法在发放系统配置
  smartConsultingNoYGFF: false,
  // 是否开启语音投诉
  isOpenVoiceComplaints: false,
  //是否开启审批投诉反馈功能
  isOpenSPComplaintFeedback: false,
  // 发放系统地址请求参数，一旦确定不要轻易改动
  FFAddressRequestParams: {
    orgid: '510500',
    orglevel: '2'
  },
  // 审批系统地址请求参数，一旦确定不要轻易改动
  SPAddressRequestParams: {
    orgid: '510500',
    orglevel: '2'
  },
  // 关闭页面访问 即访问时跳转该功能暂未开放
  closePages: [
    // 'packageQuery/subsidy-payment', // 补贴发放查询
    //'packageDetails/complaint-progress', // 投诉进度
    // 'packageQuery/publicity', // 阳光申报公示
    // 'tabbar/sunshine', // 阳光发放
    // 'packageDetails/my-message', // 我的消息
    // 'packageCommon/user-info', // 个人信息编辑
  ],
  // 关闭页面内某些模块 true 则关闭
  configClosePageModule: {
    pageTabbarHome: {
      subsidizedGoods: true, // 补贴商品专区
      hotService: false, // 热门服务
      convenientService: false, // 便捷服务
      news: true, // 惠民快讯
      swiper: false, // 轮播图
      policyDocument: false, // 政策文件
      leaveMessage: true, // 我要留言
      publicityVideo: true, // 宣传视频
      annualAccount: '0' // 年度盘点 0 关闭 1 简洁版 2 叙事版
    },
    pageTabbarMy: {
      myHome: false, // 我的家
      myService: false, // 我的服务
      myDeclarationProject: false, // 我的申报项目
      myAgencyProject: false, // 我的代办项目
      myOneCard: false, // 我的一卡通
      myCardBag: false // 我的卡包
    }
  },
  // 首页便捷服务显示配置 true 则显示 false 则不显示
  homeConvenientServiceDisplayConfig: {
    showServiceNetwork: true, // 服务网点
    showCustomerService: false, // 智能客服
    showSurvivalCertification: false // 生存认证
  },
  // 配置分享内容
  configSharePages: {
    pageTabbarHome: {
      title: '泸州一卡通', // 转发标题
      path: '/pages/tabbar/home/home?type=share', // 转发路径
      query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
      imageUrl: '' // 自定义图片路径
    },
    pageTabbarSunshineDeclare: {
      title: '泸州一卡通，阳光申报',
      path: '/pages/tabbar/sunshine-declare/sunshine-declare?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarSunshine: {
      title: '泸州一卡通村村响，让补贴晒一晒',
      path: '/pages/tabbar/sunshine/sunshine?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarMy: {
      title: '泸州一卡通',
      path: '/pages/tabbar/my/my?type=share',
      query: 'type=share',
      imageUrl: ''
    }
  },
  // 配置各申报页面的申报配置
  configDeclarePages: {
    // closeAuth: 关闭对申报人进行生存认证 例如 ['507'] 关闭该人员类别的人脸识别 为空则关闭全部
    // isFixedDeclareType: 是否固定申报类型 [true|false] 默认 false
    // isJumpDeclareTypeSelect: 是否跳过申报类型选择 isFixedDeclareType 为true时有效  [true|false] 默认 false
    // fixedDeclareType: 固定的申报类型 isFixedDeclareType 为true时有效 01 自主申报 02 代为申报
    // unableDeclareTip: 自定义无法申报提示
    // isShowSSCSInfo: 是否显示社保卡信息 [true|false] 默认 false
    // isOpenSSCStateDisabledTip: 是否开启社保卡状态不正常提示 [true|false] 默认 false
    // isCheckDisability: 申报是否进行残疾人校验 [true|false] 默认 false
    // isCheckFileAndRegister: 申报是否进行建档立卡校验 [true|false] 默认 false
    // isCheckDeclare:  是否开启申报校验 [true|false] 默认 false
    declare_20213: {
      closeAuth: []
    },
    declare_20215: {
      closeAuth: []
    },
    declare_20044: {
      closeAuth: []
    },
    declare_20064: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20140: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20582: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20291: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20021: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20583: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20072: {
      closeAuth: [],
      unableDeclareTip: '该补贴项目暂未在微信小程序平台开放,请联系村、社区工作人员进行办理!'
    },
    declare_20008: {
      closeAuth: [],
      isFixedDeclareType: true,
      fixedDeclareType: '02',
      unableDeclareTip: '该补贴项目暂未在微信小程序平台开放,请联系村、社区工作人员进行办理!'
    },
    declare_20055: {
      unableDeclareTip: '该补贴项目暂未在微信小程序平台开放,请联系村、社区工作人员进行办理!'
    },
    declare_20141: {
      closeAuth: [],
      unableDeclareTip: '该补贴项目暂未在微信小程序平台开放,请联系区县残联工作人员进行办理!'
    },
    declare_20521: {
      closeAuth: [],
      unableDeclareTip: '该补贴项目暂未在微信小程序平台开放,请联系市人力资源和社会保障局工作人员进行办理!'
    },
    declare_20557: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20062: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20370: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20560: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20590: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20591: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20592: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20551: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20640: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20535: {
      closeAuth: [],
      isCheckDisability: true
    },
    declare_20382: {
      closeAuth: []
    },
    declare_20447: {
      closeAuth: []
    },
    declare_20595: {
      closeAuth: []
    },
    declare_20599: {
      closeAuth: []
    },
    declare_20600: {
      closeAuth: []
    },
    declare_20701: {
      closeAuth: []
    },
    declare_20900: {
      closeAuth: []
    },
    declare_20982: {
      closeAuth: []
    }
  },
  aMapKey: 'e7c0eedf7100da58938c21b4f2a4fb24' // 高德地图密钥
}

export default config510500
