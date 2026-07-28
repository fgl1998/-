import { request } from "@/service/request";

/**
 * 查询资金公开数据
 * @param {String} unitid 单位
 * @param {Number} startDate 开始时间
 * @param {Number} stopDate 结束时间
 * @param {Number} year 年度
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSZFinancialDisclosure = (
  unitid,
  startDate,
  stopDate,
  year,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "查询资金公开数据",
    methodName: "financialDisclosure",
    unitid,
    year,
    startDate,
    stopDate,
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
export { requestSZFinancialDisclosure };
