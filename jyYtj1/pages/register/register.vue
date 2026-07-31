<template>
	<div class="page">
		<!-- 用户注册 -->
		<common-header></common-header>
		<div class="page-wrap">
			<div class="wrap-center">
				<div class="regist-wrap">
					<div class="regist-title">
						请输入注册信息
					</div>
					<div class="regist-con">
						<div class="regist-form">
							<div class="form-group">
								<uni-forms ref="form" :modelValue="formInfo" :rules="rules">
									<uni-row class="uni-row">
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="姓名:" name="aac003" required labelWidth="120">
													<input type="text" class="input-box" v-model="formInfo.aac003"
														@input="binddata('aac003',$event.detail.value)" />
													<!-- <common-keyboard placeholder="" :classStyle="classStyle" @getSearchValue="(val)=>{ formInfo.aac003 = val}" idName='inputUnit' > </common-keyboard> -->
												</uni-forms-item>
												<div class="form-read">
													<button class="btn btn-blue" style="margin-top: -25px;" @click="readCard">读身份证</button>
													<button class="btn btn-blue" style="margin-top: 10px;" @click="readSocialCard">读社保卡</button>
												</div>
											</div>
										</uni-col>
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="身份证号:" name="aac002" required labelWidth="120">
													<input class="input-box" type="idcard" maxlength="18"
														v-model="formInfo.aac002"
														@input="binddata('aac002',$event.detail.value)" />
												</uni-forms-item>
											</div>
										</uni-col>
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="手机号:" name="acb501" required labelWidth="120">
													<input class="input-box" type="number" maxlength="11"
														v-model="formInfo.acb501"
														@input="binddata('acb501',$event.detail.value)" />
												</uni-forms-item>
											</div>
										</uni-col>
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="验证码:" name="code" required labelWidth="120">
													<div class="code">
														<input class="input-box" type="number" maxlength="6"
															v-model="formInfo.code"
															@input="binddata('password',$event.detail.value)" />
														<button class="code-btn" @click="sendCode"
															:disabled="!disabledCode">{{codeText}}</button>
													</div>
												</uni-forms-item>
											</div>
										</uni-col>
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="账号名:" name="username" required labelWidth="120">
													<!-- <input class="input-box" type="text" v-model="formInfo.username"
														@input="binddata('username',$event.detail.value)" /> -->
														<!-- <common-keyboard placeholder="" :classStyle="classStyle" @getSearchValue="(val)=>{ formInfo.username = val}" idName='inputUserName' ></common-keyboard> -->
													<uni-easyinput class="input-box" type="text" v-model="formInfo.aac002" disabled></uni-easyinput>
												</uni-forms-item>
											</div>
										</uni-col>
										<uni-col :span="12">
											<div class="form-item">
												<uni-forms-item label="密码:" name="password" required labelWidth="120">
													<input class="input-box" type="password" maxlength="18"
														v-model="formInfo.password"
														@input="binddata('password',$event.detail.value)" />
													<!-- <common-keyboard placeholder="" :classStyle="classStyle" :inputType="inputType" @getSearchValue="(val)=>{ formInfo.password = val}" idName='inputPassword' ></common-keyboard> -->
													<uni-view data-v-61dfc0d0="" class="uni-error-message" style="padding-left: 120px;">
														<uni-text data-v-61dfc0d0="" class="uni-error-message-text">
															<span>密码需包含字母与数字,长度8到18个字符</span>
														</uni-text>
													</uni-view>
												</uni-forms-item>
											</div>
										</uni-col>
									</uni-row>
								</uni-forms>
							</div>
							<div style="display: flex;">
								<div class="form-group-btn">
									<button class="btn btn-blue" @click="register">确定注册</button>
								</div>
								<div class="form-group-btn1">
									<div class="form-tip" v-if="errorStatus">
										<i class="ic ic-yellow-tip"></i>
										<span>{{errorMsg}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="regist-tip">
							<div class="tip-title"><i class="ic ic-tip"></i></div>
							<div class="tip-decr">
								<view>
									<text class="text-blue">读身份证</text><span>，请将身份证放置在身份证读卡区再点击‘读身份证’读取</span>
									<text class="text-blue" style="padding-left: 300px;">读社保卡</text><span>，请将社保卡插入社保卡读卡区再点击‘读社保卡’读取</span>
								</view>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--身份证-->
		<uni-popup ref="idCardPopup" type="center" :animation="false">
			<div class="popup-box">
				<div class="popup-img-box idCard-img">
					<image src="../../static/images/gif/idCard.gif" mode="aspectFill" class="popup-img"></image>
				</div>
				<button class="btn btn-blue" @click="closeIdCard">关闭</button>
			</div>
		</uni-popup>
		<!--社保卡-->
		<uni-popup ref="socialPopup" type="center" :animation="false">
			<div class="popup-box">
				<div class="popup-img-box social-img">
					<image src="../../static/images/gif/socialSecurityCard.gif" mode="aspectFill" class="popup-img">
					</image>
				</div>
				<button class="btn btn-blue" @click="closeSocial">关闭</button>
			</div>
		</uni-popup>
		<!--footer-->
		<common-footer :isLogin="isLogin" @login="login"></common-footer>
	</div>
</template>

<script>
	export default {
		onLoad(option) {
			if (JSON.stringify(option) != '{}') {
				this.$utils.showToast("未查询到用户信息，请完善相关信息完成注册!");
				this.personInfo = JSON.parse(decodeURIComponent(option.personInfo));
				this.formInfo.aac002 = this.personInfo.idcard;
				this.formInfo.aac003 = this.personInfo.name;
			}
		},
		data() {
			return {
				// 传递给输入框及键盘组件，输入框样式及类型
				classStyle: 'input-box',
				inputType: 'password',
				
				isLogin: false,
				formInfo: {
					aac003: '',
					acb501: '',
					aac002: '',
					code: '',
					username: '',
					password: ''
				},
				isRead: true,
				disabledCode: true,
				codeText: '获取验证码',
				disRegist: false,
				errorStatus: false,
				errorMsg: '',
				rules: {
					aac003: {
						rules: [{
								required: true,
								errorMessage: '请输入姓名',
							},
							{
								minLength: 2,
								maxLength: 10,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					acb501: {
						rules: [{
								required: true,
								errorMessage: '请输入电话号码',
							},
							{
								pattern: /^1[3456789]\d{9}$/,
								errorMessage: '请输入正确的电话号码',
							}
						]
					},
					aac002: {
						rules: [{
								required: true,
								errorMessage: '请输入身份证号',
							},
							{
								format: 'idcard',
								errorMessage: '请输入正确的身份证号',
							}
						]
					},
					code: {
						rules: [{
							required: true,
							errorMessage: '请输入验证码',
						}]
					},
					username: {
						rules: [{
								required: true,
								errorMessage: '请输入用户名',
							},
							{
								format: 'chinese',
								errorMessage: '用户名不可包含汉字',
							}
						]
					},
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 8,
								maxLength: 18,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
							},
							{
								format: 'passEnOrNr',
								errorMessage: '密码必须包含字母和数字',
							}
						]
					},
					personInfo : {},
				}
			}
		},
		methods: {
			//关闭身份证读卡
			closeIdCard: function() {
				this.$refs.idCardPopup.close()
			},
			//关闭社保卡读卡
			closeSocial: function() {
				this.$refs.socialPopup.close()
			},

			//发送验证码
			sendCode() {
				if (!this.formInfo.acb501) {
					this.$utils.showToast("请输入手机号码")
				} else {
					this.countDown(60);
					let ret = {};
					ret.method = "ytjLoginByPhone";
					ret.acb501 = this.formInfo.acb501;
					this.$utils.request(ret, res => {
						if (res.code === "-1") {
							this.$utils.showToast("调用服务异常")
							return
						} else {
							this.$utils.showToast("已经将短信验证码发送到输入的手机号,请及时查收!");
						}
					});
				}
			},
			// 倒计时方法
			countDown(time) {
				if (time === 0) {
					this.disabledCode = true
					this.codeText = "获取验证码"
					return;
				} else {
					this.disabledCode = false
					this.codeText = "重新发送(" + time + ")"
					time--
				}
				setTimeout(() => {
					this.countDown(time)
				}, 1000)
			},
			binddata(name, value) {
				//通过 input 事件设置表单指定 name 的值
				this.$refs.form.setValue(name, value)
			},
			login: function(value) {
				this.isLogin = value;
			},
			readCard() {
				this.$refs.idCardPopup.open()
				this.$cardUtil.callCard(2, "", res => {
					if (res.data.resultFlag == '-1') {
						this.closeIdCard();
						this.$utils.showToast("获取身份信息失败，请把身份证放置在读卡区再点击刷卡")
						return
					}
					this.formInfo.aac002 = res.data.resultContent.certNumber;
					this.formInfo.aac003 = res.data.resultContent.partyName;
					this.closeIdCard();

				})
			},
			// 读取社保卡
			readSocialCard() {
				this.$refs.socialPopup.open();
				let _this = this;
				let url = "ws://127.0.0.1:12342";
				let websocket;
				let connected = false;
				if ('WebSocket' in window) {
					websocket = new WebSocket(url);
				} else if (window.WebSocket) {
					websocket = new WebSocket(url);
				} else if ('MozWebSocket' in window) {
					websocket = new MozWebSocket(url);
				} else {
					_this.$utils.commonSaveModel("浏览器版本太低！请使用Chrome、Firefox、IE10+浏览器！")
					// alert("浏览器版本太低！请使用Chrome、Firefox、IE10+浏览器！");
				}
				
				websocket.onopen = function() {
					connected = true;
					let jsonStr = JSON.stringify({
						'function': 'iReadCardBas',
						'iType': 3
					});
					websocket.send(jsonStr);
				}
				websocket.onmessage = function(e) {
					let dataStr = JSON.parse(e.data);
					if (dataStr.success == -2) {
						_this.$utils.commonSaveModel("请插入社保卡！")
						// alert("请插入社保卡！");
						return;
					}
					let s = JSON.parse(e.data).pOutInfo;
					let arr = s.split("|");
					let aac002 = arr[1];
					_this.formInfo.aac002 = aac002;
					_this.formInfo.aac003 = arr[4];
					_this.closeSocial();
				}
			},
			//注册
			register() {
				this.disRegist = true
				this.$refs.form.validate().then(ret => {
					ret.method = "ytjRegister";
					ret.yae100 = "14";
					ret.aac003 = this.formInfo.aac003;
					ret.aac002 = this.formInfo.aac002;
					ret.aac006 = this.formInfo.aac002.substring(6, 10) + '-' + this.formInfo.aac002.substring(10, 12) + '-' + this.formInfo.aac002.substring(12, 14)
					ret.acb501 = this.formInfo.acb501;
					ret.checkCode = this.formInfo.code;
					ret.user_name = this.formInfo.aac002;
					ret.user_pwd = this.formInfo.password;
					this.errorStatus = false;
					this.$utils.request(ret, res => {
						if (res.code === "-1") {
							this.$utils.showToast("用户信息注册失败,原因:" + res.message)
							return
						} else {
							this.getPerInfo();	
						}
					});
				}).catch(err => {
					this.errorStatus = true;
					this.errorMsg = err[0].errorMessage;
					//console.log('表单错误信息：', err);
				})
			},
			
			//查询个人基本信息 -- 新增和查询在同一个service 在同一个事物，新增未提交 查询不到
			getPerInfo(){
				let param = {};
				let _this = this;
				param.method = "getPerInfoByAac002";
				param.aac002 = this.formInfo.aac002;
				this.$utils.request(param, res => {
					if (res.code === "-1") {
						this.$utils.showToast("注册失败")
						return
					} else {
						let userInfo = res.data.ac01;
						// userInfo.age = this.$check.age(userInfo.aac006)
						if (!userInfo.aae008) {
							userInfo.aae008 = "";
						}
						if (userInfo) {
							
							try {
								uni.setStorage({
									key: 'userInfo',
									data: userInfo,
									success: function() {
										_this.$utils.showToast("注册成功！即将为您自动登录......");
										setTimeout(() => {
											uni.redirectTo({
												url: '/pages/index/index'
											});
										}, 3000)
									}
								});
							} catch (e) {
								this.$utils.showToast("注册失败")
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/ .uni-forms-item__label {
		height: 65px;
		line-height: 65px;

		.label-text {
			font-size: 24px;
			color: #666666;
		}
	}

	/deep/ .uni-input-input,
	/deep/ .is-input-border {
		font-size: 26px;
		height: 65px;
		line-height: 65px;
		color: #333333;
		background: #ffffff;
		padding: 0 10px;
		box-sizing: border-box;
	}

	/deep/ .uni-easyinput__content-input {
		height: 58px;
		line-height: 58px;
	}

	/deep/ .uni-easyinput__content .is-input-border {
		border: solid 2px #bed4e9;
		box-sizing: border-box;
	}

	/deep/ .uni-forms-item__inner {
		padding-bottom: 36px;
	}

	/deep/ .uni-error-message {
		bottom: 8px;

		.uni-error-message-text {
			font-size: 16px;
		}
	}

	.regist-wrap {
		padding: 70px 92px 50px;

		.regist-title {
			font-size: 26px;
			line-height: 36px;
			color: #333333;
			position: relative;
			padding-left: 20px;
			margin-bottom: 50px;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 8px;
				height: 8px;
				background: #999999;
				border-radius: 50%;
			}
		}

		.regist-con {
			padding: 0 60px;

			.regist-form {
				.form-group {
					.form-item {
						padding-left: 0px;
						position: relative;

						.input-box {
							width: 480px;
							height: 65px;
							line-height: 65px;
							border: solid 2px #bed4e9;
							box-sizing: border-box;
						}

						.form-read {
							padding-left: 10px;
							position: absolute;
							right: 0;
							top: 15px;

							.btn-blue {
								padding: 0;
								width: 100px;
								height: 40px;
								line-height: 40px;
								font-size: 18px;
								color: #FFFFFF;
							}
						}

						.code {
							.input-box {
								padding-right: 120px;
								box-sizing: border-box;
							}

							.code-btn {
								position: absolute;
								top: 0;
								right: 150px;
								font-size: 22px;
								color: #0578ee;
								background: none;
								padding: 0;
								line-height: 65px;

								&:after {
									border: none;
								}

								&[disabled] {
									color: #333333;
									opacity: 0.4;
								}
							}
						}

						.form-tip {
							position: absolute;
							left: 170px;
							bottom: 12px;

							span {
								display: inline-block;
								vertical-align: middle;
								font-size: 20px;
								color: #f7170b;
								padding-left: 12px;
							}
						}

					}
				}

				.form-group-btn {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					width: 55%;
					padding: 16px 0px 40px;

					.btn-blue {
						width: 170px;
						height: 60px;
						line-height: 60px;
						font-size: 24px;
						margin: 0;
					}

					.form-tip {
						padding-left: 30px;

						span {
							display: inline-block;
							vertical-align: middle;
							font-size: 20px;
							color: #f7170b;
							padding-left: 12px;
						}
					}
				}
				
				.form-group-btn1 {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					width: 45%;
					padding: 16px 0px 40px;
				
					.btn-blue {
						width: 170px;
						height: 60px;
						line-height: 60px;
						font-size: 24px;
						margin: 0;
					}
				
					.form-tip {
						padding-left: 30px;
				
						span {
							display: inline-block;
							vertical-align: middle;
							font-size: 20px;
							color: #f7170b;
							padding-left: 12px;
						}
					}
				}
			}

			.regist-tip {
				height: 146px;
				background-color: #fffcfc;
				border: solid 1px #ffe1e0;
				padding: 28px 42px;
				box-sizing: border-box;

				.tip-title {
					padding-bottom: 24px;
				}

				.tip-decr {
					font-size: 16px;
					line-height: 28px;
					color: #666666;

					.text-blue {
						color: #0578ee;
					}

					.text-org {
						color: #f17471;
						padding-left: 8px;
						font-style: italic;
					}
				}
			}
		}
	}
</style>
