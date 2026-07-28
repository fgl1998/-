import { request } from '@/service/request'

/**
 * 个人投诉信息查询
 * @param {String} userName 姓名
 * @param {String} idCard 身份证号
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestFFGetHb58List = (
  userName,
  idCard,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNamedesc: '个人投诉信息查询',
    methodName: 'getHb58List',
    chb581: userName,
    chb582: idCard,
    pageSize: pageSize + '',
    pageNo: pageNo + '',
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
export { requestFFGetHb58List }
