<template>
	<view class="service-page" id="contrainer">
		<view class="service-box">
			<view class="form-page">
				<!-- 步骤一：基本信息和申请信息 -->
				<view v-show="headerIndex == 0">
					<view class="uform">
						<u-form :model="infoForm" ref="infoForm" label-position="left" :rules="rules">
							<!-- 基本信息 -->
							<view class="title-line-blue">
								<view class="title">基本信息</view>
							</view>
							<u-form-item label="姓名" prop="aac003" label-width="120" required>
								<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
							</u-form-item>
							<u-form-item label="身份证号" prop="yac002" label-width="120" required>
								<u-input v-model="infoForm.yac002" :border="false" placeholder="身份证号" disabled />
							</u-form-item>
							<u-form-item label="性别" prop="aac004" label-width="120" required>
								<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="AAC004"
									v-model="infoForm.aac004"></mini-picker>
							</u-form-item>
							<u-form-item label="民族" prop="aac005" label-width="120" required>
								<mini-picker disabled placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
									v-model="infoForm.aac005"></mini-picker>
							</u-form-item>
							<u-form-item label="联系电话" prop="aae005" label-width="120" required>
								<u-input v-model="infoForm.aae005" :border="false" placeholder="请输入联系电话" />
							</u-form-item>
							<u-form-item label="发放方式" prop="syy002" label-width="120" required>
								<mini-picker placeholder="请选择发放方式" selectPrompt="请选择发放方式" v-model="infoForm.syy002"
									@change="fromChange($event, 'infoForm', 'syy002')" :range="payMethods">
								</mini-picker>
							</u-form-item>
							<u-form-item label="银行类别" prop="yhk031" label-width="120" required>
								<u-input v-model="infoForm.yhk031" :border="false" placeholder="请选择银行类别"
									@click="visibleBank = true" />
							</u-form-item>
							<u-form-item label="银行卡号" prop="yhk030" label-width="120">
								<u-input v-model="infoForm.yhk030" :border="false" placeholder="银行卡号" disabled />
							</u-form-item>
							<u-form-item label="开户名称" prop="yhk032" label-width="120">
								<u-input v-model="infoForm.yhk032" :border="false" placeholder="开户名称" disabled />
							</u-form-item>
							<u-form-item label="银联号" prop="yhk033" label-width="120">
								<u-input v-model="infoForm.yhk033" :border="false" placeholder="银联号" disabled />
							</u-form-item>
							<u-form-item label="户籍号" prop="alc083" label-width="120" required>
								<u-input v-model="infoForm.alc083" :border="false" placeholder="请输入户籍号" />
							</u-form-item>

							<!-- 申请信息 -->
							<view class="title-line-blue">
								<view class="title">申请信息</view>
							</view>
							<u-form-item label="失业时间" prop="dff002" label-width="120">
								<u-input v-model="infoForm.dff002" :border="false" placeholder="请选择失业时间"
									@click="dff002Show = true" />
								<u-calendar v-model="dff002Show" @change="changeDff002">
								</u-calendar>
							</u-form-item>
							<u-form-item label="停保原因" prop="cause" label-width="120">
								<mini-picker placeholder="请选择停保原因" selectPrompt="请选择停保原因" collection="STOPCAUSE"
									v-model="infoForm.cause" @change="fromChange($event, 'infoForm', 'cause')">
								</mini-picker>
							</u-form-item>
							<u-form-item label="有无求职要求" prop="dff005" label-width="120" required>
								<mini-picker placeholder="请选择有无求职要求" selectPrompt="请选择有无求职要求" v-model="infoForm.dff005"
									@change="fromChange($event, 'infoForm', 'dff005')" :range="yesNoOptions">
								</mini-picker>
							</u-form-item>
							<u-form-item label="求职要求" prop="dff006" label-width="120" required>
								<mini-picker placeholder="请选择求职要求" selectPrompt="请选择求职要求" v-model="infoForm.dff006"
									@change="fromChange($event, 'infoForm', 'dff006')" :range="yesNoOptions">
								</mini-picker>
							</u-form-item>
							<u-form-item label="参保起止时间" prop="aae003_s" label-width="120">
								<u-input v-model="infoForm.aae003_s" :border="false" placeholder="参保起止时间" disabled />
							</u-form-item>
							<u-form-item label="参保截止时间" prop="aae003_e" label-width="120">
								<u-input v-model="infoForm.aae003_e" :border="false" placeholder="参保截止时间" disabled />
							</u-form-item>
							<u-form-item label="是否进行求职登记" prop="dff007" label-width="120" required>
								<mini-picker placeholder="请选择是否进行求职登记" selectPrompt="请选择是否进行求职登记"
									v-model="infoForm.dff007" @change="fromChange($event, 'infoForm', 'dff007')"
									:range="yesNoOptions">
								</mini-picker>
							</u-form-item>
							<u-form-item label="本次每月拟发放失业保险金金额" prop="ajc151" label-width="120">
								<u-input v-model="infoForm.ajc151" :border="false" placeholder="本次每月拟发放失业保险金金额"
									disabled />
							</u-form-item>
							<u-form-item label="缴费月数" prop="dff001" label-width="120">
								<u-input v-model="infoForm.dff001" :border="false" placeholder="缴费月数" disabled />
							</u-form-item>
							<u-form-item label="社保缴纳地(审核机构)" prop="aae017" label-width="120" required>
								<mini-picker v-model="infoForm.aae017" :border="false" placeholder="社保缴纳地(审核机构)"
									disabled collection="AAE017" />
							</u-form-item>

							<view class="btn-box">
								<u-button @click="onRead" style="margin-right: 10px;">阅读承诺书</u-button>
								<u-button type="primary" @click="nextFn" :disabled="!hasReadCommitment">下一步</u-button>
							</view>
						</u-form>
					</view>
				</view>

				<!-- 步骤二：缴费信息和材料上传 -->
				<view v-show="headerIndex == 1">
					<view class="title-line-blue">
						<view class="title">失业保险缴费信息</view>
					</view>
					<scroll-view scroll-y="true" scroll-x="true" style="height: 300rpx; white-space: nowrap;">
						<view class="table-container">
							<view class="table-header">
								<view class="table-col">缴费险种</view>
								<view class="table-col">缴费年度</view>
								<view class="table-col">缴费所属期</view>
								<view class="table-col">对应缴费所属期</view>
								<view class="table-col">单位缴费</view>
								<view class="table-col">个人缴费</view>
								<view class="table-col">身份证号</view>
								<view class="table-col">经办时间</view>
								<view class="table-col">单位名称</view>
							</view>
							<view class="table-body">
								<view v-for="(item, index) in jfData" :key="index" class="table-row">
									<view class="table-col">{{item.syy001}}</view>
									<view class="table-col">{{item.wjj001}}</view>
									<view class="table-col">{{item.wjj002}}</view>
									<view class="table-col">{{item.wjj003}}</view>
									<view class="table-col">{{item.wjj001fileid}}</view>
									<view class="table-col">{{item.isswtich}}</view>
									<view class="table-col">{{item.yac002}}</view>
									<view class="table-col">{{item.aae036}}</view>
									<view class="table-col">{{item.aab004}}</view>
								</view>
							</view>
						</view>
					</scroll-view>

					<view class="title-line-blue">
						<view class="title">材料上传</view>
					</view>
					<service-upload ref="materialUploadTable" :yda020="showUploadFile" />
					<view class="btn-box">
						<u-button @click="headerIndex = 0" style="width: 45%;">上一步</u-button>
						<u-button type="primary" @click="handleConfirmSybxj" style="width: 45%;">确认提交</u-button>
					</view>
				</view>

				<!-- 步骤三：完成页面 -->
				<service-complete v-show="headerIndex == 2" />
			</view>
		</view>

		<!-- 承诺弹窗 -->
		<u-modal v-model="visible2" :show-cancel-button="true" title="申领失业人员领取失业保险金承诺书" :close-on-click-overlay="false"
			@confirm="handleOkRed" @cancel="visible2 = false">
			<view class="commitment-content">
				<p>我郑重承诺：</p>
				<p>1、本人所提供的申请材料内容与实际情况一致，无弄虚作假情况现象；</p>
				<p>2、自觉遵守国家法律法规；</p>
				<p>3、领取失业保险金期间重新就业，及时向参保所在地失业保险经力机构备案，并办理停止领取失业保险金及停止享受其他失业保险待遇的手续；</p>
				<p>4、如有伪造申请材料、虚报、假报、冒领等欺瞒手段骗取失业保险金及其他失业保险待遇的行为，本人自愿承担一切法律责任；</p>
				<p>5、如因弄虚作假或不符合申领条件的、或因提供不准确的信息，造成无法与本人联系影响本人申领的，本人自愿承担后果；</p>
				<p>6、本人承诺为非本人意愿中断就业；</p>
				<p>7、本人同时申请办理失业登记，接收公共就业服务。</p>
			</view>
			<view class="commitment-radio">
				<u-radio-group v-model="radioValue" @change="handleRedRadioChange">
					<u-radio :name="1">我已阅读并接受</u-radio>
				</u-radio-group>
			</view>
		</u-modal>

		<!-- 银行选择器 -->
		<bankCard ref="bankCardRef" :allow-add="true" :params="paramsBankCard" :visible="visibleBank"
			@onClose="closeBank" />
	</view>
