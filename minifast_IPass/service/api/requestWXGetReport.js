import { request } from '@/service/request'

/**
 * 获取年度报告
 * @param {String} idcard 身份证号
 * @param {String} year 年度
 * @param {Boolean} isShowLoading 是否显示加载中动画 默认值 true
 * @param {Boolean} isShowErrorToast 是否显示错误提示 默认值 true
 * @returns
 */

const requestWXGetReport = (idcard, year, isShowLoading = true, isShowErrorToast = true) => {
  const data = {
    methodnamedesc: '获取年度报告',
    idcard,
    year
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontReportRestService/getReport', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestWXGetReport }
