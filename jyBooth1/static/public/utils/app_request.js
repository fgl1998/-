import requestConstant from './requestUrl.js'
import loginConfig from './login_config.js'
import terminalencrypt from './crypt/terminalencrypt.js'
import { Message } from 'element-ui'
import request_xception from './request_exception.js'

function toLoginPage() {
  uni.navigateTo({
    url: '/pages/loginPage/loginPage',
  })
}

function logOut() {
  // loginConfig.removeLoginInfo()
  // toLoginPage()
  post(requestConstant.logOutRequestType, null, null, null, true)
}

function loginAuthRequest(data) {
  let loginInfo = loginConfig.getLoginInfo()
  data.userType = requestConstant.user_type
  data.authType = requestConstant.auth_type
  data.legalId = loginInfo.aab001
  data.aae400 = '18'
  // data.yae100 = requestConstant.yae100
  // data.dwNo = loginInfo.aab001
  console.log(data, '登录参数')
  const data2 = {
    authType: 'MESSAGE',
    userType: 'UT02',
    mobile: '13882974941',
    checkCode: '1',
  }

  post(requestConstant.loginRequestType, null, null, data, true).then((res) => {
    loginConfig.setToken(res.token)
    loginInfo = loginInfo || {}
    loginInfo.accountId = res.user.currentUser.accountBo.accountId
    loginInfo.user_id = res.user.currentUser.customMap.userId
    loginInfo.aab001 = res.user.currentUser.customMap.aab001
    loginInfo.aac001 = res.user.currentUser.customMap.aac001
    // let user = res.user.currentUser.accountBo.agencyBoList[0]
    let user = res.user.currentUser.customMap
    loginConfig.setLoginInfo(loginInfo)
    post(
      requestConstant.businessRequestType,
      'jy201_hrm503',
      null,
      {
        aab001: loginInfo.aab001,
        // aac147: user.aac147,
        aac001: loginInfo.aac001,
        pageNumber: 1,
        pageSize: 100,
      },
      true,
    ).then((data) => {
      let hr = data.data.pageBean.list[0]
      if (!hr) {
        Message.error('未查询到单位联系人信息，请到xxx网站企业中心进行hr绑定!')
        logOut()
        return
      }
      hr.user_id = hr.acb00p
      let newUserInfo = Object.assign(loginInfo, hr)
      loginInfo.loginId = hr.acb00p
      loginInfo.name = hr.acb224
      loginInfo.mobile = hr.acb225
      loginConfig.setLoginInfo(newUserInfo)
      uni.navigateTo({
        url: '/pages/uniCenter/index',
      })
    })
  })
}

function loginAuthRequestByAcount(data) {
  const param = {
    ...data,
  }
  post(requestConstant.commonRequestType, 'jy002_QueryApi', null, param, false).then((res) => {
    console.log(res, 88888)

    loginConfig.setToken(res.token)
    loginInfo = loginInfo || {}
    loginInfo.accountId = res.user.currentUser.accountBo.accountId
    // let user = res.user.currentUser.accountBo.agencyBoList[0]
    let user = res.user.currentUser.customMap
    loginConfig.setLoginInfo(loginInfo)
    post(requestConstant.businessRequestType, 'jy201_hrm503', null, {
      aab001: loginInfo.aab001,
      aac147: user.aac147,
      acb22d: '1',
      pageNumber: 1,
      pageSize: 100,
    }).then((data) => {
      let hr = data.data.pageBean.list[0]
      if (!hr) {
        Message.error('未查询到单位联系人信息，请到xxx网站企业中心进行hr绑定!')
        logOut()
        return
      }
      hr.user_id = hr.acb00p
      let newUserInfo = Object.assign(loginInfo, hr)
      loginInfo.loginId = hr.acb00p
      loginInfo.name = hr.acb224
      loginInfo.mobile = hr.acb225
      loginConfig.setLoginInfo(newUserInfo)
      uni.navigateTo({
        url: '/pages/uniCenter/index',
      })
    })
  })
}

function get(obj) {
  return request(obj.url, 'GET', obj.data, obj.loadStyle)
}

/**
 * @param {Object} type 接口类型
 * @param {Object} apiCode 接口名称
 * @param {Object} header 请求头
 * @param {Object} data 请求参数
 * @param {Object} loadStyle 是否显示加载
 */
