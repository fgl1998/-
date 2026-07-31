<template>
	<view>
		<view class="container-modal">
				<!-- 普通弹窗 -->
				<uni-popup ref="popup">
				<!-- ... -->
					<div class="modal-part">
						<div class="part-top"><span @click="close"></span></div>
						<div class="part-bottom">
							<div class="part-bottom-text">还没有登录哦</div>
							<div class="part-bottom-text-tip">请您点击下方按钮去登录</div>
							<div class="part-bottom-btn" @click="loginPage">立即登录</div>
						</div>
					</div>
				
				</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		name:"common-modal",
		data() {
			return {
				
			};
		},
		methods:{
			open() {
				this.$refs.popup.open();
			},
			loginPage() { //跳转登录页
				this.$utils.navigateToLogin();
			},
			close() {
				this.$refs.popup.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
.container-modal{
	
	.modal-part{
		width: 720px;
		height: 580px;
		overflow: hidden;
		border-radius: 20px;
		.part-top{
			width: 100%;
			height: 270px;
			background: url('./../../static/images/index/tipPic.png') center no-repeat;
			position: relative;
			span{
				position: absolute;
				right: 20px;
				top: 20px;
				width: 34px;
				height: 34px;
				cursor: pointer;
				background: url('./../../static/images/index/icon-close.png') center no-repeat;
			}
		}
		.part-bottom{
			width: 100%;
			height: 310px;
			background-color: #fff;
			.part-bottom-text{
				width: 204px;
				height: 48px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				font-size: 34px;
				color: rgba(0,0,0,0.9);
				line-height: 48px;
				text-align: center;
				font-style: normal;
				text-transform: none;
				margin: 0 auto;
			}
			.part-bottom-text{
				width: 300px;
				height: 60px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				font-size: 34px;
				color: rgba(0,0,0,0.9);
				line-height: 60px;
				text-align: center;
				font-style: normal;
				margin: 0 auto;
			}
			.part-bottom-text-tip{
				width: 300px;
				height: 35px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 24px;
				color: rgba(0,0,0,0.5);
				line-height: 35px;
				text-align: center;
				font-style: normal;
				margin: 0 auto;
			}
			.part-bottom-btn{
				width: 260px;
				height: 95px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 500;
				font-size: 30px;
				color: #FFFFFF;
				line-height: 75px;
				text-shadow: 0px 2px 1px rgba(0,70,198,0.45);
				text-align: center;
				font-style: normal;
				text-transform: none;
				margin: 50px auto;
				background: url('./../../static/images/index/Rectangle-btn.png') center no-repeat;
				cursor: pointer;
			}
		}
	}
}
	
</style>