import config from '@/config'
import { showModal, showLoading, hideLoading, request as uniRequest } from '@/utils/uni-api'
import { getIsDev } from '@/utils/get'
import store from '@/store'
import { M_UPDATE_USER_INFO } from '@/store/constants'
import { AES_Encrypt, AES_Decrypt } from './aes'

let isError = false // 是否已经发生错误
/**
 * 自定义发起 HTTPS 网络请求
 * @param {string} url 开发者服务器接口地址，已默认加上前缀
 * @param {object} data 请求的参数
 * @param {boolean} isShowLoading [true] 请求数据时显示加载中
 * @param {boolean} showErrorToast [true] 是否显示错误提示
 * @param {string} method [POST] HTTP 请求方法。可取值 OPTIONS、GET、HEAD、POST、PUT、DELETE、TRACE、CONNECT
 *
 * @returns { Promise }
 * @example
  request('test').then(res => {
    // 接口调用成功
  }).catch(err => {
    // 接口调用失败
  }).finally((res) => {
    // 接口调用完成
  })
*/
const request = async (
  url,
  data = {},
  isShowLoading = true,
  showErrorToast = true,
  method = 'POST',
  timeout = 1000 * 60 * 10
) => {
  // 当前环境是否为开发环境
  const isDev = getIsDev()
  // 字符串中是否含有“http”或者“https”的正则验证表达式
  const httpExp = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
  const { requestUrl, isOpenDataEncrypt, isOpenTokenVerify, isShowErrorTip } = config
  const { userInfo, userList } = store.state

  let header = {}
  // 根据加密情况使用content-type
  if (isOpenDataEncrypt) {
    header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  } else {
    header = {
      'content-type': 'application/json;charset=UTF-8'
    }
  }

  // 存在token
  if (userInfo.token && isOpenTokenVerify) {
    header = {
      ...header,
      authorization: 'Bearer ' + userInfo.token
    }
  }

  return new Promise((resolve, reject) => {
    // 没有请求地址时 终止程序
    if (!url) {
      showModal('uni request接参数url必须传入，请检查！')
      reject(false)
    }

    // 是否显示数据加载中
    if (isShowLoading && !isError) {
      showLoading()
    }

    // 路径是否带有“http”或者“https”
    const isHttpUrl = httpExp.test(url)

    // 不是以http/https开头的路径
    if (!isHttpUrl) {
      url = requestUrl + url
    }

    // 合并 data
    data = {
      ...data,
      // #ifdef H5
      chm301: '02', // 02 网厅申报 03 微信申报 04 线下批量申报 07 支付宝
      chw017: '02',
      chb004: '02', // 调用渠道 01 核心系统 02 网厅 03 微信小程序
      // #endif
      // #ifdef MP-ALIPAY
      chm301: '07', // 02 网厅申报  03 微信申报 04 线下批量申报 07 支付宝
      chw017: '05',
      chb004: '03', // 调用渠道 01 核心系统 02 网厅 03 微信小程序
      // #endif
      // #ifdef MP-WEIXIN
      chm301: '03', // 02 网厅申报 03 微信申报 04 线下批量申报 07 支付宝
      chw017: '01',
      chb004: '03', // 调用渠道 01 核心系统 02 网厅 03 微信小程序
      openId: userInfo.openid ? userInfo.openid : '',
      // #endif
      userList: JSON.stringify([userList])
    }

    const data2 = {
      ...data
    }
    if (isOpenDataEncrypt) {
      data = JSON.stringify(data)
      data = AES_Encrypt(data)
      data = encodeURIComponent(data)
    }

    uniRequest(url, data, header, method, timeout)
      .then((res) => {
        let { statusCode, data: resData } = res // 服务器返回的数据

        // 开启数据加密
        if (isOpenDataEncrypt) {
          resData = AES_Decrypt(resData)
          resData = JSON.parse(resData)
          if (isDev) {
            console.log(`url =>`, url)
            console.log(`data =>`, data2)
            console.log(`res =>`, resData)
          }
        }

        // 请求成功 状态码为 200
        if (statusCode === 200 && resData) {
          const { code, data, errors } = resData
          // 服务器返回错误
          if (errors && errors.length > 0) {
            const error = errors[0]
            if (showErrorToast && isShowErrorTip) {
              showModal(error.msg)
            }
            reject(error)
          } else {
            // 服务器返回的数据是否正常判断
            if (code === 200 && data) {
              const { resultData } = data
              if (resultData) {
                const { code, message, token } = resultData
                if (isOpenTokenVerify) {
                  if (code == '200' || code == '1') {
                    resolve(resultData)
                  } else if (code == '401') {
                    // 登录超时
                    if (!isError) {
                      isError = true
                      showModal('登录超时！即将退出小程序，请重新进入！').then((res) => {
                        isError = false
                        uni.exitMiniProgram()
                      })
                      reject(resultData)
                    }
                  } else if (code == '402') {
                    // 更新token
                    store.commit(M_UPDATE_USER_INFO, { token })
                    resolve(resultData)
                  } else {
                    if (showErrorToast && isShowErrorTip) {
                      showModal(message || '接口出错，请联系管理员！')
                      reject(resultData)
                    } else {
                      reject(resultData)
                    }
                  }
                } else {
                  if (code == '200' || code == '1' || !code) {
                    resolve(resultData)
                  } else {
                    if (showErrorToast && isShowErrorTip) {
                      showModal(message)
                      reject(resultData)
                    } else {
                      reject(resultData)
                    }
                  }
                }
              }
            }
          }
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err)
      })
      .finally(() => {
        if (isShowLoading) {
          hideLoading()
        }
      })
  })
}

export { request }
