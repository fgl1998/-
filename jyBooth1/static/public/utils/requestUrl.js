const dev = 'http://192.168.3.34:8080/sxterminal' //开发地址
// const dev = 'http://172.50.1.102:30001/sxterminal' //开发地址
const yinhai = 'http://172.50.1.102:30001/sxterminal' //公司银海云地址

const test = 'http://10.164.10.134:30001/gaterminal' //测试环境地址
const prod = 'http://10.164.10.135:30001/gaterminal' //正式环境地址

const requestUrl = dev

const codeList = [
  'aab022',
  'aab022_1',
  'aab056',
  'aac011',
  'acc217',
  'acb214',
  'acb00s',
  'aab019',
  'acc241',
  'acc242',
  'aac183',
  'acb00r',
  'aca111',
  'acc262',
  'acb469',
  'acb21u1',
  'acb468',
  'acc315',
  'aab056',
  'aab019',
  'acb212',
  'acb01f',
  'acb21z',
]

const AllUpdateApiCode = [
  'jy204_hrm259',
  'jy202_hrm226',
  'jy201_hrm201',
  'jy201_hrm202',
  'jy201_hrm512',
  'jy204_hrm205',
  'jy201_hrm114',
  'jy201_hrm108',
  'jy201_hrm101',
  'jy204_hrm126',
  'jy204_hrm127',
  'jy201_hrm212',
  'jy202_hrm212',
  'jy225_hrm105',
  'jy225_hrm107',
  'jy201_hrm115',
  'jy201_hrm226',
  'jy201_hrm100',
  'jy201_hrm101',
]

//jy204_hrm104、jy201_hrm258（暂时不用）、jy201_hrm259、jy201_hrm257(导航台接口)
const excludeAab001Api = [
  'jy201_hrm217',
  'jy201_hrm205',
  'jy201_hrm115',
  'jy225_hrm103',
  'jy204_hrm104',
  'jy201_hrm257',
  'jy201_hrm259',
  'jy225_hrm105',
]
//渠道编号
const channelCode = 'jyZpHall'
//默认接口
const interfaceUrl = '/api/business/invoke'
//业务接口
// const businessUrl = '/api/businessCommon/getData'
const businessUrl = '/api/business/invoke'
//二维码接口
// const qrcodeUrl = '/api/qrCode/commonQrCode'
const qrcodeUrl = '/api/login/commonQrCode'
//码值获取接口
const codeUrl = '/api/base/getDictText.do'
//数据来源
const aae400 = '18'
//用户类型：UT01-个人 UT02-单位
const user_type = 'UT02'
//认证类型：X00-账密
const auth_type = 'MESSAGE'
//登录认证接口
const loginAuth = '/api/login/loginAuth.do'
//获取图形验证码
const sendCheckCodeSmsUrl = '/api/login/sendCheckCodeSms.do'
// 退出登录接口
const logoutUrl = '/api/security/token/logout.do'

//请求类型 common:通用请求 business:业务请求 login:登录请求
const businessRequestType = 'business'
const commonRequestType = 'common'
const loginRequestType = 'login'
const codeRequestType = 'code'
const logOutRequestType = 'logout'
const qrcodeRequestType = 'qrcode'
const otherType = 'other'
const sendCheckCodeSmsRequestType = 'sendCheckCodeSms'
//token
const TERMINALJTOKEN = 'TERMINAL-JTOKEN'
const LOGININFO = 'loginInfo'

//文件请求地址
// const fileLoadUrl = '/api/base/downloadBusinessFile.do'
const fileLoadUrl = '/api/businessCommon/fileDownload'
//文件上传地址
// const fileUploadUrl = '/api/base/uploadBusinessFile.do'
const fileUploadUrl = '/api/businessCommon/fileUpload'
//系统编号
const systemCode = 'jyplat'
//码值缓存key
const codeCacheKey = 'cacheStorage'
//展位编号缓存key
const deviceCacheKey = 'deviceId'

export default {
  requestUrl,
  codeList,
  channelCode,
  interfaceUrl,
  businessUrl,
  aae400,
  user_type,
  auth_type,
  loginAuth,
  businessRequestType,
  commonRequestType,
  codeRequestType,
  TERMINALJTOKEN,
  LOGININFO,
  fileLoadUrl,
  fileUploadUrl,
  systemCode,
  codeUrl,
  codeCacheKey,
  excludeAab001Api,
  deviceCacheKey,
  logoutUrl,
  logOutRequestType,
  qrcodeUrl,
  qrcodeRequestType,
  otherType,
  sendCheckCodeSmsUrl,
  sendCheckCodeSmsRequestType,
  AllUpdateApiCode,
}
