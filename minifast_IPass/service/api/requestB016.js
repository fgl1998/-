import { request } from '@/service/request'

/**
 * 获得所有补贴项目
 * @param {string} chi032 补贴项目名称
 * @param {string} aae100 补贴项目有效性 0 1
 * @param {string} chi04y 补贴项目是否是微信端申报  1 0
 * @param {string} chi037 业务局
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB016 = (
  chi032 = '',
  aae100 = '',
  chi04y = '',
  chi037 = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '获得所有补贴项目',
    methodName: 'B016',
    chi032,
    aae100,
    chi04y,
    chi037,
    chi121: '', // 微信端申报入口(1:群众小程序 2:经办人小程序)
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
export { requestB016 }
