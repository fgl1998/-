/**
 * 工具类js
 */
const numberReg = /^-?[1-9][0-9]?.?[0-9]*$/
const intReg = /^-?[1-9][0-9]*$/
const phoneReg = /^1[0-9]{10,10}$/
const emailReg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const pwdReg = /^.{6,16}$/

/**
 * 判断是否为数字
 * @param {Object} val
 */
function isNumber(val) {
	return numberReg.test(val)
}

/**
 * 判断是否为int
 * @param {Object} val
 */
function isInt(val) {
	return intReg.test(val)
}

/**
 * 判断是否为手机号
 * @param {Object} val
 */
function isPhone(val) {
	return phoneReg.test(val)
}

/**
 * 判断是否为电子邮箱
 * @param {Object} val
 */
function isEmail(val) {
	return emailReg.test(val)
}

/**
 * 判断密码是否满足要求
 * @param {Object} val
 */
function isPwd(val) {
	return pwdReg.test(val)
}

/**
 * 身份证号脱敏
 */
function idcardHide(val) {
	if (!val) return;
	let news = val.substr(0, 3) + '***********' + val.substr(val.length-4, 4)
	return news
}

/**
 * 姓名脱敏
 * @param {Object} val
 */
function nameHide(val) {
	if (!val) return;
	let news = ''
	if (val.length > 2) {
		news = '**' + val.substr(val.length-1, 1)
	} else {
		news = '*' + val.substr(1, 1)
	}
	return news
}

/**
 * 手机号脱敏
 */
function mobileHide(val) {
	if (!val) return;
	let news = val.substr(0, 7) + '****'
	return news
}

/**
 * 截取时间年月日
 */
function getTimeYear(val) {
	if (!val) return;
	let news = val.substr(0, 10)
	return news
}

/**
 * 将时间戳格式化为yyyy-MM-dd HH:mm:ss
 * @param {Object} timeStamp
 */
function toTimeStr(timeStamp) {
	if(!timeStamp){
		return ''
	}
	var time = new Date(parseInt(timeStamp));
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

/**
 * 格式化日期
 */
function timeFormat(dateTime = null, fmt = "yyyy-mm-dd") {
	// 如果为null,则格式化当前时间
	if (!dateTime) dateTime = Number(new Date());
	// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
	if (dateTime.toString().length == 10) dateTime *= 1000;
	let date = new Date(Number(dateTime));
	let ret;
	let opt = {
		"y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"h+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString(), // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
		}
	}
	return fmt;
}

/**
 * 时间补足2位数
 * @param {Object} m
 */
function add0(m) {
	return m < 10 ? '0' + m : m
}

/**
 * 判断是否为app
 */
function isApp() {
	let flag = false;
	try {
		//获取app版本号
		md.appVersion;
		flag = true;
	} catch (e) {
		flag = false;
	}
	return flag;
}

/**
 * 判断是否是ios
 */
function isIos() {
	if (md.systemType == "ios") {
		return true;
	}
	return false;
}

/**
 * 获取身份证号中的出生日期、性别、年龄
 * @param idNumber
 * @returns {{birthday: string, sex: string, age: string}}
 */
function getIdNumberInfo(idNumber) {
	var birthday =  idNumber.substring(6, 10) + "-" + idNumber.substring(10, 12) + "-" + idNumber.substring(12, 14);
	var sex = "";
	if(parseInt(idNumber.substr(16, 1)) % 2 == 1){
		sex = "1";
	} else {
		sex = "2";
	}
	var myDate = new Date();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
	if (idNumber.substring(10, 12) < month || idNumber.substring(10, 12) == month && idNumber.substring(12, 14) <= day) {
		age++;
	}
	return {
		"birthday":birthday + "",
		"sex":sex +"",
		"age":age + "",
	}
}

/**
 * 获取当前时间
 * 格式:yyyy代表年份,MM代表月份,dd代表天数,hh代表小时,mm代表分钟,ss代表秒数
 */
