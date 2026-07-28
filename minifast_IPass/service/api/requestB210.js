import { request } from '@/service/request'

/**
 * 查询补贴项目
 * @param {string} [chi032=''] 补贴项目名称。 默认值 `''`。
 * @param {string} [chi031=''] 补贴项目编码。 默认值 `''`。
 * @param {string} [chi037=''] 部门编码。 默认值 `''`。
 * @param {number} [pageNo=1] 查询页数。默认值 `1`
 * @param {number} [pageSize=10] 查询数量。默认值 `10`。
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB210 = (
  chi032 = '',
  chi031 = '',
  chi037 = '',
  pageNo = 1,
  pageSize = 10,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '查询补贴项目',
    methodName: 'B210',
    chi032,
    chi031,
    chi037,
    pageNo: pageNo + '',
    pageSize: pageSize + ''
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB210 }
