import config from '@/config'
import { getIsDev } from '@/utils/get'
import { openDocument, showLoading, hideLoading, base64ToArrayBuffer, env } from '@/utils/uni-api'
import { requestFFGetPolicyFilePdf, requestSPGetChi057 } from '@/service/api'
/**
 * 预览 pdf
 * @param {string} chi050 必填。文件码值，可通过 downFile 获得
 * @param {string} fileType 默认值：pdf。
 * @param {string} chi056 默认值：pdf。
 * @param {boolean} isYGSP 是否请求审批系统
 * @param {boolean} isYGFF 是否请求发放系统
 * @returns {Promise}
 *
 * @example
  previewPDFWeixin().then(res => {
	// 接口调用成功
  }).catch(err => {
	// 接口调用失败
  }).finally((res) => {
	// 接口调用完成
  })
 */
const previewPDFWeixin = (chi050, fileType = 'pdf', chi056 = 'file.pdf', isYGSP = false, isYGFF = false) => {
  showLoading()
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  let { isRequestYGFF } = config
  if (isYGSP) {
    isRequestYGFF = false
  }
  if (isYGFF) {
    isRequestYGFF = true
  }
  // 创建并打开文件
  const createAndOpenFile = (filePath, fileName, arrayBuffer) => {
    const fs = wx.getFileSystemManager()
    // 获取历史文件列表
    fs.readdir({
      dirPath: filePath,
      success(res) {
        res.files.forEach((el) => {
          // 删除历史文件，删除时要注意文件名一定要和存的时候一样,不然会报没有unlink无文件权限问题
          fs.unlink({
            filePath: filePath + el,
            success(res) {
              if (isDev) {
                console.log('历史文件删除成功：', el, res)
              }
            },
            fail(err) {
              if (isDev) {
                console.log('历史文件删除失败：', el, err)
              }
            }
          })
        })
        // 写入新文件
        fs.writeFile({
          filePath: filePath + fileName,
          data: arrayBuffer,
          success(res) {
            if (isDev) {
              console.log('写入新文件成功', res)
            }
            // 打开文件
            openDocument(filePath + fileName, fileType).finally(() => {
              hideLoading()
            })
          },
          fail(err) {
            if (isDev) {
              console.log('写入新文件失败', err)
            }
          }
        })
      }
    })
  }
  // 下载文件
  const downloadTempFile = (base64Str, fileName) => {
    const arrayBuffer = base64ToArrayBuffer(base64Str)
    // 自定义政策文件存储路径
    const filePath = env().USER_DATA_PATH + '/policyDocument/'
    const fs = wx.getFileSystemManager()
    // 判断文件/目录是否存在
    fs.access({
      path: filePath,
      success(res) {
        // 文件夹存在
        if (isDev) {
          console.log('文件夹存在', res)
        }
        createAndOpenFile(filePath, fileName, arrayBuffer)
      },
      fail(err) {
        // 文件夹不存在 创建文件夹
        console.log('文件夹不存在', err)
        fs.mkdir({
          dirPath: filePath,
          success(res) {
            // 创建文件夹成功 并打开文件
            if (isDev) {
              console.log('创建文件夹成功', res)
            }
            createAndOpenFile(filePath, fileName, arrayBuffer)
          },
          fail(err) {
            // 创建文件夹失败
            if (isDev) {
              console.log('创建文件夹失败', err)
            }
            hideLoading()
          }
        })
      }
    })
  }

  // 审批系统请求
  if (isRequestYGFF) {
    requestFFGetPolicyFilePdf(chi050)
      .then((res) => {
        const { list } = res
        if (list) {
          const data = list[0]
          const fileName = data.chi051 && data.chi051 != '' ? data.chi051 + '.pdf' : 'file.pdf'
          const base64Str = data.chi057
          downloadTempFile(base64Str, fileName)
        } else {
          hideLoading()
        }
      })
      .catch(() => {
        hideLoading()
      })
  } else {
    requestSPGetChi057(chi050)
      .then((res) => {
        const fileName = chi056 ? chi056 : 'file.pdf'
        const base64Str = res.chi057
        downloadTempFile(base64Str, fileName)
      })
      .catch(() => {
        hideLoading()
      })
  }
}

export { previewPDFWeixin }
