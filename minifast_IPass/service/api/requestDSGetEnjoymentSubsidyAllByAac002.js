import { request } from "@/service/request";

/**
 * 获取个人享受补贴项目列表
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestDSGetEnjoymentSubsidyAllByAac002 = (
  aac002,
  aac003,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "获取个人享受补贴项目列表",
    methodName: "getResultFromHmhnDs",
    methodNameDs: "getEnjoymentSubsidyAllByAac002",
    aac002: aac002.toLocaleUpperCase(),
    aac003,
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
export { requestDSGetEnjoymentSubsidyAllByAac002 };
