import { request } from '@/service/request'

/**
 * 商铺物品新增
 * @param {String} chi620 物品类别
 * @param {String} chi621 物品名称
 * @param {String} chi622 物品参考价格
 * @param {String} chi624 支付比例
 * @param {String} chi625 备注
 * @param {String} cht130 商铺主键
 * @param {String} cht141 实际价格
 * @param {Array} hi21List
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */

const requestB055 = (
  chi620,
  chi621,
  chi622,
  chi624,
  chi625,
  cht130,
  cht141,
  hi21List,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '商铺物品新增',
    methodName: 'B055',
    hi21List: JSON.stringify(hi21List),
    chi620,
    chi621,
    chi622,
    chi623: '1',
    chi624,
    chi625,
    cht130,
    cht141,
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
export { requestB055 }
