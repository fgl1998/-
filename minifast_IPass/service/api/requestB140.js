import { request } from '@/service/request'
/**
 * 提交问卷信息并签退
 * @param {Array} ht35List 个人信息
 * @param {Array} ht36List 问卷信息
 * @param {Array} userList
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB140 = (
  ht35List,
  ht36List,
  userList,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: '提交问卷信息并签到',
    methodName: 'B140',
    ht35List:JSON.stringify(ht35List),
    ht36List:JSON.stringify(ht36List),
    userList:JSON.stringify(userList),
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
export { requestB140 }
