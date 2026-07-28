import { request } from "@/service/request";

/**
 * 查询行政区划及单位账套
 * @param {String} year
 * @param {String} returnTop //首次进入传false,查询所有区县
 * @param {String} parentId //上级组织的id
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSZQueryAreaUnit = (
  year,
  returnTop,
  parentId,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "查询行政区划及单位账套",
    methodName: "queryAreaUnitLazy",
    year,
    returnTop,
    parentId,
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
export { requestSZQueryAreaUnit };
