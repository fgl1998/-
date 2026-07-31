import JSRSASign from './jsrsasign.js'
import Url from './requestUrl.js'
import requestConstant from './requestUrl.js'
import CryptoJS from './crypto-js.js'
import websocket from './websocket.js'

import { Message, MessageBox } from 'element-ui'

const wx = uni

// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('1234123412341234')
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse('1234123412341234')
const showToast = (title, image) => {
  if (image == 'success') {
    Message.success(title)
  } else if (image == 'warning') {
    Message.warning(title)
  } else if (image == 'error') {
    Message.error(title)
  } else {
    Message.info(title)
  }
  // return new Promise((resolve, reject) => {
  // 	wx.showToast({
  // 		title,
  // 		image,
  // 		duration: 2500,
  // 		icon: "none",
  // 		success(res) {
  // 			resolve(res);
  // 		},
  // 		fail(err) {
  // 			reject(err);
  // 		},
  // 		complete(res) {
  // 			//console.log(`showToast 接口调用完成，调用结果: `, res);
  // 		}
  // 	});
  // });
}

const showMessageModal = (title, content, type) => {
  MessageBox.alert(content ? content : '消息提示', title ? title : '消息提示标题', {
    confirmButtonText: '确定',
  })
}

const getAbbreviatSalary = (number) => {
  return number / 10000 >= 1
    ? String((Number((number / 10000).toFixed(2)) * 100) / 100).concat('w')
    : number / 1000 >= 1
    ? String((Number((number / 1000).toFixed(2)) * 100) / 100).concat('k')
    : String(number)
}

const showModal = (title, content, showCancel, succ, fail) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success: function (res) {
        if (res.confirm) {
          if (succ) succ()
          //console.log('用户点击确定');
        } else if (res.cancel) {
          if (fail) fail()
          //console.log('用户点击取消');
        }
      },
    })
  })
}

const commonSaveModel = (msg) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      content: msg,
      showCancel: false,
      success: function success(res) {
        resolve(res)
      },
    })
  })
}

const navigateToLogin = () => {
  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url: '/pages/login/login',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}

