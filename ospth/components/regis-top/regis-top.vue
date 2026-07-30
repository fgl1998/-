<template>
	<!-- 业务申请公共头部 -->
	<view class="regis-top">
		<view class="main">
			<view class="main-head" :class="{'main-head2': !showSteps}">
				<!--步骤条-->
				<view class="vt-step" v-if="showSteps">
					<view class="step-top">
						<view v-for="(item, index) in steps"
							:class="{'step-li': true, 'step-li-op': current != index+1, 'step-li-width': true}">
							<view class="step-circle">
								<view class="inner-circle">{{index+1}}</view>
							</view>
							<view class="step-text">{{ item }}</view>
							<view v-if="index != steps.length-1" class="step-line"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "regis-top",
		props: {
			current: {
				type: Number,
				required: true,
				default: 1
			},
			userInfo: {
				type: Object,
				required: true,
				default: () => {
					return {}
				}
			},
			isTwoStep: {
				type: Boolean,
				default: false
			},
			showSteps: {
				type: Boolean,
				default: true
			},
			steps: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				baseImg: this.$base.IMAGE_SRC,
				stepList: [1],
			};
		},
		watch: {
			current: {
				deep: true,
				handler(newVal, oldVal) {
					if (newVal !== 1 && newVal > oldVal) this.stepList.push(newVal);
					if (oldVal !== 1 && newVal < oldVal) {
						if (this.stepList.some(item => {
								return item == oldVal
							})) {
							let idx = this.stepList.indexOf(oldVal);
							this.stepList.splice(idx, 1);
						}
					}
				}
			}
		},
		computed: {
			resetUserId: function() {
				if (this.userInfo.aac002) {
					return this.userInfo.aac002.substr(0, 3) + ' **** **** **** ' + this.userInfo.aac002.substr(15)
				} else {
					return '----'
				}
			}
		},
		mounted() {

		},
		methods: {
			toInfoCenter() { // 跳转到消息中心 即受理状态
				this.$utils.navigateTo('/pages/personalCenter/acceptState/index')
			},
			// 编辑个人信息
			toEditinfo() {
				if (this.userInfo.aac001) {
					const url = '/pages/personalCenter/editInfo/index?aac001=' + this.userInfo.aac001 + '&aac002=' + this
						.userInfo.aac002;
					this.$utils.navigateTo(url);
				} else {
					this.$utils.showToast('不存在个人信息!')
				}
			},
		},
		onLoad(options) {

		}
	};
</script>
<style lang="scss" scoped>
	.main-head {
		box-sizing: border-box;
		// height: 240rpx;
		padding: 24rpx 38rpx;
		// background-color: #1492FF;
		background-color: #fff;
		
	}

	.main-head2 {
		height: 0px;
		padding: 0;
		// background-color: #1492FF;
		background-color: #fff;
	}

	.opera-btn {
		overflow: hidden;
		font-family: PingFang SC;
		font-size: 32rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 45rpx;
		letter-spacing: 0px;
		color: #ffffff;
	}

	.step-text {
		height: 36rpx;
		font-size: 26rpx;
		color: #000000;
		line-height: 26rpx;

	}

	.btn-fl {
		float: left;
	}

	.btn-fr {
		float: right;
		font-size: 28rpx;
		line-height: 48rpx;
	}

	.step-top {
		display: flex;
		justify-content: space-around;
		margin-top: 40rpx;
	}

	.step-li {
		width: 30%;
		text-align: center;
		color: white;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.step-li-width {
		width: 45%;
	}

	.step-line {
		width: 65%;
		height: 4rpx;
		background: white;
		position: absolute;
		top: 20rpx;
		left: 68%;

		background-image: linear-gradient(to right, #F5F5F5 35%, rgba(255, 255, 255, 0) 0%);
		/* 35%设置虚线点x轴上的长度 */
		background-position: bottom;
		/* top配置上边框位置的虚线 */
		background-size: 15px 20px;
		/* 第一个参数设置虚线点的间距；第二个参数设置虚线点y轴上的长度 */
		background-repeat: repeat-x;

	}

	.step-circle {
		width: 36rpx;
		height: 36rpx;
		background: #1492FF;
		border-radius: 50%;

		font-size: 24rpx;
		color: #FFFFFF;
		line-height: 36rpx;
		margin-bottom: 20rpx;
		text-align: center;

		// .inner-circle {
		// 	position: relative;
		// 	top: 50%;
		// 	margin-left: calc(50% - 5px);
		// 	transform: translateY(-50%);
		// 	width: 20rpx;
		// 	height: 20rpx;
		// 	background-color: #ffffff;
		// 	border-radius: 50%;
		// }
	}

	.step-li-op {

		// opacity: 0.5;
		.step-circle {
			background: #CCCCCC;
		}

		.step-text {
			color: #999999;
		}
	}

	.top-card {
		height: 180rpx;
		border-radius: 24rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(153, 153, 153, 0.3);
		/*margin-top: 28rpx;*/
		padding: 28rpx;
		position: relative;
		top: 24rpx;
		z-index: 9;
		display: flex;
	}

	.top-card>view {
		height: 100%;
	}

	.card-lt {
		width: 100rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
	}

	.card-rt {
		// width: calc(100% - 100rpx);
		padding-left: 25rpx;
		font-family: PingFang SC;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0px;
	}

	.rt-p1 {
		font-size: 36rpx;
		line-height: 50rpx;
		color: #333333;
		position: relative;
	}

	.r-btn {
		width: 150rpx;
		height: 59rpx !important;
		background-color: rgba(46, 130, 241, 0.12);
		border: solid 2rpx rgba(46, 130, 241, 0.35);
		position: absolute;
		top: 32rpx;
		right: 0;
		font-family: PingFang SC;
		font-size: 28rpx;
		text-align: center;
		line-height: 55rpx;
		color: #2e82f1;
		border-bottom-left-radius: 30rpx;
		border-top-left-radius: 30rpx;
	}

	.rt-p2 {
		font-size: 32rpx;
		line-height: 45rpx;
		color: #333333;
		margin: 14rpx 0;
	}

	.rt-p3 {
		max-width: 500rpx;
		font-size: 26rpx;
		line-height: 37rpx;
		color: #666666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.main-content {
		/*height: 900rpx;*/
		padding: 6rpx;
		padding-top: 120rpx;
		background: white;
	}

	.common-p {
		font-family: PingFang SC;
		font-size: 30rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 84rpx;
		letter-spacing: 0px;
		padding-left: 30rpx;
		color: #999999;
	}

	.addBorder {
		position: relative;
	}

	.addBorder:after {
		content: "";
		position: absolute;
		left: 30rpx;
		bottom: 0rpx;
		width: calc(100% - 30rpx);
		height: 0rpx;
		border-bottom: 2rpx solid #e5e5e5;
		box-sizing: border-box;
	}

	.addBorder .picker {
		height: 92rpx;
		line-height: 92rpx;
		color: #36404a;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-size: 28rpx;
	}

	/deep/.main-content3 .mini-cell-wrapper {
		margin-bottom: 0 !important;
		border-top: none !important;
	}

	/deep/.cell-li .right {
		color: #2e82f1 !important;
	}

	.bottom-box {
		margin-top: 48rpx;
		height: 100rpx;
		display: flex;
		justify-content: space-around;
	}

	.bottomBtn {
		width: 40%;
	}
</style>