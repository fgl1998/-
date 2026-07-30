<template>
	<view>
		<view style="margin-bottom: 10rpx;background-color: #ddffff!important;
				padding: 14px;
				border-left: 6px solid #ccc!important;
				border-color: #2196F3!important">
			企业人员参保登记材料上传
		</view>
		<van-row style="height: 780px;">
			<van-col span="4">
				<van-sidebar v-model="activeKey" @change="onChange">
					<van-sidebar-item class="sidebar" :title="item.uploadName" v-for="(item, index) in uploadList">
					</van-sidebar-item>
				</van-sidebar>
			</van-col>
			<van-col span="18">
				<mini-batchUpload :upload-name="uploadName" style="float: right;margin-left: 10rpx"></mini-batchUpload>
			</van-col>
		</van-row>
		<van-button type="info" style="width: 100%;">提交</van-button>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				activeKey: 0,
				uploadList: [{
					uploadName: '就失业信息'
				}, {
					uploadName: '用工合同'
				}
				],
				uploadName: '就失业信息'
			}
		},
		methods: {
			onChange(index) {
				this.uploadName = this.uploadList[index].uploadName
			}
		}

	}
</script>
<style>
	.sidebar {
		border-color: gray;
		border-width-base: 1px;
		border-radius-sm: 2px;
		border-radius-md: 4px;
		border-radius-lg: 8px;
		border-radius-max: 999px;
	}
</style>