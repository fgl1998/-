<template>
	<view class="select-tree-wrapper">
		<miniPopup :isShowPopup="visible&& !disabled" @close="handleCancel" :maskCloseable="true" @clickMask="clickMask">
			<div class="bank-card">
				<div class="bank-card-content">
					<!-- 弹窗头部 -->
					<div class="bank-card-header">
						<div class="bank-card-title">{{ currentView === 'select' ? '选择银行账户' : '银行卡新增' }}</div>
						<div class="bank-card-close" @click="handleCancel">×</div>
					</div>

					<!-- 账号选择视图 -->
					<div v-if="currentView === 'select'" class="select-view">
						<!-- 银行账号下拉选择框 -->
						<div class="form-item">
							<label class="form-label">选择银行账号</label>
							<select class="bank-select" v-model="selectedAccountId" @change="onAccountSelect">
								<option value="">请选择银行账号</option>
								<option v-for="item in dataSourceQuery" :key="item.aae010" :value="item">
									{{ item.aae044 }}--{{ item.aae010 }}
								</option>
							</select>
						</div>

						<!-- 选中账号信息展示 -->
						<div v-if="selectedAccount" class="selected-info">
							<div class="info-item">
								<span class="info-label">开户户名：</span>
								<span class="info-value">{{ selectedAccount.aae009 }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">银行名称：</span>
								<span class="info-value">{{ selectedAccount.aae044 }}</span>
							</div>
							<div class="info-item">
								<span class="info-label">账号：</span>
								<span class="info-value">{{ selectedAccount.aae010 }}</span>
							</div>
						</div>

						<!-- 按钮组 -->
						<div class="btn-group">
							<button class="btn-primary" @click="confirmSelect"
								:disabled="!selectedAccountId">确认选择</button>
							<button class="btn-secondary" @click="switchToAdd">新增账号</button>
						</div>
					</div>

					<!-- 新增账号表单视图 -->
					<div v-if="currentView === 'add'" class="add-view">
						<u-form :model="formData" ref="bankForm" label-position="left">
							<u-form-item label="总行选择" label-width="150" required>
								<mini-picker placeholder="请选择总行" selectPrompt="请选择总行" :range="questionTypeList"
									v-model="selectedBankValue" @change="handleChangeBank" />
							</u-form-item>
							<!-- 支行名称 -->
							<u-form-item label="支行选择" label-width="150" required>
								<mini-picker placeholder="请选择支行" selectPrompt="请选择支行" :range="dataSourceAdd"
									v-model="selectedBankValue2" @change="handleChangeBank1" />
							</u-form-item>
							<!-- 支行名称 -->
							<u-form-item label="支行名称" label-width="150" required>
								<u-input v-model="formData.bankbranchname" :border="false" placeholder="请输入支行名称"
									disabled />
							</u-form-item>
							<!-- 银行卡号 -->
							<u-form-item label="银行联行号" label-width="150" required>
								<u-input v-model="formData.bankbranchid" :border="false" placeholder="请输入银行联行号" disabled
									maxlength="40" />
							</u-form-item>

							<!-- 开户户名 -->
							<u-form-item label="开户户名" label-width="150" required>
								<u-input v-model="formData.aae009" :border="false" placeholder="请输入户名" />
							</u-form-item>

							<!-- 银行账号 -->
							<u-form-item label="银行账号" label-width="150" required>
								<u-input v-model="formData.aae010" :border="false" placeholder="请输入银行账号" />
							</u-form-item>
						</u-form>

						<!-- 按钮组 -->
						<div class="u-button-group" style="margin-top: 30px; padding: 0 20px;">
							<u-button @click="confirmAdd" type="primary" style="width: 48%;">新增</u-button>
							<u-button @click="switchToSelect" type="default"
								style="width: 48%; margin-left: 4%;">关闭</u-button>
						</div>
					</div>
				</div>
			</div>
		</miniPopup>
	</view>
</template>

<script>
	import miniPopup from '../mini-popup/mini-popup.vue'
	import miniPicker from '../mini-picker/mini-picker.vue'

	export default {
		components: {
			miniPopup,
			miniPicker
		},
		name: 'bankCard',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			params: {
				type: Object,
				default: () => ({})
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				// 当前视图状态：select-选择账号，add-新增账号
				currentView: 'select',

				// 表单数据对象
				formData: {
					aaf200Desc: '',
					bankbranchname: '',
					bankbranchid: '',
					aae009: '',
					bankbranchid: '',
					isDefault: '1'
				},

				// 银行相关
				selectedBankValue: '',
				selectedBankValue2: '',
				questionTypeList: [],

				// 账户选择相关
				selectedAccountId: '',
				dataSourceQuery: [],

				loading: false,
				currentRequest: null,
				dataSourceAdd: [],
				selectedAccount: ''
			}
		},
		computed: {},
		watch: {
			visible(val) {
				if (val) {
					this.initData()
				} else {
					this.resetAll()
				}
			}
		},
		beforeDestroy() {
			// 取消未完成的请求
			if (this.currentRequest) {
				this.currentRequest.cancel && this.currentRequest.cancel()
				this.currentRequest = null
			}
		},
		mounted() {
			// 添加初始化日志，便于测试组件加载
			try {
				// console.log('BankCard组件初始化');
				this.$dict.getDictList("BANKID", res => {
					this.questionTypeList = res
				})
			} catch (error) {
				console.error('BankCard组件初始化失败:', error);
				// 确保在移动端环境下能显示错误信息
				if (this.$message && this.$message.error) {
					this.$message.error('银行账户组件加载失败，请重试');
				}
			}
		},
		methods: {
			// 点击遮罩层关闭
			clickMask(e) {
				// this.visible = e
				this.$emit('onClose')
			},
			/**
			 * 提交银行数据到接口
			 */
			/**
			 * 提交银行数据到接口
			 * @param {Object} values 表单值
			 */
			submitBankData(values) {

				return
				try {
					const userCode = this.getUserCode()

					if (!userCode) {
						this.$message.warning('用户编号缺失，无法提交')
						return
					}

					const submitData = {
						...values,
						aae732: this.getUserTypeCode(),
						aae733: userCode,
						aae044: values.bankbranchname,
						aae008: values.bankbranchid,
						aae021: '1',
						aaf200: this.selectedBankValue,
					}

					this.loading = true

					const requestParam = {
						no: '000-0015',
						data: JSON.stringify(submitData)
					}

					this.$base.post('', requestParam, (res) => {
						this.loading = false
						if (res && res.serviceSuccess) {
							if (res.data && res.data.code === '1') {
								this.$message.success(res.data.msg || '添加成功')
								setTimeout(() => {
									this.$emit('onClose', {
										...submitData
									}) // 传递副本避免后续修改影响
									this.reset()
								}, 500)
							} else {
								this.$message.error(res.data.msg || '添加失败')
							}
						} else {
							this.$message.error(res.msg || '请求失败，请重试')
						}
					}, (error) => {
						this.loading = false
						console.error('提交银行数据错误:', error)
						this.$message.error('网络异常，请稍后重试')
					})
				} catch (error) {
					this.loading = false
					console.error('处理提交数据时出错:', error)
					this.$message.error('提交数据异常，请重试')
				}
			},
			// 显示弹窗的处理已通过props的visible直接控制

			/**
			 * 初始化数据
			 */
			initData() {
				try {
					// 加载用户银行账号列表
					this.queryPerBankList()
					// 重置表单数据
					this.resetFormData()
				} catch (error) {
					console.error('BankCard组件数据初始化失败:', error);
					// 添加错误处理
					if (this.$message && this.$message.error) {
						this.$message.error('银行账户数据加载异常，请重试');
					}
				}
			},

			/**
			 * 重置表单数据
			 */
			resetFormData() {
				this.formData = {
					aaf200Desc: '',
					bankbranchname: '',
					bankbranchid: '',
					aae009: '',
					bankbranchid: '',
					isDefault: '1'
				}
			},

			/**
			 * 重置所有状态和数据
			 */
			resetAll() {
				this.currentView = 'select'
				this.selectedAccountId = ''
				this.selectedAccount = ''
				this.selectedBankValue = ''

				// 清空数据源
				this.dataSourceQuery = []

				// 重置表单
				this.resetFormData()
			},

			/**
			 * 切换到选择视图
			 */
			switchToSelect() {
				this.currentView = 'select'
				this.resetFormData()
			},

			/**
			 * 切换到新增视图
			 */
			switchToAdd() {
				this.currentView = 'add'
				this.resetFormData()
			},

			/**
			 * 银行选择变更
			 */
			handleChangeBank(e) {
				// mini-picker组件回调参数处理
				const value = e.value;
				this.selectedBankValue = value
				this.queryPerBankBranchList()
			},
			handleChangeBank1(e) {
				// mini-picker组件回调参数处理
				const value = e.value;
				this.selectedBankValue2 = value
				this.formData.bankbranchname = e.bankbranchname
				this.formData.bankbranchid = e.bankbranchid
			},
			/**
			 * 保持兼容性的银行选择变更方法
			 */
			onBankSelect() {
				this.onBankSelectChange();
			},

			/**
			 * 账号选择变更
			 */
			onAccountSelect(e) {
				this.selectedAccount = this.selectedAccountId
				// 账号选择逻辑，通过computed的selectedAccount自动获取选中信息
			},

			/**
			 * 查询个人银行信息列表
			 */
			queryPerBankList() {
				// 取消之前可能未完成的请求
				if (this.currentRequest) {
					this.currentRequest.cancel && this.currentRequest.cancel()
				}

				if (!this.validateUserParams()) return
				this.loading = true

				const userCode = this.getUserCode()
				if (!userCode) {
					this.loading = false
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('用户编号缺失，无法查询2')
					} else {
						console.warn('用户编号缺失，无法查询1')
					}
					return
				}

				const requestParam = {
					no: '000-0013',
					data: JSON.stringify({
						aae732: this.getUserTypeCode(), // 用户对象
						aae733: userCode, // 用户编号
						aaf200: this.selectedBankValue, // 总行名称
						pageSize: 1000, // 增大分页以显示更多账号
						pageNum: 1,
					}),
				}
				this.currentRequest = this.$base.post('', requestParam, (res) => {
					this.loading = false
					if (res && res.serviceSuccess) {
						try {
							const bankArr = res.data.list || []
							if (bankArr.length === 0) {
								if (this.$message && typeof this.$message.info === 'function') {
									this.$message.info('暂无数据！')
								}
								this.dataSourceQuery = []
							} else {
								this.dataSourceQuery = bankArr
							}
						} catch (error) {
							console.error('处理银行列表数据出错:', error)
							if (this.$message && typeof this.$message.error === 'function') {
								this.$message.error('数据处理异常，请重试')
							}
						}
					} else {
						if (this.$message && typeof this.$message.error === 'function') {
							this.$message.error(res.msg || '查询失败，请重试')
						}
						this.dataSourceQuery = []
					}
				}, (error) => {
					this.loading = false
					console.error('银行列表请求错误:', error)
					if (this.$message && typeof this.$message.error === 'function') {
						this.$message.error('网络异常，请稍后重试')
					}
					this.dataSourceQuery = []
				})
			},

			/**
			 * 确认选择银行账号
			 */
			confirmSelect() {
				if (!this.selectedAccount) {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('请选择一条银行账号信息')
					}
					return
				}
				// 触发关闭事件并传递选中的账号信息
				this.$emit('onClose', this.selectedAccount)
			},

			/**
			 * 确认新增银行账号
			 */
			confirmAdd() {
				// 表单验证
				if (!this.selectedBankValue) {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('请选择总行信息')
					}
					return
				}
				if (!this.formData.bankbranchname || this.formData.bankbranchname.trim() === '') {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('请输入支行名称')
					}
					return
				}


				if (!this.formData.aae009 || this.formData.aae009.trim() === '') {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('请输入开户户名')
					}
					return
				}
				if (!this.formData.aae010 || this.formData.aae010.trim() === '') {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('请输入银行账号')
					}
					return
				}
				// 账号格式验证
				if (!/^[0-9]{2,40}$/.test(this.formData.aae010)) {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('银行账号格式不正确')
					}
					return
				}

				// 提交数据
				this.submitBankData(this.formData)
			},

			/**
			 * 处理取消操作
			 */
			handleCancel() {
				this.$emit('onClose')
			},

			/**
			 * 验证用户参数
			 */
			validateUserParams() {
				// 从原代码中保留的用户参数验证逻辑
				try {
					if (!this.params) {
						if (this.$message && typeof this.$message.warning === 'function') {
							this.$message.warning('未获取到用户信息，请刷新页面重试')
						}
						return false
					}
					return true
				} catch (error) {
					console.error('验证用户参数失败:', error)
					return false
				}
			},

			/**
			 * 获取用户编号
			 */
			getUserCode() {
				// 从原代码中保留的获取用户编号逻辑
				try {
					const userInfo = this.params
					return userInfo.ext03 || userInfo.legalExt03 || ''
				} catch (error) {
					console.error('获取用户编号失败:', error)
					return ''
				}
			},

			/**
			 * 获取用户类型编码
			 */
			getUserTypeCode() {
				const typeMap = {
					'UT01': '1',
					'UT02': '2',
					'UT03': '3'
				}
				return typeMap[this.params.userType] || '1'
			},

			/**
			 * 提交银行数据
			 */
			queryPerBankBranchList(formData) {
				// 取消之前可能未完成的请求
				if (this.currentRequest) {
					this.currentRequest.cancel && this.currentRequest.cancel()
				}

				const userCode = this.getUserCode()
				if (!userCode) {
					if (this.$message && typeof this.$message.warning === 'function') {
						this.$message.warning('用户编号缺失，无法提交')
					}
					return
				}

				const requestParam = {
					no: '000-0014',
					data: JSON.stringify({
						aaf200: this.selectedBankValue,
						pageSize: 10000,
						pageNum: 1,
						aae044: ''
					}),
				}

				this.loading = true
				this.currentRequest = this.$base.post('', requestParam, (res) => {
					this.loading = false
					if (res.serviceSuccess) {
						let bankBranchData = res.data.list || []
						if (bankBranchData.length === 0) {
							this.$message.info('查询成功，暂无数据！')
							this.dataSourceAdd = []
						} else {
							bankBranchData.forEach(v => {
								v.name = v.bankbranchname;
								v.label = v.bankbranchname;
								v.value = v.bankbranchid;
							})
							this.dataSourceAdd = bankBranchData
							this.$message.info('查询成功，请选择支行！')
						}
					} else {
						this.$message.error('查询失败，请重试')
						this.dataSourceAdd = []
						this.pageDown2.total = 0
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select-tree-wrapper {
		display: block;
		width: 100%;
		background-color: #fff;

		.mini-popup-wrapper {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 991;
		}
	}

	.bank-card {
		width: 100%;
		font-size: 14px;
		background-color: #fff;
		padding-bottom: 60rpx;
		box-sizing: border-box;
	}

	.bank-card-content {
		padding: 0;
	}

	/* 弹窗头部 */
	.bank-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid #e8e8e8;
		background-color: #fafafa;
	}

	.bank-card-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.bank-card-close {
		font-size: 20px;
		color: #999;
		cursor: pointer;
		padding: 0 5px;
	}

	.bank-card-close:active {
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 4px;
	}

	/* 视图容器 */
	.select-view,
	.add-view {
		padding: 15px;
	}

	/* 表单样式 */
	.form-item {
		margin-bottom: 15px;
	}

	.form-label {
		display: block;
		margin-bottom: 5px;
		color: #666;
	}

	.form-label.required::before {
		content: "*";
		color: #ff4d4f;
		margin-right: 4px;
	}

	.form-input,
	.bank-select {
		width: 100%;
		padding: 10px;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
	}

	.form-input:focus,
	.bank-select:focus {
		border-color: #1890ff;
		outline: none;
	}

	/* 选中信息展示 */
	.selected-info {
		margin: 15px 0;
		padding: 15px;
		background-color: #f9f9f9;
		border-radius: 4px;
	}

	.info-item {
		margin-bottom: 8px;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.info-label {
		color: #666;
		margin-right: 8px;
	}

	.info-value {
		color: #333;
		font-weight: 500;
	}

	/* 按钮样式 */
	.btn-group {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	.btn-group.full-width {
		flex-direction: column;
		gap: 10px;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		text-align: center;
	}

	.btn-group:not(.full-width) .btn-primary,
	.btn-group:not(.full-width) .btn-secondary {
		margin: 0 5px;
	}

	.btn-group.full-width .btn-primary,
	.btn-group.full-width .btn-secondary {
		width: 100%;
	}

	.btn-primary {
		background-color: #1890ff;
		color: white;
	}

	.btn-primary:hover {
		background-color: #40a9ff;
	}

	.btn-primary:disabled {
		background-color: #f5f5f5;
		color: #d9d9d9;
		cursor: not-allowed;
	}

	.btn-secondary {
		background-color: #f5f5f5;
		color: #333;
		border: 1px solid #d9d9d9;
	}

	.btn-secondary:hover {
		background-color: #e6f7ff;
		color: #1890ff;
		border-color: #91d5ff;
	}

	/* 表单区块 */
	.form-section {
		margin-bottom: 20px;
	}

	/* 移动端适配 */
	@media screen and (max-width: 375px) {
		.bank-card-header {
			padding: 12px;
		}

		.bank-card-title {
			font-size: 15px;
		}

		.select-view,
		.add-view {
			padding: 12px;
		}

		.form-item {
			margin-bottom: 12px;
		}

		.form-input,
		.bank-select,
		.btn-primary,
		.btn-secondary {
			padding: 9px;
			font-size: 13px;
		}
	}

	/deep/.uni-input-wrapper {
		text-align: right;
	}

	.u-button-group {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>