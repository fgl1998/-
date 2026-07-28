import { request } from '@/service/request'

/**
 * 查询补贴项目补贴享受人员的校验结果
 * @param {String} chb000
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestB013 = (chb000, pageNo, pageSize, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '查询补贴项目补贴享受人员的校验结果',
    methodName: 'B013',
    chb000,
    chr032: '',
    pageNum: pageNo + '',
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
export { requestB013 }
