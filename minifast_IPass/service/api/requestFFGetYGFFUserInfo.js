import { request } from '@/service/request'

/**
 * 获取用户发放系统岗位信息
 * @param {String} aac002 身份证号
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestFFGetYGFFUserInfo = (
  aac002,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '获取用户发放系统岗位信息',
    methodName: 'getYGFFUserInfo',
    aac002,
  }
  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontBcpDataRestService/getWebServiceData',
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        const { fieldData } = res
        if (fieldData) {
          let { orgnamepath, position } = fieldData
          if (orgnamepath) {
            orgnamepath = orgnamepath.split('/').join('')
          }

          let positionName = ''
          position = JSON.parse(position)
          const len = position.length

          if (position && len > 0) {
            let arr = []
            position.map((item) => {
              arr.push(item.positionname)
            })
            positionName = arr.join(',')
          }
          resolve({
            positionName,
            orgnamepath,
          })
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestFFGetYGFFUserInfo }
