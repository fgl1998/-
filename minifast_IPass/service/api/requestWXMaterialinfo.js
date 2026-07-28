import { request } from '@/service/request'

/**
 * 疫情登记材料查询接口
 * @param {String} aka131 ren
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXMaterialinfo = (
  aka131,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '疫情登记材料查询接口',
    aka131,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontRegisterRestService/materialinfo',
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
export { requestWXMaterialinfo }
