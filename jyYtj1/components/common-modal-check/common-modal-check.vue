<template>
	<view class="container-modal">
		<!-- 普通弹窗 -->
		<uni-popup ref="popup">
		<!-- ... -->
			<div class="modal-part">
				<div class="part-top"><span @click="cancelBtn"></span></div>
				<div class="part-bottom">
					<div class="part-bottom-text">温馨提示</div>
					<div class="part-bottom-text-tip">{{tipInfo}}</div>
					<div class="part-bottom-btn-box">
						<div class="part-bottom-btn btn-cancel" @click="cancelBtn">取消</div>
						<div class="part-bottom-btn btn-verify" @click="verifyBtn">确定</div>
					</div>
					
				</div>
			</div>
		
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			tipInfo: {
				type: String,
				default: '请确认是否需要取消操作？'
			},
			typeCheck:{
				type: String,
				default: '1'
			}
			
		},
		methods: {
			
			open(){
				this.$refs.popup.open()
			},
			
			cancelBtn (){
				this.$refs.popup.close()
			},
			verifyBtn (){
					this.$emit("triggerClick",this.typeCheck);
					this.$refs.popup.close()
				
			},
		}
	}
</script>


<style lang="scss" scoped>
	.container-modal{
	
		.modal-part{
			width: 680px;
			height: 580px;
			overflow: hidden;
			border-radius: 20px;
			.part-top{
				width: 100%;
				height: 270px;
				background: url('./../../static/images/login/warn-tip.png') center no-repeat;
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
				.part-bottom-btn-box{
					width: 500px;
					display: flex;
					justify-content: space-between;
					margin: 0 auto;
					.part-bottom-btn{
						width: 260px;
						
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
						cursor: pointer;
					}
					.btn-cancel{
						height: 80px;
						color: rgba(0,0,0,0.9);
						line-height:75px;
						background: url('./../../static/images/login/rectangle-cancel.png') center no-repeat;
					}
					.btn-verify{
						height: 95px;
						background: url('./../../static/images/login/rectangle-home.png') center no-repeat;
					}
				}
				
			}
		}
	}
	

</style>
