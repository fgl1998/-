<template>
	<view class="class_block">
		<scroll-view scroll-x="true">
			<view class="tab_wrap">
				<view v-for="(item, index) in classData" :key="index" class="scroll_item" @click="clickClassItem(item)">
					<view class="item_text" :class="{ 'active': item.active }">{{ item.sdimItemName }}</view>
					<!-- <view class="divide" v-show="classData.length !== index + 1"></view> -->
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: {
			classData: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			clickClassItem(item) {
				this.$emit('clickClassItem', item)
			}
		}
	}
</script>

<style lang="scss">
	.class_block {
		/deep/.uni-scroll-view ::-webkit-scrollbar {
			/* 隐藏滚动条，但依旧具备可以滚动的功能 */
			display: none;
			width: 0;
			height: 0;
			color: transparent;
			background: transparent;
		}

		/deep/::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			color: transparent;
			background: transparent;
		}

	}
</style>

<style lang="scss">
	.class_block {
		background-color: #FFFFFF;
		width: 100%;
		height: 88rpx;
		// margin-bottom: 10rpx;

		.tab_wrap {
			display: flex;
			padding-left: 24rpx;
			align-items: center;
			height: 76rpx;
			border-bottom: 2rpx solid #f1f1f1;

			.scroll_item {
				display: flex;
				align-items: center;
				height: 100%;

				.item_text {
					height: 100%;
					line-height: 88rpx;
					white-space: nowrap;
					// box-sizing: border-box;
					padding: 0 24rpx;
					font-family: PingFangSC-Regular;
					font-size: 30rpx;
					color: #666666;
				}

				.active {
					font-weight: bold;
					// height: 100%;
					font-size: 30rpx;
					line-height: 88rpx;
					color: #1b7af7;
					// box-sizing: border-box;
					// border-bottom: 4rpx solid #1d87ff;
					position: relative;
				}
				
				.active::after {
				  content: '';
				  width: 60%;
				  height: 1px;
				  display: block;
				  margin: 0 auto;
				  border-bottom: 2px solid #1d87ff;
				  position: absolute;
				  // left: 34rpx;
				  bottom:0rpx;
				  transform: translateX(10%);
				}

				.divide {
					width: 2rpx;
					height: 48rpx;
					background-color: #e7f1ff;
					// margin: 0 24rpx;
				}
			}


		}
	}
</style>
