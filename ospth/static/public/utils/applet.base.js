import {
  APP_NAME,
  IMAGE_REPLACE_DIRECTORY,
  BASE_IP,
  BASE_URL,
  IMAGE_SRC,
  DEFAULT_AREA_CODE,
  DEFAULT_AREA_NAME,
  OSPTP_NAME,
} from '@/config.js'

function getBaseUrl() {
  // return 'http://192.168.2.21:7001/ldjy/xzjy/api/ggfw/data.do';
  // return 'http://192.168.2.9:7001/ldjy/xzjy/api/ggfw/data.do';
  return 'http://192.168.2.80:7001/ldjy/xzjy/api/ggfw/data.do'
}
/**
 * 渠道编号
 */
const CHANNEL_CODE = 'osp-02-006-app'

/**
 * 错误信息
 */
const ERROR_MSG = '出现了点小意外, 请稍后再试'

/**
 * 网络异常
 */
const NET_ERROR = '网络开小差了, 请稍后再试'

/**
 * 业务异常
 */
const BUS_ERROR = '业务内部错误，错误信息：'

const TOKEN_LOSE = '令牌失效'

import cryptUtil from '../crypto/cryptUtil.js'
import smUtil from '../crypto/index.js'

/**
 * Token名称
 */
const APPLET_TOKEN = 'applet-token'
/**
 * sm4密钥
 */
const sm4Key = 'A4a2gRHrWDvtUaGu'
/**
 * 同步移除token信息
 */
function removeToken() {
  uni.removeStorageSync(APPLET_TOKEN)
}

/**
 * 同步存储token信息
 * @token token信息
 */
function setToken(token) {
  uni.setStorageSync(APPLET_TOKEN, token)
}

/**
 * @param {Object} cur true获取当前用户
 * @param {Object} jump true未登录不跳转登录页
 */
function getUser(cur, jump) {
  if (cur == undefined) {
    cur = true
  }
  let user = uni.getStorageSync('user')
  if (!user) {
    //是否跳转登录页
    if (!jump) {
      uni.navigateTo({
        url: '/pages/my/user/loginPwd/loginPwd',
      })
    }
    return ''
  }
  //返回当前用户
  // console.log("用户信息" + JSON.stringify(user))
  if (cur && user.runStatus == '2') {
    if (user?.currentUser) {
      return JSON.parse(JSON.stringify(user.currentUser))
    } else {
      return user
    }
  } else {
    if (user?.loginUser) {
      return JSON.parse(JSON.stringify(user.currentUser))
    } else {
      return user
    }
  }
}

/**
 * 路由地址统一跳转（平台）
 * @url url
 * @isRulunch 跳转方式
 * @param 参数
 */
function navigate(url, isRelunch, param) {
  let path = '/pages/other/service/service'
  if (param) {
    path = path + '?param=' + encodeURIComponent(JSON.stringify(param))
  }
  if (isRelunch) {
    uni.reLaunch({
      url: path,
    })
  } else {
    uni.navigateTo({
      url: path,
    })
  }
}

/**
 * 获取跳转的页面路径
 */
function getNavigatePath(accessUrl, onSuccess, onFailure) {
  post('/navigate' + accessUrl, null, onSuccess, onFailure)
}

/**
 * 供外部post请求调用
 * @url URL地址
 * @params 请求参数
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function post(url, param, onSuccess, onFailure, showToast = true) {
  let params = JSON.parse(JSON.stringify(param))
  let header = dealHeader('post')
  //参数加密
  params = cryptUtil.cryptoData(params, header.channelCode, url)
  request(url, params, 'POST', header, onSuccess, onFailure, showToast)
}

/**
 * 供外部get请求调用
 * @url URL地址
 * @params 请求参数
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function get(url, params, onSuccess, onFailure) {
  let header = dealHeader('get')
  request(url, params, 'GET', header, onSuccess, onFailure)
}

/**
 * 获取md对象
 */