const navigateTo = (url) => {
  return new Promise((resolve, reject) => {
    uni.navigateTo({
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

//返回上1级或n级
const navigateBack = (deltaNum) => {
  return new Promise((resolve, reject) => {
    wx.navigateBack({
      delta: deltaNum,
    })
  })
}
//关闭当前页面跳转到指定页面
const redirectTo = (url) => {
  return new Promise((resolve, reject) => {
    wx.redirectTo({
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
 * 解密方法
 * @param data
 * @returns {string}
 */
const getReal = (data) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

const dateFormat = (date) => {
  if (date == '' || date == undefined) {
    date = new Date()
  }
  return dateFormats('YYYY-mm-dd', date)
}

function dateFormats(fmt, date) {
  // 获取当前日期-失业登记日期
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

const getDate = (type) => {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  if (type === 'start') {
    year = year - 60
  } else if (type === 'end') {
    year = year + 2
  }
  month = month > 9 ? month : '0' + month
  day = day > 9 ? day : '0' + day
  return `${year}-${month}-${day}`
}
//获取码值描述
const queryCodeDesc = (collect, _code) => {
  let codeCacheMap = uni.getStorageSync('cacheStorage')
  if (codeCacheMap && codeCacheMap[collect]) {
    let code_desc = ''
    codeCacheMap[collect].forEach((x) => {
      if (x.value == _code) {
        code_desc = x.label
      }
    })
    return code_desc
  }
}

// 证件号脱敏处理
const idHide = (aac002) => {
  let idcard = aac002.toString()
  if (idcard.length == 15 || idcard.length == 18) {
    let idLen = idcard.length
    let str = ''
    for (let i = 0; i < idLen - 6; i++) {
      str += '*'
    }
    return idcard.substr(0, 3) + str + idcard.substr(idLen - 3)
  } else {
    return aac002
  }
}

//获取年龄
const getAge = (idCard) => {
  //计算年龄
  var yearBirth = idCard.substring(6, 10)
  var monthBirth = idCard.substring(10, 12)
  var dayBirth = idCard.substring(12, 14)
  //获取当前年月日并计算年龄
  var myDate = new Date()
  var monthNow = myDate.getMonth() + 1
  var dayNow = myDate.getDay()
  var age = myDate.getFullYear() - yearBirth
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--
  }
  return age
}

let times = 1
const restart = () => {
  times = 1
}

//打开外接屏幕
const openScreen = (url1, url2) => {
  const path = window.location.origin + window.location.pathname + '#'
  mdDonseeDevice.getScreens({}, (res) => {
    if (res.code == 0) {
      let screens = JSON.parse(JSON.parse(res.detectionString).screens)
      let deScreenId = screens[0]
      mdDonseeDevice.openOutScreen({
        displayId: deScreenId,
        name: 'secondScreen',
        url: path + url1,
      })
      if (screens.length > 1) {
        mdDonseeDevice.openOutScreen({
          displayId: screens.filter((item) => item !== deScreenId)[0],
          name: 'tvScreen',
          url: path + url2,
        })
      }
    } else {
      this.$utils.showToast('获取屏幕失败，请联系管理员')
    }
  })
}

//关闭双屏
const closeOutScreen = (screenName) => {
  mdDonseeDevice.closeOutScreen({
    name: screenName,
  })
}

//获取性别头像
const getSexHeadOrDefault = (fileId, sex) => {
  if (sex == '1') {
    return getFileLoadUrlOrDefault(fileId, 'img/recruitTalents/male.png')
  }
  return getFileLoadUrlOrDefault(fileId, 'img/recruitTalents/female.png')
}

// 获取文件加载地址，如果没有则返回默认地址
const getFileLoadUrlOrDefault = (fileId, defaultFile) => {
  if (fileId) {
    return getFileLoadUrl(fileId)
  }
  return getRealImgUrl(defaultFile)
}

// 获取真实图片地址
const getRealImgUrl = (url) => {
  return require('@/static/images/' + url)
}

// 获取图片加载地址
const getFileLoadUrl = (fileId) => {
  if (fileId) {
    return (
      requestConstant.requestUrl +
      requestConstant.fileLoadUrl +
      '?fileId=' +
      fileId +
      '&channelCode=' +
      requestConstant.channelCode +
      '&sysCode=' +
      requestConstant.systemCode
    )
  }
}

// 转义
const htmlDecode = (str) => {
  if (str) {
    let s = ''
    if (!str || str.length == 0) return ''
    if (str.indexOf('&amp;') != -1) {
      str = str.replace(/&amp;/g, '&')
    }
    s = str.replace(/&lt;/g, '<')
    s = s.replace(/&gt;/g, '>')
    s = s.replace(/&#xff08;/g, '(')
    s = s.replace(/&#xff09;/g, ')')
    s = s.replace(/&#xa;/g, '\r\n')

    if (unescape) {
      s = unescape(s)
    }
    return s
  } else {
    return ''
  }
}
/**
 * 格式化薪资显示
 * @param {*} minSalary 最低薪资
 * @param {*} maxSalary 最高薪资
 * @returns 格式化后的薪资字符串
 */
const formatSalary = (minSalary, maxSalary)=> {
	// 两个薪资都有值，显示范围
	if (minSalary && maxSalary) {
		minSalary = (minSalary / 1000).toFixed(1).replace('.0', '')
		maxSalary = (maxSalary / 1000).toFixed(1).replace('.0', '')
		return `￥${minSalary}-${maxSalary}K`;
	}

	// 只有最低薪资
	else if (minSalary && !maxSalary) {
		minSalary = (minSalary / 1000).toFixed(1).replace('.0', '')
		return `￥${minSalary}K起`;
	}

	// 只有最高薪资
	else if (!minSalary && maxSalary) {
		maxSalary = (maxSalary / 1000).toFixed(1).replace('.0', '')
		return `￥${maxSalary}K以内`;
	}

	// 都没有值
	else {
		return "薪资面议";
	}
};

export default {
  showToast,
  showModal,
  commonSaveModel,
  navigateTo,
  navigateToLogin,
  navigateBack,
  redirectTo,
  dateFormat,
  dateFormats,
  getDate,
  queryCodeDesc,
  idHide,
  getReal,
  showMessageModal,
  getAbbreviatSalary,
  openScreen,
  closeOutScreen,
  getFileLoadUrl,
  getRealImgUrl,
  getFileLoadUrlOrDefault,
  getSexHeadOrDefault,
  htmlDecode,
  formatSalary,
}
