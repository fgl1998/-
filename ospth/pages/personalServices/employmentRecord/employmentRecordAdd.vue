<template>
	<view class="service-page" id="contrainer">
		<service-header :headerList="headerList" :headerIndex="headerIndex" />
		<view class="service-box">
			<service-know :htmlText="htmlText" v-show="headerIndex == 0" />
			<employmentRecordAddForm ref="formRef" @changeUploadFile="changeUploadFile" v-show="headerIndex == 1" />
			<service-upload ref="materialUploadTable" :yda020="showUploadFile" v-show="headerIndex == 2" />
			<service-complete v-show="headerIndex == 3" />
			<view class="btn-box">
				<u-button type="primary" @click="--headerIndex" style="margin-right: 30rpx;width: 100%;"
					v-show="headerIndex != 0 && headerIndex != 3">上一步</u-button>
				<u-button type="primary" @click="addFn" v-show="headerIndex != 3" style="width: 100%;">下一步</u-button>

			</view>
		</view>
	</view>
</template>

<script>
	import employmentRecordAddForm from './components/employmentRecordAddForm.vue'
	export default {
		data() {
			return {
				// showUploadFile: '9_403',
				// showUploadFile: '491',
				// showUploadFile: '493',
				showUploadFile: '',

				headerList: [{
						icon: "",
						title: "经办需知",
					},
					{
						icon: "",
						title: "信息录入",
					},
					{
						icon: "",
						title: "材料上传",
					},
					{
						icon: "",
						title: "办结完成",
					},
				],
				headerIndex: 0,
				htmlText: '<div style="color:red;">提示</div>1、你必须对所填信息的真实性负责。<br/>2、申请成功后请时刻关注审核进度。<br/>3、多个证书请申请多次，身份证图片，毕业证图片可以反复使用。<br/>4、实际金额以审核结果为准，页面显示金额仅供参考。',
				formData: {}, //表单数据
			}
		},
		components: {
			employmentRecordAddForm,
		},

		watch: {
			headerIndex: {
				handler: function(newVal, oldVal) {
					console.log('newVal, oldVal: ', newVal, oldVal);
					this.$nextTick(() => {
						this.setHeight()
					})
				}
			}
		},
		mounted() {
			setTimeout(() => {
				this.setHeight()
			}, 500)
		},
		// 页面初次渲染完成时触发，一个页面只会调用一次
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.setHeight()
		},
		methods: {
			changeUploadFile(e) {
				console.log('e: ', e);
				this.showUploadFile = e
			},
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						terminalUtil._setIframeHeight(data.height)
					}
				}).exec()
			},
			addFn() {
				console.log('this.headerIndex: ', this.headerIndex);
				// 表单校验
				if (this.headerIndex == 1) {
					console.log('this.$refs.formRef: ', this.$refs);
					this.$refs.formRef.handleConfirm((info) => {
						console.log('info: ', info);
						this.formData = info
						this.headerIndex++
					})
					// 材料核验
				} else if (this.headerIndex == 2) {
					const fileList = this.$refs.materialUploadTable.check() || []
					console.log('11: ', 11);
					this.fileList = fileList
					if (fileList && fileList.length) {
						const yhc407 = this.formData.yhc407
						// 只有在特定就业形式下才强制要求上传材料，其他情况可以不上传
						const needUploadFileTypes = ['21', '22', '29', '30'];
						if (needUploadFileTypes.includes(yhc407) && fileList[0].files.length === 0) {
							this.$message.error('请上传必要的材料');
							return;
						}
					}
					this.saveFn()
					console.log('fileList: ', fileList);
				} else {
					this.headerIndex++
				}
			},
			saveFn() {
				console.log('this.fileList1111: ', this.fileList);
				const param = {
					no: '403-0016',
					data: JSON.stringify({
						...this.formData,
						fileList: JSON.stringify(this.fileList)
					})
				}
				console.log('param: ', param);
				// return
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data.code === '1') {
						this.$message.success(res.data.msg || '保存成功')
						this.headerIndex++
						// setTimeout(() => {
						// 	this.$router.go(-1)
						// }, 5000)
					} else {
						this.$message.error(res.data.msg || '保存失败')
					}
				}, (error) => {
					// 添加失败回调，处理网络错误等情况
					this.$message.error('网络异常，请稍后重试')
					console.error('请求失败:', error)
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.service-page {
		// height: 100%;
		background-color: #fff;

		.service-box {
			// padding-top: 188rpx;
			// box-sizing: border-box;
		}

		.btn-box {
			display: flex;
			padding: 32rpx;

			.u-btn {
				flex: 1;
			}
		}
	}
</style>