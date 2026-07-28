import { request } from '@/service/request'

/**
 * 请求加入我的家
 * @param {String} userName
 * @param {String} idCard
 * @param {String} familyId
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestWXInsertFamilyNumber = (
  userName,
  idCard,
  familyId,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '请求加入我的家',
    userName,
    idCard,
    familyId,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontFamilyRestService/insertFamilyNumber',
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
export { requestWXInsertFamilyNumber }
