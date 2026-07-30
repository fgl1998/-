<template>
	<!-- 中转页面 -->
	<view>
		<div v-if="errorMsg.length > 0" style="margin-top: 30%;">
			<van-empty :description="errorMsg"></van-empty>
		</div>
	</view>
</template>

<script>
	import {
		Dialog
	} from 'vant';
	export default {
		data() {
			return {
				//业务受理号编号
				projectNo: '',
				//地区编码
				areaCode: '',
				//事项编号
				handleItemCode: '',
				//事项名称
				handleItemName: '',
				//渠道编号
				channelCode: 'osp-02-006-app',
				//错误提示
				errorMsg: '',
				//页面回显
				pageEcho: ''
			}
		},
		onLoad(option) {
			this.channelCode = option.channelCode
			this.handleItemCode = option.handleItemCode
			this.handleItemName = option.handleItemName
			this.pageEcho = option.pageEcho
			if (this.pageEcho == "1") {
				this.projectNo = option.projectNo
			}
			if (this.handleItemName) {
				try {
					uni.setNavigationBarTitle({
						title: this.handleItemName
					});
				} catch (e) {}
			}
			this.areaCode = option.areaCode
			//老年模式 
			uni.setStorageSync('old', option.old)
			uni.setStorageSync('applet-token', option.token);
			if (!this.channelCode || this.channelCode == null || this.channelCode == "" || this.channelCode == "undefined") {
				this.channelCode = "osp-02-006-app"
			}
			uni.setStorageSync("channelCode", this.channelCode)
			uni.setStorageSync("areaCode", this.areaCode)

			this.checkServiceAuth()
		},
		methods: {
			//权限校验
			checkServiceAuth() {
				let params = {
					'taskBasicCode': this.handleItemCode,
					'type': 'service',
					'path': 'jumpPage',
					'pageEcho': this.pageEcho
				}
				this.$base.post('/auth/checkAuth', params, res => {
					if (res.code == '-1' || res.code == 'R99') {
						//校验失败
						Dialog.alert({
							title: '提示',
							message: res.message
						}).then(() => {
							this.errorMsg = res.message
						});
						return
					}
					if (res.code == '0') {
						//未登录
						Dialog.alert({
							title: '提示',
							message: res.message
						}).then(() => {
							this.errorMsg = res.message
							if(this.errorMsg && (this.errorMsg.indexOf("登录信息已失效") != -1 || this.errorMsg.indexOf('用户未登录') != -1 || this.errorMsg.indexOf('请先登录后再进行该操作') != -1)) {
								// 判断是否为小程序环境
								if(this.$base.isWechat()) {
									wx.miniProgram.navigateBack({delta: 1})
									wx.miniProgram.postMessage({data:{ action: "login"} })
								} else if(this.$base.isApp()) {
									// 执行父页面方法
									md.execScript({
										// frameName: "main",
										name: 'root',
										script: "_setMessage({\"action\":\"login\"})"
									})
								} else {
									window.history.go(-1);
								}
							}
						});
						return
					}
					if (res.code == 'B99') {
						if (res.user) {
							uni.setStorageSync("user", res.user)
						} else {
							uni.removeStorageSync("user")
						}
						// 基础库信息完善
						Dialog.alert({
							title: '提示',
							message: res.message
						}).then(() => {
							this.errorMsg = res.message
						});
						return
					}
					if (res.code == '99') {
						//权限不足
						Dialog.alert({
							title: '提示',
							message: res.message
						}).then(() => {
							this.errorMsg = res.message
						});
						return
					}
					if (res.user) {
						uni.setStorageSync("user", res.user)
					} else {
						uni.removeStorageSync("user")
					}
					if (res.taskBasicVo) {
						uni.setStorageSync("service_" + this.handleItemCode, JSON.stringify(res.taskBasicVo))
					}
					if (res.taskBasicVo && res.taskBasicVo.channelVos) {
						var channelVos = res.taskBasicVo.channelVos;
						for (let i = 0; i < channelVos.length; i++) {
							if (channelVos[i].channelType == this.channelCode) {
								uni.setStorageSync("channelMode", channelVos[i].channelMode);
							}
						}
					}
					if (this.pageEcho != '1') {
						this.projectNo = res.projectNo
					}
					let formVo = res.taskBasicVo.taskBasicFormVos[0]
					if (formVo && formVo.formType == "3") {
						//本系统地址，直接跳转到实际地址
						let formUrl = formVo.formUrl
						if (formUrl.indexOf("http") == -1 && this.checkRouteExist(formUrl)) {
							if (formUrl.indexOf("/") != 0) {
								formUrl = "/" + formUrl
							}
							uni.reLaunch({
								url: formUrl + '?taskBasicCode=' + this.handleItemCode + '&projectNo=' +
									projectNo + '&taskBasicName=' + this.handleItemName + '&pageEcho=' +
									this.pageEcho
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
						url: url + '?taskBasicCode=' + this.handleItemCode + '&projectNo=' + this
							.projectNo + '&taskBasicName=' + this.handleItemName + '&pageEcho=' + this
							.pageEcho
					})
				}, data => {
					Dialog.alert({
						title: '提示',
						message: '权限校验失败！'
					}).then(() => {
						this.errorMsg = '权限校验失败！'
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
			}
		}
	}
</script>

<style>

</style>