function getCurrSysDate(format) {
	const date = new Date()
	let fmt = format.toString()
	if (fmt.indexOf('yy') !== -1) {
		if (fmt.indexOf('yyyy') !== -1) {
			fmt = fmt.replace('yyyy', date.getFullYear())
		} else {
			fmt = fmt.replace('yy', date.getFullYear().toString().substr(-2, 2))
		}
	}
	if (fmt.indexOf('MM') !== -1) {
		const m = date.getMonth() + 1
		fmt = fmt.replace('MM', m.toString().length == 1 ? ('0' + m) : m)
	}
	if (fmt.indexOf('dd') !== -1) {
		const d = date.getDate()
		fmt = fmt.replace('dd', d.toString().length == 1 ? ('0' + d) : d)
	}
	if (fmt.indexOf('hh') !== -1) {
		fmt = fmt.replace('hh', date.getHours())
	}
	if (fmt.indexOf('mm') !== -1) {
		fmt = fmt.replace('mm', date.getMinutes())
	}
	if (fmt.indexOf('ss') !== -1) {
		fmt = fmt.replace('ss', date.getSeconds())
	}
	return fmt
}

/**
 * 设置倒计时
 * @param {Object} i
 */
function setCountDown(i) {
	uni.setStorageSync("countdown" + i, "60s")
	setTimeout(function() {
		uni.removeStorageSync("countdown" + i)
	}, 60000)
}

/**
 * 获取倒计时
 * @param {Object} i
 * @param {Object} callback
 */
function getCountDown(i, callback) {
	let time = uni.getStorageSync("countdown" + i)
	if (time) {
		uni.showToast({
			title: '发送验证码过于频繁,请一分钟后再试',
			icon: 'none',
			duration: 3000
		})
		callback(false)
	} else {
		callback(true)
	}
}

/**
 * 去除文本中的Html标签
 * @param {Object} description
 */
function replaceHtml(description) {
	description = description.replace(/(\n)/g, "");
	description = description.replace(/(\t)/g, "");
	description = description.replace(/(\r)/g, "");
	description = description.replace(/<\/?[^>]*>/g, "");
	description = description.replace(/\s*/g, "");
	description = description.replace(/&nbsp;/ig, "");
	description = description.replace(/&ldquo;/ig, "");
	description = description.replace(/&rdquo;/ig, "");
	description = description.replace(/&middot;/ig, "");
	description = description.replace(/&mdash;/ig, "");
	return description;
}

/**
 * 消息推送监听
 */
function setJpush() {
	if (isApp()) {
		//用户关闭了消息推送
		if (!uni.getStorageSync('push')) {
			return
		} else {
			let _this = this
			//初始化消息推送
			jPush.init(function(rets) {
				if (rets.status) {
					//绑定登录用户
					_this.changeJpush()
				}
			});
			jPush.getRegistrationId(function(ret) {})
			//监听jpush
			jPush.setListener(function(ret, err) {})
			//点击事件
			md.addEventListener({
				name: 'notifyclicked'
			}, function(ret, err) {
				console.log("22222222---------------")
				setTimeout(function() {
					notifys()
				}, 100)
			})
		}
	}
}

/**
 * 更换监听用户
 * @param {Object} alias 别名，一般使用登录账号
 * @param {Object} tag 标签，一般使用登录账号
 */
function changeJpush(alias, tag) {
	if (isApp()) {
		//用户关闭了消息推送
		if (!uni.getStorageSync('push')) {
			return
		} else {
			//绑定别名
			let user = base.getUser(true, true)
			if (user) {
				let param = {
					alias: alias,
					tags: [tags]
				}
				jPush.bindAliasAndTags(param, function(ret) {});
			};
		}
	}
}

function notifys() {
	if (!base.getUser(true, true)) {
		uni.showToast({
			title: '请先登录后查看消息',
			icon: 'none',
			duration: 3000
		})
		return
	};
	uni.navigateTo({
		url: '/pages/my/myMessage/myMessage'
	})
}

/**
 * 获取url的参数对象
 * @param {Object} params 完整url路径
 */
function getUrlObject(params) {
	let url = decodeURIComponent(params)
	url = url.slice(url.indexOf("?") + 1)
	url = url.split('&')
	let param = {}
	for (let i = 0; i < url.length; i++) {
		let key = url[i].slice(0, url[i].indexOf('='))
		let value = url[i].slice(url[i].indexOf('=') + 1)
		param[key] = value
	}
	return param
}

/**
 * 规则校验
 * @param {Object} data
 * @param {Object} rules
 */
function validate(data, rules) {
	let res = {
		isOk: true,
		errMsg: ''
	}
	if (!rules || !rules.length) {
		return res
	}
	for (let rule of rules) {
		// rule: {name:'', type:'', errMsg:'', min:1, max:2, eqName:'', required:boolean, regex:'', validator:function}
		if (!rule || !rule.name || !rule.type) {
			continue
		}
		// 如果值不存在
		if (!data[rule.name]) {
			// 如果是必填项就返回错误提示，required可以作为type是为了不同的type能给用户不同的提示
			if (rule.type === 'required' || rule.required) {
				res = {
					isOk: false,
					errMsg: rule.errMsg
				}
				if (!res.errMsg) {
					res.errMsg = '请输入必填项数据' // 默认提示
				}
				return res
			}
			// 如果不是必填项就跳过
			continue
		}
		switch (rule.type) {
			// required 上面已经判断过了
			case 'eq':
				if (data[rule.name] !== data[rule.eqName]) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'number':
				if (!numberReg.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'int':
				if (!intReg.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'phone':
				if (!phoneReg.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'email':
				if (!emailReg.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'pwd':
				if (!pwdReg.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'range': // 数字类型的值取值范围
				// {name: 'xxx', type: 'range', min: 6, max: 6, required: true, errMsg: 'xxx'}
				let val = data[rule.name]
				if (val) {
					if (numberReg.test(val)) {
						if (rule.min && val < rule.min) {
							res = {
								isOk: false,
								errMsg: rule.errMsg
							}
						} else if (rule.max && val > rule.max) {
							res = {
								isOk: false,
								errMsg: rule.errMsg
							}
						}
					} else {
						res = {
							isOk: false,
							errMsg: rule.errMsg
						}
					}
				}
				break
			case 'lengthRange': // 字符串长度取值范围
				// {name: 'xxx', type: 'lengthRange', min: 6, max: 6, errMsg: 'xxx'}
				let le = data[rule.name] ? data[rule.name].length : 0
				if (rule.min && le < rule.min) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				} else if (rule.max && le > rule.max) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'regex': // 自定义正则表达式
				// {name: 'xxx', type: 'regex', regex: /^1[0-9]{10,10}$/, errMsg: 'xxx'}
				if (rule.regex && !rule.regex.test(data[rule.name])) {
					res = {
						isOk: false,
						errMsg: rule.errMsg
					}
				}
				break
			case 'self': // 自定义校验函数
				// {name: 'xxx', type: 'self', validator: fnValidate}
				if (rule.validator) {
					res = rule.validator(rule.name, data[rule.name])
				}
				break
		}
		// 发现任何一个错误就立即返回，后面的不再判断
		if (!res.isOk) {
			if (!res.errMsg) {
				res.errMsg = '请正确填写数据' // 默认提示
			}
			return res
		}
	}
	return res
}

const commonTipsModel = (msg) => {
	uni.showModal({
		content: msg,
		showCancel: false,
		success: function success(res) {
			//navigateTo('/pages/index/main')
		}
	});
}

//心跳检测
const heartCheck = {
	timeout: 10000,        //10秒发一次心跳
	timeoutObj: null,
	serverTimeoutObj: null,
	reset: function(){
		clearTimeout(this.timeoutObj);
		clearTimeout(this.serverTimeoutObj);
		return this;
	},
	start: function(){
		let self = this;
		this.timeoutObj = setTimeout(function(){
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			//onmessage拿到返回的心跳就说明连接正常
			uni.sendSocketMessage({
			    data: "ping"
			});
			self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
				uni.closeSocket();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
			}, self.timeout)
		}, this.timeout)
	}
}

export default {
	toTimeStr: toTimeStr,
	getTimeYear: getTimeYear,
	nameHide: nameHide,
	idcard: idcardHide,
	mobile: mobileHide,
	isApp: isApp,
	isIos: isIos,
	setCountDown: setCountDown,
	getCountDown: getCountDown,
	getIdNumberInfo: getIdNumberInfo,
	isNumber: isNumber,
	isInt: isInt,
	isPhone: isPhone,
	isEmail: isEmail,
	isPwd: isPwd,
	validate: validate,
	replaceHtml: replaceHtml,
	setJpush: setJpush,
	changeJpush: changeJpush,
	getUrlObject: getUrlObject,
	commonTipsModel: commonTipsModel,
	timeFormat: timeFormat,
	getCurrSysDate: getCurrSysDate,
	heartCheck: heartCheck
}
