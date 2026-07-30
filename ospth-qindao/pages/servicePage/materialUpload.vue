<template>
	<view class="uploadPage">
		<h-navbar title="材料补正" v-if="type == '1'" :border-bottom="false" title-color="#fff" back-icon-color="#fff"
			:background="{ background: '#1492ff' }" zIndex='999'></h-navbar>
		<view class="innerPage">
			<view class="ant-alert-with-description">
				<span class="ant-alert-message">补正原因：</span>
				<view class="ant-alert-description">{{bzComment}}</view>
			</view>
			<view class="uploadBox">
				<upload :materialList="materialList" :taskBasicGuid="taskBasicGuid" :projectNo="projectNo" :pageEcho="state == '10'?'0':'1'" @handleBack="handleBack" :isFromWeb='false'></upload>
			</view>
			<view class="btnBox">
				<view class="setBtn">
					<van-button class='btnStyle' type="info" @click="fnToSave()" :disabled="isDisabled">完成补正</van-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '@/components/upload-last/upload-last.vue';
	import { Dialog } from 'vant';
	export default {
		components:{
			upload
		},
		data() {
			return {
				materialList: [],
				count: 0,
				initTimer: null,
				projectNo: '',
				taskBasicCode: '',
				taskBasicGuid: "",
				materialVos: [],
				bzMaterialVos: [],
				isDisabled: false,
				flowId: '',
				bzComment: '',
				state: '',
				type: '1'
			}
		},
		onLoad(option) {
			this.projectNo = option.projectNo
			this.taskBasicCode = option.taskBasicCode
			this.state = option.state
			this.flowId = option.flowId
			if(option.type) {
				this.type = option.type
			}
			if(this.state != "10") {
				Dialog.alert({
					title: '提示',
					message: '当前业务暂不可补正！'
				})
				this.isDisabled = true
			}
			this.queryTaskBasicGuid()
			this.queryAllMaterials()
			this.getProcess()
		},
		onShow(){

		},
		methods: {
			getProcess() {
				if(!this.flowId) {
					return
				}
				this.bzComment = '无'
				let param = {
					'flowId': this.flowId
				}
				this.$base.post('/flowgine/listTaskByFlowId',param, data => {
					if(data.resultSet.length == 0){
						Dialog.alert({
							title: '提示',
							message: '暂无进度'
						})
						return;
					}
					let allStep = data.resultSet;
					allStep.forEach((item)=>{
						if(item.taskState == '8') {
							this.bzComment = item.comment || '无'
						}
					})
				})
			},
			queryTaskBasicGuid() {
				let param = {
					taskBasicCode: this.taskBasicCode,
				};
	
				this.$base.post("/ssm/queryTaskBasicGuid", param, (res) => {
					this.taskBasicGuid = res.taskBasicGuid;
				});
			},
			queryAllMaterials() {
				let param = {
					taskBasicCode: this.taskBasicCode
				}
				this.$base.post("/ssm/queryTaskBasicMaterials", param, (res)=> {
					if(res.resultSet && res.resultSet.length > 0) {
						this.materialVos = res.resultSet
						this.queryMaterialByProjectNo()
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到材料信息！'
						})
					}
				})
			},
			queryMaterialByProjectNo() {
				let param = {
					projectNo: this.projectNo
				}
				this.$base.post("/osa/queryMaterialListByProjectNo", param, (res)=> {
					if(res.resultSet && res.resultSet.length > 0) {
						this.bzMaterialVos = res.resultSet
						this.queryMaterials()
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到材料信息！'
						})
					}
				})
			},
			queryMaterials() {
				let param = {
                    projectNo: this.projectNo,
					taskBasicCode: this.taskBasicCode
				}
				this.$base.post("/bmc/queryDigitalMaterial", param, (res)=> {
					if(res.bmcMaterialVos && res.bmcMaterialVos.length > 0) {
						let bmcMaterialVos = res.bmcMaterialVos
						let bmcFilesVos = res.bmcFilesVos
						for(let i in bmcMaterialVos) {
							for(let j in this.materialVos) {
								if(bmcMaterialVos[i].materialCode.trim() == this.materialVos[j].materialCode.trim()) {
									let material = this.materialVos[j]
									material.list = this.getFiles(bmcFilesVos, bmcMaterialVos[i].materialCode)
									this.materialList.push(material)
									break
								}
							}
						}
						//遍历，查看哪些需要补正
						for(let i in this.materialList) {
							for(let j in this.bzMaterialVos) {
								if(this.materialList[i].materialCode.trim() == this.bzMaterialVos[j].materialCode.trim()) {
									this.materialList[i].perfectState = this.bzMaterialVos[j].perfectState
									break
								}
							}
						}
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到材料信息！'
						})
					}
				})
			},
			getFiles(bmcFilesVos, materialCode) {
				let list = []
				for(let i in bmcFilesVos) {
					if(bmcFilesVos[i].materialCode == materialCode) {
						let file = bmcFilesVos[i]
						file.index = file.materialVerNo
						list.push(file)
					}
				}
				return list
			},
			fnToSave() {
				let param = {
					projectNo: this.projectNo,
					reason:'材料补正'
				}
				this.$base.post('/flowgine/acceptRedoResumeById', param, res => {
					Dialog.alert({
						title: '提示',
						message: '补正完成'
					})
					this.isDisabled = true;
				})
			},
			handleBack(){

			}
		}
	}
</script>

<style lang="scss" scoped>
.uploadPage{
	.ant-alert-with-description {
		position: relative;
		padding: 30rpx;
		color: #303133;
		line-height: 1.5;
		border-radius: 8rpx;
		background-color: #e6f7ff;
		border: 1px solid #91d5ff;
		box-sizing: border-box;
		font-size: 28rpx;
		word-wrap: break-word;
		.ant-alert-message {
			display: block;
			margin-bottom: 8rpx;
			color: rgba(0, 0, 0, 0.85);
			font-size: 32rpx;
		}
		.ant-alert-description {
			display: block;
			font-size: 28rpx;
			line-height: 44rpx;
		}
	}

	.innerPage{
		padding: 32rpx;
		.titleBox{
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			.icon{
				width: 6rpx;
				height: 30rpx;
				background-color: #1b7af7;
				border-radius: 4rpx;
			}
			.title{
				font-size: 32rpx;
				font-family: PingFangSC-Medium;
				color: #000;
				margin-left: 20rpx;
			}
		}
	}
	.btnBox{
		width: 100%;
		padding-bottom: 12rpx;
		margin-top: 40rpx;
		.setBtn{
			display: flex;
			justify-content: space-evenly;
		}
		.btnStyle{
			width: 100%;
			margin-top: 24rpx;
		}
	}
}
</style>
