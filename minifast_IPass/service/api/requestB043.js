import { request } from '@/service/request'
import config from '@/config'

/**
 * 获取个人社保卡信息
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB043 = (
  aac002,
  aac003,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取个人社保卡信息',
    methodName: 'B043',
    aac002,
    aac003,
    aab301: config.areaCode,
  }
  return new Promise((resolve, reject) => {
    request(
        '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp',
        data,
        isShowLoading,
        isShowErrorToast
      )
      .then((res) => {
        const {
          list
        } = res.lists.bankInfoList
        if (list && list.length > 0) {
          const len = list.length
          let SSCInfo = list[0]
          for (let i = 0; i < len; i++) {
            if (list[i].aaz502 === '1') {
              SSCInfo = list[i]
              break
            }
          }
          resolve(SSCInfo)
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestB043 }