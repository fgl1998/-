<template>
	<view>
		<view :style="{position: 'absolute',top: top+'rpx',right: right+'rpx'}">
			<view class="tag"><!-- 若名字中带 “·” 可点击 -->{{msg}}
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			top: {
				type: [String],
				default: '',
			},
			right: {
				type: [String],
				default: '',
			},
			msg:{
				type:[String],
				default:'',
			},
		},
		data() {
			return {
				currentItem: 0,
			}
		},
		components: {},
		onLoad() {},
		created() {},
		computed: {

		},
		methods: {},
	}
</script>
<style lang="scss" scoped>
.tag{
		font-size: 20rpx;
		line-height: 40rpx;
		text-align: center;
	    width:228rpx;
	    height:40rpx;
	    border:2rpx solid #fac831;
	    position:relative;
	    background-color:#f8cc4a2e;
		border-radius: 10rpx;
		    color: #ffc107;
	}
	.tag:before,.tag:after{
	    content:"";display:block;
	    border-width:50rpx;
		border-top-width: 20rpx;
		border-right-width:10rpx;
		border-left-width:10rpx;
	    position:absolute; bottom:-68rpx;
	    left:148rpx;
	    border-style:solid dashed dashed;
	    border-color:#ffc107 transparent transparent;
		border-top-color:#ffc107;
	    font-size:0;
	    line-height:0;
	}
	.tag:after{
	    bottom:-66rpx;
	    border-color:#FFF transparent transparent;
	}
</style>
