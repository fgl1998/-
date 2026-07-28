import { request } from '@/service/request'

/**
 *
 * @param {string} aac002
 * @param {string} aac003
 * @param {string} chi031
 * @param {string} aae209
 * @param {string} aac005
 * @param {string} chi037
 * @param {string} chb0gf
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB126 = (
  aac002,
  aac003,
  chi031,
  aae209,
  aac005,
  chi037,
  chb0gf,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '',
    methodName: 'B126',
    aac002,
    aac003,
    chi031,
    aae209,
    aac005,
    chi037,
    chb0gf,
    validateCodeStr: '1',
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
export { requestB126 }
