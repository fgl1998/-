<template>
	<view class="officeStep_page">
		<h-navbar title="进度查询" :is-back="true" :border-bottom="false" back-icon-color="#fff" title-color="#fff"
			:background="{ background: '#4092ff' }"></h-navbar>
		<!-- 多条办件列表时，显示分类 -->
		<u-tabs-swiper v-if="wholeList.length>1" :list="wholeList" :current="wholeType" :is-scroll="false" @change="tabClick"></u-tabs-swiper>
		<view class="step_block" v-if="!noData">
			<!-- 办件基础信息 -->
			<view class="step_head">
				<view class="head_title">
					<view class="icon_bg"></view>
					<view class="">{{officeInfo.handleItemName}}</view>
				</view>
				<view class="line"></view>
				<view class="head_time">
					<view class="startTime">
						开始时间：{{$util.timeFormat(officeInfo.createTime, 'yyyy-mm-dd hh:MM:ss')}}</view>
					<view class="endTime">
						结束时间：{{officeInfo.endTime ? $util.timeFormat(officeInfo.endTime, 'yyyy-mm-dd hh:MM:ss') : "暂未结束"}}
					</view>
				</view>
				<view class="handle_btn" :class="['state'+officeInfo.state_]"></view>
			</view>
			<view class="step_body">
				<view class="body_head">
					<div class="left">审批流程</div>
					<div class="right">{{getChannelDesc(officeInfo.appNo)}}</div>
				</view>
				<view class="line  line_width"></view>
				<view class="step_info">
					<!-- 流程遍历 -->
					<view v-for="(item,index) in allStep" :key="index">
						<view class="stepTitle_block">
							<view class="stepTitle_img"
								:class="{stepOne_img:index==0&&(officeInfo.state_!='05')||(officeInfo.state_!='08'),stepTow_def:index!=0,stepOne_img_err:index==0&&officeInfo.state_=='08'}">
							</view>
							<view class="stepTitle">{{item.taskName}}</view>
						</view>
						<view class="stepBlock_info">
							<view :class="item.status!='受理'?'stepTwoLine_act':'stepTwoLine_def'"></view>
							<view class="info_block sec_block">
								<view :class="[isOld?'fontSize':'']">办理人：<text
										class="con">{{item.assigneeName||'---'}}</text>
								</view>
								<view :class="[isOld?'fontSize':'']">办理时间： <text
										class="con">{{item.assigneeName||'---'}}</text>
								</view>
								<!-- <view :class="[isOld?'fontSize':'']">办理结果：<text class="tip">{{getTaskStateDesc(item.taskState)||'--'}}</text></view> -->
								<view :class="[isOld?'fontSize':'']">办理意见：<text
										class="con">{{item.comment||'--'}}</text> </view>
							</view>
						</view>
					</view>
					<!-- 流程最终状态 -->
					<!-- <view class="stepTitle_block">
						<view class="stepTitle_img"
							:class="(accept.acpt_status == '05' || accept.acpt_status == '07' || accept.acpt_status == '08' || accept.acpt_status == '11')?'stepThree_act':'stepThree_def'">
						</view>
						<view class="stepTitle" :class="[isOld?'fontSize':'']">{{allStep[type].comment_}}</view>
					</view> -->
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
				isOld:false,
				//步骤列
				allStep: [{
					stepList: [],
					channel: '',
					name: '',
					handleTime: '',
					startTime: '',
					endTime: '',
				}],
				//当前总业务状态
				businessState: '',
				//当前总业务信息
				accept: {},
				//第几个业务
				type: 0,
				typeName: [
					'办件一',
					'办件二',
					'办件三',
					'办件四',
					'办件五',
					'办件六',
					'办件七',
					'办件八',
					'办件九'
				],
				//打包办，多条总业务
				wholeList: [{
					allStep: [{
						stepList: [],
						channel: '',
						name: '',
						handleTime: '',
						startTime: '',
						endTime: '',
					}],
					businessState: '',
					accept: {},
					name:''
				}],
				//总业务索引
				wholeType: 0,
				noData: false,
				officeInfo:'',
				projectNo: '',
				channelList: [],
				acceptStateList: [],
				taskStateList: []
			}
		},
		onLoad(option) {
			this.projectNo = option.projectNo
			this.queryOfficeInfo()
			if(uni.getStorageSync('old')){
				this.isOld = true;
			}
			this.$dict.getDictList('OSP_CHANNEL', (res) => {
				this.channelList = res;
			})
			this.$dict.getDictList('FG_TASK_STATE', (res) => {
				if(res && res.length>0) {
					res.forEach((item)=> {
						if(item.value == "8") {
							item.label = "受理补正"
						}
					})
				}
				this.taskStateList = res;
			})
			this.fnGetStateList()
		},
		methods: {
			fnGetStateList() {
				this.$dict.getDictList("OSA_ACCEPT_STATE", (res)=>{
					let list = res
					this.acceptStateList = []
					if(list.length > 0) {
						list.forEach((item)=>{
							if(item.label == "已受理") {
								item.label = "办理中"
							}
							this.acceptStateList.push(item)
						})
					}
				})
			},
			getTaskStateDesc(value) {
				for(let i in this.taskStateList) {
					if(this.taskStateList[i].value == value) {
						return this.taskStateList[i].label
					}
				}
				return null
			},
			fnGetStateDesc(value) {
				for(let i in this.acceptStateList) {
					if(this.acceptStateList[i].value == value) {
						return this.acceptStateList[i].label
					}
				}
				return value
			},
			getChannelDesc(value) {
				if(value == null || value == "" || typeof value == "undefined") {
					return "---"
				}
				for(let i in this.channelList) {
					if(this.channelList[i].value == value) {
						return this.channelList[i].label
					}
				}
				return value
			},
			queryOfficeInfo() {
				let param = {
					id_: this.projectNo,
					pageSize: 5,
					pageNumber: 1
				}
				this.$base.post('/osa/queryAcceptDataPage', param, res => {
					if(res.list && res.list.length > 0) {
						this.officeInfo = res.list[0]
						this.getProcess(this.officeInfo.id_);
						this.businessState = this.fnGetStateDesc(this.officeInfo.state_)
						this.accept = {acpt_status: this.officeInfo.state_}
						this.wholeList = [{
							allStep: this.allStep,
							businessState: this.businessState,
							accept: this.accept,
							name: ''
						}]
					} else {
						Dialog.alert({
							title: '提示',
							message: '办件单编号无效！'
						})
					}
				}, err => {
					if (err.message.indexOf('无效') != -1) {
						Dialog.alert({
							title: '提示',
							message: '办件单编号无效！'
						})
					} else {
						Dialog.alert({
							title: '提示',
							message: err.message
						})
					}
				})
			},
			//查询进度
			getProcess(id) {
				let param = {
					'flowId': this.officeInfo.flowId
				}
				this.$base.post('/flowgine/listTaskByFlowId',param, data => {
					if(data.resultSet.length == 0){
						Dialog.alert({
							title: '提示',
							message: '暂无进度'
						})
						return;
					}
					this.noData = false
					this.wholeList = []
					this.allStep = data.resultSet;
					this.allStep = this.allStep.sort(this.compare);
				})
			},
			tabClick(index){
				this.wholeType = index
				this.changeWhole()
			},
			//切换总业务
			changeWhole() {
				this.type = 0
				this.allStep = this.wholeList[this.wholeType].allStep
				this.businessState = this.wholeList[this.wholeType].businessState
				this.accept = this.wholeList[this.wholeType].accept
			},
			//获取码值
			getResultDesc(status) {
				let str = '审核中';
				switch (status) {
					case "01":
						str = '受理'
						break
					case "5":
						str = '撤销'
						break
					case "13":
					case "31":
						str = '审核通过';
						break;
					case "12":
					case "32":
						str = '审核不通过';
						break;
					default:
						str = "未知"
				}
				return str;
			},
			//办理状态
			getTaskStatus(status) {
				var result_Desc = "";
				switch (status) {
					case "1":
					case "2":
						result_Desc = "审核中";
						break;
					case "4":
						result_Desc = "审核通过";
						break;
					case "6":
						result_Desc = "撤销";
						break;
					default:
						result_Desc = "审核不通过";
				}
				return result_Desc;
			},
			//总业务状态
			getBusinessStatus(status) {
				var result_Desc = "";
				switch (status) {
					case "0":
					case "1":
						result_Desc = "审核中";
						break;
					case "2":
						result_Desc = "审核通过";
						break;
					case "3":
						result_Desc = "审核不通过";
						break;
					case "4":
						result_Desc = "已终止";
						break;
					case "5":
						result_Desc = "不予受理";
						break;
					default:
						result_Desc = "未知";
				}
				return result_Desc;
			},
			//切换办件列表
			changeType(i) {
				if (this.type != i) {
					this.type = i
				}
			},
			compare(a,b){
				const bandA = new Date (a.createTime);
				const bandB = new Date (b.createTime)
				let comparison = 0;
				if(bandA > bandB){
					comparison = 1;
				}else if (bandA < bandB){
					comparison = -1;
				}
				return comparison;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.officeStep_page {
		background-color: #f6f7f8;
		min-height: 100%;
	
		.fontSize {
			font-size: 40rpx;
		}
	
		.line {
			width: 692rpx;
			height: 0rpx;
			background: #FFFFFF;
			opacity: 0.41;
			border: 2rpx solid #E7E7E7;
			margin: 0 auto;
		}
	
		.line_width {
			width: 628rpx;
			margin: 0 auto;
		}
	
		.step_block {
			margin: 0 auto;
			background: #F3F5F9;
	
			.step_head {
				background-color: #fff;
				position: relative;
				margin-bottom: 24rpx;
	
				.head_title {
					height: 108rpx;
					background: #FFFFFF;
					border-radius: 8rpx 8rpx 0rpx 0rpx;
					display: flex;
					align-items: center;
					padding: 36rpx 32rpx;
					font-weight: bold;
					box-sizing: border-box;
	
					.icon_bg {
						width: 8rpx;
						height: 36rpx;
						background: #1492FF;
						margin-right: 12rpx;
					}
				}
	
	
	
				.head_time {
					font-size: 24rpx;
					color: #999999;
					padding: 22rpx 32rpx;
	
					.startTime {
						height: 34rpx;
						line-height: 40rpx;
						margin-bottom: 22rpx;
					}
	
					.endTime {
						height: 34rpx;
						line-height: 40rpx;
					}
				}
	
				.handle_btn {
					position: absolute;
					top: 0;
					right: 0;
					width: 180rpx;
					height: 130rpx;
					background: #1492FF;
					border-radius: 0rpx 0rpx 0rpx 0rpx;
				}
	
				.state04 {
					background: url(#{$image_src}/static/newImages/index/office_status04.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.state05 {
					background: url(#{$image_src}/static/newImages/index/office_status05.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.state07 {
					background: url(#{$image_src}/static/newImages/index/office_status07.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.state08 {
					background: url(#{$image_src}/static/newImages/index/office_status08.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.state10 {
					background: url(#{$image_src}/static/newImages/index/office_status10.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.state11 {
					background: url(#{$image_src}/static/newImages/index/office_status11.png) no-repeat center;
					background-size: 100% 100%;
				}
	
			}
	
			.step_body {
				width: 686rpx;
				min-height: 600rpx;
				border-radius: 12rpx;
				opacity: 1;
				margin: 0 auto;
				background: #FFFFFF;
	
				.body_head {
					padding: 30rpx 32rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
	
					.left {
						height: 40rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #333333;
						line-height: 40rpx;
					}
	
					.right {
						height: 34rpx;
						font-size: 24rpx;
						color: #666666;
						line-height: 34rpx;
					}
				}
	
				.step_info {
					padding: 34rpx 28rpx 54rpx 26rpx;
				}
	
	
			}
	
	
	
			.stepTitle_block {
				display: flex;
				align-items: center;
	
				.stepTitle_img {
					width: 28rpx;
					height: 28rpx;
				}
	
				.stepOne_img {
					background: url(#{$image_src}/static/newImages/index/warn.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepOne_img_err {
					background: url(#{$image_src}/static/newImages/index/err.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepTow_def {
					background: url(#{$image_src}/static/newImages/index/suc.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepTwo_act {
					// height: 440rpx;
	
					width: 4rpx;
					background-image: linear-gradient(rgba(112, 112, 112, 0.38) 35%, rgba(255, 255, 255, 0) 0%);
					/* 35%设置虚线点y轴上的长度 */
					background-position: left;
					/* right配置右边框位置的虚线 */
					background-size: 1px 10px;
					/* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
					background-repeat: repeat-y;
	
				}
	
				.stepThree_def {
					width: 16rpx;
					height: 16rpx;
					background: #C8C8C8;
					border-radius: 50%;
					position: relative;
					margin-left: 3px;
	
					&::after {
						width: 8rpx;
						height: 8rpx;
						content: '';
						display: inline-block;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background-color: #fff;
						border-radius: 50%;
					}
				}
	
				.stepThree_act {
					background: url(#{$image_src}/static/newImages/my/icon03@2x.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepTitle {
					margin-left: 16rpx;
					height: 40rpx;
					font-size: 28rpx;
					color: #333333;
					line-height: 40rpx;
				}
			}
	
			.stepBlock_info {
				display: flex;
				// align-items: center;
				margin-left: 7px;
	
				.info_line {
					width: 4rpx;
					height: 336rpx;
					background: url(#{$image_src}/static/newImages/my/line01_activated.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepTwoLine_def {
					width: 6rpx;
					height: 542rpx;
					background: url(#{$image_src}/static/newImages/my/line02_default.png) no-repeat center;
					background-size: 100% 100%;
				}
	
				.stepTwoLine_act {
					// height: 440rpx;
					width: 4rpx;
					background-image: linear-gradient(rgba(112, 112, 112, 0.38) 35%, rgba(255, 255, 255, 0) 0%);
					/* 35%设置虚线点y轴上的长度 */
					background-position: left;
					/* right配置右边框位置的虚线 */
					background-size: 1px 10px;
					/* 第一个参数设置虚线点x轴上的长度；第二个参数设置虚线点的间距 */
					background-repeat: repeat-y;
				}
	
				.info_block {
					margin-left: 24rpx;
					margin-top: 24rpx;
					width: 586rpx;
					// height: 170rpx;
					background: #F7F7F7;
					padding: 18rpx 24rpx;
					box-sizing: border-box;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
	
					.fontSize {
						font-size: 34rpx;
					}
	
					>view {
						/* height: 34rpx; */
						font-size: 24rpx;
						color: #476A9C;
						line-height: 34rpx;
						margin-bottom: 16rpx;
	
						.con {
							height: 34rpx;
							font-size: 24rpx;
							color: #666666;
							line-height: 34rpx;
						}
	
						.tip {
							width: 126rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							font-size: 30rpx;
							background-color: #e9ffe9;
							color: #00d22e;
						}
					}
	
					view:last-of-type {
						margin-bottom: 0rpx;
					}
	
				}
	
				.first_block {
					margin-bottom: 24rpx;
				}
	
				.sec_block {
					margin-bottom: 20rpx;
				}
			}
		}
	}
</style>