<template>
	<view class="uplaod">
		<!--第三步材料上传-->
		<!--上传组件-->
		<view class="main" v-show="showUpload">
			<view class="pageTitle">
				<view class="icon"><van-icon name="arrow-left" @click="backPage" /></view>
				<view class="title">材料上传</view>
			</view>
			<view class="item" style="width: 100%;height: 100%;">
				<mini-upload :fileList="fileList" :cardCode="cardCode" :taskBasicGuid="taskBasicGuid" :moreInfo="moreInfo"
					:readOnly="pageEcho == '1' || perfectState == '1'" :materialCode="materialCode"
					:projectNo="projectNo" :isRequired="required" :name="this.materialName" :totalNumber="totalNumber"
					:maxIndex="maxIndex" :shareParam="shareParam" @max-change="maxIndex=$event"
					@change="imgChange" @fnBack="backPage"></mini-upload>
			</view>
		</view>
		<!--上传列表-->
		<view class="main2">
      <box-title title="材料上传"/>
			<view class="none-data" v-show="!returnCount">
				------无可上传材料------
			</view>
			<view class="uploadCell" v-show="returnCount">
				<view v-for="(item, index) in lsMaterialList" :key="index">
					<view class="uploadBox">
						<view class="titleBox" style="display: flex;justify-content: space-between;">
							<view style="display: flex;max-width: 80%;">
								<view class="icon"></view>
								<view class="title">{{item.materialName+'（'+getTotalNum(item)+'）'}}</view>
							</view>
							<view>
								<view style="font-size: 24rpx;padding: 4rpx 6rpx;"
									:style="{color: item.required == 1?'#f5222d': '#52c41a', border: item.required == 1?'solid 1px #f5222d': 'solid 1px #52c41a'}">
									{{getRequireLabel(item.required)}}
								</view>
							</view>
						</view>
						<view class="clickBox">
							<view class="innerBox">
								<view class="icon downloadIcon"></view>
								<view class="text">模板下载</view>
							</view>
							<view class="innerBox" style="background-color: #edf5ff;" @click="uploadPage(item)">
								<view class="icon uploadIcon"></view>
								<view class="text" style="color: #1b7af7;" v-show="item.list.length == 0">上传</view>
								<view class="text" style="color: #1b7af7;" v-show="item.list.length > 0">已上传</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			// 自动上传的材料信息，materialsCode材料编号，list材料信息
			materialData: {
				type: Object,
				default: function() {
					return {};
				},
			},
			shareParam: {
				type: Object,
				default: function() {
					return {};
				},
			},
			projectNo: { // 业务受理号
				type: String,
				required: false
			},
			handleItemCode: { // 办理项编号
				type: String,
				required: false
			},
			materialList: { // 材料列表
				type: Array,
				default: function() {
					return []
				}
			},
			taskBasicGuid: {
				type: String,
				required: false
			},
			isFromWeb: {
				type: Boolean,
				default: false
			},
			pageEcho: {
				type: String,
				default: '0'
			},
			cardCode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fileList: [],
				totalNumber: 0,
				lsMaterialList: [],
				showUpload: false, // 是否显示材料上传
				materialName: '', // 上传材料名称
				required: '0',
				materialCode: '', // 材料id 用于判断上传的是哪个材料
				perfectState: '0', //材料完善状态（0-不完善；1-完善）
				returnCount: true,
				requireTypes: [],
				maxIndex: 1,
				moreInfo: {},
			};
		},
		watch: {
			materialList: {
				deep: true,
				handler: function(newVal, oldVal) {
					if (newVal.length) {
						// 修改
						let list = JSON.parse(JSON.stringify(this.materialList));
						let fileItem = null
						list.forEach((item) => {
							if (!item.list) {
								item.list = []
							}
							if (item.moreInfo) {
								let moreInfo = JSON.parse(item.moreInfo)
								item.archiveMinPage = moreInfo.archiveMinPage ? moreInfo.archiveMinPage : 0
							}
							if (this.materialCode && this.materialCode == item.materialCode) {
								fileItem = item
							}
						})
						this.lsMaterialList = [...list]
						if (fileItem) {
							this.uploadPage(fileItem)
						}
						this.$emit('handleBack', this.lsMaterialList)
					}
				}
			},
			materialData: {
				deep: true,
				handler: function(newVal, oldVal) {
					if (newVal.materialsCode) {
						let params = {
							projectNo: this.projectNo,
							handleItemCode: this.handleItemCode,
							materialStr: JSON.stringify(this.lsMaterialList)
						}
						this.$base.post('/material/updateMaterial', params, res => {
							this.uploadMaterial()
							this.fnQuerymaterial()
						}, null, false)
					}
				}
			}
		},
		components: {

		},
		mounted() {
			let list = JSON.parse(JSON.stringify(this.materialList))
			list.forEach((item) => {
				if (!item.list) {
					item.list = []
				}
				if (item.moreInfo) {
					let moreInfo = JSON.parse(item.moreInfo)
					item.archiveMinPage = moreInfo.archiveMinPage ? moreInfo.archiveMinPage : 0
				}
			})
			this.lsMaterialList = [...list]
			this.$emit('handleBack', this.lsMaterialList)
			this.$dict.getDictListNoCatch('SSM_MATERIAL_REQUIRE_TYPE', (res) => {
				this.requireTypes = res;
			});
		},
		methods: {
			getTotalNum(row) {
				let total = 0;
				if (row.originalPageNum) {
					total = total + Number(row.originalPageNum)
				}
				if (row.copyPageNum) {
					total = total + Number(row.copyPageNum)
				}
				if (total == 0) {
					return "--";
				}
				return row.list.length + "/" + total;
			},
			getRequireLabel(value) {
				if (this.requireTypes.length > 0) {
					for (let i in this.requireTypes) {
						if (this.requireTypes[i].value == value) {
							return this.requireTypes[i].label
						}
					}
				}
				return value;
			},
			imgChange(list) { // 返回图片
				this.lsMaterialList.forEach((item) => {
					if (item.materialCode == this.materialCode) {
						item.list = []
						if (list.length > 0) {
							list.forEach((file, index) => {
								item.list.push({
									fileSufx: file.fileSufx,
									stogId: file.stogId,
									fileId: file.fileId,
									fileName: file.fileName,
									base64: file.base64,
									fileNum: index + 1
								})
							})
						}
					}
				})

				if (this.isFromWeb) {
					this.fnFromWeb(this.lsMaterialList);
				}
			},

			//通过网厅扫码进入
			fnFromWeb(list) {
				let params = {
					projectNo: this.projectNo,
					handleItemCode: this.handleItemCode,
					materialStr: JSON.stringify(list)
				}
				this.$base.post('/material/updateMaterial', params, res => {}, null, false)
			},

			uploadPage(item) { //显示材料上传
				this.materialCode = item.materialCode // 材料类型id
				this.materialName = item.materialName // 上传材料名称
				// this.perfectState = item.perfectState
				if (item.perfectState === undefined) {
					this.perfectState = '0'
				} else {
					if (item.perfectState != '0') {
						this.perfectState = '1'
					} else {
						this.perfectState = '0'
					}
				}
				this.fileList = JSON.parse(JSON.stringify(item.list)) // 材料列表
				this.required = item.required
				this.totalNumber = 0;
				if (item.originalPageNum) {
					this.totalNumber = this.totalNumber + Number(item.originalPageNum)
				}
				if (item.copyPageNum) {
					this.totalNumber = this.totalNumber + Number(item.copyPageNum)
				}
				if (item.moreInfo) {
					this.moreInfo = JSON.parse(item.moreInfo)
          this.moreInfo.reusable = item.reusable
				} else {
					this.moreInfo = {}
				}
				this.showUpload = true // 显示上传材料组件
			},
			backPage() { // 返回操作
				this.showUpload = false // 关闭上传材料组件
				this.$emit('handleBack', this.lsMaterialList)
			},
			//查看材料是否上传变更
			fnQuerymaterial() {
			    let param = {
			        projectNo: this.projectNo,
			        handleItemCode: this.handleItemCode,
			    };
				this.$base.post('/material/getMaterialList', param, res => {
					uni.hideLoading()
				}, null, false)
			},
			//更新材料缓存
			uploadMaterial() {
				this.lsMaterialList.forEach((item) => {
					if (item.materialCode == this.materialData.materialsCode) {
						item.list = []
						if (this.materialData?.list.length > 0) {
							this.materialData.list.forEach((file, index) => {
								item.list.push({
									fileSufx: file.fileSufx,
									stogId: file.stogId,
									fileId: file.fileId,
									fileName: file.fileName,
									base64: file.base64,
									fileNum: index + 1
								})
							})
						}
					}
				})
				this.fnFromWeb(this.lsMaterialList);
			},
		},
		onLoad(options) {

		}
	};
