<template>
	<div v-if="showError" style="margin-top: 30%;">
		<u-empty :text="errorMsg" mode="page"></u-empty>
	</div>
</template>

<script>
	// import {
	// 	ejs
	// } from '@epoint-mrc/ejsv4';
	export default {
		data() {
			return {
				showError: false,
				errorMsg: '网络异常',
				areaCode: '',
				formData: {},
				channelCode: '', //渠道编号
				taskBasicCode: '', //事项编号
				taskBasicName: '',
				url: '', //跳转的url
				officeNo: '',
				channelId: '',
				//页面回显
				pageEcho: ''
			}
		},
		onLoad(options) {
			this.formData = options
			console.log('options=' + options.userToken)
			if (!this.formData || !this.formData.areaCode) {
				this.areaCode = '659900000000'
			} else if (this.formData.areaCode) {
				this.areaCode = this.formData.areaCode
			}
			if (!this.formData || !this.formData.channelCode) {
				this.channelCode = 'osp-02-006-app'
			}
			// if (this.formData.channelCode == 'zwfw-01-002-zww') {
			// 	let that = this
			// 	if (ejs.os.ejs) {
			// 		ejs.config({
			// 			appkey: '', //设置成应用方的appid
			// 			timestamp: '',
			// 			nonceStr: '',
			// 			signature: '',
			// 			ticketCode: '',
			// 			jsApiList: [{
			// 				xj_custom: ejs.os.android ?
			// 					'com.epoint.workarea.xinjiang.ejsapi2.XJApi' : 'XJApi'
			// 			}]
			// 		});
			// 		ejs.ready(function() {
			// 			ejs.callApi({
			// 				name: 'getOtherToken',
			// 				mudule: 'xj_custom',
			// 				success: function(result) {
			// 					console.log('通过原生api获取浪潮统一认证token：', result.other_access_token);
			// 					that.$base.post('/custom/h5/getUserEJS', {
			// 						accessToken: result.other_access_token
			// 					}, (res) => {
			// 						that.$base.setToken(res.accessToken)
			// 						that.fnInit()
			// 					}, (res) => {
			// 						alert(JSON.stringify(res))
			// 					})
			// 				},
			// 				error: function(err) {
			// 					alert(JSON.stringify(err))
			// 					reject();
			// 				}
			// 			});
			// 		});
			// 	} else if (ejs.os.alipay) {
			// 		that.$base.post('/custom/h5/getUserEJS', {
			// 			accessToken: options.userToken
			// 		}, (res) => {
			// 			that.$base.setToken(res.accessToken)
			// 			that.fnInit()
			// 		})
			// 	} else if (ejs.os.wechat) {
			// 		that.$base.post('/custom/h5/getUserEJS', {
			// 			accessToken: options.userToken
			// 		}, (res) => {
			// 			that.$base.setToken(res.accessToken)
			// 			that.fnInit()
			// 		})
			// 	}
			// 	// that.$base.post('/custom/h5/getUserEJS',{accessToken:'naturalToken8916773337297837784459533248945661608478172294611972177178935669'},(res)=>{
			// 	// 	that.$base.setToken(res.accessToken)
			// 	// 	that.fnInit()
			// 	// },(res)=>{
			// 	// 	alert(JSON.stringify(res))
			// 	// })
			// }
			// //部平台
			// else if (this.formData.security) {
			// 	this.$base.post('/social/decryptHtmlSign', {
			// 		security: this.formData.security
			// 	}, (res) => {
			// 		this.$base.setToken(res.accessToken)
			// 		this.fnInit()
			// 	})
			// } else if (this.formData.cardToken) {
			// 	this.$base.post('/social/loginBycardToken', {
			// 		cardToken: this.formData.cardToken
			// 	}, (res) => {
			// 		this.$base.setToken(res.accessToken)
			// 		this.fnInit()
			// 	})
			// } else if (this.formData.channelType == '8') {
			// 	this.channelCode = 'osp-02-006-app'
			// 	//先获取空的token
			// 	this.$base.post('/custom/h5/getNullToken', null, (res) => {
			// 		let token = res.data.accessToken
			// 		this.$base.setToken(res.accessToken)
			// 		//再调用新企办接口
			// 		setTimeout(() => {
			// 			// JSBridge.ready(function(data){
			// 			JSBridge.request({
			// 				// 测试
			// 				// url: "https://xqb.xinjiang.gov.cn:8443/rst_test/userInfo",    
			// 				// 正式
			// 				url: "https://xqb.xinjiang.gov.cn/ebus/rst_pro/userinfo",
			// 				data: {
			// 					input: ""
			// 					// format: "json",
			// 					// timestamp: timestamp,
			// 					// request_id: this.uuidA.replace("-","").replace("-","").replace("-","").replace("-","").replace("-","")
			// 				},
			// 				header: {
			// 					'Content-Type': 'application/x-www-form-urlencoded', // 默认值
			// 					"access_key": 'xqb',
			// 					'applet-token': applettoken,
			// 					"timestamp": timestamp
			// 				},
			// 				method: 'POST',
			// 				success: function(res) {

			// 					// console.log("data:" + res.data); // 透传http response body
			// 					// console.log("code:" + res.statusCode); // 透传接口返回，可能是200，也有可能是其它返回值
			// 					uni.showToast({
			// 						title: "网络异常，" + res.data,
			// 						icon: 'none',
			// 						duration: 3000
			// 					})
			// 					var result = JSON.parse(res.data)
			// 					if (result.success) {
			// 						this.$user.getUser()
			// 						let user = uni.getStorageSync("user")
			// 						if (user.currentUser?.customMap?.message) {
			// 							uni.showToast({
			// 								title: user.currentUser.customMap.message,
			// 								icon: 'none',
			// 								duration: 3000
			// 							})
			// 						} else {
			// 							this.fnInit()
			// 						}
			// 						//再获取用户信息
			// 					} else {
			// 						let msgArr = result.message.split(":")
			// 						uni.redirectTo({
			// 							url: "/pagesPerson/other/errorPage/errorPage?title=" +
			// 								msgArr[1]
			// 						})
			// 					}
			// 					// todo  真TM迷。 头信息无法获取到value
			// 				},
			// 				fail: function(res) {

			// 					uni.showToast({
			// 						title: "网络异常，请稍后重试",
			// 						icon: 'none',
			// 						duration: 3000
			// 					})
			// 				}
			// 			})
			// 			// })

			// 		}, 200)
			// 	})
			// }
			// // uni.setStorageSync('applet-token', "f6f0fd81.MEUCID3Re/UFgJcVzIN5Qd1NuXLSihANaFPz9QndtlOP0e3BAiEAywNCw7/s+HlvETcU1Pmi8UUoKPDwlZ3gaA9YrSy1k6g=");
			// // this.$base.setToken("585f6d7c.MEYCIQDfa4Ivx3iKRCclk2DR0h5lFbwRnSnkwokN1S7cxF4G2gIhAIiMzj3NeMR9mD8ztflSJtYG2leKe7OPILMnTDPFTcKe");
			// // uni.showLoading({
			// // 	mask: true,
			// // 	title:'加载中',
			// // });

			// // this.fnGetPageUrl()
		},
		methods: {
			fnInit() {
				this.channelCode = this.formData.channelCode
				uni.setStorageSync("channelCode", "osp-02-006-app")
				this.taskBasicCode = this.formData.taskBasicCode
				if (!this.taskBasicCode) {
					this.showErrorMsg("未获取到事项编号！")
					return
				}
				this.checkServiceAuth()
			},
			fnGetPageUrl() {
				this.formData.security = encodeURIComponent(this.formData.security)
				this.$base.post("/api/h5/authorize", this.formData, res => {
					if (res.token) {
						uni.setStorageSync('applet-token', res.token);
					}
					if (res.taskBasicName) {
						uni.setNavigationBarTitle({
							title: res.taskBasicName
						})
					}
					this.taskBasicName = res.taskBasicName
					this.checkServiceAuth()
				}, err => {
					let message = "网络异常！"
					if (err.message) {
						message = err.message
					}
					this.showErrorMsg(message)
				})
			},
			//权限校验
			checkServiceAuth() {
				let that = this
				let params = {
					'taskBasicCode': this.taskBasicCode,
					'type': 'service',
					'path': 'jumpPage',
					'pageEcho': this.pageEcho
				}
				that.$base.post('/auth/checkAuth', params, res => {
					if (res.code == '-1' || res.code == 'R99') {
						//校验失败
						that.showErrorMsg(res.message)
						return
					}
					if (res.code == '0') {
						//未登录
						that.showErrorMsg(res.message)
						return
					}
					if (res.code == 'B99') {
						if (res.user) {
							uni.setStorageSync("user", res.user)
						} else {
							uni.removeStorageSync("user")
						}
						// 基础库信息完善
						that.showErrorMsg(res.message)
						return
					}
					if (res.code == '99') {
						//权限不足
						that.showErrorMsg(res.message)
						return
					}
					if (res.user) {
						uni.setStorageSync("user", res.user)
					} else {
						uni.removeStorageSync("user")
					}
					if (res.taskBasicVo) {
						uni.setStorageSync("service_" + that.taskBasicCode, JSON.stringify(res.taskBasicVo))
					}
					if (res.taskBasicVo && res.taskBasicVo.channelVos) {
						var channelVos = res.taskBasicVo.channelVos;
						for (let i = 0; i < channelVos.length; i++) {
							if (channelVos[i].channelType == that.channelCode) {
								uni.setStorageSync("channelMode", channelVos[i].channelMode);
							}
						}
					}
					if (that.pageEcho != '1') {
						that.projectNo = res.projectNo
					}
					let formVo = res.taskBasicVo.taskBasicFormVos[0]
					if (formVo && formVo.formType == "3") {
						//本系统地址，直接跳转到实际地址
						let formUrl = formVo.formUrl
						if (formUrl.indexOf("http") == -1 && that.checkRouteExist(formUrl)) {
							if (formUrl.indexOf("/") != 0) {
								formUrl = "/" + formUrl
							}
							uni.reLaunch({
								url: formUrl + '?handleItemCode=' + that.taskBasicCode + '&projectNo=' +
									projectNo + '&areaCode=' + that.areaCode + '&handleItemName=' + that
									.taskBasicName + '&pageEcho=' +
									that.pageEcho
							})
							return
						}
						/* if(formUrl.indexOf("http") != -1) {
							//外部地址则通过全页面打开
							window.location.href = formUrl + '?taskBasicCode=' + this.handleItemCode + '&projectNo=' + projectNo + '&taskBasicName=' + this.handleItemName
							return
						} */
					}
					let url = "/pages/iframePage/iframePage";
					//判断地址是否为本地地址，为本地地址则直接打开，不为本地地址，则iframe嵌入
					uni.reLaunch({
						url: url + '?handleItemCode=' + that.taskBasicCode + '&projectNo=' + that
							.projectNo + '&areaCode=' + that.areaCode + '&handleItemName=' + that
							.taskBasicName + '&token=' + encodeURIComponent(uni.getStorageSync(
								'applet-token')) + '&pageEcho=' + this
							.pageEcho
					})
				}, data => {
					Dialog.alert({
						title: '提示',
						message: '权限校验失败！'
					}).then(() => {
						that.errorMsg = '权限校验失败！'
					});
					return
				})
			},
			checkRouteExist(path) {
				let routes = this.$router.options.routes
				return this.checkRoute(routes, path)
			},
			checkRoute(routes, path) {
				for (let i in routes) {
					if (routes[i].path == path || routes[i].path == "/" + path) {
						return true;
					}
					if (routes[i].children) {
						if (this.checkRoute(routes[i].children, path)) {
							return true
						}
					}
				}
				return false
			},
			showErrorMsg(message) {
				this.showError = true
				this.errorMsg = message
				uni.hideLoading();
			}
		}
	}
</script>

<style>
</style>