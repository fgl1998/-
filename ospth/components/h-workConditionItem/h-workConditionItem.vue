<template>
	<view class="class_block">
		<scroll-view scroll-x="true">
			<view class="tab_wrap_condition">
				<view v-for="(item, index) in classData" :key="index" class="scroll_item"
					@click="clickConditionItem(item)">
					<!-- <button :class="item.active?'item_text_active':'item_text'">{{ item.sdimItemName }}</button> -->
					<view :class="item.active?'item_text_active':'item_text'">{{ item.sdimItemName }}</view>
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
			clickConditionItem(item) {
				this.$emit('clickConditionItem', item)
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
		height: 92rpx;
		margin-bottom: 12rpx;

		.tab_wrap_condition {
			display: flex;
			margin: 0 20rpx;
			align-items: center;
			height: 92rpx;

			.scroll_item {
				display: flex;
				align-items: center;
				height: 100%;
				width: 25%;
				
				.item_text {
					height: 60%;
					width: 152rpx;
					text-align: center;
					line-height: 60rpx;
					// margin-right: 10rpx;
					background-color: #f3f5f7;
					border-radius: 8rpx;
					color: #666666;
					font-family: PingFangSC-Regular;
					font-size: 26rpx;
				}

				.item_text_active {
					height: 60%;
					width: 152rpx;
					line-height: 60rpx;
					text-align: center;
					border-radius: 8rpx;
					font-family: PingFangSC-Medium;
					font-size: 26rpx;
					color: #1b7af7;
					background-color: #e8f1fe;
				}
			}
		}
	}
</style>
