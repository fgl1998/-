import requestConstant from './requestUrl'
import api from './app_request'
import { Message, MessageBox } from 'element-ui'

const success_key = 'success'
const get_qrcode_key = 'get_qrcode'
const dzsbk_code_type = 'e_social_card'
const wx_code_type = 'we_chat_applet'
var timer = null
const timeExecutor = 3000
const code_state_not_scan = 'PENDING'
const code_state_expire = 'EXPIRED'
const code_state_scan_end = 'SCANEND'
const code_state_confirmd = 'CONFIRMED'
const code_state_invalid = 'INVALID'

const getLoginInfo = () => {
  return JSON.parse(sessionStorage.getItem(requestConstant.LOGININFO))
  // return uni.getStorageSync(requestConstant.LOGININFO);
}
const setLoginInfo = (info) => {
  sessionStorage.setItem(requestConstant.LOGININFO, JSON.stringify(info))
  // uni.setStorageSync(requestConstant.LOGININFO, info)
}
const setToken = (token) => {
  sessionStorage.setItem(requestConstant.TERMINALJTOKEN, token)
  // uni.setStorageSync(requestConstant.TERMINALJTOKEN,token)
}
const getToken = () => {
  return sessionStorage.getItem(requestConstant.TERMINALJTOKEN)
  // return uni.getStorageSync(requestConstant.TERMINALJTOKEN)
}
const removeLoginInfo = () => {
  sessionStorage.removeItem(requestConstant.LOGININFO)
  sessionStorage.removeItem(requestConstant.TERMINALJTOKEN)
  // uni.removeStorageSync(requestConstant.LOGININFO)
  // uni.removeStorageSync(requestConstant.TERMINALJTOKEN)
}
const isLogin = () => {
  return !!getToken()
}

const getQrCode = async (requestType, businessType, qrCodeId, type) => {
  const param = {
    requestType: requestType,
    businessType: businessType,
    qrCodeId: qrCodeId,
    // businessParam: JSON.stringify({
    //   userType: 'UT02',
    // }),
  }
  var result = new Object()
  await api.post(requestConstant.qrcodeRequestType, null, null, param, false).then((res) => {
    let data = JSON.parse(res)
    if (data.flag != success_key) {
      Message.error('获取二维码失败，请重新获取!')
      result = false
      return
    }
    // 判断二维码类型，返回对应的二维码
    const qrCodeData = data.result

    if (!qrCodeData) {
      Message.error('获取二维码失败，请重新获取!')
      result = false
      return
    }
    switch (businessType) {
      case dzsbk_code_type: // 电子社保卡
        result = { id: qrCodeData.qRCodeId, url: qrCodeData.qRCodeBase64Src }
        break
      case wx_code_type: // 微信小程序二维码
        // result = { id: qrCodeData.qrCodeId, url: `a=${qrCodeData.qrCodeId}&b=19&c=UT02&d=1&g=${getLoginInfo().aab998}` }
        result = { id: qrCodeData.qRCodeId, url: qrCodeData.qRCodeBase64Src }
        break
      default:
        break
    }
  })
  return result
}

// 获取二维码以及扫码结果
// const recursionGetScanResult = (requestType, businessType, qrCodeId, type) => {
//   if (timer != null) {
//     clearTimeout(timer)
//   }
//   timer = setTimeout(() => {
//     const param = {
//       requestType: requestType,
//       businessType: businessType,
//       qrCodeId: qrCodeId,
//       businessParam: businessType,
//     }
//     api.post(requestConstant.qrcodeRequestType, null, null, param, false).then((res) => {
//       let data = JSON.parse(res)
//       if (data.flag != success_key) {
//         // 请求失败，重新获取
//         recursionGetScanResult(requestType, businessType, qrCodeId, type)
//         return
//       }

//       // 未获取到扫码结果以及二维码状态为未扫描时继续轮询

