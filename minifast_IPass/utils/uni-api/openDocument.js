/**
 * 不支持 h5。
 * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
 * @param {string} filePath 必填。文件路径，可通过 downFile 获得
 * @param {string} fileType 默认值：pdf。文件类型，指定文件类型打开文件。微信小程序支持的有效值 doc, xls, ppt, pdf, docx, xlsx, pptx。支付宝小程序支持的有效值 pdf
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com
 * 
 * 支付宝小程序支持情况说明：https://opendocs.alipay.com/mini/api/mwpprc
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/file/file?id=opendocument

 * @returns {Promise}
 *
 * @example
  openDocument('test.pdf').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const openDocument = (filePath, fileType = 'pdf') => {
  // 当前环境是否为开发环境
  const isDev = process.env.NODE_ENV === 'development'
  // #ifdef MP-WEIXIN
  // #endif
  return new Promise((resolve, reject) => {
    uni.openDocument({
      filePath,
      fileType,
      success(res) {
        resolve(res)
      },
      fail(err) {
        if(isDev) {
          console.log('openDocument 接口调用失败 => ', err)
        }
        reject(err)
      }
    })
  })
}
export { openDocument }
