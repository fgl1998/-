/**
 * 用户相关js
 */
const base = require('./applet.base.js');

/**
 * function: 用户登录
 * @params    请求参数
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function login(params, onSuccess, onFailure) {
	let param = JSON.parse(JSON.stringify(params))
	base.post(base.BASE_URL.replace("api", "")+'login', param,
		onSuccess, onFailure);
}

/**
 * 自然人注册
 */
function naturalRegister(params, onSuccess, onFailure) {
	let param = JSON.parse(JSON.stringify(params))
	base.post('/register/naturalRegister.do', param, onSuccess, onFailure)
}

/**
 * function: 三方账户解绑
 */
function thirdUnBind(onSuccess, onFailure) {
	getCode(function(data) {
		let params = {
			code: data.code
		};
		base.post('/third/thirdUnBind.do', params, onSuccess, onFailure);
	}, onFailure);
}

/**
 * function: 三方账户绑定
 */
function thirdBind(onSuccess, onFailure) {
	getCode(function(data) {
		let params = {
			code: data.code
		};
		base.post('/third/thirdBind.do', params,
			onSuccess, onFailure);
	}, onFailure);
}

/**
 * 三方登录
 */
function thirdLogin(onSuccess, onFailure) {
	getCode(function(data) {
		let params = {
			code: data.code,
			userType: 'UT01'
		};
		base.post('/login/thirdLogin.do', params,
			onSuccess, onFailure);
	}, onFailure);
}

/**
 * 当前小程序是否绑定
 */
function isBind(onSuccess, onFailure) {
	getCode(function(data) {
		let params = {
			code: data.code
		};
		base.post('/third/currentBindStatus.do', params,
			onSuccess, onFailure);
	}, onFailure);
}

/**
 * function: 获取用户信息
 */
function getUser(onSuccess, onFailure) {
	base.post('/user/getUserInfo', null,
		res => {
			if (res.loginUser) {
				uni.setStorageSync("user", res)
			} else {
				uni.removeStorageSync("user")
			}
			onSuccess(res)
		}, data => {
			uni.removeStorageSync("user")
			if(onFailure){
				onFailure(data)
			} else {
				uni.showToast({
					title:data.message,
					icon:'none'
				})
			}
		});
}


/**
 * 修改用户信息
 */
function modifyUser(type, params, onSuccess, onFailure) {
	let url = ''
	//自然人
	if (type == '1') {
		url = '/member/modifyNaturalInfo.do'
		//法人
	} else {
		url = '/member/modifyLegalInfo.do'
	}
	base.post(url, params, onSuccess, onFailure)

}

/**
 * 找回密码
 */
function resetPwd(params, onSuccess, onFailure) {
	let param = JSON.parse(JSON.stringify(params))
	base.post('/member/resetAccountWordpass.do', param, onSuccess, onFailure)
}

/**
 * 修改密码
 */
function modifyPwd(params, onSuccess, onFailure) {
	let param = JSON.parse(JSON.stringify(params))
	base.post('/member/modifyAccountWordpass.do', param, onSuccess, onFailure)
}

/**
 * 更改自然人手机
 */
function modifyMobile(params, onSuccess, onFailure) {
	base.post(memberUrl + '/member/modifyNaturalMobile.do', params, onSuccess, onFailure)
}

/**
 * 更改自然人邮箱
 */
function modifyEmail(params, onSuccess, onFailure) {
	base.post(memberUrl + '/member/modifyNaturalEmail.do', params, onSuccess, onFailure)
}

/**
 * function: 退出登录
 * @onSuccess 成功回调
 * @onFailure 失败回调
 */
function logout(onSuccess, onFailure) {
	let user = base.getUser(false)
	base.post(base.BASE_URL.replace("api", "")+'logout', {accountId: user.accountBo.accountId}, onSuccess, onFailure);
}

/**
 * 修改用户头像
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function modifyHead(onSuccess, onFailure) {
	base.uploadImg(data => {
		data = JSON.parse(data).resultData.data
		let param = {
			fileId: data[0].fileId
		}
		base.post(memberUrl + '/member/modifyAccountHeadPortrait.do', param, datas => {
			onSuccess(data[0].fileId)
		}, onFailure)
	}, onFailure)
}

/**
 * 信息验重
 */
