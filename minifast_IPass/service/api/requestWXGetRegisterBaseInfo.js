import { request } from '@/service/request'

/**
 * 疫情到访登记详情
 * @param {String} id
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetRegisterBaseInfo = (
  id,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '疫情到访登记详情',
    id,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontRegisterRestService/getRegisterBaseInfo',
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
export { requestWXGetRegisterBaseInfo }
