<template>
	<view>
		<div class="modal-input" @click="clickModal">
			<div :class="isEdit && moduleValue ? 'input-content input-text':'input-content input-placehoder'" :style="{background:!isEdit ? '#f5f7fa': '',cursor:!isEdit ? 'not-allowed': ''}">
				<span>{{!moduleValue ? placeholder : moduleValue}}</span>
			</div>
		</div>
		<uni-popup ref="popup" type="center">
			<div class="screen-box">
				<div class="screen-title">
					<div class="screen-title-base">
						<text style="color: #0C6AF7;">岗位</text>选择  
						<span> / 请您选择或检索相关职位</span>
					</div>
					<div class="screen-title-close" @click="close">
						<image src="../../static/images/index/icon-close.png" mode="aspectFit"></image>
		
					</div>
				</div>
				<div class="screen-content">
					<div class="screen-lt">
						<div class="screen-search">
							<div class="screen-search-input">
								<uni-easyinput type="text" v-model="searchText" placeholder="岗位名称搜索" suffixIcon="search"  @iconClick="iconClick"/>
							</div>
							
						</div>
						<div class="screen-tab">
							<scroll-view scroll-y="true" class="scroll-Y" style="height: 100%;">
									<div v-for="(item,index) in workTypeTree" :key="index" @click="changeType(item,1)"
									:class="['tab-item', item.aca111 == screenType ? 'actived' : '']">
										<span class="text">{{item.aca112}}</span>
										<span class="arrow"><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image></span>
									</div>
							</scroll-view>
							
						</div>
					</div>
					
					<div class="screen-rt" v-if='!searchShow && workTypeSecond.length > 0'>
						<div class="screen-rt-list">
							<scroll-view scroll-y="true" style="height: 100%;">
									<div v-for="(item,index) in workTypeSecond" :key="index" @click="changeType(item,2)"
									:class="['tab-item', item.aca111 == screenTypeSecond ? 'actived' : '']">
										<span class="text">{{item.aca112}}</span>
										<span class="arrow"><image src="../../static/images/viewer/icon-arrow.png" mode="aspectFit"></image></span>
									</div>
							</scroll-view>
						</div>
						<div class="screen-rt-tag">
							<template v-if='workTypeLast.length > 0'>
								<scroll-view scroll-y="true" style="height: 100%;">
										<div class="screen-rt-tag-content">
											<div v-for="(item,index) in workTypeLast" :key="index" @click="changeType(item)"
											:class="['tab-item-tag', item.aca111 == screenTypeLast ? 'actived' : '']">
												<span class="text">{{item.aca112}}</span>
											</div>
										</div>
								</scroll-view>
							</template>
							<template>
								<div class='nodata' >
									<div class="nodata-pic">
											<div class="nodata-img"></div>
											<div class="nodata-text">暂时检索不到你要的数据哦~</div>
										
									</div>
								</div>
							</template>	
						</div>
						
					</div>
					
					<div class="screen-rt" v-else-if="searchShow && searchArray.length > 0">
					<scroll-view scroll-y="true" style="height: 100%;">
							<div class="screen-rt-tag-content-search">
								<div v-for="(item,index) in searchArray" :key="index" @click="changeType(item)"
								:class="['tab-item-tag', item.aca111 == screenTypeLast ? 'actived' : '']">
									<span class="text">{{item.aca112}}</span>
								</div>
							</div>
					</scroll-view></div>
					
					<div class="screen-rt" v-else>
						<div class='nodata'>
							<div class="nodata-pic">
									<div class="nodata-img"></div>
									<div class="nodata-text">暂时检索不到你要的数据哦~</div>
								
							</div>
						</div>
					</div>
				</div>

			
			</div>
		</uni-popup>


	</view>
</template>

