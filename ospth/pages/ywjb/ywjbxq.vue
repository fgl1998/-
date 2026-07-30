<template>
	<view class="pageInfo">
		<!-- <h-navbar title="业务经办详情" :border-bottom="false" title-color="#000" :background="{ background: '#FFF' }"></h-navbar> -->
		<view class="serviceBox isFlex">
			<view class="title">
				<view class='icon'></view>
				<view class='titleName'>{{ title }}</view>
			</view>
			<view class="date">{{ date }}</view>
		</view>
		<view class="spaceGray"></view>
		<view class="serviceBox">
			<view class="titleBlock" v-if="iframeUrl">申请信息</view>
			<iframe 
				v-if="iframeUrl"
				id='form-iframe'
				ref="iframePage"
				:src="iframeUrl" 
				frameborder="no"
				scrolling="auto"
				:height="iframeHeight"
				width="100%"
				:style="{height: iframeHeight + 'px'}"
			></iframe>
			<view class="serviceList">
				<view class='leftName'>附件：</view>
				<view v-if="materialList.length > 0" class='rightName' style="color:#1492FF" @click="showPopup = true">查看附件</view>
				<view v-else class='rightName' style="color:#999999">未上传附件</view>
			</view>
		</view>
		<view class="spaceGray"></view>
		<view class="serviceBox">
			<view class="titleBlock">审核信息</view>
			<view class="serviceList showBorder">
				<view class='leftName'>审核状态</view>
				<view class='rightName' style="color:#1492FF">{{ getStateLabel(taskState) }}</view>
			</view>
			<view class="serviceList showBorder">
				<view class='leftName'>审核环节</view>
				<view class='rightName'>{{ taskName }}</view>
			</view>
			<view class="serviceList">
				<van-steps direction="vertical" :active="allStep.length-(type=='2'?0:1)" active-color='#1492FF' >
				  <van-step v-for="(item, index) in allStep" :key="index">
				    <p>{{item.taskName}}</p>
					<view class="tips" style="margin-top: 12rpx;">
						<view>经办人：{{item.assigneeName || '---'}}</view>
					</view>
					<view class="tips">
						<view>审核意见：{{item.comment||'---'}}</view>
					</view>
					<view class="tips">
						<view>完成时间：{{item.endTime || '---'}}</view>
					</view>
				  </van-step>
				   <van-step>
				     <p>业务办结</p>
				   </van-step>
				</van-steps>
			</view>
		</view>
		<view class="spaceGray" v-if="type != '2'"></view>
		<view class="btnBox" v-if="type != '2'">
			<view class="checkBtn" @click="showBtn = true">审核</view>
		</view>
		<van-popup v-model="showPopup" round :close-on-click-overlay='false' style='z-index: 1;'>
			<view class="innerPopup">
				<view class="closeIcon" @click="showPopup = false">X</view>
				<view class="title">附件列表</view>
				<view class="fileList" v-for="(item,index) in materialList" :key='index'>
					<view class="imgTitle">{{index + 1}}.{{ item.materialName }}</view>
					<van-swipe @change="onChange">
					  <van-swipe-item v-for="(file,index) in item.list" :key="index">
						  <view class="img">
						  	<img v-if="file.type == 'jpg' || file.type == 'png' || file.type == 'jpeg'" :src="file.url" @click='preImg(file)'>
							<view v-else class="typeIcon" :class="file.type"></view>
						  </view>
					  </van-swipe-item>
					</van-swipe>
				</view>
				<view class="closePopup" @click="showPopup = false">确认</view>
			</view>
		</van-popup>
		<van-popup v-model="showReason" round class='showDialog' position="bottom">
			<view class="title">受理补正</view>
			<view v-if="showMaterial" class="titleBox">
				<view class="title_text">补正材料</view>
			</view>
			<view v-if="showMaterial" class="materials" style="margin: 30rpx 0;padding-left: 30rpx;">
				<van-checkbox-group v-model="materials">
					<van-checkbox shape="round" style="margin-bottom: 10rpx;" :name="item.materialCode" v-for="(item, index) in materialList" :key="index">{{item.materialName}}</van-checkbox>
				</van-checkbox-group>
			</view>	
			<view class="titleBox">
				<view class="title_text">补正原因</view>
			</view>
			<view class="post">
				<van-cell-group>
					<van-field type="textarea" v-model="reason" label="" placeholder="请输入" style='height: 294rpx;background-color: #F8F8F8;margin-bottom: 174rpx;'/>
				</van-cell-group>
			</view>
			<view class="showDialogBtnBox">
				<van-button type="default" style="width: 330rpx;height: 98rpx;" @click="showReason=false">取消</van-button>
				<van-button type="info" style="width: 330rpx;height: 98rpx;margin-left: 24rpx;" @click='reasonHandleOk()'>确认</van-button>
			</view>
		</van-popup>
		
		<van-popup v-model="showBtn" round class='showPopupBtn' position="bottom">
			<view class="title">审核意见</view>
			<view class="typeBtnBox">
				<view class="typeBtn" v-for="(button, buttonIndex) in buttonList" :key="buttonIndex" @click="fnFunction(button)" v-show="button.display == '1'">
					<view class="icon" :class="buttonClass(button)"></view>
					<view class="word">{{ button.btnName }}</view>
				</view>
			</view>
		</van-popup>
		
		<van-popup v-model="revokeVisible" round class='showDialog' position="bottom">
			<view class="title">撤回</view>
			<view class="titleBox">
				<view class="title_text">撤回原因</view>
			</view>
			<view class="post">
				<van-cell-group>
					<van-field type="textarea" v-model="reason" label="" placeholder="请输入" style='height: 294rpx;background-color: #F8F8F8;margin-bottom: 174rpx;'/>
				</van-cell-group>
			</view>
			<view class="showDialogBtnBox">
				<van-button type="default" style="width: 330rpx;height: 98rpx;" @click="revokeVisible=false">取消</van-button>
				<van-button type="info" style="width: 330rpx;height: 98rpx;margin-left: 24rpx;" @click='revokeHandleOk()'>确认</van-button>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import '@/static/common/PostMessageUtil.js';
	import { Dialog, Toast, Popup } from 'vant';
	export default {
		data() {
			return {
				radio: '1',
				taskId: null,
				flowId: null,
				flowNo: null,
				businessKey: null,
				flowExt1: null,
				flowExt2: null,
				flowExt3: null,
				flowKey: null,
				nodeExtension: null,
				title: null,
				date: null,
				taskName: null,
				taskState: null,
				showPopup: false,
				serviceList:null,
				buttonList: null,
				iframeUrl: null,
				iframeHeight: 150,
				preViewUrl: this.$base.BASE_URL + "/bmc/download", // 预览地址
				fileList: null,
				preImgList: [],
				allStep: [],
				reason: '',
				showMaterial: false,
				showReason: false,
				materials: [],
				materialList: [],
				btnId: '',
				type: '0',
				showBtn:false,
				taskInfo: {},
				stateList: [],
				revokeVisible: false
			}
		},
		computed: {
			
		},
		onLoad(param) {
			this.taskId = param.taskId;
			this.type = param.type;
			
			uni.setStorageSync('applet-token', param.token);
			uni.setStorageSync("channelCode", param.channelCode);
			window._setIframeHeight = this.setIframeHeight
			
			this.fnQueryData()
			
			this.$dict.getDictList('FG_TASK_STATE', (res) => {
				this.stateList = res
			});
		},
		
		methods:{
			buttonClass(button) {
				return {
					'back': button.btnId == 'back' || button.btnName == '退回' || button.btnName == '撤回',
					'unpass': button.btnId == 'unpass' || button.btnName == '审核不通过' || button.btnName == '终止',
					'acceptRedo': button.btnId == 'acceptRedo' || button.btnName == '受理补正',
					'pass': button.btnId == 'pass' || button.btnName == '审核通过'  || button.btnName == '提交'
				}
			},
			getStateLabel(value) {
				for(let i in this.stateList) {
					if(this.stateList[i].value == value) {
						return this.stateList[i].label == "已创建"?"待审核":this.stateList[i].label;
					}
				}
				return value;
			},
			fnQueryData() {
				let param = {
					id: this.taskId,
					pageNumber: 1,
					pageSize: 2
				}
				let url = ''
				if(this.type == 2) {
					url = '/flowgine/listMyTaskDonePage'
				} else if(this.type == 3) {
					url = '/flowgine/listMyTaskSingedTodoPage'
				} else {
					url = '/flowgine/listTaskTodoPage'
				}
				this.$base.post(url, param, data => {
					if(data.list && data.list.length > 0) {
						this.taskInfo = data.list[0]
						this.flowId = this.taskInfo.flowId;
						this.flowNo = this.taskInfo.flowNo;
						this.businessKey = this.taskInfo.businessKey;
						this.flowExt1 = this.taskInfo.flowExt1;
						this.flowExt2 = this.taskInfo.flowExt2;
						this.flowExt3 = this.taskInfo.flowExt3;
						this.flowKey = this.taskInfo.flowKey;
						this.nodeExtension = this.taskInfo.nodeExtension;
						this.title = this.taskInfo.flowName;
						this.date = this.taskInfo.createTime;
						this.taskName = this.taskInfo.taskName;
						this.taskState = this.taskInfo.taskState;
						
						this.fnInit()
						this.getFileList();
						this.fnQueryTaskDetail();
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到办件信息！',
						})
					}
				})
			},
			fnInit(){
				let param = {
					taskId: this.taskId
				}
				this.$base.post('/flowgine/initTaskPage', param, data => {
					this.serviceList = data;
					if(!this.serviceList.flowFormVo || !this.serviceList.flowFormVo.menuUrl) {
						if(this.type != 2) {
							Dialog.alert({
								title: '提示',
								message: '未获取到移动端办理地址！',
							})
						}
						return
					}
					let menuUrl = this.serviceList.flowFormVo.menuUrl
					this.fnGetTicket(menuUrl)
					
					this.buttonList = this.serviceList.flowginePermissions.map(item => {
						const button = JSON.parse(item.moreInfo)
						button.displayButtons = JSON.parse(button.displayButtons)
						button.hideButtons = JSON.parse(button.hideButtons)
						button.display = button.display === '1'
						button.orderNo = button.orderNo ? button.orderNo : 0
						return button
					});
					this.buttonList.sort((a,b) => { return (a.orderNo - b.orderNo) })
				})
				window.riskValidParameter = this.riskValidParameter
			},
			fnGetTicket(menuUrl) {
				let paramJson = {}
				paramJson.taskId = this.taskId
				paramJson.flowId = this.taskInfo.flowId
				paramJson.projectNo = this.taskInfo.flowNo
				paramJson.taskBasicCode = this.taskInfo.flowKey
				paramJson.channelType = this.taskInfo.flowExt6
				paramJson.applyerNo = this.taskInfo.businessKey
				paramJson.applyerName = this.taskInfo.flowExt1
				paramJson.applyerPageCode = this.taskInfo.flowExt2
				paramJson.lackState = this.taskInfo.flowExt5
				if(this.taskInfo.nodeExtension){
					paramJson = {...paramJson, ...JSON.parse(this.taskInfo.nodeExtension)}
				}
				let param = {
					'taskId': this.taskId
				}
				this.$base.post('/h5/getOsaTicket', param, data => {
					if(!data.data){
						Dialog.alert({
							title: '提示',
							message: '初始化页面失败',
						})
						return;
					}
					paramJson.ticket = data.data
					let acceptJson = encodeURIComponent(this.$base.sm4Encrypt(JSON.stringify(paramJson)))
					if(menuUrl.indexOf("?") != -1) {
						menuUrl = menuUrl + '&acceptJson=' + acceptJson;
					} else {
						menuUrl = menuUrl + '?acceptJson=' + acceptJson;
					}
					if (!menuUrl.indexOf('_modulePartId_') == -1) {
						this.iframeUrl += '&_modulePartId_='+ new Date().getTime()
					} else {
						this.iframeUrl = menuUrl
					}
					this.$nextTick(() => {
						this.getIframeHeight();
					})
				})
			},
			fnQueryTaskDetail() {
				let param = {
					'flowId': this.flowId
				}
				this.$base.post('/flowgine/listTaskByFlowId',param, data => {
					if(data.resultSet.length == 0){
						return;
					}
					this.noData = false
					this.wholeList = []
					this.allStep = data.resultSet;
					this.allStep = this.allStep.sort(this.compare);
				})
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
			},
			
			// 风控参数获取
			riskValidParameter () {
			  const param = {}
			  return param
			},
			
			getFileList(){
				let param = {
					projectNo: this.flowNo
				}
				this.$base.post('/bmc/queryDigitalMaterial', param, res => {
					this.fileList = res.bmcFilesVos;
					this.materialList = res.bmcMaterialVos;
					this.fileList.forEach(item => {
						this.materialList.forEach(key => {
							if(item.materialId == key.materialId){
								if(!key.list) {
									key.list = []
								}
								key.list.push({
									url:`${this.preViewUrl}?stogId=${item.stogId}&fileSufx=${item.fileSufx}`,
									name: key.materialName,
									type:item.fileSufx.slice(1)
								});
							}
						})
						console.log("this.materialList", this.materialLists)
					})
				})
			},
			
			//获取iframe高度
			getIframeHeight() {
				this.iframeIsLoad = true
				const iframe = this.$refs.iframePage.contentWindow
				terminalUtil._getIframeHeight(iframe)
				setTimeout(() => {
					const iframe = this.$refs.iframePage.contentWindow
					terminalUtil._getIframeHeight(iframe)
				}, 300)
				setTimeout(() => {
					const iframe = this.$refs.iframePage.contentWindow
					terminalUtil._getIframeHeight(iframe)
				}, 500)
			},
			
			// //设置iframe高度
			setIframeHeight(height) {
				this.iframeHeight = height;
			},
			
			fnFunction(button) {
				this.btnId = button.btnId
				if (button.systemBtn === '1') {
					this.localFunction(button)
				} else {
					this.remoteFunction(button)
				}
				this.showBtn = false;
			},
			fnCallBackFun(result) { // code为'1'表示调用成功
			    if (!result) return
			    if (result.resultCode === '1') {
					Dialog.alert({
						title: '提示',
						message: '操作成功',
					})
			        const button = this.buttonList.find(button => this.btnId === button.btnId)
			        button.displayButtons.forEach(item => {
						const button = this.buttonList.find(button => item === button.btnId)
						if (button) this.$set(button, 'display', true)
			        })
			        button.hideButtons.forEach(item => {
						const button = this.buttonList.find(button => item === button.btnId)
						if (button) this.$set(button, 'display', false)
			        })
			    } else {
					Dialog.alert({
						title: '提示',
						message: '操作失败',
					})
				}
				try {
					uni.hideLoading();
				} catch(e) {}
				
			},
			remoteFunction(button) {
				PostMessageUtil.initRisk(this, this.remoteFunction, button) // 风控初始化
				window.fnCallBackFun = this.fnCallBackFun
				const frameWindow = document.getElementById('form-iframe').contentWindow
				if (button.isRiskControl === '1' && !PostMessageUtil.riskValidLocal(this.flowNo, this.taskId, button.riskRule)) {
					return
				}
				setTimeout(()=> {
					uni.showLoading({
						mask: true,
						title: '加载中...'
					});
				}, 30000)
				PostMessageUtil.sendMessage(frameWindow, button.functionName, null, 'fnCallBackFun')
			},
			localFunction(button) {
				eval('this.' + button.btnId + '()') 
			},
			acceptRedo(){
				this.showReason = true
				this.showMaterial = true
			},
			reasonHandleOk() {
				if (!this.reason) {
					Dialog.confirm({
						title: '提示',
						message: '请输入退回受理原因！',
					})
				    return
				}
				if (!this.materials || this.materials.length == 0) {
					Dialog.confirm({
						title: '提示',
						message: '请选择需要补正的材料！',
					})
				    return
				}
				let param = {
					id: this.taskInfo.id,
					flowId: this.taskInfo.flowId,
					taskId: this.taskInfo.id,
					reason: this.reason,
					materialCodes: JSON.stringify(this.materials)
				}
				this.$base.post('/flowgine/acceptRedo', param, data => {
					this.showReason = false
					this.showMaterial = false
					this.fnCallBackFun({resultCode: '1'})
				}, (err)=>{
					this.fnCallBackFun({resultCode: '0'})
				})
			},
			completeTask(){
				let param = {
					id: this.taskId,
					flowId: this.flowId
				}
				this.$base.post('/flowgine/completeTask', param, data => {
					this.fnCallBackFun({resultCode: '1'})
				}, (err)=>{
					this.fnCallBackFun({resultCode: '0'})
				})
			},
			revokeTask(){
				this.revokeVisible = true
			},
			revokeHandleOk(){
				let param = {
					taskId: this.taskId,
					comment: this.reason
				}
				this.$base.post('/flowgine/revokeTask', param, data => {
					this.revokeVisible = false
					this.fnCallBackFun({resultCode: '1'})
				}, (err)=>{
					this.fnCallBackFun({resultCode: '0'})
				})
			},
			cancelFlow(){
				let param = {
					flowId: this.flowId,
					reason: this.reason
				}
				this.$base.post('/flowgine/cancelFlow', param, data => {
					this.fnCallBackFun({resultCode: '1'})
				}, (err)=>{
					this.fnCallBackFun({resultCode: '0'})
				})
			},
			
			preImg(item){
				let previewImg = [];
				if(!item.url.startsWith("http")) {
					let prefix = window.location.href.split("template")[0];
					if(item.url.startsWith("/")) {
						prefix = prefix.substring(0, prefix.length-1)
					}
					previewImg.push(prefix + item.url);
				} else {
					previewImg.push(item.url);
				}
				
				uni.previewImage({
					urls: previewImg,
					current: 0,
				})
				this.showPopup = false;
			},
			
			onChange(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.van-step--vertical:not(:last-child)::after {
		border: 0;
	}
	
	/deep/.van-field--min-height .van-field__control{
		height: 294rpx;
	}
	
	.pageInfo{
		.serviceBox{
			padding: 30rpx 32rpx;
			.title{
				display: flex;
				align-items: center;
				.icon{
					width: 6rpx;
					height: 32rpx;
					background-color: #1492FF;
				}
				
				.titleName{
					margin-left: 6rpx;
				}
			}
			
			.date{
				font-size: 24rpx;
				color: #666;
			}
			
			.titleBlock{
				padding-bottom: 30rpx;
				width: 100%;
				border-bottom: 0.6rpx solid #E6E6E6;
			}
			
			.serviceList{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 30rpx;
				font-size: 28rpx;
				color: #666;
				.tips{
					font-size: 24rpx;
					color: #999;
					margin-top: 8rpx;
				}
			}
			
			.showBorder{
				padding-bottom: 30rpx;
				border-bottom: 0.6rpx solid #E6E6E6;
			}
			
			.btnBox{
				display: flex;
				align-items: center;
				.leftBtn{
					width: 212rpx;
					height: 96rpx;
					line-height: 96rpx;
					text-align: center;
					background: #FFFFFF;
					border-radius: 12rpx;
					border: 2rpx solid #999999;
				}
				
				.rightBtn{
					margin-left: 24rpx;
					width: 464rpx;
					height: 96rpx;
					line-height: 96rpx;
					text-align: center;
					background: #1492FF;
					border-radius: 12rpx;
					border: 2rpx solid rgba(0,0,0,0);
					color: #FFF;
				}
			}
			
			.bottom-btn {
			  width: 184rpx;
			  height: 64rpx;
			  border-radius: 4rpx;
			  margin: 12rpx 0;
			  margin-right: 32rpx;
			  font-size: 24rpx;
			}
		}
		
		.isFlex{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		.spaceGray{
			width: 100%;
			height: 16rpx;
			background-color: #F3F5F9;
		}
		
		.btnBox{
			width: 100%;
			background-color: #F3F5F9;
			display: flex;
			justify-content: center;
			padding-bottom: 24rpx;
			.checkBtn{
				width: 686rpx;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				background: #1492FF;
				opacity: 1;
				border: 1px solid rgba(0,0,0,0);
				color: #FFF;
				border-radius: 8rpx;
			}
		}
		
		.innerPopup{
			width: 686rpx;
			min-height: 600rpx;
			background-color: #FFF;
			position: relative;
			.closeIcon{
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: 50%;
				color: #FFF;
				background-color: #999999;
				text-align: center;
				font-size: 24rpx;
				position: absolute;
				right: 40rpx;
				top: 20rpx;
			}
			
			.title{
				text-align: center;
				color: #333333;
				font-weight: bold;
				padding-top: 20rpx;
				margin-bottom: 38rpx;
			}
			
			.fileList{
				padding: 0 32rpx;
				margin-bottom: 12rpx;
				.imgTitle{
					font-size: 28rpx;
					color: #333333;
					margin-bottom: 24rpx;
				}
				
				.img{
					width: 616rpx;
					height: 334rpx;
					background-color: #EFEFEF;
					position: relative;
					img{
						width: 100%;
						height: 100%;
					}
					
					.typeIcon{
						width: 88rpx;
						height: 88rpx;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
					
					.pdf{
						background: url('../../static/common/image/pdf.png') no-repeat center;
						background-size: 100% 100%;
					}
					
					.word{
						background: url('../../static/common/image/word.png') no-repeat center;
						background-size: 100% 100%;
					}
					
					.xml{
						background: url('../../static/common/image/xml.png') no-repeat center;
						background-size: 100% 100%;
					}
				}
			}
			
			.closePopup{
				color: #1492FF;
				text-align: center;
				margin-top: 84rpx;
				margin-bottom: 36rpx;
			}
		}
	}
	.showDialog{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 32rpx;
		
		.title{
			font-size: 36rpx;
			text-align: center;
			margin-bottom: 12rpx;
		}
		.dialog{
			text-align: center;
			margin: 24rpx;
		}
		
		.post{
			margin-bottom: 12rpx;
		}
		
		.showLine{
			border-top: 1px solid #f0f0f0;
		}
		
		.showDialogBtnBox{
			position: absolute;
			bottom: 20rpx;
			padding-left: 12rpx;
			display: flex;
		}
	}

	.title_text {
		font-size: 32rpx;
		color: #333;
		font-family: 'pingFangSC-Medium';
		text-align: left;
		margin-bottom: 24rpx;
		position: relative;
		padding-top: 28rpx;
	}
	
	.showPopupBtn{
		width: 100%;
		height: 648rpx;
		padding: 32rpx;
		background-color: #FFF;
		.title{
			font-size: 36rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 36rpx;
		}
		
		.typeBtnBox{
			display: flex;
			flex-flow: row wrap;
			.typeBtn{
				width: 324rpx;
				height: 244rpx;
				background-color: #F8F8F8;
				border-radius: 16rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-right: 40rpx;
				margin-bottom: 36rpx;
				
				.icon{
					width: 68rpx;
					height: 68rpx;
					margin-bottom: 24rpx;
					margin-top: 54rpx;
					background: url('../../static/common/image/base.png') no-repeat center;
					background-size: 100% 100%;
				}
				
				.back{
					background: url('../../static/common/image/back.png') no-repeat center;
					background-size: 100% 100%;
				}
				
				.unpass{
					background: url('../../static/common/image/unpass_logo.png') no-repeat center;
					background-size: 100% 100%;
				}
				
				.acceptRedo{
					background: url('../../static/common/image/slbz.png') no-repeat center;
					background-size: 100% 100%;
				}
				
				.pass{
					background: url('../../static/common/image/pass_logo.png') no-repeat center;
					background-size: 100% 100%;
				}
				
				.word{
					color: #333;
					text-align: center;
				}
			}
			
			.active{
				border: 4rpx solid #1492FF;
			}
		}
		
	}
</style>