function getMD() {
  let timeP = new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(window.md)
    }, 500)
  })

  let getMDP = new Promise(function (resolve, reject) {
    if (window.isLoadMdlife) {
      resolve(window.md)
    } else {
      window.addMDlifeLoadLisener(() => {
        resolve(window.md)
      })
    }
  })
  return Promise.race([
    timeP,
    getMDP, // 200毫秒超时
  ])
}

/**
 * 监听md生命周期
 */
function initLifecycle() {
  //监听md生命周期
  window.isLoadMdlife = false
  window.addMDlifeLoadLisener = function (fuc) {
    if (!window.mdlifeLoadLisener) {
      window.mdlifeLoadLisener = []
    }
    window.mdlifeLoadLisener.push(fuc)
  }
  window.onViewCreate = function () {
    window.isLoadMdlife = true
    if (window.mdlifeLoadLisener && window.mdlifeLoadLisener.length > 0) {
      for (let i = 0; i < window.mdlifeLoadLisener.length; i++) {
        window.mdlifeLoadLisener[i]()
      }
      window.mdlifeLoadLisener.splice(0, window.mdlifeLoadLisener.length)
    }
  }
}

/**
 * 检查md是否存在
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function checkMd(url, params, method, onSuccess, onFailure) {
  uni.showLoading({
    mask: true,
    title: '加载中',
  })
  if (window.isLoadMdlife) {
    appRequest(url, params, method, onSuccess, onFailure)
  } else {
    window.addMDlifeLoadLisener(() => {
      appRequest(url, params, method, onSuccess, onFailure)
    })
  }
}

/**
 * function: 封装app网络请求前置校验
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function appRequest(url, params, method, onSuccess, onFailure) {
  getMD().then((md) => {
    sendRequest(url, params, method, onSuccess, onFailure)
  })
}

/**
 * function: 封装app网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function sendRequest(url, params, method, header, onSuccess, onFailure) {
  if (!url.includes('http')) {
    url = BASE_URL + url
  }
  uni.showLoading({
    mask: true,
    title: '加载中',
  })
  let count = 0
  let hideLoading = setTimeout((data) => {
    uni.hideLoading()
    if (count == 0) {
      //请求未正常结束，重新发送一次请求
      sendRequest(url, params, method, onSuccess, onFailure)
      count++
      return
    }
    uni.showModal({
      title: '提示',
      content: '网络请求失败，是否重试？',
      success: (res) => {
        if (res.confirm) {
          sendRequest(url, params, method, onSuccess, onFailure)
        }
      },
    })
  }, 30000)
  md.ajax(
    {
      url: url,
      method: method,
      returnAll: true,
      timeout: 60,
      data: {
        values: dealParams(params),
      },
      headers: dealHeader(method),
    },
    function (ret, err) {
      clearTimeout(hideLoading)
      uni.hideLoading()
      if (!ret) {
        uni.showModal({
          title: '提示',
          content: NET_ERROR,
        })
        return
      }
      if (ret.body.serviceSuccess && ret.body.serviceSuccess != 'false') {
        try {
          if (ret.body.token) {
            // 自动存储token信息
            setToken(ret.body.token)
          }
          onSuccess(ret.body)
        } catch (e) {
          if (onFailure) {
            onFailure({
              message: ERROR_MSG + '[' + e.message + ']',
            })
          } else {
            uni.showModal({
              title: '提示',
              content: ERROR_MSG + '[' + e.message + ']',
            })
          }
        }
      } else {
        if (ret.body.message == TOKEN_LOSE) {
          setToken(ret.body.resultData.data)
          uni.removeStorageSync('user')
        } else {
          if (ret.body.message == '用户未登录') {
            uni.removeStorageSync('user')
          }
          if (onFailure) {
            //请求失败回调
            onFailure(ret.body)
          } else {
            uni.showModal({
              title: '提示',
              content: ret.body.message,
            })
          }
        }
      }
    }
  )
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function request(url, params, method, header, onSuccess, onFailure) {
  let flag = false
  if (url == '') {
    flag = true
    const info = Base.getUser(true, true)
    //个人
    const commParams1 = JSON.stringify({
      aae011: info?.naturalBo?.name,
      yae116: info?.naturalBo?.userid,
    })
    //企业
    const commParams2 = JSON.stringify({
      aae011: info?.legalBo?.legalName,
      yae116: info?.accountBo?.accountId,
    })
    params.uuid = Math.floor(Math.random() * 10 ** 20).toString()
    params.comm = info.accountBo.userType === 'UT01' ? commParams1 : commParams2
  }
  if (url.indexOf('http') == -1) {
    url = BASE_URL + url
  }
  let loading = setTimeout(function () {
    uni.showLoading({
      mask: true,
      title: '加载中',
    })
  }, 100)

  uni.request({
    url: flag ? getBaseUrl() : url,
    data: dealParams(params),
    method: method,
    header: header,
    success: function (res) {
      // console.log('res: ',res);
      // 404 会进入success  离谱
      if (res.statusCode == 404) {
        // failure for other reasons
        clearTimeout(loading)
        uni.hideLoading()
        uni.showToast({
          title: NET_ERROR,
          icon: 'none',
          duration: 3000,
          mask: true,
        })
        return
      }
      clearTimeout(loading)
      uni.hideLoading()
      // 根据接口返回状态进行处理
      if (res.data.serviceSuccess) {
        try {
          if (url != BASE_URL.replace('api', '') + 'login') {
            res.data = cryptUtil.decryptResult(res.data)
          }
          if (res.data && res.data.data && res.data.data.accessToken) {
            // 自动存储token信息
            setToken(res.data.data.accessToken)
          }
          if (flag) {
            onSuccess(res.data)
          } else {
            onSuccess(res.data.data)
          }
        } catch (e) {
          if (onFailure) {
            onFailure({
              message: ERROR_MSG + '[' + e.message + ']',
            })
          } else {
            uni.showModal({
              title: '提示',
              showCancel: false,
              content: ERROR_MSG + '[' + e.message + ']',
            })
          }
        }
      } else {
        if (res.data.message == TOKEN_LOSE) {
          uni.removeStorageSync('user')
          removeToken()
          uni.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误，请重试',
          })
        } else {
          if (res.data.message == '用户未登录') {
            uni.removeStorageSync('user')
          }
          //请求失败回调
          if (onFailure) {
            onFailure(res.data)
          } else {
            uni.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false,
              success: () => {
                if (
                  res.data.message &&
                  (res.data.message.indexOf('登录信息已失效') != -1 || res.data.message == '用户未登录')
                ) {
                  toLogin()
                }
              },
            })
          }
        }
      }
    },
    fail: function (error) {
      console.log('error: ', error)
      // failure for other reasons
      clearTimeout(loading)
      uni.hideLoading()
      uni.showModal({
        title: '提示',
        showCancel: false,
        content: NET_ERROR,
      })
    },
  })
}

// h5页面返回小程序或app
function backToApplet() {
  // 判断是否为小程序环境
  if (isWechat()) {
    wx.miniProgram.navigateBack({
      delta: 1,
    })
    wx.miniProgram.postMessage({
      data: {
        action: 'back',
      },
    })
  } else if (isApp()) {
    // 执行父页面方法
    md.execScript({
      // frameName: "main",
      name: 'root',
      script: '_setMessage({"action":"back"})',
    })
  } else {
    window.history.go(-1)
  }
}

function isWechat() {
  try {
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1) {
      return true
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

/**
 * 上传图片或视频
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function uploadImg(onSuccess, onFailure) {
  uni.chooseImage({
    success: (chooseImageRes) => {
      const tempFilePaths = chooseImageRes.tempFilePaths
      uni.uploadFile({
        url: BASE_URL + '/base/uploadPlatformFile.do',
        filePath: tempFilePaths[0],
        header: base.dealHeader('post'),
        name: 'file',
        success: (data) => {
          if (data.statusCode == '200') {
            onSuccess(data.data)
          } else {
            onFailure(data.data)
          }
        },
      })
    },
  })
}

/**
 * 获取拖拽验证码
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getDrag(onSuccess, onFailure) {
  post('/code/getDragCode.do', null, onSuccess, onFailure)
}

/**
 * 校验验证码
 * @param {Object} params
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function checkDrag(params, onSuccess, onFailure) {
  post('/code/checkCaptcha.do', params, onSuccess, onFailure)
}

/**
 * 人脸认证入口
 * @param {Object} param
 * @param {Object} onSuccess
 * @param {Object} onFailure
 * @param {Object} complete
 */
function face(param, onSuccess, onFailure, isFirst) {
  if (param.idCardNumber && !param.certNo) {
    param.certNo = param.idCardNumber
  }
  if (base.isApp()) {
    faceCheck(param.certNo, onSuccess, onFailure, isFirst)
  } else {
    //#ifdef MP-WEIXIN
    wx.startFacialRecognitionVerify({
      name: param.name,
      idCardNumber: param.certNo,
      success: function (data) {
        uni.showToast({
          title: '人脸识别成功',
          icon: 'none',
        })
        onSuccess(data)
      },
      fail: function (data) {
        uni.showToast({
          title: '人脸识别失败',
          icon: 'none',
        })
        if (onFailure) {
          onFailure(data)
        }
      },
      complete: function (data) {
        console.log('回调结果', JSON.stringify(data))
      },
      checkAliveType: 2,
    })
    //#endif
    //#ifdef MP-ALIPAY
    //这里需要单独申请支付宝小程序的人脸认证 https://opendocs.alipay.com/mini/introduce/alipay-verfify
    let param = {
      certName: param.name,
      certNo: param.certNo,
      phoneNo: param.tel,
    }
    post('/alipay/identityCheck.do', param, (data) => {
      let reData = data.resultData.data
      if (reData.success) {
        /**
         * 唤起认证流程
         * 参数: certifyId、url 需要通过支付宝 openapi 开放平台网关接口获取
         * 详细说明可查看文档下方的参数说明
         **/
        my.startAPVerify({
          url: reData.certifyUrl,
          certifyId: reData.verifyId,
          success: function (res) {
            if (res.resultStatus == '9000') {
              uni.showToast({
                title: '人脸识别成功',
                icon: 'none',
              })
              data.aac002 = param.certNo
              data.code = '1'
              data.message = '人脸识别成功'
              if (onSuccess) {
                onSuccess(data)
              }
            }
          },
          fail: function (res) {
            uni.showToast({
              title: '人脸识别失败',
              icon: 'none',
            })
            data.aac002 = param.certNo
            data.code = '-1'
            data.message = data.errMsg
            if (onFailure) {
              onFailure(data)
            }
          },
          complete: function (res) {
            console.log('回调结果', JSON.stringify(res))
          },
          checkAliveType: 2,
        })
      } else {
        uni.showToast({
          title: reData.msg,
          icon: 'none',
        })
      }
    })
    //#endif
  }
}

// 人脸识别
function faceCheck(idCard, onSuccess, onFailure, isFirst) {
  faceDetector.detect(
    {
      detectMode: 4,
    },
    function (ref) {
      if (ref.code == '0') {
        /**执行成功*/
        let img_cj = ref.faceDetectInfo.base64
        queryImg(idCard, img_cj, onSuccess, onFailure, isFirst)
      } else if (ref.code == '1') {
        md.toast({
          msg: '摄像头不允许操作',
          duration: 4000,
          location: 'middle',
        })
      } else if (ref.code == '2') {
        md.toast({
          msg: '其他未知错误',
          duration: 4000,
          location: 'middle',
        })
      } else if (ref.code == '3') {
        md.toast({
          msg: '超时',
          duration: 4000,
          location: 'middle',
        })
      } else if (ref.code == '4') {
        md.toast({
          msg: '用户操作返回 ',
          duration: 4000,
          location: 'middle',
        })
      }
    }
  )
}

//根据身份证号码获取社保人脸信息
function queryImg(idCard, img_cj, onSuccess, onFailure, isFirst) {
  let param = {}
  param.aac002 = idCard
  param.aab301 = '650000'
  param.channelNo = '806c84c6f31f8e121ca00380d18caf6f'
  param.operator = '达州人社'
  post(
    '/custom/auth/queryCardImg.do',
    param,
    (data) => {
      if (data.resultData.data.result.ykk051) {
        let img_Sb = data.resultData.data.result.ykk051
        checkInfo(img_cj, img_Sb, idCard, onSuccess, onFailure)
      } else {
        if (isFirst) {
          md.toast({
            msg: '暂无该人员卡照片信息无法进行人脸校验,请到相关制卡网点制卡生成卡信息',
            duration: 4000,
            location: 'middle',
          })
        } else {
          md.toast({
            msg: '暂无该人员人脸信息无法进行人脸校验，请先到社会保障卡功能下上传照片信息',
            duration: 4000,
            location: 'middle',
          })
        }
      }
    },
    (data) => {
      let mes = data.message
      api.commonTipsModel(mes)
    }
  )
}

