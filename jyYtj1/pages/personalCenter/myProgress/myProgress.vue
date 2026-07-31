<template>
	<div class="page">
		<!-- 岗位列表 -->
		<common-header></common-header>

		<div class="page-wrap">
			<div class="wrap-center">

				<div class="wrap-box">
					<div class="wrap-con">
						<div class="wrap-title">
							<div class="title-lt">
								<div class="lt-text"> <span><text style="color:#0C6AF7 !important">职位</text> 列表 </span>  / 点击下方列表可查看</div>
								<!-- <div class="lt-search">
									<a href="javascript:;" @click="screenShow">更多查询</a>
								</div> -->
							</div>
							<div class="title-rt">
								<uni-row class="demo-uni-row" width="1300" :gutter="20">
									<uni-col :span="6">
										<custom-address placeholder="选择地区" @change="getAreaValue" v-model="acb303"/>
									</uni-col>
									<uni-col :span="4">
										<custom-select collect='acb469' placeholder="选择工作形式" @change="getSelectValue" v-model="acb469"/>
									</uni-col>
									<uni-col :span="6">
										<div class="sitem-box">
											<div class="salary-item">
												<input class="uni-input" type="number" v-model="acb21h" placeholder="最低薪资"
													@blur="changeSalary(0,$event)" />
												<span>~</span>
												<input class="uni-input" type="number" v-model="acb21j" placeholder="最高薪资"
													@blur="changeSalary(1,$event)" />
											</div>
										</div>
									</uni-col>
									<uni-col :span="4">
										
										<div class="modal-input" @click="clickModal">
											<div :class="modalValue.type != '0' ? 'input-content input-text':'input-content input-placehoder'">{{modalValue.type == 0 ? "选择岗位": modalValue.aca112}}</div>
										</div>
									</uni-col>
	
						
									<uni-col :span="2">
										<button class="btn btn-white" @click="resetInputAll">重置</button>
									</uni-col>
									<uni-col :span="2">
										<button class="btn btn-blue" @click="getInputAll">搜索</button>
									</uni-col>
								</uni-row>
							</div>
						</div>
						<div class="wrap-list">
							<div class="list-con">
								<table class="table">
									<tr>
										<th>职位名称</th>
										<th style="width: 15%;">薪资情况</th>
										<th style="width: 25%;">公司名称</th>
										<th style="width: 30%">地址</th>
										<th style="width: 10%;text-align: center;">操作</th>
									</tr>
									<template v-if='jobList.length > 0'>
										<tr v-for="(item,index) in jobList" :key="index" >
											<td style="font-weight: bold;">{{item.acb213}}</td>
											<td style="width: 15%;">
												<span>{{item.acb21h&&item.acb21j ? item.acb21h + '~' + item.acb21j :''}}元/月</span>
												<span>{{item.acb21h&&!item.acb21j ? item.acb21h + '以上':''}}</span>
												<span>{{!item.acb21h&&item.acb21j ? item.acb21j + '以下':''}}</span>
												<span>{{!item.acb21h&&!item.acb21j ? '薪资面议' :''}}</span>
											</td>
											
											<td style="width: 25%;">{{item.aab004}}</td>
											<td style="width: 30%">{{item.acb217}}</td>
											<td style="width: 10%;text-align: center;color: #0C6AF7;cursor: pointer;" @click="toPage(item)">查看详情</td>
										</tr>
									</template>
									
									<template v-else>
										<tr class='nodata' style="height: calc(100% - 64px);">
											<td class="nodata-pic">
												<div class="nodata-img"></div>
												<div class="nodata-text">暂时检索不到你要的数据哦~</div>
											</td>
										</tr>
									</template>
								</table>
							</div>
						</div>
					</div>
					<div class="wrap-page" v-if='jobList.length>0'>
						<common-pager :totals="pageTotal" :currentPage="currentPage" :pageSize="pageSize"
							@currentChange="currentChange"></common-pager>
					</div>
				</div>

			</div>
		</div>

		<common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>

		<!--筛选弹框-->
		<modal-workType ref="workTypeModal"  @setModalValue="getModalValue" :modalValue="modalValue"></modal-workType> 

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
				currentPage: 1,
				pageSize: 8,
				pageTotal: 0,
				jobList: [],
				aca111: '', //行业
				acb21h: '', //最低薪资
				acb21j: '', //最高薪资
				acb469:'',//形式
				acb303: '', //招聘详细地址
				modalValue:{type: 0,aca112:'',aca111: ''}
			}
		},
		methods: {
			 clickModal() {  //打开弹窗
			 	this.$refs.workTypeModal.open()
			 },
			 getModalValue (val) { //获取弹窗数据设置
				if(JSON.stringify(val) != "{}"){
					this.modalValue = {
						type: val.aca111,aca111: val.aca111,aca112:val.aca112
					}
					this.aca111 = this.modalValue.aca111
				}else{
					this.modalValue = {type: 0,aca112:'',aca111: ''}
					this.aca111 = ''
				}

			 },
			 getAreaValue(value){
				 this.acb303 = value
			 },
			 getSelectValue(value){
				 this.acb469 = value
			 },
			 getInputAll(){
				 this.handleGetData()
				 
			 },
			 
			 
			 changeSalary: function(type, e) {
			 	let val = parseFloat(e.target.value)
			 	if (val >= 0) {
			 		switch (type) {
			 			case 0: //最低
			 				if (this.acb21j != '') {
			 					if (val < parseFloat(this.acb21j)) {
			 						this.acb21h = val
			 					} else {
			 						this.acb21h = ''
			 						this.$utils.showToast("最低薪资必须小于最高薪资！")
			 					}
			 				} else {
			 					this.acb21h = val
			 				}
			 				break;
			 			default: //最高
			 				if (this.acb21h != '') {
			 					if (val > parseFloat(this.acb21h)) {
			 						this.acb21j = val
			 					} else {
			 						this.acb21j = ''
			 						this.$utils.showToast("最高薪资必须大于最低薪资！")
			 					}
			 				} else {
			 					this.acb21j = val
			 				}
			 				break;
			 		}
			 	} else {
			 		this.$utils.showToast("薪资必须大于等于0！")
			 	}
			 },
			 
			
			init() {
				this.currentPage = 1;
				this.handleGetData()
			},
			// 查询数据
			handleGetData(){
				
				let param = {
					method:"jy202_hrm101",
					ycb211: "0",
					pageNumber: this.currentPage,
					pageSize: this.pageSize,
					aca111:this.aca111,
					acb21h: this.acb21h,
					acb21j: this.acb21j,
					acb303: this.acb303,
					acb469: this.acb469,
					audit_status: '0',//职位审核通过
				};
				//param.ycb213 = this.type.code;
				if(this.aca111){
					param.aca111 = this.aca111
				} else if(this.userInfo && this.userInfo.aca111){
					param.aca111 = this.userInfo.aca111
				}
				if(this.acb211 != undefined){
					param.acb211 = this.acb211;
				}
				this.$utils.request(null,param,true
				).then((res)=>{
					if(res.serviceSuccess){
						let pageBean = res.data.pageBean
						if(pageBean.total>0){
							this.jobList = pageBean.list;
							this.pageTotal = pageBean.total;
						} else {
							this.jobList = [];
							// this.$utils.showModal("提示", "尚未查询到相关的岗位信息", false, succ => {}, fail => {
							// })
						}
					}else{
						this.$utils.showModal(res.errors[0].msg)
					}
				})
			},
			//分页返回页码
			currentChange(val) {
				//console.log("翻到第" + val + "页了");
				this.currentPage = val;
				this.handleGetData()
			},
			
			toPage(item) {
				item.oddJob = false
				this.$utils.navigateTo('/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' +
					encodeURIComponent(JSON.stringify(item)))
			},
			
		resetInputAll: function() {
			this.modalValue = {type: 0,aca112:'',aca111: ''}
			this.aca111 = ''
			this.acb21h = ''
			this.acb21j = ''
			this.acb303 = ''
			this.acb469 = ''
			this.handleGetData()
		},
		}
	}
