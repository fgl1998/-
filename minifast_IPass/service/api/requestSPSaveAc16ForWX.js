import { request } from '@/service/request'

/**
 * 生存认证放行申请
 * @param {String} cac161 户籍地址
 * @param {String} cac162 申请原因
 * @param {String} cac163 申请说明
 * @param {String} aac003 提交者姓名
 * @param {String} aac002 提交者身份证
 * @param {String} chb015 受理区县
 * @param {String} chb017 受理乡镇
 * @param {String} chb018 受理村
 * @param {String} chi031 补贴项目编号
 * @param {object} cac16d 放行申请类型 1 首次申报放行 2 周期生存认证放行
 * @param {String} cac16e 代办人身份证
 * @param {String} cac16f 代办人姓名
 * @param {object} declareInfo 提交的申报数据
 * @param {object} hi21List 证明材料
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSPSaveAc16ForWX = (
  cac161,
  cac162,
  cac163,
  aac003,
  aac002,
  chb015,
  chb017,
  chb018,
  chi031,
  cac16d,
  cac16e,
  cac16f,
  declareInfo,
  hi21List,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '生存认证放行申请',
    methodName: 'saveAc16ForWX',
    cac161,
    cac162,
    cac163,
    aac003,
    aac002,
    chb015,
    chb017,
    chb018,
    chi031,
    cac16d,
    cac16e,
    cac16f,
    cac16g: JSON.stringify(declareInfo),
    hi21List: JSON.stringify(hi21List),
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
export { requestSPSaveAc16ForWX }
