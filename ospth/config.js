/**
 * 开发、测试、生产环境启动打包配置
 */

/**
 * 通用配置，不用区分不同环境
 */

const commonConfig = {
  // 系统名称
  APP_NAME: '智慧就业',
  // 网厅名称
  OSPTP_NAME: '西藏就业综合服务平台',
  // 图片替换目录 如personalized/master、personalized/xj,带有项目特色的图片放到对应目录以方便项目进行快速切换
  IMAGE_REPLACE_DIRECTORY: 'personalized/xj',
  //默认行政区划编码
  DEFAULT_AREA_CODE: '540000000000',
  DEFAULT_AREA_NAME: '西藏自治区',
}

/**
 * 区分不同环境配置
 * 渠道端 ip+端口+上下文+(固定字符串applet/api)
 */

/**
 * 开发环境
 */
// 开发环境后台请求地址
const BASE_URL_DEV = 'http://192.168.2.21:8080/xz-jy-osp-tb/api'
// 办事页面路径
const BASE_IP_DEV = 'http://127.0.0.1:8087'
// 加密级别：0.不做任何处理 1.加密 2.加密+签名 3.加密+签名+时间戳
const CRYPT_TYPE_DEV = '0'
// 返回数据解密 false不解密，true解密
const BACK_DECRYPT_DEV = false
// 开发环境资源请求路径
const IMAGE_SRC_DEV = 'http://192.168.2.21:8080/xz-jy-osp-tb/template'
// uni.scss中配置的资源请求路径
const UNI_SCSS_SRC_DEV = 'http://192.168.2.21:8080/xz-jy-osp-tb/template'

/**
 * 测试环境
 */
// 测试环境后台请求地址
const BASE_URL_TEST = 'http://10.200.6.46:30001/osp-tb/api'
// 办事页面路径
const BASE_IP_TEST = 'http://10.200.6.46:30001/osp-tb'
// 加密级别：0.不做任何处理 1.加密 2.加密+签名 3.加密+签名+时间戳
const CRYPT_TYPE_TEST = '0'
// 返回数据解密 false不解密，true解密
const BACK_DECRYPT_TEST = false
// 测试环境资源请求路径
const IMAGE_SRC_TEST = 'http://10.200.6.46:30001/osp-tb/template'
// uni.scss中配置的资源请求路径
const UNI_SCSS_SRC_TEST = 'http://10.200.6.46:30001/osp-tb/template'

/**
 * 生产环境
 */
// 正式环境后台请求地址
const BASE_URL_PROD = 'https://rsggfw.rst.xinjiang.gov.cn/osp-app/api'
// 本地取uniapp端口  正式环境取terminal端口 (h5temp办事页面路径)
const BASE_IP_PROD = 'https://rsggfw.rst.xinjiang.gov.cn'
// 加密级别：0.不做任何处理 1.加密 2.加密+签名 3.加密+签名+时间戳
const CRYPT_TYPE_PROD = '3'
// 返回数据解密 false不解密，true解密
const BACK_DECRYPT_PROD = true
// 测试环境资源请求路径
const IMAGE_SRC_PROD = 'https://rsggfw.rst.xinjiang.gov.cn/osp-app/template'
// uni.scss中配置的资源请求路径
const UNI_SCSS_SRC_PROD = 'https://rsggfw.rst.xinjiang.gov.cn/osp-app/template'

const env = process.env.UNI_RUN_ENV ? process.env.UNI_RUN_ENV : 'dev'
const script = process.env.UNI_SCRIPT ? (process.env.UNI_SCRIPT.indexOf('TEST') != -1 ? 'TEST' : 'PROD') : 'dev'
module.exports = {
  ...commonConfig,
  BASE_URL: env === 'test' ? BASE_URL_TEST : env === 'prod' ? BASE_URL_PROD : BASE_URL_DEV,
  BASE_IP: env === 'test' ? BASE_IP_TEST : env === 'prod' ? BASE_IP_PROD : BASE_IP_DEV,
  CRYPT_TYPE: env === 'test' ? CRYPT_TYPE_TEST : env === 'prod' ? CRYPT_TYPE_PROD : CRYPT_TYPE_DEV,
  BACK_DECRYPT: env === 'test' ? BACK_DECRYPT_TEST : env === 'prod' ? BACK_DECRYPT_PROD : BACK_DECRYPT_DEV,
  IMAGE_SRC: env === 'test' ? IMAGE_SRC_TEST : env === 'prod' ? IMAGE_SRC_PROD : IMAGE_SRC_DEV,
  image_src: script === 'TEST' ? UNI_SCSS_SRC_TEST : script === 'PROD' ? UNI_SCSS_SRC_PROD : UNI_SCSS_SRC_DEV,
  image_replace_directory: commonConfig.IMAGE_REPLACE_DIRECTORY,
}
