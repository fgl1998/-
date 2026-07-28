import { request } from "@/service/request";

/**
 * 个人待遇明细
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {String} year 年度
 * @param {Number} pageNo 页数
 * @param {Number} pageSize 每页条数
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetStageTreatment = (
  aac002,
  aac003,
  year,
  pageNo,
  pageSize,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "个人待遇明细",
    methodName: "getResultFromHmhnDs",
    methodNameDs: "getTreatment",
    pagenumber: pageNo + "",
    aac002: aac002.toLocaleUpperCase(),
    aac003,
    year,
    pagesize: pageSize + "",
  };
  return new Promise((resolve, reject) => {
    request(
      "/frontRestService/frontBcpDataRestService/getWebServiceDataForDs",
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
export { requestDSGetStageTreatment };
