<template>
	<view class="">
		<div class="zhanwei"></div>
		<view class="service-header">
			<!-- <u-navbar back-text="返回" :title="title" @click="goBack"></u-navbar> -->
			<h-navbar  v-if="$base.isApp()" :title="title" :border-bottom="false" title-color="#000" back-icon-color="#000"
				:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
			<view class="header-item-container" v-if="headerList&&headerList.length">
				<view class="header-item"
					:class="{ 'header-item-active': headerIndex == index, 'header-item-actived': headerIndex > index }"
					v-for="(item, index) in headerList" :key="item.title">
					<view class="item-icon" :class="{ 'active': headerIndex == index, 'finish': headerIndex > index }"
						:id="item.icon"></view>
					<view class="item-title">{{ item.title }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			headerIndex: {
				type: Number,
				default: 0,
			},
			headerList: {
				type: Array,
				default: () => {
					return [];
				},
			},
			title: {
				type: String,
				default: '事项办理'
			}
		},
		data() {
			return {};
		},
		methods: {
			goBack() {
				uni.navigateBack()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.zhanwei {
		height: 160rpx;
	}

	.service-header {
		position: fixed;
		left: 0;
		top: 0%;
		padding: 0 32rpx 16rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #e4e7ed;
		width: 100%;
		z-index: 99999;

		box-sizing: border-box;

		.header-item-container {
			display: flex;
			justify-content: space-between;
			width: 100%;

			.header-item {
				text-align: center;
				font-size: 24rpx;

				#step1 {
					background: url(../../static/headerImage/step1-0.png) no-repeat;
					background-size: 100% 100%;
				}

				#step1.active {
					background: url(../../static/headerImage/step1-1.png) no-repeat;
					background-size: 100% 100%;
				}

				#step1.finish {
					background: url(../../static/headerImage/step1-2.png) no-repeat;
					background-size: 100% 100%;
				}

				#step2 {
					background: url(../../static/headerImage/step2-0.png) no-repeat;
					background-size: 100% 100%;
				}

				#step2.active {
					background: url(../../static/headerImage/step2-1.png) no-repeat;
					background-size: 100% 100%;
				}

				// 从这里开始，后续步骤的背景图有了之后需要更改名称
				#step2.finish {
					background: url(../../static/headerImage/step1-2.png) no-repeat;
					background-size: 100% 100%;
				}

				#step3 {
					background: url(../../static/headerImage/step2-0.png) no-repeat;
					background-size: 100% 100%;
				}

				#step3.active {
					background: url(../../static/headerImage/step1-1.png) no-repeat;
					background-size: 100% 100%;
				}

				#step3.finish {
					background: url(../../static/headerImage/step1-2.png) no-repeat;
					background-size: 100% 100%;
				}

				#step4 {
					background: url(../../static/headerImage/step3-0.png) no-repeat;
					background-size: 100% 100%;
				}

				#step4.active {
					background: url(../../static/headerImage/step1-1.png) no-repeat;
					background-size: 100% 100%;
				}

				#step4.finish {
					background: url(../../static/headerImage/step1-2.png) no-repeat;
					background-size: 100% 100%;
				}

				#step5 {
					background: url(../../static/headerImage/step4-0.png) no-repeat;
					background-size: 100% 100%;
				}

				#step5.active {
					background: url(../../static/headerImage/step1-1.png) no-repeat;
					background-size: 100% 100%;
				}

				#step5.finish {
					background: url(../../static/headerImage/step1-2.png) no-repeat;
					background-size: 100% 100%;
				}

				.item-icon {
					width: 96rpx;
					height: 96rpx;
					border-radius: 10rpx;
					margin-bottom: 8rpx;
					position: relative;

					&::after {
						content: "";
						width: 40rpx;
						height: 3rpx;
						background-color: #e1e1e1;
						position: absolute;
						right: -48rpx;
						top: 48rpx;
					}
				}

				&:last-child {
					.item-icon {
						&::after {
							background-color: transparent;
						}
					}
				}
			}

			.header-item-active {
				color: #fba82d;
			}

			.header-item-actived {
				color: #5983fe;
			}
		}
	}
</style>