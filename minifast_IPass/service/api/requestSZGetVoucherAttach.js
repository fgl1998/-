import { request } from "@/service/request";

/**
 * 查询附件
 * @param {String} voucherkey 附件标识
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestSZGetVoucherAttach = (
  voucherkey,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodNameDesc: "查询资金附件",
    methodName: "getVoucherAttach",
    voucherkey,
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
export { requestSZGetVoucherAttach };