</template>

<script>
	export default {
		name: 'unemploymentInsuranceAdd',
		components: {

		},
		data() {
			return {
				headerIndex: 0,
				// 表单数据
				infoForm: {
					syy001: '', // 失业申请编号
					aac001: '', // 个人编号
					aac003: '', // 姓名
					yac002: '', // 身份证号
					aac004: '', // 性别
					aac005: '', // 民族
					aae005: '', // 联系电话
					syy002: '', // 发放方式
					yhk031: '', // 银行类别
					yhk030: '', // 银行卡号
					yhk032: '', // 开户名称
					yhk033: '', // 银联号
					alc083: '', // 户籍号
					dff002: '', // 失业时间
					cause: '', // 停保原因
					dff005: '', // 有无求职要求
					dff006: '', // 求职要求
					aae003_s: '', // 参保起止时间
					aae003_e: '', // 参保截止时间
					dff007: '', // 是否进行求职登记
					ajc151: '', // 本次每月拟发放失业保险金金额
					dff001: '', // 缴费月数
					zymsys: '', // 可享受月数
					ajc097: '', // 转移月数
					aae017: '' // 社保缴纳地
				},
				// 表单验证规则
				rules: {
					aac003: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					yac002: [{
						required: true,
						message: '请输入身份证号',
						trigger: 'blur'
					}],
					aac004: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					aac005: [{
						required: true,
						message: '请选择民族',
						trigger: 'blur'
					}],
					aae005: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur'
					}],
					syy002: [{
						required: true,
						message: '请选择发放方式',
						trigger: 'blur'
					}],
					yhk031: [{
						required: true,
						message: '请选择银行类别',
						trigger: 'blur'
					}],
					alc083: [{
						required: true,
						message: '请输入户籍号',
						trigger: 'blur'
					}],
					dff005: [{
						required: true,
						message: '请选择有无求职要求',
						trigger: 'blur'
					}],
					dff006: [{
						required: true,
						message: '请选择求职要求',
						trigger: 'blur'
					}],
					dff007: [{
						required: true,
						message: '请选择是否进行求职登记',
						trigger: 'blur'
					}],
					aae017: [{
						required: true,
						message: '请输入社保缴纳地',
						trigger: 'blur'
					}]
				},
				// 弹窗控制
				visible2: false,
				visibleBank: false,
				// 日期选择器
				dff002Show: false,
				// 承诺书相关
				hasReadCommitment: false,
				redRadioChecked: false,
				radioValue: '',
				// 缴费数据
				jfData: [],
				// 用户信息
				userInfo: {},
				paramsBankCard: {},
				// 常量数据
				payMethods: [{
						value: '1',
						label: '社保卡'
					},
					{
						value: '2',
						label: '银行卡'
					}
				],
				yesNoOptions: [{
						value: '0',
						label: '否'
					},
					{
						value: '1',
						label: '是'
					}
				],
				showUploadFile: '207'
			}
		},
		watch: {
			headerIndex: {
				handler: function (newVal, oldVal) {
					console.log('newVal, oldVal: ', newVal, oldVal);
					this.$nextTick(() => {
						this.setHeight()
					})
				}
			},
		},
		onShow() {
			this.$nextTick(() => {
				this.setHeight()
			})
		},
		onLoad(options) {
			console.log('options: ', options);
			if (options.params) {
				try {
					this.userInfo = JSON.parse(decodeURIComponent(options.params));
					this.userInfo.userType = 'UT01';
					this.paramsBankCard = this.userInfo;
					console.log('获取到的用户信息:', this.userInfo);
				} catch (error) {
					console.error('解析参数失败:', error);
				}
			}
		},
		onReady() {
			this.$nextTick(() => {
				this.setHeight()
				this.$refs.infoForm.setRules(this.rules);
			});
			this.init();
		},
		methods: {
			// 初始化数据
			init() {
				const param = {
					no: '207-0027',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						let arr = res.data.ac01Info
						this.infoForm = {
							...this.infoForm,
							...arr,
							aae003_e: res.data.aae003_e,
							aae003_s: res.data.aae003_s,
						}
						this.jfData = res.data.dataList || []
					} else {
						this.$message.error(res.msg || '打开新增页面失败')
					}
				}, (error) => {
					this.$message.error('初始化数据失败，请重试');
					console.error('初始化数据失败:', error);
				})
			},
			// 阅读承诺书
			onRead() {
				this.visible2 = true
			},
			// 提交阅读并接受
			handleOkRed() {
				if (!this.redRadioChecked) {
					this.$message.error('请先阅读并接受协议');
					return;
				}
				this.hasReadCommitment = true;
				this.visible2 = false
			},
			// 阅读并接受
			handleRedRadioChange(e) {
				this.redRadioChecked = e === 1;
				this.radioValue = e;
			},
			//关闭银行卡添加弹窗
			closeBank(data) {
				console.log(data, 'data---->>>>');
				this.visibleBank = false
				let allData = []
				this.$nextTick(() => {
					this.$dict.getDictList("BANKID", res => {
						allData = res
						console.log('银行列表数据: ', res);
						if (data !== null) {
							const selectedItem = allData.find(item => item.value == data.aaf200)
							console.log('selectedItem: ', selectedItem);
							let values = {
								'yhk031': selectedItem.label, //银行类别
								'yhk030': data.aae010, //银行卡号
								'yhk032': data.aae009, //开户名称
								'yhk033': data.aae008, //银联号
							}
							console.log('values: ', values);
							this.infoForm = {
								...this.infoForm,
								...values
							}
						}
					})
				})
			},
			//失业时间
			changeDff002(e) {
				let res = e.result
				this.infoForm.dff002 = res;
				this.dff002Show = false;
				this.$forceUpdate()
			},
			// 表单字段变更
			fromChange(e, formName, fieldName) {
				// 确保正确获取值，有些组件可能返回对象而不是直接的值
				const value = e && typeof e === 'object' ? e.value : e;
				this[formName][fieldName] = value;
				this.$forceUpdate();
			},
			// 下一步
			nextFn() {
				this.$refs.infoForm.validate((valid) => {
					console.log(valid, 'valid-----??????');
					if (valid) {
						// 验证通过，执行下一步操作
						this.headerIndex = 1;
					} else {
						// 验证失败，显示错误信息
						this.$message.error('请填写必填项');
					}
				});
			},
			// 保存失业保险金申请
			handleConfirmSybxj() {
				// 检查阅读并接受是否被选中
				if (!this.redRadioChecked) {
					this.$message.error('请先阅读并接受协议');
					return;
				}

				// 获取并检查材料列表
				const fileList = this.$refs.materialUploadTable.check() || []
				if (fileList[0].files.length === 0) {
					this.$message.error('请上传必要的材料');
					return;
				}
				this.infoForm.yhk032 = this.infoForm.yhk033
				// 准备参数
				const param = {
					no: '207-0028',
					data: JSON.stringify({
						...this.infoForm,
						providers: JSON.stringify(this.jfData),
						fileList: JSON.stringify(fileList)
					})
				}

				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data.code === '1') {
						this.$message.success(res.data.msg || '保存成功');
						this.headerIndex = 2; // 跳转到完成页面
					} else {
						this.$message.error(res.msg || '保存失败');
					}
				}, (error) => {
					// 添加失败回调，处理网络错误等情况
					this.$message.error('网络异常，请稍后重试');
					console.error('请求失败:', error);
				})
			},
			// 设置高度
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						terminalUtil._setIframeHeight(data.height)
					}
				}).exec()
			}
		}
	}
