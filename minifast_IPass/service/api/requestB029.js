import { request } from '@/service/request'

/**
 * 用于查询个人的申报详情
 * @param {String} chb000
 * @param {String} aae100
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB029 = (
  chb000,
  aae100,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '用于查询个人的申报详情',
    methodName: 'B029',
    chb000,
    aae100,
    filterChb004: '1', // 过滤查询条件chb004
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp',
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
export { requestB029 }
