import config from '@/config'
import { useGetIsDev } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
/**
 * @param {string} type orgid或者orglevel
 * @returns
 * 获取地址审批接口 getOrgListByOrgId 传递的参数
 */
const getOrgListByOrgIdParams = (type) => {
  // 当前环境是否为开发环境
  const isDev = useGetIsDev()
  const { areaCode } = config
  let params = {
    methodName: 'getOrgListByOrgId',
    orglevel: '2',
  }
  switch (areaCode) {
    // 海南省
    case '430000':
      params = {
        ...params,
        orgid: '1',
        orglevel: '1',
      }
      break
    // 云南省
    case '530000':
      params = {
        ...params,
        orgid: '1',
        orglevel: '1',
      }
      break
    // 成都
    case '510100':
      params = {
        ...params,
        orgid: '111637',
        orglevel: '1',
      }
      break
    // 自贡
    case '510300':
      params = {
        ...params,
        orgid: '102414',
        orglevel: '1',
      }
      break
    // 攀枝花
    case '510400':
      params = {
        ...params,
        orgid: '1678510',
        orglevel: '1',
      }
      break
    // 泸州
    case '510500':
      params = {
        ...params,
        orgid: '510500',
        orglevel: '1',
      }
      break
    // 遂宁
    case '510900':
      params = {
        ...params,
        orgid: '100040',
      }
      break
    // 内江
    case '511000':
      params = {
        ...params,
        orgid: '110386',
      }
      break
    case '511100':
      params = {
        ...params,
        orgid: '110386',
        orglevel: '1',
      }
      break
    // 南充
    case '511300':
      params = {
        ...params,
        orgid: '511300',
      }
      break
    // 宜宾
    case '511500':
      params = {
        ...params,
        orgid: '511500',
        orglevel: '1',
      }
      break
    // 广安
    case '511600':
      params = {
        ...params,
        orgid: '511600',
        orglevel: '1',
      }
      break
    // 达州
    case '511700':
      params = {
        ...params,
        orgid: '1569450',
      }
      break
    // 雅安
    case '511800':
      params = {
        ...params,
        orgid: '101166',
        orglevel: '1',
      }
      break
    // 巴中
    case '511900':
      params = {
        ...params,
        orgid: '511900',
        orglevel: '2',
      }
      break
    // 资阳
    case '512000':
      params = {
        ...params,
        orgid: '1679870',
      }
      break
    // 阿坝
    case '513200':
      params = {
        ...params,
        orgid: '124327',
        orglevel: '1',
      }
      break
    // 甘孜
    case '513300':
      params = {
        ...params,
        orgid: '2239417',
        orglevel: '1',
      }
      break
    // 凉山
    case '513400':
      params = {
        ...params,
        orgid: '1682016',
        orglevel: '1',
      }
      break
    default:
      if (isDev) {
        showModal(
          '该地市还未整合' + ' getOrgListByOrgId 接口' + '，请联系管理员！'
        )
      }
      break
  }
  if (!type) {
    return params
  } else {
    return params[type]
  }
}

export { getOrgListByOrgIdParams }
