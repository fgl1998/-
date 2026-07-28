import { request } from '@/service/request'

/**
 * 验证身份证号是否已经被其他用户绑定
 * @param {String} idCard 身份证号
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXCheckIdCard = (
  idCard,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '验证身份证号是否已经被其他用户绑定',
    idCard,
    userType: '1',
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontLoginRestService/checkIdCard',
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
export { requestWXCheckIdCard }
