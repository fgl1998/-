import { request } from '@/service/request'

/**
 * 获取发放系统政策文件列表
 * @param {String} chi051 政策文件名 关键词
 * @param {String} chi037
 * @param {String} chi031
 * @param {String} yab003
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestFFGetPolicyFileList = (
  chi051,
  chi037,
  chi031,
  yab003,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '获取发放系统政策文件列表',
    methodName: 'getPolicyFileList',
    page: pageNo + '',
    limit: pageSize + '',
    chi051,
    chi037,
    chi031,
    yab003,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceData',
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestFFGetPolicyFileList }
