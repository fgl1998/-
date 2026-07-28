import config from '@/config'
import { showModal } from '@/utils/uni-api'
import { getIsDev } from '@/utils/get'
import { request } from '@/service/request'

/**
 * 获取地址
 * @param {Object} params 参数
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestSPGetOrgListByOrgId = (
  params = {},
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const { areaCode, SPAddressRequestParams } = config
  const isDev = getIsDev()

  if (!SPAddressRequestParams && isDev) {
    showModal(
      `该地市还未整合审批系统地址接口，请在 /config/citys/${areaCode}.js 文件中配置SPAddressRequestParams字段。具体参考同文件下的511000.js！！！`
    )
    return
  }

  const data = {
    methodnamedesc: '获取地址',
    methodName: 'getOrgListByOrgId',
    ...SPAddressRequestParams,
    ...params,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataTwo',
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
export { requestSPGetOrgListByOrgId }
