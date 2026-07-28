/* 
  配置文件
  文件中保存的是一些常用配置 请谨慎更改 更改前请确认是否存在使用
*/
import { requestUrl } from '@/config/city'

const config511500 = {
  requestUrl, // api 请求地址
  areaCode: '511500', // 行政区域编码 宜宾 511500
  areaName_zh: '宜宾', // 行政区域中文名称/简称 宜宾
  declarePackageName: 'packageDeclare511500', // 补贴项目存放包名
  // 控制政策文件的请求地址 true 请求发放系统 false 请求审批审批
  isRequestYGFF: false,
  // 是否开启阳光发放请求 true 开启 兼容甘孜
  isOpenYGFF: false,
  // 是否通过德生接口替代发放系统请求 true 开启 兼容宜宾
  isOpenYGFFByDS: true,
  // 是否开启个人补贴查询
  isOpenPersonQuery: true,
  // 是否开启村组补贴查询
  isOpenVillageQuery: true,
  // 是否开启学校补贴查询
  isOpenSchoolQuery: false,
  // 是否开启token校验，配合后台使用 true 开启
  isOpenTokenVerify: false,
  // 是否开启数据加密，配合后台使用 true 开启
  isOpenDataEncrypt: false,
  // 是否开启用户行为采集
  isOpenUserBehaviorCollection: true,
  // 服务网点是否使用百度地图
  isUseBMap: true,
  // 投诉举报记录是否查询阳光发放系统的数据 true 需要查询发放系统 false 只查询审批系统
  complaintAndReportRecordIsQueryYGFF: true,
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
    orgid: '511500',
    orglevel: '2'
  },
  // 审批系统地址请求参数，一旦确定不要轻易改动
  SPAddressRequestParams: {
    orgid: '511500',
    orglevel: '1'
  },
  // 关闭页面访问 即访问时跳转该功能暂未开放
  closePages: [
    // 'packageQuery/subsidy-payment', // 补贴发放查询
    // 'tabbar/sunshine', // 阳光发放
    // 'packageDetails/my-message', // 我的消息
    // 'packageCommon/user-info' // 个人信息编辑
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
      myOneCard: true, // 我的一卡通
      myCardBag: true // 我的卡包
    }
  },
  // 首页便捷服务显示配置 true 则显示 false 则不显示
  homeConvenientServiceDisplayConfig: {
    showServiceNetwork: true, // 服务网点
    showCustomerService: false, // 智能客服
    showSurvivalCertification: false, // 生存认证
    showWorkForRelief: true, // 以工代赈
    showThreeCapital: true, //三资公开
    showEGotIt: true // e明白了
  },
  // 配置分享内容
  configSharePages: {
    pageTabbarHome: {
      title: '宜宾一卡通', // 转发标题
      path: '/pages/tabbar/home/home?type=share', // 转发路径
      query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
      imageUrl: '' // 自定义图片路径
    },
    pageTabbarSunshineDeclare: {
      title: '宜宾一卡通，阳光申报',
      path: '/pages/tabbar/sunshine-declare/sunshine-declare?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarSunshine: {
      title: '宜宾一卡通村村响，让补贴晒一晒',
      path: '/pages/tabbar/sunshine/sunshine?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarMy: {
      title: '宜宾一卡通',
      path: '/pages/tabbar/my/my?type=share',
      query: 'type=share',
      imageUrl: ''
    }
  },
  // 配置各申报页面的申报配置 类似于99999的字符为补贴项目编码
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
    // isSkipSurvivalAuth：是否支持跳过人脸识别 [true|false] 默认 false
    declare_99999: {
      unableDeclareTip: '该项目已暂停申报，详细办理情况请咨询'
    },
    declare_20021: {
      isCheckDisability: true
    },
    declare_20022: {
      isCheckDisability: true
    },
    declare_20141: {
      isCheckDisability: true
    },
    declare_20288: {
      isCheckDisability: true
    },
    declare_20291: {
      isCheckDisability: true
    },
    declare_20677: {
      isCheckDisability: true
    },
    declare_20926: {
      isCheckDisability: true
    },
    declare_200108: {
      isCheckDisability: true
    },
    declare_20676: {
      isCheckDisability: true
    },
    declare_20064: {
      isCheckDisability: true
    },
    declare_20219: {
      closeAuth: [],
      isCheckDisability: true,
      isSkipSurvivalAuth: true
    }
  },
  // 主题名称 支持首页置灰 gray
  themeName: '',
  aMapKey: '108aaabf330836f89ab90e69ac926c60' // 高德地图密钥
}

export default config511500