//       if (!data.result || (data.result.qrCodeStatusEnum && data.result.qrCodeStatusEnum == code_state_not_scan)) {
//         recursionGetScanResult(requestType, businessType, qrCodeId, type)
//         return
//       }
//       // 二维码失效
//       if (data.result.qrCodeStatusEnum == code_state_expire) {
//         Message.error('二维码失效，请重新获取!')
//         return
//       }
//       let loginInfo = getLoginInfo()
//       console.log(loginInfo, 'loginInfo')
//       setToken(data.result.token)
//       switch (businessType) {
//         case dzsbk_code_type: {
//           loginInfo.name = data.result.userInfo.accountBo.agencyBoList[0].name
//           loginInfo.mobile = data.result.userInfo.accountBo.agencyBoList[0].mobile
//           loginInfo.accountId = data.result.userInfo.accountBo.accountId
//           loginInfo.loginId = data.result.userInfo.customMap.aac301
//           loginInfo.user_id = data.result.userInfo.customMap.aac301
//           break
//         }
//         case wx_code_type: {
//           loginInfo.name = data.result.userInfo.accountBo.agencyBoList[0].name
//           loginInfo.mobile = data.result.userInfo.accountBo.agencyBoList[0].mobile
//           loginInfo.accountId = data.result.userInfo.accountBo.accountId
//           loginInfo.loginId = data.result.userInfo.customMap.aac301
//           loginInfo.user_id = data.result.userInfo.customMap.aac301
//           break
//         }
//         default:
//           break
//       }
//       setLoginInfo(loginInfo)
//       Message.success('登录成功')
//       uni.navigateTo({
//         url: '/pages/uniCenter/index',
//       })
//     })
//   }, timeExecutor)
// }
const recursionGetScanResult = (requestType, businessType, qrCodeId, type,businessParam) => {
  if (timer) clearTimeout(timer)

  const poll = (resolve) => {
    timer = setTimeout(() => {
      const param = {
        requestType,
        businessType,
        qrCodeId,
        businessParam: businessParam,
      }
      api
        .post(requestConstant.qrcodeRequestType, null, null, param, false)
        .then((res) => {
          const data = JSON.parse(res)
          const status = data?.result?.qrCodeStatusEnum
          // 请求失败或未扫继续轮询
          if (data.flag !== success_key || !data.result || status === code_state_not_scan) {
			clearTimeout(timer)
            poll(resolve)
            return
          }

          // 过期：返回状态给页面决定是否刷新二维码
          if (status === code_state_expire || status === code_state_invalid) {
            clearTimeout(timer)
            resolve({ status: 'expired' })
            return
          }
          if (status === code_state_scan_end) {
            clearTimeout(timer)
            resolve({ status: 'scanend' })
            return
          }
          // 成功：写 token 和用户信息
          const loginInfo = getLoginInfo() || {}
          setToken(data.result.customInfo.token)
          switch (businessType) {
            case dzsbk_code_type:
            case wx_code_type:
              // loginInfo.name = data.result.customInfo.userInfo.accountBo.agencyBoList[0].name
              // loginInfo.mobile = data.result.customInfo.userInfo.accountBo.agencyBoList[0].mobile
              loginInfo.accountId = data.result.customInfo.user.currentUser.accountBo.accountId
              // loginInfo.loginId = data.result.customInfo.userInfo.customMap.aac301
              loginInfo.user_id = data.result.customInfo.user.currentUser.customMap.userId
              break
            default:
              break
          }
          // setLoginInfo(loginInfo)
          clearTimeout(timer)
          resolve({
            status: 'authed',
            token: data.result.customInfo.token,
            accountId: data.result.customInfo.user.currentUser.accountBo.accountId,
            userId: data.result.customInfo.user.currentUser.customMap.userId,
            aab001: data.result.customInfo.user.currentUser.customMap.aab001,
            aac001: data.result.customInfo.user.currentUser.customMap.aac001,
          })
        })
        .catch(() => poll(resolve))
    }, timeExecutor)
  }

  return new Promise((resolve) => poll(resolve))
}

export default {
  getLoginInfo,
  setLoginInfo,
  removeLoginInfo,
  isLogin,
  setToken,
  getToken,
  getQrCode,
  recursionGetScanResult,
}
