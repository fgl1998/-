// 设置二维码缓存

const qrCodeIdCacheKey = 'qrCodeId'
const dzsbk = 'get_qrcode'
const wxScanLogin = 'get_qrcode'

const setQrcodeCache = (prefix, qrCodeId, value) => {
  clearQrcodeCache(prefix)
  uni.setStorageSync(prefix + qrCodeIdCacheKey, qrCodeId)
}

const getQrcodeCacheKey = (prefix) => {
  return uni.getStorageSync(prefix + qrCodeIdCacheKey) || ''
}

const clearQrcodeCache = (prefix) => {
  uni.removeStorageSync(prefix + qrCodeIdCacheKey)
}

export default {
  setQrcodeCache,
  getQrcodeCacheKey,
  dzsbk,
  wxScanLogin,
  clearQrcodeCache,
}
