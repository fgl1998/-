import { request } from '@/service/request'

/**
 * 疫情到访登记列表查询
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {String} unitname 到访单位
 * @param {String} [aka131] 人员类别
 * @param {String} [registime] 登记时间
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetRegisterInfo = (
  pageNo,
  pageSize,
  unitname,
  aka131,
  registime,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '疫情到访登记列表查询',
    pageIndex: pageNo + '',
    pageSize: pageSize + '',
    aka131,
    registime,
    unitname
  }

  return new Promise((resolve, reject) => {
    request('/frontRestService/frontRegisterRestService/getRegisterInfo', data, isShowLoading, isShowErrorToast)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export { requestWXGetRegisterInfo }