<script>
	export default {
		name: "modal-traintype",
		
		data() {
			return {
			moduleValue:'',
			searchText:'',
			searchShow:false,	
			screenType:'',
			screenTypeSecond:'',
			screenTypeLast:'',
			workTypeTree:[], //一级数据
			workTypeSecond:[], //二级数据
			workTypeLast:[], //最后级数据
			checkSelect:{},//选中数据
			searchArray:[],
			}
		},
		props:{
			value:{
				type: String,
				default: '',
			},
			placeholder:{
				type: String,
				default: '选择工作地点',
			},
			moduleKey:{
				type: String,
				default: '',
			},
			moduleId:{
				type: String,
				default: '',
			},
			
			isEdit: {
				type: Boolean,
				default: true
			},
		},
		
		watch:{
			value:{
				handler(val) {
					//console.log(val)
					this.$nextTick(()=>{
						this.moduleValue = val
					})
			
				},
				immediate:true,
			}
		},
		async mounted() {
		  this.workTypeTree = await this.$utils.getTrainTypeTree()
		  console.log(this.workTypeTree, 'workTypeTree')
		},
		methods: {
			clickModal: function() { //打开弹窗
				if(this.isEdit){
					this.$refs.popup.open()
					if(!this.moduleId){
						this.restModal()
					}
				}
			},
			close: function() { //关闭弹窗
					//console.log(this.checkSelect)
					this.moduleValue = this.checkSelect.aca112
					this.$emit('setModalValue',this.checkSelect)
					this.$refs.popup.close()
				},
				
			handleGetAddress(_item={},num){
				let param = {
				  method: "jy009_com02_interface",
					root: _item.areaid,
					areacode: _item.areaid,//四川省
				}
				this.$utils.request(null,param,true).then(res => {
					if(res.serviceSuccess) {
						if(res.data.resultData.length>0){
							let _leaf = res.data.resultData[0].leaf
							if(_leaf){
								this.addressLastData = res.data.resultData
							}else{
								if(num == '1'){
									this.addressSecondData = res.data.resultData
								}else if(num == '2'){
									this.addressTirdData = res.data.resultData
								}else if(num == '3'){
									this.addressFourData = res.data.resultData
								}else{
									this.addressLastData = res.data.resultData
								}
							}
							//console.log(this.addressSecondData)
						}
					
					} else {
						this.$utils.showToast("查询区划错误！")
					}
				})
			},	
				
			iconClick(){ //搜索
						let param = {
							method: 'jy202_hrm351',
							aca112: this.searchText,
							aca11a: '3',
						};
						this.$utils.request(null, param, true).then(res => {
							//console.log(res)
							if (!res.serviceSuccess) {
								this.$utils.showToast("调用服务异常")
							} else {
								this.searchShow = true
								this.searchArray = res.data.data
								
							}
						});
					},
			changeType: function(type,num) {
				if(num == '1'){
					this.workTypeSecond = type.children
					this.screenType = type.aca111
					this.workTypeLast = []
					this.checkSelect = {}
					this.searchShow = false
				}else if(num == '2'){
					this.workTypeLast = type.children
					this.screenTypeSecond = type.aca111
					this.checkSelect = {}
				}else{
					this.screenTypeLast = type.aca111
					this.checkSelect = type
					this.close()
				}
				
				
			},
			restModal(){
				this.searchText = ''
				this.screenType = ''
				this.screenTypeSecond = ''
				this.screenTypeLast = ''
				this.workTypeSecond = [] //二级数据
				this.workTypeLast = [] //最后级数据
				this.checkSelect = {}//选中数据
				this.searchShow = false
				this.searchArray = []
			}
			
		
		}
	}
</script>

