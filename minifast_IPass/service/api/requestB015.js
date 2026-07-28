import { request } from '@/service/request'

/**
 * 公示数据

 * @param {String} chi031 补贴项目
 * @param {String} cpb100
 * @param {String} chb000
 * @param {String} che063 类型 04 公示
 * @param {String} chb009 
 * @param {String} chb00z 代办人身份证号
 * @param {String} aac002 
 * @param {String} aac003 
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {String} [type] 
 * @param {Boolean} [isShowLoading] 是否显示加载中动画 默认值 true
 * @param {Boolean} [isShowErrorToast] 是否显示错误提示 默认值 true
 * @returns
 */

const requestB015 = (
  chi031,
  cpb100,
  chb000,
  che063,
  chb009,
  chb00z,
  aac002,
  aac003,
  pageNo,
  pageSize,
  type = 'cpb100s',
  aae036_1 = '',
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '公示数据',
    methodName: 'B015',
    aae100: '',
    chb01b: '',
    desen: '1', // 是否脱敏
    type,
    aae036_1,
    chi031,
    chb000,
    che063,
    filterChb004: '1', // 过滤查询条件chb004
    cpb100s: cpb100,
    pageNo: pageNo + '',
    pageSize: pageSize + '',

    chb009,
    chb00z,
    aac002,
    aac003
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
export { requestB015 }
