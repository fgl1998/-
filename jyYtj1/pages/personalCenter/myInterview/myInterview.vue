<template>
	<div class="page">
		<common-header></common-header>
		
		<div class="page-wrap">
			<div class="wrap-center">
				<div class="wrap-box">
					<div class="wrap-con">
						<div class="wrap-title">
							<div class="wrap-title-top">
								<view class="uni-padding-wrap uni-common-mt">
												<uni-segmented-control :current="current" :values="items" :style-type="styleType"
													:active-color="activeColor" @clickItem="onClickItem" />
											</view>
							</div>
						</div>
						<view class="content">
							<view v-if="current === 0">
								<div class="wrap-ul">
									<template v-if='projectList.length>0'>
										<div class="wrap-list"v-for="(item,index) in projectList" :key="index" >
											<div class="wrap-list-top">
												<span class="span_1">[简讯信息]：</span>您收到来自<text style="color:#0C6AF7">{{item.aab004}}</text>的面试邀请
											</div>
										
											<div class="wrap-list-content">
												<div class="wrap-list-content-info">面试职位：{{item.acb213}}</div>
												<div class="wrap-list-content-info">HR信息：{{item.acb224}} <span v-if="item.acb224 && item.acb22c">|</span> {{item.acb22c}}</div>
												<div class="wrap-list-content-info">面试时间：{{item.acb222}}</div>
												<div class="wrap-list-content-info">面试邀请时间：{{item.aae043}}</div>
												<div class="wrap-list-content-address">面试地点：{{item.acb223}}</div>
												<div class="wrap-list-content-rate"> <span>综合评价：</span><uni-rate :readonly="true" v-model="item.acg01a"></uni-rate></div>
												<div class="wrap-list-content-address">评价内容：{{ item. acg012}}</div>
											</div>
											<div class="wrap-list-bottom">
												<span>距离面试邀请结束还剩：{{item.startenddays}}天</span>
												<!-- <span>请在规定的面试时间内，前往面试地点~</span> -->
												<!-- <button>查看详情</button> -->
											</div>
										</div>
									</template>
									<template v-else>
										<div class="nodata">
											<div class="nodata-pic">
												<image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img"/>
													<div class="nodata-text">暂时检索不到你要的数据哦~</div>
												
											</div>
										</div>
									</template>
								</div>
							</view>
							<view v-if="current === 1">
								<div class="wrap-ul">
									<template v-if='projectList.length>0'>
										<div class="wrap-list wrap-list_1"v-for="(item,index) in projectList" :key="index" >
											<div class="wrap-list-top">
												<span class="span_2">[简讯信息]：</span>您收到来自<text style="color:#0C6AF7">{{item.aab004}}</text>的面试邀请
											</div>
										
											<div class="wrap-list-content">
												<div class="wrap-list-content-left">
													<div class="wrap-list-content-info">面试职位：{{item.acb213}}</div>
													<div class="wrap-list-content-info">HR信息：{{item.acb224}} <span v-if="item.acb224 && item.acb22c">|</span> {{item.acb22c}}</div>
													<div class="wrap-list-content-info">面试时间：{{item.acb222}}</div>
													<div class="wrap-list-content-info">面试邀请时间：{{item.aae043}}</div>
													<div class="wrap-list-content-rate"> <span>综合评价：</span><uni-rate :readonly="true" v-model="item.acg01a"></uni-rate></div>
												<div class="wrap-list-content-address">评价内容：{{ item. acg012}}</div>
												</div>
												
												<!-- <div class="wrap-list-content-right">
													<button @click="online(item)">查看详情</button>
												</div> -->
											</div>
											
										</div>
									</template>
									<template v-else>
										<div class="nodata">
											<div class="nodata-pic">
												<image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img"/>
													<div class="nodata-text">暂时检索不到你要的数据哦~</div>
												
											</div>
										</div>
									</template>
								</div>
							</view>
						</view>
					
					</div>
					<div class="wrap-page" v-if='projectList.length>0'>
						<common-pager :totals="pageTotal" :currentPage="currentPage" :pageSize="pageSize"
							@currentChange="currentChange"></common-pager>
					</div>
				</div>
			</div>
		</div>
			
		<common-footer :userName="userInfo.aac003" :isLogin="isLogin" ></common-footer>
	</div>
</template>

