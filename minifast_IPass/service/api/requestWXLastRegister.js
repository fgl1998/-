import { request } from "@/service/request";

/**
 * 查询最后一次到访记录
 * @param {String} aac002 身份证
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXLastRegister = (
  aac002,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: "查询最后一次到访记录",
    aac002,
  };

  return new Promise((resolve, reject) => {
    request(
      "/frontRestService/frontRegisterRestService/lastRegister",
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
export { requestWXLastRegister };
