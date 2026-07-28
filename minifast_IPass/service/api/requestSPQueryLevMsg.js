import { request } from '@/service/request'

/**
 * 微信留言查询
 * @param {String} chb552 loginId
 * @param {String} chb557 问题类型
 * @param {String} queryType 留言类型 2 公开 3 个人
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestSPQueryLevMsg = (
  chb552,
  chb557,
  queryType,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '微信留言查询微信留言查询',
    methodName: 'queryLevMsg',
    pageNo: pageNo + '',
    pageSize: pageSize + '',
    queryType,
    chb557,
    chb552,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataTwo',
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
export { requestSPQueryLevMsg }