<script>
	export default {
		onLoad: function(option) {
			this.userInfo = uni.getStorageSync("userInfo");
			if (this.userInfo) {
				this.isLogin = true;
			} else {
				this.isLogin = false;
				
			}
		this.init();
		},
		data() {
			return {
				userInfo: {},
				isLogin: false,
				projectList:[],
				currentPage: 1,
				pageSize: 4,
				pageTotal: 0,
				items: ['线下面试', '线上面试'],
				current: 0,
				activeColor: '#007aff',
				styleType: 'text'
			}
		},
		methods: {
			init() {
				this.currentPage = 1;
				this.handleGetData('0')
			},
			onClickItem(e) {
				this.projectList = []
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				}
				if(e.currentIndex == 1){
					this.pageSize = 6
					this.handleGetData('1')
				}else{
					this.pageSize = 4
					this.handleGetData('0')
				}
			},
			// 查询数据
			handleGetData(valueNum){
				let param = {
						acc315:valueNum,
						aac001:this.userInfo.customMap.aac001,
						pageNumber: this.currentPage,
						pageSize: this.pageSize,
						
				}
				this.$utils.request('/api/businessCommon/getData/jy202_hrm138', param, true,false,'cipher').then(res => {
					if(res.serviceSuccess){
						let pageBean = res.data.pageBean
						//console.log(res.data)
						if(pageBean.total>0){
							this.projectList = pageBean.list.map(item => {
								if(item.cg01_qy){
									let acg01a = JSON.parse(item.cg01_qy).acg01a
								  let acg012 = JSON.parse(item.cg01_qy).acg012
									return {...item, acg01a, acg012}
								}else{
									return {...item}
								}
							});
							this.pageTotal = pageBean.total;
						} else {
							this.projectList = [];
							
						}
					}else{
						this.$utils.showToast(res.errors[0].msg)
					}
				})
			},
			//分页返回页码
			currentChange(val) {
				//console.log("翻到第" + val + "页了");
				this.currentPage = val;
				this.handleGetData()
			},
			
			online(data){
				this.$utils.navigateTo('/pages/personalCenter/onlineInterview/onlineInterview?item=' + encodeURIComponent(JSON
							.stringify(data)))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap-con{
		padding: 0 60px !important;
	}
.wrap-title{
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	height: 110px !important;
	.wrap-title-top{
		display: flex;
		//justify-content: center;
		align-items: center;
		height: 100%;
		//margin: 0 auto;
		
	}
	
}
.wrap-ul{
	width: 100%;
	height: 550px;
	// display: flex;
	// justify-content: space-between;
	// flex-wrap: wrap;
	.wrap-list_1{
		height: 227px !important; 
		.wrap-list-content{
			height: 120px !important; 
			display: flex;
			justify-content: space-between;
			.wrap-list-content-left{
				width: 100%;
				.wrap-list-content-info{
					width: 50%;
					float: left;
					height: 30px;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 16px;
					color: rgba(0,0,0,0.6);
					line-height: 30px;
					text-align: left;
					font-style: normal;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
			.wrap-list-content-right{
				width: 120px;
				display: flex;
				align-self: self-end;
				button{
					width: 120px;
					height: 48px;
					background: #0C6AF7;
					border-radius: 4px 4px 4px 4px;
					color: #fff;
					margin: 0;
					line-height: 48px;
				}
			}
		}
	}
	.wrap-list{
		width: 800px;
		height: 250px;
		background: #F5F5F5;
		border-radius: 0px 0px 0px 0px;
		box-sizing: border-box;
		padding:12px 30px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		float: left;
		    margin-bottom: 25px;
		    margin-right: 40px;
			&:nth-child(2n){
				    margin-right: 0px;
			}
		.wrap-list-top{
			width: 100%;
			height: 40px;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: 22px;
			color: rgba(0,0,0,0.9);
			line-height: 40px;
			text-align: left;
			font-style: normal;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			.span_1{
				padding-left: 30px;
				display: inline-block;
				//vertical-align: middle;
				background: url("../../../static/images/personalCenter/icon-interview.png") left center no-repeat;
			}
			.span_2{
				padding-left: 30px;
				display: inline-block;
				//vertical-align: middle;
				background: url("../../../static/images/personalCenter/icon-video.png") left center no-repeat;
			}
		}
		.wrap-list-content{
			width: 100%;
			height: 150px;
			//display: flex;
			// /justify-content: space-between;
			.wrap-list-content-info{
				width: 50%;
				float: left;
				height: 30px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 16px;
				color: rgba(0,0,0,0.6);
				line-height: 30px;
				text-align: left;
				font-style: normal;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.wrap-list-content-address{
				width: 100%;
				height: 30px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 16px;
				color: rgba(0,0,0,0.6);
				line-height: 30px;
				text-align: left;
				font-style: normal;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.wrap-list-content-rate{
				width: 100%;
				height: 30px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 16px;
				color: rgba(0,0,0,0.6);
				line-height: 30px;
				display: flex;
				align-items: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				text-align: left;
				font-style: normal;
			}
			
		}
		.wrap-list-bottom{
			display: flex;
			justify-content: space-between;
			span{
				width: 400px;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				font-size: 20px;
				color: #000000;
				text-align: left;
				font-style: normal;
				text-transform: none;
			}
			button{
				width: 120px;
				height: 48px;
				background: #0C6AF7;
				border-radius: 4px 4px 4px 4px;
				color: #fff;
				margin: 0;
				line-height: 48px;
			}
		}
	}
	
}
.pic-img{
	width: 100%;
	height: 100%;
}


.wrap-title-top /deep/ .segmented-control{
	height: 60px;
}
.wrap-title-top /deep/.segmented-control__item{
	padding-right: 50px;
}
.wrap-title-top /deep/ .segmented-control__item--text{
	border-bottom-width: 4px;
}
.wrap-title-top /deep/ .segmented-control__text{
	font-size: 24px;
	font-weight: 600;
}
</style>
