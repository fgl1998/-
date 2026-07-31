/**
 * 系统没隔5s向服务器更新设备信息
 */

import app_request from './app_request'
import requestUrl from './requestUrl'
import login_config from './login_config'
import { MessageBox, Message } from 'element-ui'

const bigScreenUrl = '/pages/largeScreen/largeScreen'
const recruitmentAreaUrl = '/pages/recruitmentArea/recruitmentArea'
const jobInfoStatistic = '/pages/jobInfoStatistic/jobInfoStatistic'
const loginPageUrl = '/'

function send() {
  setInterval(() => {
    // console.log('=======location=======', window.location.href)
    let page = window.location.href
    let currentPage = page.split('#')[1]
    // console.log('=======currentPage=======', currentPage)
    const pageMap = {
      '/pages/largeScreen/largeScreen': 'deviceInfo_2',
      '/pages/recruitmentArea/recruitmentArea': 'deviceInfo_4',
      '/pages/jobInfoStatistic/jobInfoStatistic': 'deviceInfo_3',
      '/': 'deviceInfo_1',
    }

    let deviceId = null
    let ace772 = null
    let ace769 = null
    if (currentPage.includes(bigScreenUrl)) {
      deviceId = uni.getStorageSync('deviceInfo_2').ace711
      ace772 = uni.getStorageSync('deviceInfo_2').ace772
      ace769 = '6'
    } else if (currentPage.includes(recruitmentAreaUrl)) {
      console.log(page.split('#'))

      deviceId = uni.getStorageSync('deviceInfo_4').ace711
      ace772 = uni.getStorageSync('deviceInfo_4').ace772
      ace769 = '5'
    } else if (currentPage.includes(jobInfoStatistic)) {
      deviceId = uni.getStorageSync('deviceInfo_3').ace711
      ace772 = uni.getStorageSync('deviceInfo_3').ace772
      ace769 = '6'
    } else {
      deviceId = uni.getStorageSync('deviceInfo_1').ace711
      ace772 = uni.getStorageSync('deviceInfo_1').ace772
      ace769 = '1'
    }
    console.log('=======currentPage=======', currentPage, deviceId, ace772)

    if (deviceId && ace772) {
      let param = {
        ace711: deviceId,
        ace772: ace772,
        // ace824: currentPage == bigScreenUrl || currentPage == recruitmentAreaUrl ? '2' : '1',
        // ace769: currentPage == bigScreenUrl || currentPage == recruitmentAreaUrl ? '3' : '1',
        ace769,
      }
      app_request.post(requestUrl.commonRequestType, 'jy204_hrm259', null, param, false).then((res) => {
        //如果校验码被更换,则清除设备信息deviceInfo_1/2,退回登录页
        if (res?.data?.result?.code == '-1001') {
          // Message.error(res.data.data.messge)
          MessageBox.alert(res.data.result.messge, '提示', {
            confirmButtonText: '确定',
            callback: (action) => {},
          })
          if (currentPage.includes(bigScreenUrl)) {
            uni.removeStorageSync('deviceInfo_2')
            uni.reLaunch({
              url: bigScreenUrl,
            })
          } else if (currentPage.includes(recruitmentAreaUrl)) {
            const acb330 = uni.getStorageSync('acb330')
            uni.removeStorageSync('deviceInfo_4')
            uni.reLaunch({
              url: recruitmentAreaUrl + '?acb330=' + acb330,
            })
          } else if (currentPage.includes(jobInfoStatistic)) {
            uni.removeStorageSync('deviceInfo_3')
            uni.reLaunch({
              url: jobInfoStatistic,
            })
          } else {
            login_config.removeLoginInfo()
            uni.removeStorageSync('deviceInfo_1')
            uni.reLaunch({
              url: loginPageUrl,
            })
          }
          //设置一个页面重新加载的计数器，避免页面不停刷新闪烁
          uni.setStorageSync('reLanch_times', 1)
        } else {
          const aab001 = res?.data?.result?.aab001
		  // 储存单位id,用于获取电子社保卡登录结果
		  if(aab001){
			  uni.setStorageSync('aab001',aab001)
		  }
          // 判断当前展位是否被预约
          const loginInfo = login_config.getLoginInfo()
          // 如果展位没有被预约，则判是否检测到预约单位信息
          if (!loginInfo || !loginInfo.aab001) {
            if (aab001 && currentPage == loginPageUrl) {
              // 如果展位被预约，则刷新页面，获取展位预约信息
              window.location.reload()
            }
          } else {
            // 如果预约展位信息与当前登录展位信息不一致，则退出登录，跳转到登录页面
            if (login_config.isLogin()) {
              if (aab001 != loginInfo.aab001 && currentPage != loginPageUrl) {
                Message.error('展位预约信息失效，即将退出登录!')
                setTimeout(() => {
                  app_request.logOut()
                  uni.navigateTo({
                    url: loginPageUrl,
                  })
                }, 2000)
              }
            } else {
              if ((!loginInfo || !loginInfo.aab001) && aab001) {
                window.location.reload()
              } else if (loginInfo && loginInfo.aab001 && !aab001) {
                login_config.removeLoginInfo()
                window.location.reload()
              }
            }
          }
        }
      })
    } else {
      const reLanchTimes = uni.getStorageSync('reLanch_times')
      if (!reLanchTimes || reLanchTimes <= 0) {
        // Message.error("设备注册已失效，请重新注册设备")
        MessageBox.alert('设备注册已失效，请重新注册设备', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {},
        })
        if (currentPage == bigScreenUrl) {
          uni.removeStorageSync('deviceInfo_1')
          uni.reLaunch({
            url: bigScreenUrl,
          })
        } else if (currentPage.includes(jobInfoStatistic)) {
          uni.removeStorageSync('deviceInfo_3')
          uni.reLaunch({
            url: jobInfoStatistic,
          })
        } else if (currentPage.includes(recruitmentAreaUrl)) {
          const acb330 = uni.getStorageSync('acb330')
          uni.removeStorageSync('deviceInfo_4')
          uni.reLaunch({
            url: recruitmentAreaUrl + '?acb330=' + acb330,
          })
        } else {
          login_config.removeLoginInfo()
          uni.removeStorageSync('deviceInfo_1')
          uni.reLaunch({
            url: loginPageUrl,
          })
        }
        //设置一个页面重新加载的计数器，避免页面不停刷新闪烁
        uni.setStorageSync('reLanch_times', 1)
      }
    }
  }, 5000)
}
export default {
  send,
}