</script>

<style scoped>
	.service-page {
		padding: 20rpx;
	}

	.title-line-blue {
		height: 80rpx;
		background-color: #e6f4ff;
		border-left: 8rpx solid #1890ff;
		display: flex;
		align-items: center;
		padding-left: 24rpx;
		margin-bottom: 30rpx;
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.btn-box {
		margin-top: 60rpx;
		display: flex;
		justify-content: center;
	}

	.table-container {
		width: 100%;
		border: 1rpx solid #e8e8e8;
		margin-bottom: 40rpx;
	}

	.table-header,
	.table-row {
		display: flex;
		flex-wrap: nowrap;
	}

	.table-col {
		flex-shrink: 0;
		width: 180rpx;
		padding: 10rpx 5rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		border: 1rpx solid #e5e5e5;
		font-size: 28rpx;
	}

	.table-header .table-col {
		background-color: #f5f5f5;
		font-weight: bold;
	}

	.table-row:nth-child(even) {
		background-color: #fafafa;
	}

	/* 美化承诺书弹窗样式 */
	.u-modal {
		border-radius: 20rpx !important;
		overflow: hidden;
		box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.2) !important;
		animation: modalFadeIn 0.3s ease-out;
	}
	
	@keyframes modalFadeIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.u-modal__header {
		background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%) !important;
		color: white !important;
		padding: 36rpx 40rpx !important;
		position: relative;
	}
	
	.u-modal__header::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4rpx;
		background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
	}
	
	.u-modal__title {
		font-size: 36rpx !important;
		font-weight: 600 !important;
		color: white !important;
		text-align: center;
		letter-spacing: 2rpx;
	}
	
	.u-modal__content {
		padding: 40rpx !important;
		max-height: 70vh;
		overflow-y: auto;
		background-color: #fafafa;
	}
	
	.commitment-content {
		padding: 30rpx 20rpx;
		line-height: 2.2;
		font-size: 30rpx;
		color: #333;
		background-color: white;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		margin-bottom: 30rpx;
	}
	
	.commitment-content p {
		margin-bottom: 24rpx;
		text-indent: 60rpx;
		position: relative;
		transition: all 0.2s ease;
	}
	
	.commitment-content p:last-child {
		margin-bottom: 0;
	}
	
	.commitment-content p:hover {
		color: #1890ff;
	}
	
	.commitment-content p:first-child {
		text-indent: 0;
		font-weight: 600;
		color: #1890ff;
		text-align: center;
		margin-bottom: 40rpx;
		font-size: 32rpx;
	}
	
	/* 复选框样式优化 */
	.commitment-radio {
		margin-top: 30rpx;
		padding: 25rpx;
		background-color: #f0f9ff;
		border-radius: 12rpx;
		border: 1rpx solid #bae7ff;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.2s ease;
	}
	
	.commitment-radio:hover {
		background-color: #e6f7ff;
		box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.1);
	}
	
	.u-radio {
		font-size: 32rpx;
		color: #333;
		transition: all 0.2s ease;
	}
	
	.u-radio--active {
		color: #1890ff !important;
		font-weight: 500;
	}
	
	/* 按钮样式优化 */
	.u-modal__footer {
		padding: 30rpx 40rpx !important;
		border-top: 1rpx solid #e8e8e8;
		background-color: white;
		display: flex;
		gap: 30rpx;
		justify-content: center;
	}
	
	.u-button {
		min-width: 200rpx !important;
		height: 92rpx !important;
		font-size: 32rpx !important;
		border-radius: 46rpx !important;
		transition: all 0.3s ease !important;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}
	
	.u-button:hover:not(:disabled) {
		transform: translateY(-2rpx) scale(1.02);
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
	}
	
	.u-button--primary {
		background-color: #1890ff;
		border-color: #1890ff;
	}
	
	.u-button--primary:hover:not(:disabled) {
		background-color: #40a9ff !important;
		border-color: #40a9ff !important;
	}
	
	/* 滚动条美化 */
	.u-modal__content::-webkit-scrollbar {
		width: 8rpx;
	}
	
	.u-modal__content::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4rpx;
	}
	
	.u-modal__content::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4rpx;
		transition: background 0.2s ease;
	}
	
	.u-modal__content::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
	
	/* 移动端适配 */
	@media (max-width: 768px) {
		.u-modal {
			margin: 40rpx;
		}
		
		.u-modal__content {
			padding: 30rpx 20rpx !important;
		}
		
		.commitment-content {
			padding: 20rpx 15rpx;
		}
		
		.commitment-content p {
			font-size: 28rpx;
			text-indent: 40rpx;
			margin-bottom: 20rpx;
		}
		
		.u-modal__footer {
			padding: 20rpx !important;
			flex-direction: column;
			gap: 20rpx;
		}
		
		.u-button {
			width: 100%;
		}
	}
	</style>