<style lang="scss" scoped>
	.screen-box {
		width: 1440px;
		height: 800px;
		background: #FDFDFD;
		border-radius: 20px 20px 20px 20px;
			overflow: hidden;
		.screen-title{
				box-sizing: border-box;
				width: 100%;
				height: 70px;
				padding: 0 30px;
				border-bottom: 1px solid #DDDDDD;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.screen-title-base{
					width: 100%;
					height: 70px;
					line-height: 70px;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					font-size: 24px;
					color: rgba(0,0,0,0.9);
					text-align: left;
					font-style: normal;
					text-transform: none;
					position: relative;
					padding-left: 15px;
					:before {
						content: '';
						position: absolute;
						top: 50%;
						left: 0;
						-webkit-transform: translateY(-50%);
						transform: translateY(-50%);
						width: 8px;
						height: 23px;
						background: #0C6AF7;
						border-radius: 2px;
				
					}
					span{
						font-family: PingFang SC, PingFang SC;
						font-weight: 400;
						font-size: 18px;
						color: rgba(0,0,0,0.6);
						line-height: 21px;
						text-align: left;
						font-style: normal;
						text-transform: none;
						margin-left: 5px;
					}
				}
				.screen-title-close{
					width: 34px;
					height: 34px;
					cursor: pointer;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		.screen-content {
			height: calc(100% - 71px);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			background: #fff;
			background-size: 20px 12px;

			.screen-lt {
				width: 320px;
				height: 100%;
				border-right: 1px solid #ddd;
				.screen-search{
					width: 100%;
					height: 99px;
					border-bottom: 1px solid #ddd;
					display: flex;
					justify-content: center;
					align-items: center;
					.screen-search-input{
						width: 260px;
						height: 48px;
					}
				}
				
				.screen-tab {
					width: 100%;
					height:  calc(100% - 100px);
					.tab-item {
						width: 320px;
						height: 55px;
						line-height: 55px;
						text-align: center;
						border-radius: 0px 0px 0px 0px;
						display: flex;
						box-sizing: border-box;
						padding: 0 24px;
						justify-content: space-between;
						align-items: center;
						cursor: pointer;
						&.actived{
							background: rgba(39,164,255,0.15);
						
							.text{
								color:#0C6AF7;
								}
							}
							
							.text{
								display: block;
								width: 235px;
								height: 35px;
								font-family: PingFang SC, PingFang SC;
								font-weight: 400;
								font-size: 18px;
								color: rgba(0,0,0,0.9);
								line-height: 35px;
								text-align: left;
								font-style: normal;
								text-transform: none;
								overflow: hidden;text-overflow: ellipsis;
								white-space: nowrap;
							}
							.arrow{
								display: block;
								width: 18px;
								height: 35px;
								image{
									width: 100%;
									height: 100%;
								}
							}
					}
				}
			}

			.screen-rt {
				width: calc(100% - 321px);
				height: 100%;
				background: #FBFCFD;
				display: flex;
				justify-content: space-between;
				.screen-rt-list{
					width: 320px;
					height: 100%;
					border-right: 1px solid #ddd;
					.tab-item {
						width: 320px;
						height: 55px;
						line-height: 55px;
						text-align: center;
						border-radius: 0px 0px 0px 0px;
						display: flex;
						box-sizing: border-box;
						padding: 0 24px;
						justify-content: space-between;
						align-items: center;
						cursor: pointer;
						&.actived{
							background: rgba(39,164,255,0.15);
						
							.text{
								color:#0C6AF7;
								}
							}
							
							.text{
								display: block;
								width: 235px;
								height: 35px;
								font-family: PingFang SC, PingFang SC;
								font-weight: 400;
								font-size: 18px;
								color: rgba(0,0,0,0.9);
								line-height: 35px;
								text-align: left;
								font-style: normal;
								text-transform: none;
								overflow: hidden;text-overflow: ellipsis;
								white-space: nowrap;
							}
							.arrow{
								display: block;
								width: 18px;
								height: 35px;
								image{
									width: 100%;
									height: 100%;
								}
							}
					}
				}
				.screen-rt-tag{
					width: calc(100% - 321px);
					height: 100%;
					
					.screen-rt-tag-content{
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						padding: 30px;
						.tab-item-tag {
							display: inline-block;
							margin-right: 20px;
							margin-bottom: 20px;
							height: 48px;
							background: #F3F3F3;
							border-radius: 4px 4px 4px 4px;
							cursor: pointer;
								border: 1px solid #F3F3F3;
							&.actived{
								background: rgba(39,164,255,0.15);
								border-radius: 4px 4px 4px 4px;
								border: 1px solid #0C6AF7;
							
								.text{
									color:#0C6AF7;
									background: url('../../static/images/viewer/icon-check.png') right top no-repeat;
									}
								}
								
								.text{
									display: block;
									width: 100%;
									padding: 0 15px;
									height: 48px;
									box-sizing: border-box;
									font-family: PingFang SC, PingFang SC;
									font-weight: 400;
									font-size: 18px;
									color: rgba(0,0,0,0.9);
									line-height: 48px;
									text-align: center;
									font-style: normal;
									text-transform: none;
								}
						}
					}
					
				}
			}
		}

	

	}
	.screen-rt-tag-content-search{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 30px;
		.tab-item-tag {
			display: inline-block;
			margin-right: 20px;
			margin-bottom: 20px;
			height: 48px;
			background: #F3F3F3;
			border-radius: 4px 4px 4px 4px;
			cursor: pointer;
				border: 1px solid #F3F3F3;
			&.actived{
				background: rgba(39,164,255,0.15);
				border-radius: 4px 4px 4px 4px;
				border: 1px solid #0C6AF7;
			
				.text{
					color:#0C6AF7;
					background: url('../../static/images/viewer/icon-check.png') right top no-repeat;
					}
				}
				
				.text{
					display: block;
					width: 100%;
					padding: 0 15px;
					height: 48px;
					box-sizing: border-box;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					font-size: 18px;
					color: rgba(0,0,0,0.9);
					line-height: 48px;
					text-align: center;
					font-style: normal;
					text-transform: none;
				}
		}
	}
	
	.screen-search-input /deep/ .content-clear-icon{
	    padding: 0 5px;
	    height: 100% ;
	    width: 50px;
	    background: #0C6AF7;
	    line-height: 48px;
	    font-size: 26px !important;
	    color: #fff !important;
		cursor: pointer
	}
</style>
