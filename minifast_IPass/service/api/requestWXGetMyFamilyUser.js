import { request } from '@/service/request'

/**
 * 获取家庭成员
 * @param {String} familyId
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXGetMyFamilyUser = (
  familyId,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '获取家庭成员',
    familyId,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontFamilyRestService/getMyFamilyUser',
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
export { requestWXGetMyFamilyUser }
