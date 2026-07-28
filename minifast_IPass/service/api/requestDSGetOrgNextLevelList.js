import config from '@/config'
import { showModal } from '@/utils/uni-api'
import { getIsDev } from '@/utils/get'
import { request } from '@/service/request'

/**
 * 获取地址
 * @param {object} params 参数
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestDSGetOrgNextLevelList = (
  params = {},
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const { areaCode, FFAddressRequestParams } = config
  const isDev = getIsDev()

  if (!FFAddressRequestParams && isDev) {
    showModal(
      `该地市还未整合发放系统地址接口，请在 /config/citys/${areaCode}.js 文件中配置FFAddressRequestParams字段。具体参考同文件下的511000.js！！！`
    )
    return
  }

  const data = {
    methodNamedesc: '获取地址',
    methodName: 'getResultFromHmhnDs',
    methodNameDs: 'getOrgNextLevelList',
    ...FFAddressRequestParams,
    ...params,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceDataForDs',
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
export { requestDSGetOrgNextLevelList }
