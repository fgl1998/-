<template>
	<view class="botBtn_block">
		<u-toast ref="uToast" />
		<h-loginModal ref="loginModal"></h-loginModal>
		<h-serviceModal ref="serviceModal"></h-serviceModal>
		<view class="btn_Main">
			<view class="btn_left" v-for="(item,index) in setData" :key="index" @click="handleClick(item)">
				<view class="img">
					<view class="box_icon" :class="item.code"></view>
				</view>
				<text>{{item.btnName}}</text>
			</view>
			<!-- 收藏 -->
			<view class="btn_left">
				<view class="img">
					<view v-if="!isFav" class="box_icon love" @click="favorite()"></view>
					<view v-if="isFav" class="box_icon collect" @click="cancelFav()"></view>
				</view>
				<text>
					{{isFav?'已收藏':'收藏'}}
				</text>
			</view>
			<view v-if="workInfoBotBtn[3].able" class="btn_bg_true btn_right" @click="apply">申报</view>
			<view v-if="!workInfoBotBtn[3].able" class="btn_bg_false btn_right">申报</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			workInfoBotBtn: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				isTrue:false,
				setData: [{
						id: 1,
						btnName: '评价',
						code: 'comment'
					},
					// {
					// 	id: 2,
					// 	btnName: '咨询',
					// 	code: 'server'
					// }
				],
				user:'',
				isFav:false
			}
		},
		mounted() {
			let _this = this
			this.$nextTick(function(){
				_this.user = this.$base.getUser(true,true)
				_this.isFav = this.workInfoBotBtn[2].isFav
			})
		},
		methods: {
			handleClick(item) {
				if (item.id === 1) {
					this.$refs.loginModal.handle(data=>{
						this.hasComment(data=>{
							uni.navigateTo({
								url: '/pages/work/workContent/ContentItem/contentRight?param='+this.workInfoBotBtn[0].service
							})
						})
					})
				}
				if (item.id === 2) {
					this.$refs.loginModal.handle(data=>{
						if(uni.getStorageSync("user").runStatus == '2'){
							this.$refs.uToast.show({
								title: '切换的亲情账号不支持当前功能',
								type: 'default',
								icon: false,
								duration: 3000
							})
							return
						}
						let param = this.workInfoBotBtn[1].service
						uni.navigateTo({
							url: '/pages/work/workConsult/index?handleItemCode='+param.handleItemCode+'&handleItemName='+
							param.handleItemName+"&type="+ (param.industryType||'')
						})
					})
				}
			},
			//收藏
			favorite(){
				this.$refs.loginModal.handle(data=>{
				if(uni.getStorageSync("user").runStatus == '2'){
					this.$refs.uToast.show({
						title: '切换的亲情账号不支持当前功能',
						type: 'default',
						icon: false,
						duration: 3000
					})
					return
				}
				let param = {
					handleItemCode: this.workInfoBotBtn[2].handleItemCode,
					handleItemName: this.workInfoBotBtn[2].handleItemName,
					accessUrl: this.workInfoBotBtn[2].handleItemName.accessUrl
				}
				this.$base.post('/custom/favorite/addFavorite.do', param, data => {
					this.isFav = true
					this.workInfoBotBtn[2].favoriteId = data.resultData.data
					this.$refs.uToast.show({
						type: 'default',
						icon: false,
						title: '收藏成功'
					})
				}, data => {
					if (data.message.includes('已收藏')) {
						this.$refs.uToast.show({
							type: 'default',
							icon: false,
							title: '已收藏'
						})
					} else {
						this.$refs.uToast.show({
							type: 'default',
							icon: false,
							title: data.message
						})
					}
				});
				})
			},
			//取消收藏
			cancelFav(){
				if(uni.getStorageSync("user").runStatus == '2'){
					this.$refs.uToast.show({
						title: '切换的亲情账号不支持当前功能',
						type: 'default',
						icon: false,
						duration: 3000
					})
					return
				}
				let param = {
					favoriteId: this.workInfoBotBtn[2].favoriteId,
				}
				this.$base.post('/custom/favorite/deleteFavorite.do', param, data => {
					this.$refs.uToast.show({
						title: '取消成功！',
						type: 'default',
						icon: 'none'
					})
					this.isFav = false
				}, data => {
					this.$refs.uToast.show({
						title: '取消失败',
						type: 'default',
						icon: 'none'
					})
				})
			},
			//申报
			apply(){
				this.$refs.loginModal.handle(data=>{
					if(this.workInfoBotBtn[3].able){
						//存在channelId说明是事项清单跳转的
						if(this.workInfoBotBtn[3].channelId){
							this.$base.checkServiceAuth(this.workInfoBotBtn[3])
						}else{
							this.$refs.serviceModal.handle(this.workInfoBotBtn[3].handleItemCode)
						}
					}
				})
			},
			//是否评论
			hasComment(onSuccess){
				let param = {
					"apiCode": "HCP_11",
					"BZE014": "i4qu0c90",
					"userCardNo": this.user.naturalBo.certNo,
					"userProp":'1',
					//渠道 1pc 2移动端
					"EVALUATE_CHANNL": "",
					"SUBITEM_CODE":this.workInfoBotBtn[1].service.handleItemCode,
					"page_size": "1",
					"page_no": 1
				}
				this.$api.getOldData(param, data => {
					if(data.list.length!=0){
						uni.showToast({
							title:'已评价该事项',
							icon:'none',
							mask:true
						})
						return
					}
					onSuccess(data)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.botBtn_block {
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		z-index: 10;
		width: 100%;
		height: 100rpx;

		.btn_Main {
			display: flex;

			.btn_left {
				width: 50%;
				height: 100rpx;
				align-items: center;
				display: flex;
				flex-direction: column;
				margin-top: 10rpx;

				.img {
					.box_icon.comment {
						width: 40rpx;
						height: 40rpx;
						background: url(#{$image_src}/static/newImages/work/comment.png) no-repeat center;
						background-size: 100% 100%;
					}

					.box_icon.server {
						width: 40rpx;
						height: 40rpx;
						background: url(#{$image_src}/static/newImages/work/server.png) no-repeat center;
						background-size: 100% 100%;
					}

					.box_icon.love {
						width: 40rpx;
						height: 40rpx;
						background: url(#{$image_src}/static/newImages/work/Uncollected.png) no-repeat center;
						background-size: 100% 100%;
					}
					.box_icon.collect {
						width: 50rpx;
						height: 40rpx;
						background: url(#{$image_src}/static/newImages/work/collect.png) no-repeat center;
						background-size: 100% 100%;
					}

				}

				text {
					font-size: 26rpx;
					color: #333333;
					margin-top: 8rpx;
				}
			}
			
			button::after { border: none }
			
			.declare{
				width: 50%;
				height: 100rpx;
				background-color: #FFFFFF;
				color: #333333;
				padding-top: 20rpx;
				font-size: 24rpx;
				
				.declare_img{
					width: 28rpx;
					height: 22rpx;
					background: url(#{$image_src}/static/newImages/work/share.png) no-repeat center;
					background-size: 100% 100%;
					margin: 0 auto;
				}
			}

			.btn_right {
				width: 50%;
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
				font-size: 30rpx;
				text-align: center;
			}
			
			.btn_bg_true{
				background-color: rgb(64, 146, 255);
			}
			
			.btn_bg_false{
				background-color: #dfdfdf;
			}

		}

		.cancel {
			width: 100%;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			font-size: 36rpx;
			margin: 32rpx 0;
		}
	}
</style>
