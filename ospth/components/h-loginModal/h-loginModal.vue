<template>
	<view>
		<van-dialog
			title="温馨提示"
			confirmButtonText='登录'
			show-cancel-button
			@confirm="toLogin()"
			@cancel="cancel()"
			v-model="loginShow" 
			:message="loginContent" 
		></van-dialog>
	</view>
</template>
<!-- 登录弹框组件,判断登录状态 -->
<script>
	export default {
		name:"h-loginModal",
		data() {
			return {
				loginContent:'您还未登录，请登录后操作',
				user: '',
				loginShow: false,
				other: false
			};
		},
		methods:{
			handle(callBack,cancel){
				this.user = uni.getStorageSync("user")
				if(!this.user){
					this.loginShow = true
					if(cancel){
						this.other = true
					}
				}else{
					this.loginShow = false
					if(callBack) {
						callBack()
					}
				}
			},
			//跳转登录页
			toLogin(){
				//#ifdef MP-WEIXIN
				uni.navigateTo({
					url:'/pages/my/user/loginPwd/loginPwd'
				})
				//#endif
				//#ifdef MP-ALIPAY
				uni.navigateTo({
					url:'/pages/my/user/loginPwd/loginPwd'
				})
				//#endif
				//#ifdef H5
				uni.navigateTo({
					url:'/pages/my/user/loginPwd/loginPwd'
				})
				//#endif
			},
			//取消操作
			cancel(){
				this.loginShow = false
				//其他额外操作
				if(this.other){
					this.$emit('cancel')
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