</script>
<style lang="scss" scoped>
	page {
		background-color: #f5f7fa;
	}

	.uplaod {
		width: 100%;
		height: 100%;
	}

	.main {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		background: #f5f7fa;

		.pageTitle {
			width: 100%;
			height: 88rpx;
			margin-bottom: 32rpx;
			background-color: #1492FF;
			color: #fff;
			display: flex;
			align-items: center;

			.icon {
				padding-top: 12rpx;
				margin-left: 12rpx;
			}

			.title {
				margin-left: 270rpx;
			}
		}
	}

	.main2 {
    background-color: #ffffff;

    .title_box {
			display: flex;
			align-items: center;

			.title_style {
				width: 6rpx;
				height: 32rpx;
				border-radius: 6rpx;
				background-color: #3883ff;
				margin-right: 12rpx;
			}

			.title_text {
				font-size: 32rpx;
				color: #005fe2;
				height: 32rpx;
				line-height: 32rpx;
				font-weight: 500;
			}
		}
	}

	.main-body {
		padding: 37rpx;
		padding-top: 140rpx;
		padding-bottom: 0;
	}

	.main-top {
		height: 92rpx;
		line-height: 92rpx;
		text-align: center;
		border-bottom: 2rpx solid whitesmoke;
		padding-left: 30rpx;
	}

	.topBtn {
		height: 54rpx;
		line-height: 54rpx;
		font-size: 14px;
		margin-top: 19rpx;
		margin-right: 14rpx;
	}

	.checkBtn {
		float: right;
		background: #1989fa;
		color: #fff;
	}

	.backBtn {
		float: right;
		background: grey;
		color: #fff;
	}

	.data-title {
		display: inline-block;
		float: left;
		width: 550rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
	}

	.data-type {
		height: 90rpx;
		line-height: 90rpx;
		color: #1989fa;
		font-size: 28rpx;
		padding-left: 30rpx;
	}

	.data-dz {
		width: 44%;
		height: 210rpx;
		line-height: 210rpx;
		text-align: center;
		margin-left: 30rpx;
		/*border: 4rpx solid whitesmoke;*/
	}

	.data-dz>img {
		width: 100%;
		height: 100%;
	}

	.dz-title {
		height: 90rpx;
		line-height: 90rpx;
		color: #999999;
		font-size: 28rpx;
		padding-left: 30rpx;
	}

	.common-p {
		font-family: PingFang SC;
		font-size: 30rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 84rpx;
		letter-spacing: 0px;
		padding-left: 30rpx;
		color: #999999;
	}

	.uploadCell {
		background-color: #fff;
		border-radius: 10px;
    padding: 0 18rpx;
    margin-top: 24rpx;

		.uploadBox {
			background-color: #fff;
			padding:  0 0 32rpx 0;
			border-radius: 10px;

			.titleBox {
				display: flex;
				align-items: center;

				.icon {
					width: 36rpx;
					height: 36rpx;
					background: url('../mini-upload/images/icon.png') no-repeat;
					background-size: 100% 100%;
				}

				.title {
					font-size: 32rpx;
					color: "#333333";
					font-family: 'PingFangSC-Medium';
					margin: 0 5px;
				}
			}

			.clickBox {
				display: flex;
				justify-content: space-between;

				.innerBox {
					margin-top: 40rpx;
					width: 296rpx;
					height: 76rpx;
					border-radius: 8rpx;
					background-color: #f3f5f7;
					display: flex;
					align-items: center;
					justify-content: center;
					box-sizing: border-box;

					.icon {
						width: 28rpx;
						height: 30rpx;
					}

					.downloadIcon {
						background: url('../mini-upload/images/download.png') no-repeat;
						background-size: 100% 100%;
					}

					.uploadIcon {
						background: url('../mini-upload/images/upload.png') no-repeat;
						background-size: 100% 100%;
					}

					.text {
						color: "#666666";
						font-size: 28rpx;
						margin-left: 20rpx;
						line-height: 30rpx;
						font-family: 'PingFangSC-Medium';
					}
				}
			}
		}
	}
</style>
