import { request } from '@/service/request'

/**
 * 家庭信息查询
 * @param {String} idCard
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXGetMyFamilyInfo = (
  idCard,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    idCard,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontFamilyRestService/getMyFamilyInfo',
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
export { requestWXGetMyFamilyInfo }
