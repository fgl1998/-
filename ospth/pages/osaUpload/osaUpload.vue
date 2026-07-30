<template>
	<view class="uploadPage">
		<h-navbar title="材料上传" :border-bottom="false" title-color="#fff" back-icon-color="#fff"
			:background="{ background: '#4092ff' }" :isBack='false' back-icon-name='arrow-left' back-icon-size="22" zIndex='999'></h-navbar>
		<view class="innerPage">
			<view class="uploadBox">
				<upload :materialList="materialVos" :projectNo="projectNo" :handleItemCode='taskBasicCode' @handleBack="handleBack" :isFromWeb='true'></upload>
			</view>
		</view>
	</view>
</template>

<script>
	import upload from '@/components/upload-last/upload-last.vue';
	export default {
		components:{
			upload
		},
		data() {
			return {
				materialVos: [],
				count: 0,
				initTimer: null,
				projectNo: '',
				taskBasicCode: '',
				sceneCode: ''
			}
		},
		onLoad(option) {
			this.projectNo = option.projectNo;
			this.taskBasicCode = option.taskBasicCode;
			this.sceneCode = option.sceneCode;
			this.getMaterialList()
		},
		methods: {
			//获取资料列表
			getMaterialList(){
				let param = {
					taskBasicCode: this.taskBasicCode
				}
				this.$base.post("/ssm/queryTaskBasicMaterials", param, (res)=> {
					let list = res.resultSet
					if(list && list.length > 0) {
						this.materialVos = []
						list.forEach((item)=>{
							if(this.sceneCode.indexOf(item.sceneCode) != -1 || item.sceneCode == "S0000") {
								this.materialVos.push(item)
							}
						})
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到材料信息！'
						})
					}
				})                   
			},
			handleBack(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.uploadPage{
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
}
</style>
