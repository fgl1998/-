/**
 * 拨打电话
 * @param {string} phoneNumber 需要拨打的电话号码
 * 
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/system/phone?id=makephonecall
 * @returns {Promise}
 *
 * @example
  makePhoneCall('13211111111').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
 */
const makePhoneCall = (phoneNumber) => {
  // 当前环境是否为开发环境
  // const isDev = useGetIsDev();
  // #ifdef MP-ALIPAY
  // #endif
  return new Promise((resolve, reject) => {
    uni.makePhoneCall({
      phoneNumber,
      success(res) {
        resolve(res);
      },
      fail(err) {
        console.error("makePhoneCall 接口调用失败 => ", err);
        reject(err);
      },
    });
  });
};
export { makePhoneCall };