//校验人脸信息
function checkInfo(img_cj, img_Sb, idCard, onSuccess, onFailure) {
  let param = {}
  param.jybh = 'scrz'
  param.image1 = img_cj
  param.image2 = img_Sb
  post(
    '/custom/AppImageCompare/compare.do',
    param,
    (data) => {
      if (!data.resultData.data.similarity) {
        md.toast({
          msg: '人脸校验失败',
          duration: 4000,
          location: 'middle',
        })
        return
      }
      if (data.resultData.data.similarity < 50) {
        md.toast({
          msg: '温馨提示，人脸校验结果不是同一个人',
          duration: 4000,
          location: 'middle',
        })
        if (onFailure) {
          onFailure(data)
        }
      } else {
        uni.showToast({
          title: '人脸识别成功',
          icon: 'none',
        })
        // 人脸比对的成功
        onSuccess(data)
      }
    },
    (data) => {
      let mes = data.message
      api.commonTipsModel(mes)
    }
  )
}

/**
 * 解密社保卡页面返回的参数
 * @param {Object} security 返回参数的对应该名称字段
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function decryptSocial(security, onSuccess, onFailure) {
  post(
    '/social/decryptHtmlSign.do',
    {
      security: security,
    },
    (data) => {
      onSuccess(data.resultData.data)
    },
    (data) => {
      if (onFailure) {
        onFailure(data)
      } else {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
      }
    }
  )
}

/**
 * 校验服务权限并跳转
 * 需要channelId和handleItemCode
 * @param {Object} param
 */
function checkServiceAuth(param) {
  let params = {
    taskBasicCode: param.handleItemCode,
    type: 'service',
  }
  post(
    '/auth/checkAuth',
    params,
    (res) => {
      if (res.code == '-1') {
        //校验失败
        uni.showModal({
          title: '提示',
          content: res.message,
          showCancel: false,
        })
        return
      }
      if (res.code == '0') {
        uni.showModal({
          title: '提示',
          content: res.message,
          success: function (res) {
            if (res.confirm) {
              this.toLogin()
            }
          },
        })
        return
      }
      if (res.code == '99') {
        //权限不足
        uni.showModal({
          title: '提示',
          content: res.message,
          success: function (res) {
            if (res.confirm) {
              uni.switchTab({
                url: '/pages/menu/my',
              })
            }
          },
        })
        return
      }
      if (res.user) {
        console.log('res.user222===============-----------: ', res.user)
        uni.setStorageSync('user', res.user)
      } else {
        uni.removeStorageSync('user')
      }
      this.navigate(null, false, param)
    },
    (data) => {
      uni.showToast({
        title: '权限校验失败',
        icon: 'none',
      })
      return
    }
  )
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  if (!params) {
    return {}
  }
  return params
}

/**
 * 获取页面跳转参数
 * @option onload携带的option参数
 */
function getPageData(option) {
  let param = JSON.parse(decodeURIComponent(option.param))
  return param
}

/**
 * function: 根据需求处理请求头：添加固定参数配置等
 * @method 请求方式
 */
