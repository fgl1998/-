import { request } from '@/service/request'

/**
 * 数据统计
 * @param {Object} params 采集的数据
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXInsertUserVist = (params, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    ...params,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontUserBehaviorRestService/insertUserVist',
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
export { requestWXInsertUserVist }
