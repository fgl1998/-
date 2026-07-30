<template>
	<view style="height: 100%;">
		<h-navbar title="手机号认证" :border-bottom="false" :is-back="false" title-color="#fff" back-icon-color="#fff"
			:background="{ background: '#4092ff' }" zIndex='999'></h-navbar>
		<view class="query_body">
			<view class="query_main">
				<view class="form_block">
					<view class="title_wrap">
						<view class="title_style"></view>
						<view class="title_text">手机号认证</view>
					</view>
					<view style="margin-top: 30rpx;">
						<van-form>
							<van-field :required="true" :labelWidth="100" v-model="name" label="姓名：" placeholder="请输入姓名"/>
							<van-field :required="true" :labelWidth="100" v-model="certNo" label="证件号：" placeholder="请输入证件号"/>
							<van-field :required="true" :labelWidth="100" v-model="phone" label="手机号：" placeholder="请输入手机号"/>
							<van-field
							  v-model="sms"
							  center
							  :required="true"
							  :labelWidth="100"
							  clearable
							  label="短信验证码"
							  placeholder="请输入短信验证码"
							>
							  <template #button>
								<van-count-down :time="time" v-if="time!=''" format="ss 秒后重新获取	" @finish='finish'/>
							    <van-button size="small" @click="getCode()" v-if="time==''"
								 type="primary">{{checkNum}}</van-button>
							  </template>
							</van-field>
						</van-form>
					</view>
				</view>
				<view style="padding: 20rpx 50rpx;">
					<van-button style='width:100%' type="info" @click="checkPhone()">认证</van-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				showSelect: false,
				checkNum: "获取验证码",
				name: '',
				certNo: '',
				phone: '',
				handleItemCode: '',
				handleItemName: '',
				sms: "",
				time:'',
				projectNo: '',
				imageSrc: this.$base.IMAGE_SRC,
				osaHiAcceptVo: {}
			}
		},
		onLoad(option) {
			let param = option.param
			if(param) {
				param = JSON.parse(this.$base.sm4Decrypt(param))
				this.name = param.name
				this.certNo = param.certNo
				this.phone = param.phone
				this.handleItemName = param.handleItemName
				this.handleItemCode = param.handleItemCode
			}
			/* param = {}
			param.name = '曾庆堂'
			param.certNo = '500228199203063391'
			param.phone = '15213191458'
			param.handleItemCode = '1112000000012568X5312201400200101'
			param.handleItemName = '开具医疗住院资格确认书'
			console.log(encodeURIComponent(this.$base.sm4Encrypt(JSON.stringify(param)))) */
		},
		methods: {
			getCode(){
				if (this.phone == '') {
					Dialog.alert({
					  message: '手机号不能为空',
					}).then(() => {
					  // on close
					});
					return
				}
				if (this.checkNum != '重新获取' && this.checkNum != '获取验证码') {
					Dialog.alert({
					  message: '倒计时未结束',
					}).then(() => {
					  // on close
					});
					return
				}
				//倒计时是否结束
				this.time = 60*1000
			},
			finish(){
				this.time = ''
			},
			checkPhone() {
				if(!this.phone) {
					Dialog.alert({
						title: '提示',
						message: '请填写手机号！'
					})
					return
				}
				if(!this.sms) {
					Dialog.alert({
						title: '提示',
						message: '请填写验证码！'
					})
					return
				}
				// 登录
				let param = {
					voucher: 'zengqt',
					wordpass: '111111', 
					code: '',
					userType: "UT01", 
					loginType: "0",
					imgCodeId: '',
					openId: '',
					appletType: ''
				}
				this.$user.login(param, data => {
					let token = data.accessToken
					//获取用户信息并存在本地
					this.$user.getUser(data=>{
						Dialog.alert({
							message: '认证成功',
						}).then(() => {
							uni.navigateTo({
								url:'/pages/jumpPage/jumpPage?token='+encodeURIComponent(token)+'&areaCode=120000000000&channelCode=osp-02-006-app&handleItemCode='+this.handleItemCode+'&handleItemName=' + encodeURIComponent(this.handleItemName)
							})
						});
					},data=>{
						Dialog.alert({
							title: '提示',
							message: '认证失败！'
						})
					});
				},data=>{
					Dialog.alert({
						title: '提示',
						message: '认证失败！'
					})
				})
			},
			pageTo(idx){
				if(idx == 1) { //证明验真
					uni.navigateTo({
						url:'/pages/servicePage/showPdf?projectNo='+this.projectNo+"&type=1"
					})
				} else if(idx == 2) { //材料补正
					uni.navigateTo({
						url:'/pages/servicePage/materialUpload?projectNo='+this.projectNo+"&taskBasicCode="+this.osaHiAcceptVo.taskBasicCode+"&type=1&state="+this.osaHiAcceptVo.state_+"&flowId="+this.osaHiAcceptVo.flowId
					})
				} else if(idx == 3) { //进度查询
					uni.navigateTo({
						url:'/pages/servicePage/officeStep?projectNo='+this.projectNo
					})
				} else if(idx == 4) { //结果物打印
					uni.navigateTo({
						url:'/pages/servicePage/showPdf?projectNo='+this.projectNo+"&type=2"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	height: 100%;
}
.query_body {
	height: calc(100% - 83rpx);
	background-color: #f6f7f8;
	padding: 24rpx;
	box-sizing: border-box;
	position: relative;

	.query_main {
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 8rpx;
		box-sizing: border-box;

		.form_block {
			padding: 24rpx 30rpx 40rpx 30rpx;

			.title_wrap {
				display: flex;
				align-items: center;

				.title_style {
					width: 6rpx;
					height: 32rpx;
					border-radius: 6rpx;
					background-color: #4092ff;
					margin-right: 16rpx;
				}

				.title_text {
					font-size: 34rpx;
					color: rgba(0, 0, 0, 0.85);
				}
			}

			.qrcode_wrap {
				width: 100%;
				position: relative;

				.qrcode_input {
					width: 75%;
				}

				.qrcode_image {
					z-index: 999;
					width: 25%;
					height: 30px;
					position: absolute;
					top: 16rpx;
					right: 0;
				}
			}
		}

		.btn_wrap {
			box-sizing: border-box;
			padding: 0 60rpx;
			width: 100%;
			position: absolute;
			bottom: 50rpx;
			left: 0;
		}
	}
}
.page_body {
	padding: 24rpx;
	box-sizing: border-box;
	width: 100%;

	.type_item {
		width: 100%;
		height: 200rpx;

		margin-bottom: 28rpx;
		position: relative;

		image {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-size: contain;
		}

		.type_text {
			position: absolute;
			top: 80rpx;
			left: 100rpx;
			color: #FFFFFF;
			font-size: 36rpx;
		}
	} 
}
.serviceList{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 10%;
	.btn{
		margin-bottom: 24rpx;
		.innerBtn{
			box-sizing: border-box;
			width: 280rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			border: 2rpx solid #ddd;
			border-radius: 8rpx;
		}
	}
}
</style>
