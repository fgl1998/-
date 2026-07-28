import { request } from "@/service/request";

/**
 * 查询资源公开数据
 * @param {String} unitno
 * @param {String} inputDate1 开始日期
 * @param {String} inputDate2 结束日期
 * @param {Number} pageIndex 起始页
 * @param {Number} pageSize 每页大小
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSZSelectZyResourcesList = (
  unitno,
  inputDate1,
  inputDate2,
  pageIndex,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "查询资源公开数据",
    methodName: "selectZyResourcesList",
    unitno,
    inputDate1,
    inputDate2,
    pageIndex,
    pageSize,
  };
  return new Promise((resolve, reject) => {
    request(
      "/frontRestService/frontBcpDataRestService/getHttpClientSz",
      data,
      isShowLoading,
      isShowErrorToast
    )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export { requestSZSelectZyResourcesList };
