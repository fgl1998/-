<template>
	<view class="service-page" id="contrainer">
		<view class="service-box">
			<view class="form-page">
				<view class="uform" v-show="headerIndex == 0">
					<u-form :model="infoForm" ref="infoForm" label-position="left" :rules="rules">
						<!-- 个人基本信息 -->
						<view class="title-line-blue">
							<view class="title">个人基本信息</view>
						</view>
						<u-form-item label="身份证号" prop="yac002" label-width="150">
							<u-input v-model="infoForm.yac002" :border="false" placeholder="身份证号" disabled />
						</u-form-item>
						<u-form-item label="姓名" prop="aac003" label-width="150">
							<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
						</u-form-item>
						<u-form-item label="性别" prop="aac004" label-width="150">
							<mini-picker :disabled="true" disabled placeholder="请选择性别" selectPrompt="请选择性别"
								collection="SEX" v-model="infoForm.aac004"
								@change="fromChange($event, 'infoForm', 'aac004')"></mini-picker>
						</u-form-item>
						<u-form-item label="民族" prop="aac005" label-width="150">
							<mini-picker :disabled="true" placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
								v-model="infoForm.aac005" @change="fromChange($event, 'infoForm', 'aac005')"
								disabled></mini-picker>
						</u-form-item>
						<u-form-item label="出生年月" prop="aac006" label-width="150">
							<u-input v-model="infoForm.aac006" :border="false" placeholder="出生年月" disabled />
						</u-form-item>
						<u-form-item label="联系电话" prop="aae005" label-width="150">
							<u-input v-model="infoForm.aae005" :border="false" placeholder="联系电话" disabled />
						</u-form-item>
						<u-form-item label="现住地址" prop="aac026" label-width="150">
							<u-input v-model="infoForm.aac026" :border="false" placeholder="现住地址" disabled />
						</u-form-item>
						<u-form-item label="就业登记地" prop="aae017desc" label-width="150">
							<u-input v-model="infoForm.aae017desc" :border="false" placeholder="就业登记地" disabled />
						</u-form-item>

						<!-- 注销信息 -->
						<view class="title-line-blue">
							<view class="title">注销信息</view>
						</view>

						<u-form-item label="注销原因" prop="reason" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择注销原因" selectPrompt="请选择注销原因"
								collection="ADC112" v-model="infoForm.reason"
								@change="fromChange($event, 'infoForm', 'reason', fnReasonSelect)"></mini-picker>
						</u-form-item>
						<u-form-item :label="dynamicLabels.ycc040" prop="ycc040" label-width="180"
							:required="requiredFields.ycc040">
							<u-input v-model="infoForm.ycc040" :border="false" placeholder="请选择日期"
								@click="ycc040Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ycc040Show" mode="date"
								@change="dateConfirmYcc040"></u-calendar>
						</u-form-item>
						<u-form-item label="备注" prop="ycc03m" label-width="150">
							<u-input v-model="infoForm.ycc03m" :border="false" placeholder="请输入"
								:disabled="isDisabled" />
						</u-form-item>

						<view class="tips">
							<text>材料上传提示(必须严格按照提示上传材料，否则会因为材料有误审核不通过)：</text>
							<text>1、当注销原因选择'从企业、机关、事业单位等各类用人单位失业'或'退出公益性岗位'时，'解除\终止劳动合同证明材料'必须上传；</text>
							<text>2、当注销原因选择'退出个体经营'时，'退出个体经营佐证资料'必须上传；</text>
							<text>3、当注销原因选择'丧失劳动能力'时，'佐证资料'必须上传。</text>
						</view>

						<!-- <view class="modal-btn">
							<u-button type="primary" id="saveDeleteBtn" @click="fnDeleteSave">注销保存</u-button>
						</view> -->
						<view class="btn-box">
							<u-button type="primary" @click="handleConfirm" v-show="headerIndex != 3"
								style="width: 100%;">下一步</u-button>
						</view>
					</u-form>
				</view>
			</view>
			<view v-show="headerIndex == 1">
				<view class="title-line-blue">
					<view class="title">材料上传</view>
				</view>
				<service-upload ref="materialUploadTable" :yda020="showUploadFile" />
				<view class="btn-box">
					<u-button type="primary" @click="--headerIndex"
						style="margin-right: 30rpx;width: 100%;">上一步</u-button>
					<u-button type="primary" @click="fnDeleteSave" style="width: 100%;">注销保存</u-button>
				</view>
			</view>
			<service-complete v-show="headerIndex == 2" />

		</view>
	</view>
</template>

