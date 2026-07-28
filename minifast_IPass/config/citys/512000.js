/* 
  配置文件
  文件中保存的是一些常用配置 请谨慎更改 更改前请确认是否存在使用
*/
import { requestUrl } from '@/config/city'

const config512000 = {
  requestUrl, // api 请求地址
  areaCode: '512000', // 行政区域编码 资阳 512000
  areaName_zh: '资阳', // 行政区域中文名称/简称 资阳
  declarePackageName: 'packageDeclare512000', // 补贴项目存放包名
  // 控制政策文件的请求地址 true 请求发放系统 false 请求审批审批
  isRequestYGFF: true,
  // 是否开启阳光发放请求 true 开启 兼容甘孜
  isOpenYGFF: true,
  // 是否开启个人补贴查询
  isOpenPersonQuery: true,
  // 是否开启村组补贴查询
  isOpenVillageQuery: true,
  // 是否开启学校补贴查询
  isOpenSchoolQuery: true,
  // 投诉举报记录是否查询阳光发放系统的数据 true 需要查询发放系统 false 只查询审批系统
  complaintAndReportRecordIsQueryYGFF: true,
  // 是否开启数据加密，配合后台使用 true 开启
  isOpenDataEncrypt: true,
  // 是否开启用户行为采集
  isOpenUserBehaviorCollection: true,
  // 是否开启token校验，配合后台使用 true 开启
  isOpenTokenVerify: true,
  // 是否强制绑定户籍地址
  isForceBindingAddress: false,
  // 是否显示停机提示
  isShowShutDownTips: false,
  // 是否显错误提示 isShowShutDownTips 为true是请关闭
  isShowErrorTip: true,
  // 是否开启语音投诉
  isOpenVoiceComplaints: false,
  // 智能咨询是否无法在发放系统配置
  smartConsultingNoYGFF: false,
  //是否开启审批投诉反馈功能
  isOpenSPComplaintFeedback: false,
  // 智能客服 猜你想问 配置
  customerServiceGuess: ['我的补贴到账了吗？', '如何申报公租房租赁补贴？', '如何申事实无人抚养儿童基本生活补贴？'],
  // 发放系统地址请求参数，一旦确定不要轻易改动
  FFAddressRequestParams: {
    orgid: '512099',
    orglevel: '2'
  },
  // 审批系统地址请求参数，一旦确定不要轻易改动
  SPAddressRequestParams: {
    orgid: '1679870',
    orglevel: '2'
  },
  // 关闭页面内某些模块 true 则关闭 目前根据甘孜州需求只更改了个别页面配置
  configClosePageModule: {
    pageTabbarHome: {
      subsidizedGoods: true, // 补贴商品专区
      hotService: false, // 热门服务
      convenientService: false, // 便捷服务
      news: false, // 惠民快讯
      swiper: false, // 轮播图
      policyDocument: false, // 政策文件
      leaveMessage: false, // 我要留言
      publicityVideo: true, // 宣传视频
      annualAccount: '1' // 年度盘点 0 关闭 1 简洁版 2 叙事版
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
    showCustomerService: true, // 智能客服
    showSurvivalCertification: true // 生存认证
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
    declare_20007: {
      closeAuth: [],
      unableDeclareTip: '此项目暂未开始申报受理',
      isShowSSCSInfo: true
    },
    declare_20055: {
      closeAuth: [],
      unableDeclareTip: '此项目暂未开始申报受理'
    },
    declare_20447: {
      unableDeclareTip: '请将此项目相关信息报给乡镇工作人员进行受理'
    },
    declare_20833: {
      unableDeclareTip: '请将此项目相关信息报给乡镇工作人员进行受理'
    },
    declare_20836: {
      unableDeclareTip: '请将此项目相关信息报给乡镇工作人员进行受理'
    },
    declare_20022: { isCheckDisability: true },
    declare_20640: { isCheckDisability: true },
    declare_20638: { isCheckDisability: true },
    declare_20705: { isCheckDisability: true },
    declare_20021: { isCheckDisability: true }
  },
  aMapKey: '4ccd8591f15637d2187d191e5c31905b' // 高德地图密钥
}

export default config512000
