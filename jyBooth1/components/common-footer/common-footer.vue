<template>
	<div class="footer">
		<div class="footer-lt">
			<div class="un-login" v-if="!isLogin && isRegist">
				<button class="fbtn btn-register" @click="toPage(0)">立即注册</button>
			</div>
			<div class="un-login" v-if="!isLogin && !isRegist">
				<button class="fbtn btn-register" @click="toPage(1)">立即登录</button>
			</div>
			<div class="is-login" v-if="isLogin">
				<button class="fbtn btn-out" @click="loginOut">退出登陆</button>
				<div class="islogin-text">
					<div class="login-name">{{userName ? userName : ""}}，您好！</div>
					<!-- <div class="login-timer"><span>{{timer}}s</span>后不操作将退出系统</div> -->
				</div>
			</div>
		</div>
		<div class="footer-rt">
			<button class="fbtn btn-home" @click="toPage(2)"><i class="ic ic-home"></i><span>首页</span></button>
			<button class="fbtn btn-back" @click="toPage(3)"><i class="ic ic-back"></i><span>返回</span></button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "common-footer",
		mounted() {
			// this.countDown();
		},
		props: {
			isLogin: {
				type: Boolean,
				default: true
			},
			isRegist: {
				type: Boolean,
				default: false
			},
			userName: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				timer: 90
			}
		},
		methods: {
			toPage(index) {
				switch (index) {
					case 0:
						this.$utils.redirectTo('/pages/register/register')
						break;
					case 1:
						this.$utils.redirectTo('/pages/login/login')
						break;
					case 2:
						this.$utils.redirectTo('/pages/index/index')
						break;
					default:
						this.$utils.navigateBack(1)
						break;
				}
			},
			countDown() {
				if (this.isLogin) {
					clearInterval(uni.getStorageSync("timerTask"));
					this.timer = 90;
					let timerTask = setInterval(() => {
						if (this.timer <= 0) {
							clearInterval(uni.getStorageSync("timerTask"));
							uni.setStorageSync("userInfo", "");
							this.$emit("login", false);
							//console.log("倒计时退出");
						} else {
							this.timer--;
						}
					}, 1000)
					uni.setStorageSync("timerTask", timerTask);
				} else {

				}
			},
			//退出登录
			loginOut() {
				this.$utils.showModal("提示信息", "是否退出登录", true, () => {
					uni.setStorageSync("userInfo", "");
					uni.setStorageSync("resumeInfo", "");
					this.$emit("login", false);
					this.$utils.showToast("已退出")
					setTimeout(()=>{
						this.$utils.navigateTo("/pages/index/index");
					},1000)
					clearInterval(uni.getStorageSync("timerTask"));
				}, () => {
					this.$utils.showToast("已取消")
				});
			}
		}
	}
</script>

<style lang="less">
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 70px;
		height: 138px;

		.footer-lt {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.un-login {
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}

			.is-login {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.islogin-text {
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.login-name {
						font-family: MicrosoftYaHei;
						font-size: 28px;
						line-height: 58px;
						color: #333333;
						padding-right: 34px;
					}

					.login-timer {
						font-size: 22px;
						color: #999999;

						span {
							color: #ff1500;
							padding-right: 10px;
						}
					}
				}
			}
		}

		.footer-rt {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
</style>
