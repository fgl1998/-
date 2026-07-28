import { request } from '@/service/request'

/**
 * 根据商铺id返回申报的材料列表
 * @param {String} cht130 商铺主键
 * @param {String} chi031 补贴项目
 * @param {String} cht140 物品主键
 * @param {String} aac002 购买人身份证号码
 * @param {String} cht193 备注
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB046 = (
  cht130,
  chi031,
  cht140,
  aac002,
  cht193 = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '根据商铺id返回申报的材料列表',
    methodName: 'B046',
    chi031, // 补贴项目
    aac002, // 购买人身份证号码
    cht140, // 物品主键
    cht193, // 备注
    cht130,
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
export { requestB046 }
