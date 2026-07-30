<template>
	<view>
		<u-modal v-model="show" :show-title="false" :show-confirm-button="false" :show-cancel-button="false"
			mask-close-able>
			<view class="title">
				服务事项类型
			</view>
			<view class="service_type">
				<u-button type="primary" @click="toService(1)">个人办理</u-button>
				<u-button type="primary" @click="toService(2)">单位代办</u-button>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: "h-serviceModal",
		data() {
			return {
				handleItemCode: '',
				show: false,
				user: ''
			};
		},
		mounted() {
			this.user = this.$base.getUser(true, true)
		},
		methods: {
			handle(handleItemCode) {
				if (!handleItemCode) {
					uni.showToast({
						title: '服务事项不存在',
						icon: 'none'
					})
					return
				}
				this.handleItemCode = handleItemCode
				let param = {
					handleItemCode: this.handleItemCode
				}
				this.$base.post('/custom/service/querySerAllChan.do', param, data => {
					let channelIds = data.resultData.data.channelIds
					if (channelIds) {
						//存在个人服务
						let per = channelIds.indexOf(this.$base.CHANNEL_ID_UT01) != -1
						//存在法人服务
						let legal = channelIds.indexOf(this.$base.CHANNEL_ID_UT02) != -1
						//同时存在
						if (per && legal) {
							//用户未绑定单位代办，则直接跳转个人服务
							if(!this.user.accountBo.parentAccounts){
								param.channelId = this.$base.CHANNEL_ID_UT01
								this.$base.checkServiceAuth(param)
							}else{
								this.show = true
							}
						}
						//只存在个人服务
						else if (per) {
							param.channelId = this.$base.CHANNEL_ID_UT01
							this.$base.checkServiceAuth(param)
						}
						//只存在法人服务
						else if (legal) {
							if (!this.user.accountBo.parentAccounts) {
								uni.showToast({
									title: '个人用户无法进行单位代办',
									icon: 'none',
									duration: 4000
								})
								return
							}
							param.channelId = this.$base.CHANNEL_ID_UT02
							this.$base.checkServiceAuth(param)
						}
						//都不存在
						else {
							uni.showToast({
								title: '该服务事项不支持移动端办理',
								icon: 'none'
							})
							return
						}
					} else {
						uni.showToast({
							title: '该事项暂不支持网上申报',
							icon: 'none'
						})
						return
					}
				}, data => {
					uni.showToast({
						title: data.message,
						icon: 'none'
					})
				})
			},
			//选择事项类型
			toService(type) {
				this.show = false
				let param = {
					handleItemCode: this.handleItemCode
				}
				//个人办理
				if (type == 1) {
					param.channelId = this.$base.CHANNEL_ID_UT01
				}
				//单位代办
				if (type == 2) {
					if (!this.user.accountBo.parentAccounts) {
						uni.showToast({
							title: '个人用户无法进行单位代办',
							icon: 'none',
							duration: 4000
						})
						return
					}
					param.channelId = this.$base.CHANNEL_ID_UT02
				}
				this.$base.checkServiceAuth(param)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		height: 76rpx;
		line-height: 76rpx;
		background-color: #0879f1;
		color: #FFFFFF;
		text-align: center;
	}
	
	.service_type{
		display: flex;
		justify-content: space-between;
		//#ifdef MP-WEIXIN
		padding: 60rpx 60rpx 60rpx 60rpx;
		//#endif
		//#ifdef H5
		padding: 60rpx 30rpx 60rpx 30rpx;
		//#endif
	}
</style>