</script>

<style lang="scss" scoped>
	.btn-blue {
		margin-left: 14px;
	}
	
	.pic-img{
		width: 100%;
		height: 137px;
	}
	.sitem-box {
		.salary-item {
			.uni-input{
				width: 100%	 !important;
			}
		}
		.tags-box {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
			width: 320px;
			.tag-item {
				color: #999999;
				border: 1px solid #cccccc;
				min-width: 120px;
				text-align: center;
				height: 48px;
				line-height: 48px;
				padding: 0 10px;
				box-sizing: border-box;
				margin-right: 16px;
				margin-bottom: 16px;
				border-radius: 4px;
	
				&.active {
					border: 1px solid #4BAAFE;
					color: #4DABFD;
				}
			}
		}
	
		.uni-input {
			width: 100%;
			height: 48px;
			line-height: 48px;
			border: 1px solid #dcdfe6;
			background: #ffffff;
			padding: 0 16px;
			box-sizing: border-box;
			font-size: 16px;
			border-radius: 4px;
		}
	
		.salary-item {
			display: flex;
			justify-content: flex-start;
			align-items: center;
	
			.uni-input {
				width: 140px;
			}
	
			span {
				margin: 0 16px;
				color: #999999;
			}
		}
	
	}
	
	
	// .modal-input /deep/ .is-disabled{
	// 	border-color: #e5e5e5 !important;
	// 	 background-color: #fff !important;
	// }
	// .modal-input /deep/ .is-disabled .uni-input-placeholder{
	// 	color: #999  !important;
	// }
	
</style>
