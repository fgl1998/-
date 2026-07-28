/* 
  配置文件
  文件中保存的是一些常用配置 请谨慎更改 更改前请确认是否存在使用
*/
import { requestUrl } from '@/config/city'

const config530000 = {
  requestUrl, // api 请求地址
  areaCode: '530000', // 行政区域编码 湖南省 511000
  areaName_zh: '云南省', // 行政区域中文名称/简称 湖南省
  declarePackageName: 'packageDeclare530000', // 补贴项目存放包名
  // 控制政策文件的请求地址 true 请求发放系统 false 请求审批审批
  isRequestYGFF: false,
  // 是否开启阳光发放请求 true 开启 兼容甘孜
  isOpenYGFF: true,
  // 是否开启个人补贴查询
  isOpenPersonQuery: true,
  // 是否开启村组补贴查询
  isOpenVillageQuery: true,
  // 是否开启学校补贴查询
  isOpenSchoolQuery: false,
  // 是否开启数据加密，配合后台使用 true 开启
  isOpenDataEncrypt: false,
  //是否开启审批投诉反馈功能
  isOpenSPComplaintFeedback: false,
  isOpenThreeFundedVersion: true, // 是否开启三资版本 h5打包编译有效

  // #ifdef H5
  isCompileToTianfuCitizenCloud: true, // 是否h5打包编译时编译到天府市民云 兼容文件上传 不编译至天府市民云请手动关闭
  // #endif

  // 服务网点是否使用百度地图
  isUseBMap: false,

  // 智能客服 猜你想问 配置
  customerServiceGuess: ['我的补贴到账了吗？', '如何申报普通高中国家助学金？', '如何申报高龄津贴？'],
  // 用户协议单位
  userAgreementUnit: '云南省信息中心',
  // 关闭页面内某些模块 true 则关闭 目前根据甘孜州需求只更改了个别页面配置
  configClosePageModule: {
    pageTabbarHome: {
      convenientService: true // 便捷服务
    },
    pageTabbarMy: {}
  },
  // 配置分享内容
  configSharePages: {
    pageTabbarHome: {
      title: '云南省阳光审批', // 转发标题
      path: '/pages/tabbar/home/home?type=share', // 转发路径
      query: 'type=share', // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
      imageUrl: '' // 自定义图片路径
    },
    pageTabbarSunshineDeclare: {
      title: '云南省阳光审批，阳光申报',
      path: '/pages/tabbar/sunshine-declare/sunshine-declare?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarSunshine: {
      title: '云南省阳光审批村村响，让补贴晒一晒',
      path: '/pages/tabbar/sunshine/sunshine?type=share',
      query: 'type=share',
      imageUrl: ''
    },
    pageTabbarMy: {
      title: '云南省阳光审批',
      path: '/pages/tabbar/my/my?type=share',
      query: 'type=share',
      imageUrl: ''
    }
  },
  // 配置各申报页面的申报配置
  configDeclarePages: {},

  aMapKey: '2183beb7255d9ebd9593b4701c8677f3', // 高德地图密钥 微信小程序
  aMapKeyH5: 'b91b7c6ff9fa2a0250d109e586f9be0a' // 高德地图密钥 Web服务
}

export default config530000
