import config from '@/config/index'
import { showModal } from './index'
/**
 * 下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
 * @param {string} url 下载资源的 url
 * @param {string} header HTTP 请求 Header, header 中不能设置 Referer。
 * @param {string} timeout 超时时间，单位 ms
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/request/network-file?id=downloadfile

 * @returns {Promise}
 *
 * @example
  downloadFile().then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const downloadFile = (url, header, timeout) => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-ALIPAY
  // #endif
  const httpExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  if (!url) {
    showModal('请求地址url为空, 上传文件请求已被终止！')
  }
  // 不是以http/https开头的路径
  if (!httpExp.test(url)) {
    url = config.requestUrl + url
  }
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      header,
      timeout,
      success (res) {
        resolve(res)
      },
      fail (err) {
        if (isDev) {
          console.log('downloadFile 接口调用失败 => ', err)
        }
        reject(err)
      },
    })
  })
}
export { downloadFile }
