import { request } from "@/service/request";

/**
 * 疫情到访登记接口
 * @param {String} aac002 身份证号
 * @param {String} aac003 姓名
 * @param {String} tel 电话号码
 * @param {String} aka131 人员类别
 * @param {String} unitname 到访单位（码值）
 * @param {String} content 来访内容
 * @param {String} place 来访人员地址
 * @param {String} visitnumber 访问编号
 * @param {String} visitplace 来访单位
 * @param {String} [isUpdate] 是否更新上次提交
 * @param {String} [id] id
 * @param {Boolean} [isShowLoading=true] 是否显示加载中。默认 `true`
 * @param {Boolean} [isShowErrorToast=true] 是否显示接口返回的错误提示。默认 `true`
 * @returns
 */
const requestWXInsertRegister = (
  aac002,
  aac003,
  tel,
  aka131,
  unitname,
  content,
  place,
  visitnumber,
  visitplace,
  isUpdate,
  id,
  isShowLoading = true,
  isShowErrorToast = true
) => {
  const data = {
    methodnamedesc: "疫情到访登记接口",
    aac002,
    aac003,
    aka131,
    unitname,
    content,
    place,
    visitnumber,
    visitplace,
    tel,
    isUpdate,
    id,
  };

  return new Promise((resolve, reject) => {
    request(
      "/frontRestService/frontRegisterRestService/insertRegister",
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
export { requestWXInsertRegister };
