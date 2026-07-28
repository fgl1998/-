import config from '@/config'
const { requestUrl } = config

const prefix = requestUrl + '/static/images'

// 常量 不要修改
const IMAGE_COMMON = prefix + '/common/'
const IMAGE_PACKAGE_HOME = prefix + '/packageHome/'
const IMAGE_TABBAR_HOME = prefix + '/tabbar/home/'
const IMAGE_TABBAR_MY = prefix + '/tabbar/my/'
const IMAGE_TABBAR_SUNSHINE = prefix + '/tabbar/sunshine/'
const IMAGE_TABBAR_SUNSHINE_DECLARE = prefix + '/tabbar/sunshine-declare/'
const IMAGE_ANNUAL_ACCOUNT = prefix + '/packageScan/annual-account'
const IMAGE_ANNUAL_ACCOUNT_SIMPLIFY =
  prefix + '/packageScan/annual-account-simplify/annual-account-simplify'
const IMAGE_QR = prefix + '/qr'

const DOWNLOAD_FILE_URL_PREFIX = requestUrl + '/upload/downFileByFileId?fileId=' // 文件下载地址 后接统一储存id
export {
  IMAGE_COMMON,
  IMAGE_PACKAGE_HOME,
  IMAGE_TABBAR_HOME,
  IMAGE_TABBAR_MY,
  IMAGE_TABBAR_SUNSHINE,
  IMAGE_TABBAR_SUNSHINE_DECLARE,
  IMAGE_ANNUAL_ACCOUNT,
  IMAGE_ANNUAL_ACCOUNT_SIMPLIFY,
  IMAGE_QR,
}
