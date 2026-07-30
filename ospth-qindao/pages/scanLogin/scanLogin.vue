<template>
	<view style="margin-top: 5px;margin-left: 5px;">{{ message }}</view>
</template>

<script>
	export default {
		data() {
			return {
				scanContent: {},
				message: ''
			}
		},
		onLoad(option){
			this.scanContent = option
			if(this.scanContent.type === 'app') {
				this.message = '请使用“数字政务移动APP体验版”扫码';
			} else if(this.scanContent.type === 'mini') {
				this.message = '请使用“数字政务微信小程序体验号”扫码';
			}
			uni.showModal({
				title: '提示',
				showCancel: false,
				content: this.message
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
