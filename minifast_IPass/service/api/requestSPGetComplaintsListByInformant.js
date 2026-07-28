import { request } from '@/service/request'

/**
 * 查询是否跳过人脸识别
 * @param {String} chb51c 举报类型(1阳光公示;2阳光发放)
 * @param {String} userName 姓名
 * @param {String} idCard 身份证号
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPGetComplaintsListByInformant = (
  chb51c,
  userName,
  idCard,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '个人投诉信息查询',
    methodName: 'getComplaintsListByInformant',
    chb511: userName,
    chb512: idCard,
    userIdCard: idCard,
    limit: pageSize + '',
    page: pageNo + '',
    chb51c,
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
export { requestSPGetComplaintsListByInformant }
