import { Message } from 'element-ui'
import loginConfig from './login_config'

// 异常请求处理

const normalStatus = '1'
const tokenExpire = '505'
const noToken = '418'
const userInfoNotFound = '508'
const apiErrorStatus = '-1'

const requestException = (code, message) => {
  switch (code) {
    case normalStatus: {
      break
    }
    case tokenExpire: {
      loginConfig.removeLoginInfo()
      uni.showModal({
        content: '登录已过期，请重新登录',
        success: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
        fail: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
      })
      break
    }
    case noToken: {
      loginConfig.removeLoginInfo()
      uni.showModal({
        content: '登录已过期，请重新登录',
        success: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
        fail: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
      })
      break
    }
    case userInfoNotFound: {
      loginConfig.removeLoginInfo()
      uni.showModal({
        content: '登录已过期，请重新登录',
        success: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
        fail: function (res) {
          uni.navigateTo({
            url: '/pages/loginPage/loginPage',
          })
        },
      })
      break
    }
    case apiErrorStatus: {
      Message.error(message)
      break
    }
    default: {
      Message.error('请求异常!')
      break
    }
  }
}

export default {
  requestException,
}
