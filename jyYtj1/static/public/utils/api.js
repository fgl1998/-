import Url from './requestUrl.js'
import xssUtil from './xssUtil.js'
import terminalencrypt from './crypt/terminalencrypt.js'

const showToast = (title, image) => {
  return new Promise((resolve, reject) => {
    uni.showToast({
      title,
      image,
      duration: 2500,
      icon: 'none',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
      complete(res) {
        //console.log(`showToast 接口调用完成，调用结果: `, res);
      },
    })
  })
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
    //根据机器是否可扫脸,跳转不同的登录页
    let faceLogin = uni.getStorageSync('faceLogin')
    uni.navigateTo({
      url: faceLogin === '1' ? '/pages/login/loginFacial' : '/pages/login/login',
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
    uni.navigateBack({
      delta: deltaNum,
    })
  })
}
//关闭当前页面跳转到指定页面
const redirectTo = (url) => {
  return new Promise((resolve, reject) => {
    uni.redirectTo({
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

const dateFormat = (date) => {
  if (date == '' || date == undefined) {
    date = new Date()
  }
  return dateFormats('YYYY-mm-dd', new Date(date))
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
  collect = collect.toUpperCase() // 转化大小写，防止大小写差异查不出
  let codeCacheMap = uni.getStorageSync('codeCacheMap')
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

//后端地址
const requestUrl = Url.requestUrl
//渠道编号
const channelCode = 'jyyz'
//默认接口'/api/business/getData.do'
const interfaceUrl = '/api/business/invoke'
//默认token
let getToken = ''
//请求方法
const request = (url, data, loadStyle, type = true, common = 'publicity') => {
  if (loadStyle) {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
  }
  if (type) {
    data.apiCode = data.method ? data.method : ''
	if(!Url.AllNoChangeList.includes(data.apiCode)){
		if (Url.AllUpdateApiCode.includes(data.apiCode)) {
		  //新增、编辑
		  data.apiCode = 'jyxt_u_' + data.apiCode
		  data.method = 'jyxt_u_' + data.method
		} else if (data.apiCode || data.method) {
		  //查询
		  data.apiCode = 'jyxt_q_' + data.apiCode
		  data.method = 'jyxt_q_' + data.method
		}
	}
  }

  let isCode = false
  if (data.isCode) {
    isCode = true
    delete data.isCode
  }
  const responseType = data.responseType
  if (responseType) {
    delete data.responseType
  }

  getToken = common == 'cipher' ? uni.getStorageSync('setToken') : ''
  url = url ? url : interfaceUrl

  let device_id = uni.getStorageSync('ace711')
  if (device_id) {
    data.device_id = device_id
  }
  data.aae400 = '14'

  data = terminalencrypt.cryptoData(data, channelCode)
  //data.apiCode = data.method ? data.method.substr(0,5) :''
  return new Promise((resolve, reject) => {
    uni.request({
      responseType: responseType ? responseType : '',
      url: requestUrl + url,
      method: 'POST',
      data: data,
      header: {
        channelCode: channelCode,
        'TERMINAL-JTOKEN': getToken,
      },
      success: function (res) {
        if (loadStyle) {
          uni.hideLoading()
        }
        let newVal
        if (res.data.serviceSuccess) {
          if (res.data.resultData?.data?.code === -1) {
            showToast(res.data.resultData.data.message)
            reject(res.data.resultData.data)
          }
          if (type) {
            newVal = JSON.stringify(res.data.resultData.data)
            newVal = xssUtil.decodeSafeHTML(newVal)
            newVal = newVal.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r') //处理\n \t \r
            newVal = JSON.parse(newVal)
            resolve(newVal)
          } else {
            if (common == 'publicity') {
              newVal = JSON.stringify(res.data.resultData)
              newVal = xssUtil.decodeSafeHTML(newVal)
              newVal = JSON.parse(newVal)
              resolve(newVal)
            } else if (common == 'guide') {
              newVal = JSON.stringify(res.data)
              newVal = xssUtil.decodeSafeHTML(newVal)
              newVal = JSON.parse(newVal)
              resolve(newVal)
            } else {
              newVal = JSON.stringify(res.data.resultData.data)
              newVal = xssUtil.decodeSafeHTML(newVal)
              newVal = JSON.parse(newVal)
              resolve(newVal)
            }
          }
        } else {
			if(isCode){
				reject(res.data)
				return
			}
          showToast(res.data.message)
        }
      },
      fail: function (res) {
        showToast('网络异常, 请稍后再试')
        reject(res)
      },
      complete: function () {
        if (loadStyle) {
          uni.hideLoading()
        }
      },
    })
  })
}

let times = 1
const restart = () => {
  times = 1
}

// 缓存码表数据
const appStorage = (callBack) => {
  request('/api/base/getAllAppletDict.do', {}, false).then((res) => {
    if (res) {
      let codeCacheMap = res
      uni.setStorage({
        key: 'codeCacheMap',
        data: res,
        success: function () {
          //console.log("码表缓存成功，共计" + Object.keys(res).length + "条");
        },
        fail: function () {
          //console.log("码表缓存失败")
        },
      })

      // 回调函数
      if (typeof callBack == 'function') {
        callBack(codeCacheMap)
      }
    } else {
      uni.showModal({
        title: '错误提示',
        content: '获取码表失败：请重启服务器',
        showCancel: false,
      })
    }
  })
}

// 获取工种树
const getWorkTypeTree = () => {
  return new Promise((resolve, reject) => {
    let param = {
      method: 'jy009_com01',
    }
    request(null, param, true)
      .then((res) => {
        console.log(res, '获取工种树成功')

        resolve(res.result)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

// 获取职业类 （零工）

// 获取工种树
const getOddJobTypeTree = () => {
  return new Promise((resolve, reject) => {
    let param = {
      method: 'jy216_flex100',
    }
    request(null, param, true)
      .then((res) => {
        resolve(res.acb2a1List)
        // if (res.serviceSuccess) {
        //   resolve(res.data.acb2a1List)
        // } else {
        //   reject(res.errors)
        // }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

// 获取培训树
const getTrainTypeTree = (aae964,aca111) => {
  return new Promise((resolve, reject) => {
    let param = {
      method: 'jy009_com02_interface',
	  aae038: '140100000000',
	  aae964: aae964,
	  aca111: aca111,
    }
    request(null, param, true)
      .then((res) => {
        if (res.result&&res.result.length>0) {
          resolve(res.result)
        } else {
          reject(res.errors)
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

// 获取行业树
const getOddUnitTypeTree = () => {
  return new Promise((resolve, reject) => {
    let param = {
      method: 'jy048_com01',
    }
    request(null, param, true)
      .then((res) => {
        resolve(res.result)
        // if (res.serviceSuccess) {
        //   resolve(res.data.result)
        // } else {
        //   reject(res.errors)
        // }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

//获取图片
const getRealImgUrl = (url) => {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: url,
      success: (res) => {
        resolve(res.path)
      },
      fail: (err) => {
        uni.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(res.tempFilePath)
            } else {
              reject(res.statusCode)
            }
          },
          fail: (err) => {
            reject(err)
          },
        })
      },
    })
  })
}

//获取指定范围的随机整数
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
//转义
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
// 添加浏览记录
const addFootprint = (cz29ParamInfo)=>{
  request(null,cz29ParamInfo,false).then((res) => {
      if (res.serviceSuccess) {
        //请求成功
      } else {
        //请求失败
      }
    });
}
export default {
  showToast,
  showModal,
  commonSaveModel,
  navigateTo,
  navigateToLogin,
  navigateBack,
  redirectTo,
  dateFormat,
  getDate,
  request,
  appStorage,
  queryCodeDesc,
  idHide,
  getWorkTypeTree,
  getAge,
  dateFormats,
  getOddJobTypeTree,
  getOddUnitTypeTree,
  getTrainTypeTree,
  getRealImgUrl,
  getRandomInt,
  htmlDecode,
  addFootprint,
  formatSalary,
}
