import { request } from '@/service/request'

/**
 * 获得所有补贴项目
 * @param {string} che481 用户类型
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestBusinessList = (
  che481, 
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '补贴项目列表查询',
    methodName: 'B016',
    che481
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
export { requestBusinessList }
