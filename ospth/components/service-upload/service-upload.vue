<template>
	<view class="service-upload">
		<template v-if="materailList.length">
			<view class="upload-item" v-for="(item, index) in materailList" :key="item.yap521">
				<view class="item-top">
					<view class="title"><text style="color: red;" v-if="item.yap524 === '1'">*</text>{{ item.yap521 }}
						<view class="tips">上传要求：{{formatRequirement(item)}}</view>
						<view class="tips">是否必需：{{item.yap524=='1'?'是':'否'}}</view>
					</view>
					<view class="tip">
						<text>已上传：{{ getFileCount(item) }}/{{ getMaxCount(item) }}个</text>
						<view class="tips">是否已满足上传要求：
							<text v-if="item.satisfied" style="color: #53e653;">是</text>
							<text v-if="!item.satisfied" style="color: red;">否</text>
						</view>
					</view>
				</view>
				<!-- 上传按钮和文件预览区域 -->
				<view class="upload-content">
					<!-- 上传按钮 -->
					<view class="btn" @click="handleUpload(index)" v-if="!yda031&&(getFileCount(item) < getMaxCount(item))">
						<u-icon name="plus" size="40" color="#0882ea"></u-icon>
						<text class="btn-text">上传</text>
					</view>

					<!-- 文件预览区域 -->
					<view class="preview-container">
						<view class="preview-item" v-for="(file, fileIndex) in getFiles(item)" :key="fileIndex">
							<image v-if="isImageFile(file)" class="preview-image" :src="getFileUrl(file)"
								mode="aspectFill" @click="previewFile(index, fileIndex)"></image>
							<view v-else class="file-item" @click="previewFile(index, fileIndex)">
								<text class="preview-file-name">{{ getFileName(file) }}</text>
							</view>
							<u-icon v-if="!yda031" name="trash" class="delete-icon" @click="deleteFile(index, fileIndex)"></u-icon>
						</view>
					</view>
				</view>
			</view>

		</template>
		<u-empty v-else text="无需上传材料" mode="list"></u-empty>
		<!-- 上传提示弹窗 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="info" title="提示" :content="popupContent" :before-close="true"
				@confirm="popupConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopupDialog from '../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopupDialog
		},
		props: {
			yda020: {
				type: String,
				required: true
			},
			yda031: {
				type: String,
				default: ''
			},
			visit: {
				type: Boolean,
				default: false
			},
			accept: {
				type: String,
				default: ".jpg,.jpeg,.png,.gif,.bmp,.webp"
			},
			// 外部传入的材料数据
			externalMaterialData: {
				type: Array,
				default: () => []
			},
			// 兼容原有属性
			uploadList: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				// 原有状态变量
				popupContent: '',
				currentIndex: -1,
				tempFiles: [],
				// 新增状态变量
				materailList: [],
				uploadUrl: this.$base.BASE_URL + '/file/uploadFileByUcm', // 图片上传地址
				previewUrl: this.$base.BASE_URL + '/file/downloadFileByUcm', // 图片预览地址
			}
		},
		created() {},
		watch: {
			yda031: {
				handler(newVal, oldVal) {
					if (!this.externalMaterialData || this.externalMaterialData.length === 0) {
						this.getMaterailList();
					}
				},
				immediate: true,
			},
			yda020: {
				handler(newVal, oldVal) {
					console.log('newVal, oldVal: ', newVal, oldVal);
					if (!this.externalMaterialData || this.externalMaterialData.length === 0) {
						this.getMaterailList();
					}
				},
				immediate: true,
			},
			externalMaterialData: {
				handler(newData) {
					if (newData && newData.length > 0) {
						const processedData = newData.map((item) => {
							if (item.files === undefined) {
								item.files = [];
							}
							if (item.fileList === undefined) {
								item.fileList = [];
							}
							item.total = item.files.length;
							this.extendSatisfied(item);
							return item;
						});
						this.materailList = processedData;
					}
				},
				immediate: true,
				deep: true
			},
			// 兼容原有uploadList属性
			uploadList: {
				handler(newList) {
					if (newList && newList.length > 0) {
						// 将原有格式转换为新格式
						const convertedList = newList.map((item) => {
							return {
								yap521: item.title || '',
								yap524: item.require ? '1' : '0',
								yap529: item.maxCount || 99,
								yap528: 'le',
								files: item.files || [],
								total: (item.files || []).length
							};
						});
						convertedList.forEach(item => {
							this.extendSatisfied(item);
						});
						this.materailList = convertedList;
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			// 填充上传要求字段
			formatRequirement(row) {
				const {
					yap528,
					yap529
				} = row;
				if (!yap529 || yap529 <= 0) {
					return '暂无要求';
				}
				if (yap528) {
					switch (yap528) {
						case 'eq':
							return `必须且只能上传${yap529}个文件`;
						case 'ge':
							return `至少要上传${yap529}个文件`;
						case 'le':
							return `上传文件数不能超过${yap529}个`;
						default:
							return '暂无要求';
					}
				} else {
					return '暂无要求';
				}

			},
			// 获取材料列表
			getMaterailList() {
				if (this.externalMaterialData && this.externalMaterialData.length > 0) {
					return;
				}

				let param = {
					no: "005-0002",
					data: JSON.stringify({
						yda020: this.yda020,
						yda031: this.yda031
					})
				}
				this.$base.post("", param, (res) => {
					if (res.serviceSuccess) {
						res.data.forEach((item) => {
							if (item.files === undefined) {
								item.files = [];
							}
							if (item.fileList === undefined) {
								item.fileList = [];
							}
							item.total = item.files.length;
							this.extendSatisfied(item);
						})
						this.materailList = res.data;
					}
				})
			},
			// 重置组件状态
			reset() {
				this.materailList = [];

				if (this.externalMaterialData && this.externalMaterialData.length > 0) {
					this.$nextTick(() => {
						const processedData = this.externalMaterialData.map((item) => {
							const newItem = {
								...item
							};
							if (newItem.files === undefined) {
								newItem.files = [];
							}
							if (newItem.fileList === undefined) {
								newItem.fileList = [];
							}
							newItem.total = newItem.files.length;
							this.extendSatisfied(newItem);
							return newItem;
						});
						this.materailList = processedData;
					});
				}
			},
			// 为组件数据填充是否已满足上传要求字段
			extendSatisfied(row) {
				const {
					total,
					yap524
				} = row;
				if (yap524 === '0') {
					if (total === 0) {
						row.satisfied = true;
					} else {
						this.formatSatisfied(row);
					}
				} else {
					if (total === 0) {
						row.satisfied = false;
					} else {
						this.formatSatisfied(row);
					}
				}
			},
			formatSatisfied(row) {
				const {
					total,
					yap528,
					yap529
				} = row;
				if (!yap529 || yap529 <= 0) {
					row.satisfied = true;
				} else {
					if (yap528 === 'eq') {
						row.satisfied = (yap529 === total);
					} else if (yap528 === 'ge') {
						row.satisfied = total >= yap529
					} else if (yap528 === 'le') {
						row.satisfied = total <= yap529;
					} else {
						row.satisfied = true;
					}
				}
			},
			// 获取文件数量
			getFileCount(item) {
				return item.files ? item.files.length : 0;
			},
			// 获取最大上传数量
			getMaxCount(item) {
				return item.yap529 || 99;
			},
			// 获取文件列表
			getFiles(item) {
				return item.files || [];
			},
			// 是否图片文件
			isImageFile(file) {
				const name = (file && (file.name || file.fileName)) || '';
				const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
				let flag = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
				return flag
			},
			// 获取文件名称
			getFileName(file) {
				return file.name || file.fileName || '未知文件';
			},
			// 获取文件URL
			getFileUrl(file) {
				let imgUrl = file.url || (file.fileId ? this.previewUrl + '?isFile=false&fileId=' + file.fileId : '');
				// 这里简化处理，实际应该根据后端返回的fileId构建预览URL
				if (!imgUrl) {
					imgUrl = file.url || (file.fileid ? this.previewUrl + '?isFile=false&fileId=' + file.fileid : '');
				}
				// console.log('imgUrl: ',imgUrl);
				return imgUrl
			},
			// 上传
			fnUpLoadImg(file, item) {
				let _this = this;
				uni.showLoading({
					title: '上传中'
				})
				let channelCode = "osp-02-006-app"
				if (!channelCode) {
					channelCode = "osp-02-006-app"
				}
				let obj = {
					"channelCode": channelCode,
					'TERMINAL-JTOKEN': uni.getStorageSync('applet-token') || '',

				}
				uni.uploadFile({
					url: this.uploadUrl, // 图片上传地址,
					file: file,
					name: 'file',
					formData: {},
					header: {
						"channelCode": channelCode,
						'TERMINAL-JTOKEN': uni.getStorageSync('applet-token') || '',
					},
					success(data) {
						try {
							if (data.statusCode == 200) {
								let res = JSON.parse(data.data)
								if (res.code == 200) {
									_this.$message.success('上传成功');
									// 添加新上传的文件到files数组
									item.files.push({
										...res.data,
										name: file.name
									});
									// 更新total和satisfied状态
									item.total = item.files.length;
									_this.extendSatisfied(item);
									console.log('上传后文件总数:', item.total, '是否满足要求:', item.satisfied);
								} else {
									_this.$message.error(message || '上传失败');
									item.fileList = fileList.filter((f) => f.uid !== file.uid);
								}

							}
						} catch (error) {
							//TODO handle the exception
							uni.hideLoading()
							uni.showToast({
								// title: '上传成功',
								title: error,
								icon: 'none',
								duration: 2000
							})
						}
					},
					fail(res) {
						uni.hideLoading()
						uni.showToast({
							// title: '上传成功',
							title: '上传失败',
							icon: 'none',
							duration: 2000
						})
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			// 处理上传
			handleUpload(index) {
				let _this = this
				const item = this.materailList[index];
				this.currentIndex = index;
				if (_this.$base.isApp()) {
					_this.showPopup = true;
				} else {
					uni.chooseFile({
						count: 1, //默认9
						type: 'image',
						extension: this.accept.split(','),
						success: function(res) {
							// 图片
							let type = res.tempFiles[0].type.split('/')[0]
							if (type == 'image') {
								const imgSize = res.tempFiles[0] && res.tempFiles[0].size ? res
									.tempFiles[0]
									.size :
									0;
								const imgName = res.tempFiles[0] && res.tempFiles[0].name ? res
									.tempFiles[0]
									.name :
									'';
								if (res.tempFiles[0].size / 1024 > 1024 * 20) {
									uni.showToast({
										title: '上传图片大小不能超过20M!',
										icon: 'none',
										duration: 2000
									});
									return
								} else {
									_this.fnUpLoadImg(res.tempFiles[0], item);
								}
							} else {
								// _this.fnUpLoadImg(res.tempFiles[0]);
								this.$message.info('暂只支持上传图片')
							}
						}
					});
				}
			},
			// 预览文件
			previewFile(index, fileIndex) {
				const item = this.materailList[index];
				const file = item.files[fileIndex];

				if (this.isImageFile(file)) {
					// 图片预览
					const imageUrls = item.files.filter(f => this.isImageFile(f)).map(f => this.getFileUrl(f));
					const currentIndex = item.files.filter(f => this.isImageFile(f)).findIndex(f => f === file);

					if (currentIndex !== -1) {
						uni.previewImage({
							urls: imageUrls,
							current: currentIndex,
							success: () => {
								console.log('图片预览成功');
							}
						});
					}
				} else {
					// 非图片文件提示下载
					this.popupContent = `确定要下载文件"${file.name}"吗？`;
					this.$refs.popup.open();
					this.tempFiles = [file];
				}
			},
			// 删除文件
			deleteFile(index, fileIndex) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这个文件吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: (res) => {
						if (res.confirm) {
							const item = this.materailList[index];
							item.files.splice(fileIndex, 1);
							item.total = item.files.length;
							this.extendSatisfied(item);

							// 触发删除成功事件
							this.$emit('delete-success', {
								index,
								fileIndex,
								files: item.files
							});

							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			// 弹窗确认
			popupConfirm() {
				this.$refs.popup.close();

				// 如果有临时文件，执行下载
				if (this.tempFiles && this.tempFiles.length > 0) {
					const file = this.tempFiles[0];
					// 这里应该实现文件下载逻辑
					uni.showToast({
						title: '文件下载中...',
						icon: 'loading'
					});
					this.tempFiles = [];
				}
			},


			// 验证整个上传列表
			validateUploadList() {
				const errorFiles = [];
				this.materailList.forEach(item => {
					if (item.status === 'error') {
						errorFiles.push(item.fileName || item.name || '未知文件');
					}
				});

				if (errorFiles.length > 0) {
					this.popupContent = `以下文件上传失败，请重新上传：${errorFiles.join(', ')}`;
					this.$refs.popup.open();
					return false;
				}

				if (this.materailList.length === 0) {
					this.popupContent = '请先上传文件';
					this.$refs.popup.open();
					return false;
				}

				return true;
			},

			// 验证检查
			check() {
				// 原有验证逻辑保留
				for (let i = 0; i < this.materailList.length; i++) {
					const {
						yap524,
						yap521,
						files,
						total,
						satisfied
					} = this.materailList[i];
					const length = files && files.length ? files.length : 0;
					if (yap524 == '1' && length !== total) {
						this.popupContent = `${yap521}文件上传不完整，请检查！`;
						this.$refs.popup.open();
						return false;
					}
					if (!satisfied) {
						this.popupContent = `必传材料：[${yap521}]未满足上传要求！`;
						this.$refs.popup.open();
						return false;
					}
				}

				// 新增验证逻辑
				// if (!this.validateUploadList()) {
				// 	return false;
				// }

				// 检查是否有必填项未上传
				if (this.required && this.materailList.length === 0) {
					this.popupContent = '此项为必填项，请上传文件';
					this.$refs.popup.open();
					return false;
				}

				// 移除不必要的字段，返回材料列表
				const filteredList = this.materailList.map(item => {
					const filtered = {
						...item
					};
					delete filtered.fileList;
					return filtered;
				});

				return filteredList || []
			}
		}
	}
</script>

<style scoped lang="scss">
	.service-upload {
		width: 100%;
		padding: 40rpx 32rpx;
		background-color: #fff;
		box-sizing: border-box;

		.upload-item {
			margin-bottom: 40rpx;

			.item-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.title {
					font-size: 28rpx;
					font-weight: 500;

					.tips {
						font-size: 22rpx;
						color: #aaa;
						margin-top: 10rpx;
					}
				}

				.tip {
					color: #888888;
					font-size: 24rpx;
					text-align: right;
				}
			}

			.upload-content {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 20rpx;

				.btn {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 160rpx;
					height: 160rpx;
					border: 2rpx dashed #dcdfe6;
					border-radius: 12rpx;
					background-color: #f8f9fa;

					.btn-text {
						margin-top: 16rpx;
						font-size: 24rpx;
						color: #606266;
					}

					&:active {
						background-color: #f0f2f5;
					}
				}
			}

			.preview-container {
				display: flex;
				flex-wrap: wrap;
				gap: 20rpx;
			}

			.preview-item {
				position: relative;
				width: 160rpx;
				height: 160rpx;

				.preview-image {
					width: 100%;
					height: 100%;
					border-radius: 12rpx;
					background-color: #f5f5f5;
				}

				.file-item {
					width: 100%;
					height: 100%;
					background-color: #f5f5f5;
					border-radius: 12rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 10rpx;
					box-sizing: border-box;
				}

				.preview-file-name {
					font-size: 20rpx;
					color: #606266;
					word-break: break-all;
					text-align: center;
					line-height: 28rpx;
				}

				.delete-icon {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					background: rgba(0, 0, 0, 0.6);
					color: #fff;
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
					z-index: 10;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				// 新增操作区域样式
				.preview-item-operation {
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					background-color: rgba(0, 0, 0, 0.5);
					color: #fff;
					padding: 2rpx 5rpx;
					font-size: 20rpx;
					display: flex;
					justify-content: space-around;
					border-bottom-left-radius: 12rpx;
					border-bottom-right-radius: 12rpx;
				}
			}

			// 新增上传状态相关样式
			.upload-status {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				margin-top: 20rpx;
			}

			.upload-success {
				color: #67c23a;
			}

			.upload-error {
				color: #f56c6c;
			}

			.upload-progress {
				color: #409eff;
				display: flex;
				align-items: center;
			}

			.progress-bar {
				width: 200rpx;
				height: 8rpx;
				background-color: #f2f2f2;
				border-radius: 4rpx;
				overflow: hidden;
				margin-left: 10rpx;
			}

			.progress-inner {
				height: 100%;
				background-color: #409eff;
				transition: width 0.3s;
			}
		}
	}

	// 弹窗预览样式
	.dialog-preview {
		max-width: 100%;
		max-height: 80vh;

		img {
			max-width: 100%;
			max-height: 80vh;
		}
	}
</style>