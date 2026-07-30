<template>
	<view class="uploadPage">
		<h-navbar title="材料上传" :border-bottom="false" title-color="#fff" back-icon-color="#fff"
			:background="{ background: '#4092ff' }" :isBack='false' back-icon-name='arrow-left' back-icon-size="22" zIndex='999'></h-navbar>
		<view class="innerPage">
			<view class="uploadBox">
				<upload :materialList="materialList" :cardCode="cardCode" :taskBasicGuid="taskBasicGuid" :projectNo="projectNo" :handleItemCode='handleItemCode' @handleBack="handleBack" :isFromWeb='true'></upload>
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
				oldMaterialList: [],
				materialList: [],
				count: 0,
				initTimer: null,
				projectNo: '',
				taskBasicGuid: '',
				handleItemCode: '',
				cardCode: ''
			}
		},
		onLoad(option) {
			this.projectNo = option.projectNo;
			this.handleItemCode = option.handleItemCode;
			this.taskBasicGuid = option.taskBasicGuid;
			this.cardCode = option.cardCode;
		},
		onShow(){
			this.fnSearch();
		},
		methods: {
			//轮询查询
			fnSearch(){
				if(this.count >= 300) {
					this.materialList = [];
					this.oldMaterialList = [];
					return
				}
				this.initTimer = setTimeout(() => {
					this.count++;
					this.fnSearchUploadList();
				}, 3000);
			},
			
			//获取资料列表
			fnSearchUploadList(){
				let params = {
					projectNo: this.projectNo,
					handleItemCode: this.handleItemCode
				}
				this.$base.post('/material/getMaterialList', params, res=>{
					let list = res.resultSet
					if(list) {
						if(JSON.stringify(list) != JSON.stringify(this.oldMaterialList)) {
							this.materialList = list;
							this.oldMaterialList = list;
						}
					} else {
						this.materialList = [];
						this.oldMaterialList = [];
					}
					this.fnSearch()
				},null,false)                     
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
