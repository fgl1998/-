import { request } from '@/service/request'

/**
 * 创建家庭
 * @param {String} idCard
 * @param {String} userName
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXInsertFamily = (
  idCard,
  userName,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    idCard,
    userName,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontFamilyRestService/insertFamily',
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
export { requestWXInsertFamily }