function post(type, apiCode, header, data, loadStyle, isCode) {
  header = header || {}
  data = data || {}
  header.channelCode = requestConstant.channelCode
  let codeData = data

  switch (type) {
    case requestConstant.commonRequestType: {
      // 通用接口
      let url = requestConstant.requestUrl + requestConstant.interfaceUrl
      data.apiCode = apiCode
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(null, url, 'POST', header, data, loadStyle)
    }
    case requestConstant.loginRequestType: {
      // 登录接口
      let url = requestConstant.requestUrl + requestConstant.loginAuth
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle)
    }
    case requestConstant.logOutRequestType: {
      let url = requestConstant.requestUrl + requestConstant.logoutUrl
      let userInfo = loginConfig.getLoginInfo()
      console.log(userInfo, 'userInfo')

      data.userId = userInfo.accountId
      header[requestConstant.TERMINALJTOKEN] = loginConfig.getToken()
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle)
    }
    case requestConstant.codeRequestType: {
      // 码值接口
      let url = requestConstant.requestUrl + requestConstant.codeUrl
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, codeData, loadStyle)
    }
    case requestConstant.qrcodeRequestType: {
      console.log(data, 'data')

      data.aae400 = requestConstant.aae400
	  if(!data.businessParam){
		  data.businessParam = JSON.stringify({
		    userType: requestConstant.user_type,
		    // aab998: loginConfig.getLoginInfo().aab998,
		    // b: requestConstant.yae100,
		    // c: requestConstant.user_type,
		    // g: loginConfig.getLoginInfo().aab998,
		  })
	  }
      let url = requestConstant.requestUrl + requestConstant.qrcodeUrl
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle)
    }
    case requestConstant.sendCheckCodeSmsRequestType: {
      let url = requestConstant.requestUrl + requestConstant.sendCheckCodeSmsUrl
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle)
    }

    case requestConstant.otherType: {
      data.yae100 = requestConstant.yae100
      let url = requestConstant.requestUrl + apiCode
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle, isCode)
    }

    default: {
      // 业务接口
      // let url = requestConstant.requestUrl + requestConstant.businessUrl + '/' + apiCode
      let url = requestConstant.requestUrl + requestConstant.businessUrl
      data.apiCode = apiCode
      // data.method = apiCode
      header[requestConstant.TERMINALJTOKEN] = loginConfig.getToken() || ''
      let userInfo = loginConfig.getLoginInfo()
      if (!requestConstant.excludeAab001Api.includes(apiCode)) {
        // data.user_id = userInfo.user_id
        data.aab001 = userInfo?.aab001
      }
      data = terminalencrypt.cryptoData(data, requestConstant.channelCode)
      return request(type, url, 'POST', header, data, loadStyle)
    }
  }
}

// 处理转义字符
function htmlDecode(str) {
  var s = ''
  if (str.length == 0) return ''
  s = str.replace(/&lt;/g, '<')
  s = s.replace(/&gt;/g, '>')
  s = s.replace(/&#xff08;/g, '(')
  s = s.replace(/&#xff09;/g, ')')
  return s
}

/**
 * @param {Object} requestType 请求类型
 * @param {Object} url 请求地址
 * @param {Object} method 请求方式
 * @param {Object} data 请求参数
 * @param {Object} loadStyle 是否显示加载
 */
function request(requestType, url, method, header, data, loadStyle, isCode) {
  if (loadStyle) {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
  }
  //响应数据类型参数，不参与业务参数及加密
  const responseType = data.responseType
  if (responseType) {
    delete data.responseType
  }
  let newApiCode = ''
  if (data.apiCode) {
    // console.log(
    //   'data.apiCode',
    //   data.apiCode,
    //   requestConstant.AllUpdateApiCode,
    //   requestConstant.AllUpdateApiCode.includes(data.apiCode)
    // )

    if (requestConstant.AllUpdateApiCode.includes(data.apiCode)) {
      //新增、编辑
      newApiCode = 'jyxt_u_' + data.apiCode
    } else if (data.apiCode || data.method) {
      //查询
      newApiCode = 'jyxt_q_' + data.apiCode
    }
  }
  data = { ...data, apiCode: newApiCode }
  // console.log('newApiCode', newApiCode)

  return new Promise((resolve, reject) => {
    uni.request({
      responseType: responseType ? responseType : '',
      url: url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        if (loadStyle) {
          uni.hideLoading()
        }
        if (isCode) {
          if (res.errMsg === 'request:ok') {
            resolve(res.data)
          } else {
            utils.showToast('网络异常, 请稍后再试!')
          }
          return
        }
        let temp = terminalencrypt.decryptedParam(res.data)
        if (temp.serviceSuccess) {
          if (temp?.resultData?.data?.code === -1) {
            Message.error(temp?.resultData?.data?.message)
            reject(temp.resultData.data)
            return
          }
          // 针对不同类型的请求不同处理
          switch (requestType) {
            case requestConstant.loginRequestType: {
              let newData = JSON.stringify(temp.resultData)
              newData = htmlDecode(newData)
              resolve(JSON.parse(newData))
              break
            }
            case requestConstant.codeRequestType: {
              resolve(temp)
              break
            }
            case requestConstant.sendCheckCodeSmsRequestType: {
              resolve(temp)
              break
            }
            case requestConstant.logOutRequestType: {
              loginConfig.removeLoginInfo()
              toLoginPage()
              break
            }
            case requestConstant.qrcodeRequestType: {
              let newData = JSON.stringify(temp.resultData)
              resolve(newData)
              break
            }
            default: {
              let newData = JSON.stringify(temp.resultData)
              newData = htmlDecode(newData)
              let result = JSON.parse(newData)
              // 处理异常
              // if (result.data.errors?.length > 0) {
              //   Message.error(result.data.errors[0].msg)
              // } else {
              //   resolve(JSON.parse(newData))
              // }
              resolve(JSON.parse(newData))

              break
            }
          }
        } else {
          if (temp.code != '505' && temp.code != '508') {
            if (requestType == requestConstant.qrcodeRequestType) {
              reject(temp)
            }
            // Message.error(temp.message)
            if (requestType !== requestConstant.businessRequestType) {
              Message.error(temp.message)
            }
            reject(temp)
          }
        }
      },

      fail: function (res) {
        Message.error('网络异常, 请稍后再试')
        reject(res)
      },
      complete: function (res) {
        if (loadStyle) {
          uni.hideLoading()
        }
        if (requestType && requestType == requestConstant.businessRequestType) {
          request_xception.requestException(res.data.code, res.data.message)
        }
      },
    })
  })
}

export default {
  request,
  get,
  post,
  loginAuthRequest,
  logOut,
  loginAuthRequestByAcount,
}
