import { request } from '@/service/request'

/**
 * 疫情到访今日统计查询接口
 * @param {String} registime 当日日期 2000-01-01
 * @param {String} unitname 到访单位
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXGetRegisterCount = (
  registime,
  unitname,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: '疫情到访今日统计查询接口',
    registime,
    unitname: unitname,
  }

  return new Promise((resolve, reject) => {
    request(
      '/frontRestService/frontRegisterRestService/getRegisterCount',
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
export { requestWXGetRegisterCount }