function dealHeader(method) {
  let channelCode = uni.getStorageSync('channelCode')
  if (!channelCode) {
    channelCode = CHANNEL_CODE
  }
  if (channelCode == 'applet001') {
    channelCode = 'osp-02-007-wechat'
  }
  if (channelCode == 'app001') {
    channelCode = CHANNEL_CODE
  }
  return {
    // 'regionCode': uni.getStorageSync("areaCode"),
    'TERMINAL-JTOKEN': uni.getStorageSync(APPLET_TOKEN),
    'content-type': method == 'GET' || method == 'get' ? 'application/json' : 'application/x-www-form-urlencoded',
    channelCode: channelCode,
  }
}

function toLogin() {
  //#ifdef MP-WEIXIN
  uni.navigateTo({
    url: '/pages/my/user/loginPwd/loginPwd',
  })
  //#endif
  //#ifdef MP-ALIPAY
  uni.navigateTo({
    url: '/pages/my/user/loginPwd/loginPwd',
  })
  //#endif
  //#ifdef H5
  uni.navigateTo({
    url: '/pages/my/user/loginPwd/loginPwd',
  })
  //#endif
}

/**
 * 登录后页面跳转
 */
function pageJump() {
  let old = uni.getStorageSync('old')
  if (!old) {
    uni.switchTab({
      url: '/pages/menu/index',
    })
  } else {
    uni.redirectTo({
      url: '/pages/index/OldAgeModel_index/OldAgeModel_index',
    })
  }
}

function reLaunchTo(url) {
  return new Promise((resolve, reject) => {
    uni.reLaunch({
      url,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

/**
 * 返回上1级或n级
 */
function navigateBack(deltaNum) {
  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta: deltaNum,
    })
  })
}

/**
 * 判断是否为app
 */
function isApp() {
  let flag = false
  try {
    //获取app版本号
    md.appVersion
    flag = true
  } catch (e) {
    flag = false
  }
  return flag
}

/**
 * sm4加密
 * @param {Object} value
 * @param {Object} ivKey
 */
function sm4Encrypt(value, ivKey) {
  if (!ivKey) {
    ivKey = sm4Key
  }
  return smUtil.sm4Encrypt(value, ivKey)
}

/**
 * sm4解密
 * @param {Object} value
 * @param {Object} ivKey
 */
function sm4Decrypt(value, ivKey) {
  if (!ivKey) {
    ivKey = sm4Key
  }
  return smUtil.sm4Decrypt(value, ivKey)
}

/**
 * 获取行政区划
 * */
function getAreaCode() {
  let addressInfo = uni.getStorageSync('address')
  if (addressInfo?.value) {
    return addressInfo.value
  }
  return DEFAULT_AREA_CODE
}

/**
 * 获取默认行政区划
 * */
function getDefaultAddress() {
  return {
    label: DEFAULT_AREA_NAME,
    value: DEFAULT_AREA_CODE,
  }
}

/**
 * 通过module.exports方式提供给外部调用
 */
module.exports = {
  APP_NAME: APP_NAME,
  BASE_URL: BASE_URL,
  BASE_IP: BASE_IP,
  IMAGE_SRC: IMAGE_SRC,
  IMAGE_REPLACE_DIRECTORY: IMAGE_REPLACE_DIRECTORY,
  CHANNEL_CODE: CHANNEL_CODE,
  DEFAULT_AREA_CODE: DEFAULT_AREA_CODE,
  DEFAULT_AREA_NAME: DEFAULT_AREA_NAME,
  OSPTP_NAME: OSPTP_NAME,
  post: post,
  get: get,
  dealHeader: dealHeader,
  removeToken: removeToken,
  setToken: setToken,
  getPageData: getPageData,
  getUser: getUser,
  pageJump: pageJump,
  navigate: navigate,
  reLaunchTo: reLaunchTo,
  navigateBack: navigateBack,
  getMD: getMD,
  initLifecycle: initLifecycle,
  appRequest: appRequest,
  isApp: isApp,
  toLogin: toLogin,
  checkServiceAuth: checkServiceAuth,
  isWechat: isWechat,
  backToApplet: backToApplet,
  sm4Encrypt: sm4Encrypt,
  sm4Decrypt: sm4Decrypt,
  getAreaCode: getAreaCode,
  getDefaultAddress: getDefaultAddress,
}