function checkRepeat(params, onSuccess, onFailure) {
	base.post('/member/queryRepeatUserInfo.do', params, onSuccess, onFailure);
}

function getAppletUserInfo() {
	// #ifdef MP-WEIXIN
	wx.login({
		success: (data)=> {
			onSuccess({
				code: data.code
			});
		},
		fail: (err)=> {
			if(onFailure) {
				onFailure({
					message: '获取登录凭证失败'
				});
			}
		}
	});
	// #endif
	// #ifdef MP-ALIPAY
	my.getAuthCode({
		scopes: 'auth_user',
		success: (data)=> {
			onSuccess({
				code: data.authCode
			});
		},
		fail: (err)=> {
			if(onFailure) {
				onFailure({
					message: '获取登录凭证失败'
				});
			}
		}
	});
	// #endif
}

/**
 * 初始化订阅消息
 */
function initSubscribeMsg() {
	//#ifdef MP-WEIXIN
	wx.getSetting({
		withSubscriptions: true,
		success (res) {
			let setting = res.subscriptionsSetting
			if(setting['xqmgsvCLxsD_Ixsvqmo36RaH1s2Hm821W3rKrzygfAA'] && setting['xqmgsvCLxsD_Ixsvqmo36RaH1s2Hm821W3rKrzygfAA'] == "accept") {
				//已订阅，不再提示
			} else {
				//订阅消息
				wx.requestSubscribeMessage({
					tmplIds: ['xqmgsvCLxsD_Ixsvqmo36RaH1s2Hm821W3rKrzygfAA'],
					success (res) {
						console.log(res)
					},
					fail (err) {
						console.log(err)
					}
				})
			}
		}
	})
	//#endif
	//#ifdef MP-ALIPAY
	my.requestSubscribeMessage({
		entityIds: ['4a7091b24bfb4e46be7844173cd15929'],
		success: res => {
			console.log('接口调用成功的回调', res);
		},
		fail: res => {
			console.log('接口调用失败的回调', res);
		}
	});
	//#endif
}

/**
 * 获取openid
 * @param {Object} onSuccess
 */
function getOpenId(onSuccess) {
	getCode(res=>{
		// #ifdef MP-WEIXIN
		base.post('/applet/getAppletOpenId', {code: res.code}, data=>{
			if(data.resultData) {
				data = data.resultData
			}
			data.appletType = 1
			onSuccess(data)
		});
		// #endif
		// #ifdef MP-ALIPAY
		base.post('/alipay/getAlipayUserId', {code: res.code}, data=>{
			if(data.resultData) {
				data = data.resultData
			}
			data.appletType = 2
			onSuccess(data)
		});
		// #endif
	});
}

/**
 * function: 获取登录凭证，已封装好
 */
function getCode(onSuccess, onFailure) {
	// #ifdef MP-WEIXIN
	wx.login({
		success: (data)=> {
			onSuccess({
				code: data.code
			});
		},
		fail: (err)=> {
			if(onFailure) {
				onFailure({
					message: '获取登录凭证失败'
				});
			}
		}
	});
	// #endif
	// #ifdef MP-ALIPAY
	my.getAuthCode({
		scopes: 'auth_base',
		success: (data)=> {
			onSuccess({
				code: data.authCode
			});
		},
		fail: (err)=> {
			if(onFailure) {
				onFailure({
					message: '获取登录凭证失败'
				});
			}
		}
	});
	// #endif
}

//返回上一页
function toPrePage() {
	setTimeout(function() {
		let router = getCurrentPages();
		let prePage = '/' + router[router.length - 2].is;
		uni.reLaunch({
			url: prePage
		})
	}, 1500)
}

/**
 * 通过module.exports方式提供给外部调用
 */
module.exports = {
	thirdUnBind: thirdUnBind,
	thirdBind: thirdBind,
	getUser: getUser,
	logout: logout,
	login: login,
	thirdLogin: thirdLogin,
	naturalRegister: naturalRegister,
	isBind: isBind,
	modifyUser: modifyUser,
	resetPwd: resetPwd,
	toPrePage: toPrePage,
	modifyHead: modifyHead,
	modifyPwd: modifyPwd,
	modifyMobile: modifyMobile,
	modifyEmail: modifyEmail,
	checkRepeat: checkRepeat,
	getCode:getCode,
	getOpenId: getOpenId,
	initSubscribeMsg: initSubscribeMsg
}