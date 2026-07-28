import config from '@/config'
import { showModal } from '@/utils/uni-api'
/**
 * 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data。使用前请注意阅读相关说明。、发送给朋友等操作。
 * @param {string} url 开发者服务器地址
 * @param {string} filePath 要上传文件资源的路径 (本地路径)
 * @param {string} name 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param {object} header HTTP 请求 Header，Header 中不能设置 Referer
 * @param {object} formData HTTP 请求中其他额外的 form data
 * @param {number} timeout 超时时间，单位为毫秒
 * @example 使用示例
  uploadFile(url, path, name_en, header, formData)
  .then((res) => {
    // suceess
  })
  .catch((err) => {
    // error
  })
 */
const uploadFile = (url, filePath, name, header, formData, timeout) => {
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
    uni.uploadFile({
      url,
      filePath,
      name,
      header,
      formData,
      timeout,
      success(res) {
        const { isOpenDataEncrypt } = config
        // 开启数据加密
        if (isOpenDataEncrypt) {
          resolve(res)
        } else {
          resolve(res)
        }
      },
      fail(err) {
        console.error('uploadFile 接口调用失败 => ', err)
        reject(err)
      },
    })
  })
}

export { uploadFile }
