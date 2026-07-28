import { request } from '@/service/request'

/**
 * 查询以工代赈项目工程名单
 * @param {String} chb015 区县
 * @param {String} chb017 乡镇
 * @param {String} aab301 地市编码
 * @param {String} chi931 项目工程类别
 * @param {String} chi934 项目工程名称
 * @param {String} chi037 业务局
 * @param {String} pageNo 页数
 * @param {String} pageSize 条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestB161 = (
    chb015,
    chb017,
    aab301,
    chi931,
    chi934,
    chi037,
    pageNo,
    pageSize,
    isShowLoading = true,
    isShowErrorToast = true
) => {
    const data = {
        methodNameDesc: '查询以工代赈项目工程名单',
        methodName: 'B161',
        chb015,
        chb017,
        aab301,
        chi931,
        chi934,
        chi037,
        pageNo,
        pageSize,
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
export { requestB161 }