<script>
	import employmentRecordDeleteForm from './components/employmentRecordDeleteForm.vue'
	export default {
		components: {
			employmentRecordDeleteForm,
		},
		data() {
			return {
				showUploadFile: '403wtzx',
				headerIndex: 0,
				isDisabled: false,
				infoForm: {
					ycc030: '',
					aac001: '',
					yac002: '',
					aac003: '',
					aac004: '',
					aac005: '',
					aac006: '',
					aae005: '',
					aac026: '',
					aae017desc: '',
					reason: '',
					ycc040: '',
					ycc03m: ''
				},
				rules: {
					reason: [{
						required: true,
						message: '请选择注销原因',
						trigger: 'blur'
					}],
					ycc040: [{
						required: true,
						message: '请选择注销时间',
						trigger: 'blur'
					}]
				},
				// 动态控制表单字段的状态
				dynamicLabels: {
					ycc040: '注销原因时间' // 默认标签
				},
				// 控制字段是否必填
				requiredFields: {
					ycc040: true // 默认必填
				},
				ycc040Show: false,
				userInfo: {}
			}
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
		// created() {
		// 	this.userInfo = this.params || {}
		// },
		mounted() {
			setTimeout(() => {
				this.setHeight()
				this.init()
			}, 500)
		},
		onLoad(options) {
			console.log('接收到的options:', options) // 调试用
			if (options.params) {
				try {
					// 解码并解析参数
					const decodedParams = decodeURIComponent(options.params)
					const params = JSON.parse(decodedParams)
					console.log('params: ', params);
					this.userInfo = params;
				} catch (error) {
					console.error('参数解析失败:', error)
					uni.showToast({
						title: '数据解析失败',
						icon: 'error'
					})
				}
			} else {
				uni.showToast({
					title: '缺少必要参数',
					icon: 'error'
				})
			}
		},
		// 页面初次渲染完成时触发，一个页面只会调用一次
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.$refs.infoForm.setRules(this.rules);
			this.setHeight()
		},
		methods: {
			fromChange(e, formName, fieldName, callback) {
				const value = e.value || e
				this[formName][fieldName] = value
				if (callback && typeof callback === 'function') {
					callback(value)
				}
			},
			dateConfirmYcc040(e) {
				this.infoForm.ycc040 = e.result;
				this.ycc040Show = false
				this.$forceUpdate()
			},
			init() {
				const param = {
					no: '403-0017',
					data: JSON.stringify({
						ycc030: this.$route.params?.ycc030 || '',
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code === '1') {
							const infoData = res.data.info || {}
							// 将数据赋值给infoForm
							// this.setFormData(infoData)
							this.infoForm = infoData
						}
					}
				})
			},
			setFormData(data) {
				// 将后端返回的数据赋值到infoForm
				for (const key in data) {
					if (this.infoForm.hasOwnProperty(key)) {
						this.infoForm[key] = data[key]
					}
				}
			},
			fnReasonSelect(value) {
				// 根据不同的注销原因动态设置字段标签和必填状态
				if (value == '10' || value == '30') {
					this.dynamicLabels.ycc040 = "终止劳动合同时间";
					this.requiredFields.ycc040 = true;
				} else if (value == '21') {
					this.dynamicLabels.ycc040 = "个体经营注销时间";
					this.requiredFields.ycc040 = true;
				} else if (value == '22') {
					this.dynamicLabels.ycc040 = "退出灵活就业时间";
					this.requiredFields.ycc040 = true;
				} else if (value == '50') {
					this.dynamicLabels.ycc040 = "丧失劳动能力时间";
					this.requiredFields.ycc040 = true;
				} else {
					// 其他情况恢复默认值
					this.dynamicLabels.ycc040 = "注销原因时间";
					this.requiredFields.ycc040 = true;
				}
				// 根据注销原因控制上传材料类型
				this.$emit('changeUploadFile', '403wtzx')
			},
			fnDeleteSave() {
				// 表单校验
				this.$refs.infoForm.validate((valid) => {
					console.log('222: ', 222);
					if (!valid) {
						return false
					}

					const fileList = this.$refs.materialUploadTable.check() || []
					if (fileList[0].files.length === 0) {
						this.$message.error('请上传必要的材料')
						return false
					}
					console.log('this.infoForm.ycc040: ', this.infoForm.ycc040);
					const formData = {
						...this.infoForm,
						// ycc040: moment(this.infoForm.ycc040).format('YYYY-MM-DD')
					}

					const param = {
						no: '403-0018',
						data: JSON.stringify({
							...formData,
							fileList: JSON.stringify(fileList),
						})
					}

					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code === '1') {
							this.$message.success('注销成功')
							// 可以返回上一页
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
						}
						if (res.data.code === '0') {
							this.$message.error('请求失败!')
						}
					}, (error) => {
						// 添加失败回调，处理网络错误等情况
						this.$message.error('网络异常，请稍后重试')
						console.error('请求失败:', error)
					})
				})
			},
			handleReset() {
				this.$refs.infoForm.resetFields()
			},
			handleConfirm() {
				console.log('111: ', 111);
				this.$refs.infoForm.validate((valid) => {
					console.log('valid1111: ', valid);
					if (valid) {
						this.headerIndex++
					} else {
						console.log('22: ', 22);
					}
				})
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
	@import url("../../../static/css/sass/form.scss");

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