<template>
	<!-- 业务申请公共头部 -->
	<view class="regis-top">
		<view class="main">
			<view class="main-head" :class="{'main-head2': !showSteps}">
				<!--头部操作按钮-->
				<!-- <view class="opera-btn">
					<view class="btn-fl">业务申请</view>
					<view class="btn-fr" @click="toInfoCenter">历史记录</view>
				</view> -->
				<!--步骤条-->
				<view class="vt-step" v-if="showSteps">
					<view class="step-top">
						<view v-for="(item, index) in steps" :class="{'step-li': true, 'step-li-op': current != index+1, 'step-li-width': true}">
							<view class="step-circle">
								<text>{{ index+1 }}</text>
							</view>
							<view class="step-text">{{ item }}</view>
							<view v-if="index != steps.length-1" class="step-line"></view>
						</view>
						<!-- <view :class="{'step-li': true,'step-li-op': current != 1, 'step-li-width': isTwoStep}">
							<view class="step-circle">
								<text v-if="false">1</text>
								<text>1</text>
							</view>
							<view class="step-text">信息确认</view>
							<view class="step-line"></view>
						</view>
						<view :class="{'step-li': true,'step-li-op': current != 2, 'step-li-width': isTwoStep}">
							<view class="step-circle">
								<text>2</text>
							</view>
							<view class="step-text">信息填写</view>
							<view v-if="!isTwoStep" class="step-line"></view>
						</view>
						<view :class="{'step-li': true,'step-li-op': current != 3, 'step-li-width': isTwoStep}">
							<view class="step-circle">
								<text>3</text>
							</view>
							<view class="step-text">资料上传</view>
							<view v-if="!isTwoStep" class="step-line"></view>
						</view>
						<view v-if="!isTwoStep" :class="{'step-li': true,'step-li-op': current != 4}">
							<view class="step-circle">
								<text>4</text>
							</view>
							<view class="step-text">申报完成</view>
						</view> -->
					</view>
				</view>
				<!--top card-->
				<view class="top-card">
					<view class="card-lt">
						<image v-if="baseImg" :src="baseImg + '/static/images/headImg.png'" mode=""></image>
						<!-- <img v-if="baseImg" :src="baseImg + '/static/images/headImg.png'" alt=""> -->
					</view>
					<view class="card-rt">
						<view class="rt-p1">
							{{userInfo.aac003 ? userInfo.aac003 : '---'}}
						</view>
						<view class="rt-p2">
							{{resetUserId ? resetUserId : '---'}}
						</view>
						<view class="rt-p3">
							地址：{{userInfo.aac010 ? userInfo.aac010 : '---'}}
						</view>
					</view>
					<!-- <view class="r-btn" @click="toEditinfo">
						去编辑&nbsp;>
					</view> -->
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
				baseImg: this.$base.IMAGE_SRC
			};
		},
		watch: {
			//
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
		height: 334rpx;
		padding: 24rpx 38rpx;
		background-color: #2e82f1;
	}
	
	.main-head2 {
		height: 210rpx;
		padding: 24rpx 38rpx;
		background-color: #2e82f1;
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
		font-size: 28rpx;
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
	}

	.step-li {
		width: 30%;
		text-align: center;
		color: white;
		position: relative;
	}

	.step-li-width {
		width: 45%;
	}

	.step-line {
		width: 70%;
		height: 3rpx;
		background: white;
		position: absolute;
		top: 43rpx;
		left: 66%;
	}

	.step-circle {
		width: 38rpx;
		height: 38rpx;
		display: inline-block;
		border-radius: 50%;
		background: white;
		line-height: 38rpx;
		text-align: center;
		font-size: 26rpx;
		color: #2e82f1;
		margin: 24rpx 0;
	}

	.step-li-op {
		opacity: 0.5;
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
