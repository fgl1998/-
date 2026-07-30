<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="职业技能补贴申请" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"
			@back="handleBack"></h-navbar>
		<view class="service-box">
			<view class="form-page">
				<view class="uform">
					<u-form :model="infoForm" ref="infoForm" label-position="left" :rules="rules">
						<!-- 信息填写 -->
						<view class="title-line-blue">
							<view class="title">信息填写</view>
						</view>
						<u-form-item label="身份证号" prop="ysv021" label-width="150" required>
							<u-input v-model="infoForm.ysv021" :border="false" placeholder="请输入身份证号" @blur="fnCheck"
								@confirm="fnCheck" :disabled="isDisabledYsv021" />
						</u-form-item>
						<u-form-item label="姓名" prop="ysv011" label-width="150" required>
							<u-input v-model="infoForm.ysv011" :border="false" placeholder="请输入姓名"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="性别" prop="ysv012" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择性别" selectPrompt="请选择性别"
								collection="SEX" v-model="infoForm.ysv012"
								@change="fromChange($event, 'infoForm', 'ysv012')"></mini-picker>
						</u-form-item>
						<u-form-item label="出生年月" prop="ysv013" label-width="150" required>
							<u-input v-model="infoForm.ysv013" :border="false" placeholder="请选择出生年月"
								@click="ysv013Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ysv013Show" mode="date"
								@change="dateConfirmYsv013"></u-calendar>
						</u-form-item>
						<u-form-item label="享受补贴人员范围" prop="ysv022" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择享受补贴人员范围" selectPrompt="请选择享受补贴人员范围"
								collection="YHC462" v-model="infoForm.ysv022"
								@change="fromChange($event, 'infoForm', 'ysv022')"></mini-picker>
						</u-form-item>
						<u-form-item label="证书编号" prop="ysv028" label-width="150" required>
							<u-input v-model="infoForm.ysv028" :border="false" placeholder="请输入证书编号" @blur="fnChange"
								@confirm="fnChange" :disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="工种类型" prop="ysv023" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择工种类型" selectPrompt="请选择工种类型"
								:range="ysv023ListOptions" rangeLabel="name" rangeKey="id" v-model="infoForm.ysv023"
								@change="fromChange($event, 'infoForm', 'ysv023')"></mini-picker>
						</u-form-item>
						<u-form-item label="工种等级" prop="ysv024" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择工种等级" selectPrompt="请选择工种等级"
								:range="ysv024Options" v-model="infoForm.ysv024"
								@change="fromChange($event, 'infoForm', 'ysv024', fnSelect)"></mini-picker>
						</u-form-item>
						<u-form-item label="联系电话" prop="ysv025" label-width="150" required>
							<u-input v-model="infoForm.ysv025" :border="false" placeholder="请输入联系电话"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="证书类型" prop="ysv026" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择证书类型" selectPrompt="请选择证书类型"
								:range="ysv026Options" v-model="infoForm.ysv026"
								@change="fromChange($event, 'infoForm', 'ysv026')"></mini-picker>
						</u-form-item>
						<u-form-item label="证书取得时间" prop="ysv027" label-width="150" required>
							<u-input v-model="infoForm.ysv027" :border="false" placeholder="请选择证书取得时间"
								@click="ysv027Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ysv027Show" mode="date"
								@change="dateConfirmYsv027"></u-calendar>
						</u-form-item>
						<u-form-item label="开户行支行全称" prop="yhk032" label-width="150" required>
							<u-input v-model="infoForm.yhk032" :border="false" placeholder="请输入开户行支行全称"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="银行卡号" prop="yhk030" label-width="150" required>
							<u-input v-model="infoForm.yhk030" :border="false" placeholder="请输入银行卡号"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="审核地" prop="location" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择审核地" selectPrompt="请选择审核地"
								:range="locationOptions" v-model="infoForm.location"
								@change="fromChange($event, 'infoForm', 'location')"></mini-picker>
						</u-form-item>
						<u-form-item label="发证机构" prop="aab004" label-width="150" required>
							<u-input v-model="infoForm.aab004" :border="false" placeholder="请输入发证机构"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="补贴金额合计" prop="ysv045" label-width="150">
							<u-input v-model="infoForm.ysv045" :border="false" placeholder="" :disabled="true" />
						</u-form-item>

						<!-- 材料上传 -->
						<view class="title-line-blue">
							<view class="title">材料上传</view>
						</view>
						<view class="tips" @click="downloadTemplate">点击此处下载补贴申报表模板</view>
						<service-upload ref="materialUploadTable" :yda020="showUploadFile" :yda031="infoForm.ysv010" />

						<view class="btn-box">
							<u-button type="primary" @click="handleConfirm" style="width: 30%;">确认</u-button>
							<!-- <u-button @click="handleReset" style="width: 30%;">重置</u-button> -->
							<u-button @click="handleBack" style="width: 30%;">返回</u-button>
						</view>
					</u-form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import moment from 'moment'
	export default {
		name: 'appraisalSubsidyAdd',
		data() {
			return {
				ysv013Show: false,
				ysv027Show: false,
				showUploadFile: '505',
				isDisabled: false,
				isDisabledYsv021: false,
				userInfo: {},
				infoForm: {
					ysv010: '',
					aac001: '',
					ysv021: '',
					ysv011: '',
					ysv012: '',
					ysv013: '',
					ysv022: '',
					ysv028: '',
					ysv023: '',
					ysv024: '',
					ysv025: '',
					ysv026: '',
					ysv027: '',
					yhk032: '',
					yhk030: '',
					location: '',
					aab004: '',
					ysv045: '',
					aae017: ''
				},
				rules: {
					ysv021: [{
						required: true,
						message: '请输入身份证号',
						trigger: 'blur'
					}],
					ysv011: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					ysv012: [{
						required: true,
						message: '请选择性别',
						trigger: 'blur'
					}],
					ysv013: [{
						required: true,
						message: '请选择出生年月',
						trigger: 'blur'
					}],
					ysv022: [{
						required: true,
						message: '请选择享受补贴人员范围',
						trigger: 'blur'
					}],
					ysv028: [{
						required: true,
						message: '请输入证书编号',
						trigger: 'blur'
					}],
					ysv023: [{
						required: true,
						message: '请选择工种类型',
						trigger: 'blur'
					}],
					ysv024: [{
						required: true,
						message: '请选择工种等级',
						trigger: 'blur'
					}],
					ysv025: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur'
					}],
					ysv026: [{
						required: true,
						message: '请选择证书类型',
						trigger: 'blur'
					}],
					ysv027: [{
						required: true,
						message: '请选择证书取得时间',
						trigger: 'blur'
					}],
					yhk032: [{
						required: true,
						message: '请输入开户行支行全称',
						trigger: 'blur'
					}],
					yhk030: [{
						required: true,
						message: '请输入银行卡号',
						trigger: 'blur'
					}],
					location: [{
						required: true,
						message: '请选择审核地',
						trigger: 'blur'
					}],
					aab004: [{
						required: true,
						message: '请输入发证机构',
						trigger: 'blur'
					}]
				},
				// 自定义选项
				ysv023ListOptions: [],
				ysv024Options: [{
						label: '高级技师',
						value: '401'
					},
					{
						label: '技师',
						value: '402'
					},
					{
						label: '高级',
						value: '403'
					},
					{
						label: '中级',
						value: '404'
					},
					{
						label: '初级',
						value: '405'
					}
				],
				ysv026Options: [{
						label: '专项能力资格证书',
						value: '4'
					},
					{
						label: '职业技能等级认定证书',
						value: '6'
					}
				],
				locationOptions: [{
						label: '省本级',
						value: '5499'
					},
					{
						label: '拉萨',
						value: '5401'
					},
					{
						label: '林芝',
						value: '5404'
					},
					{
						label: '昌都',
						value: '5403'
					},
					{
						label: '那曲',
						value: '5424'
					},
					{
						label: '山南',
						value: '5422'
					},
					{
						label: '阿里',
						value: '5425'
					},
					{
						label: '日喀则',
						value: '5402'
					}
				]
			}
		},
		onLoad(options) {
			console.log('接收到的options:', options)
			if (options) {
				try {
					if (options.params) {
						// 解码并解析参数
						const decodedParams = decodeURIComponent(options.params)
						this.userInfo = JSON.parse(decodedParams)
					} else {
						this.userInfo = options
					}
					console.log('userInfo: ', this.userInfo);
				} catch (error) {
					console.error('参数解析失败:', error)
					this.$message.error('数据解析失败')
				}
			}
		},
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.$refs.infoForm.setRules(this.rules);
			this.$nextTick(() => {
				this.setHeight()
				this.init()
			})
		},
		onShow() {
			this.$nextTick(() => {
				this.setHeight()
			})
		},
		methods: {
			fromChange(e, formName, fieldName, callback) {
				console.log('e: ', e);
				const value = e.value || e.id || e
				this[formName][fieldName] = value
				if (callback && typeof callback === 'function') {
					callback(value)
				}
			},
			dateConfirmYsv013(e) {
				this.infoForm.ysv013 = e.result;
				this.ysv013Show = false
				this.$forceUpdate()
			},
			dateConfirmYsv027(e) {
				this.infoForm.ysv027 = e.result;
				this.ysv027Show = false
				this.$forceUpdate()
			},
			handleBack() {
				uni.navigateBack()
			},
			init() {
				// 根据是否存在ysv010判断是编辑模式还是新增模式
				const isEditMode = !!this.userInfo.ysv010;
				// 构建请求参数
				const requestData = {};
				if (isEditMode) {
					// 编辑模式：传递ysv021和ysv010
					requestData.ysv021 = this.userInfo.ysv021;
					requestData.ysv010 = this.userInfo.ysv010;
					this.infoForm.ysv010 = this.userInfo.ysv010;
				} else {
					// 新增模式：只传递certNo
					requestData.ysv021 = this.userInfo.certNo;
				}

				const param = {
					no: '496-0009',
					data: JSON.stringify(requestData)
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code === '1') {
							this.ysv023ListOptions = res.data.ysv023List || []
							console.log('this.ysv023ListOptions: ', this.ysv023ListOptions);
							if (isEditMode && res.data.dataMap) {
								// 将数据赋值给infoForm
								const dataMap = res.data.dataMap
								this.infoForm = {
									...this.infoForm,
									...dataMap
								}
								console.log('this.infoForm: ', this.infoForm);
							}
						}
						if (res.data.code === '0') {
							this.$message.error(res.data.msg || '查询失败')
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			// 身份证号校验
			fnCheck() {
				// 获取身份证号
				let idCard = this.infoForm.ysv021;
				if (!idCard) {
					return false;
				}
				// 只有当身份证号长度为18位时才进行校验
				if (idCard.length !== 18) {
					return false;
				}
				// 基本格式校验：18位，最后一位可能是X
				const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!reg.test(idCard)) {
					this.$message.error('身份证号格式不正确，请输入18位数字，最后一位可能为X');
					return false;
				}

				// 校验码验证
				const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

				let sum = 0;
				for (let i = 0; i < 17; i++) {
					sum += parseInt(idCard[i]) * weights[i];
				}

				const checkCode = codes[sum % 11];
				if (checkCode !== idCard[17].toUpperCase()) {
					this.$message.error('身份证号校验码错误，不是有效的身份证号');
					return false;
				}

				// 出生日期校验
				const year = parseInt(idCard.substr(6, 4));
				const month = parseInt(idCard.substr(10, 2));
				const day = parseInt(idCard.substr(12, 2));

				const date = new Date(year, month - 1, day);
				if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
					this.$message.error('身份证号中出生日期无效');
					return false;
				}

				//身份证验证成功后调用接口
				let param = {
					no: '496-0010',
					data: JSON.stringify({
						ysv021: idCard,
						yac002: this.userInfo.certNo
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						// 添加安全检查
						if (!res.data || typeof res.data.code === 'undefined') {
							this.$message.error('系统异常，响应数据格式错误');
							return;
						}

						if (res.data.code === '1') {
							// 验证成功：设置字段只读并填充表单
							this.isDisabledYsv021 = true;
							this.$message.success('身份证号验证通过');
							this.infoForm = {
								...this.infoForm,
								...res.data.data
							}
						} else if (res.data.code === '0') {
							// 验证失败：显示错误信息，清空相关字段并解除禁用
							this.$message.error(res.data.msg || '身份证号验证失败');
							this.infoForm.ysv021 = ''; // 清空身份证号字段
							// 失败时需要解除身份证号的禁用，允许用户重新输入
							this.isDisabledYsv021 = false;
						} else {
							// 处理其他未知状态码
							this.$message.error(`系统返回未知状态：${res.data.code}`);
							this.isDisabledYsv021 = false;
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			fnChange() {
				// 获取身份证号和证书编号
				let ysv021Number = this.infoForm.ysv021;
				let ysv028Number = this.infoForm.ysv028;

				// 验证必要参数
				if (!ysv021Number) {
					this.$message.error('请先输入身份证号');
					return;
				}
				if (!ysv028Number) {
					this.$message.error('请输入证书编号');
					return;
				}
				let param = {
					no: '496-0012',
					data: JSON.stringify({
						ysv028: ysv028Number,
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						// 添加安全检查
						if (!res.data || typeof res.data.code === 'undefined') {
							this.$message.error('系统异常，响应数据格式错误');
							return;
						}

						if (res.data.code === '1') {
							if (res.data.cerInfo) {
								const arr = res.data.cerInfo
								// 移除连字符并保留数字
								const processedYsv023 = (arr.ysv023 || '').toString().replace(/-/g, '');
								// 在选项列表中查找匹配项
								const matchingOption = this.ysv023ListOptions && Array.isArray(this
										.ysv023ListOptions) ?
									this.ysv023ListOptions.find(option => option.id === processedYsv023) :
									null;
								// 如果找到匹配项，回显中文名称；否则置空工种类型
								if (matchingOption) {
									this.infoForm.ysv023 = matchingOption.id; // 使用id字段
								} else {
									// 未找到匹配项，置空工种类型
									this.infoForm.ysv023 = '';
								}
								// 将数据赋值给infoForm
								for (const key in arr) {
									if (this.infoForm.hasOwnProperty(key)) {
										this.infoForm[key] = arr[key]
									}
								}
								// 根据工种等级设置补贴金额
								this.fnSelect(arr.ysv024);
							}
						} else if (res.data.code === '0') {
							this.$message.error(res.data.msg);
							this.infoForm.ysv028 = ''; // 清空证书编号字段
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			fnSelect(val) {
				console.log('val: ', val);
				// ysv024
				switch (val) {
					case '401':
						this.infoForm.ysv045 = '250';
						break;
					case '402':
						this.infoForm.ysv045 = '250';
						break;
					case '403':
						this.infoForm.ysv045 = '220';
						break;
					case '404':
						this.infoForm.ysv045 = '200';
						break;
					case '405':
						this.infoForm.ysv045 = '180';
						break;
					default:
						this.infoForm.ysv045 = '0';
						break;
				}
				this.$forceUpdate();
			},
			handleReset() {
				// 重置表单所有字段
				for (const key in this.infoForm) {
					if (key !== 'ysv010') {
						this.infoForm[key] = '';
					}
				}

				// 重置禁用状态
				this.isDisabled = false;
				this.isDisabledYsv021 = false;
			},
			handleConfirm() {
				// 先进行表单验证
				this.$refs.infoForm.validate((valid) => {
					if (!valid) {
						return;
					}

					// 获取表单数据
					const formData = this.infoForm;

					// 处理日期字段格式
					if (formData.ysv013) formData.ysv013 = moment(formData.ysv013).format('YYYY-MM-DD');
					if (formData.ysv027) formData.ysv027 = moment(formData.ysv027).format('YYYY-MM-DD');

					// 根据是否存在ysv010判断是编辑模式还是新增模式
					const isEditMode = !!this.userInfo.ysv010;
					if (!isEditMode) {
						// 新增模式：设置人员编号
						formData.aac001 = this.userInfo.ext03;
					}

					formData.aae017 = formData.location;

					// 获取上传的文件列表
					let fileList = [];
					if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
						fileList = this.$refs.materialUploadTable.check() || [];
					}

					// 安全地检查文件列表
					if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files
						.length === 0) {
						this.$message.error('请上传必要的材料');
						return;
					}

					const param = {
						no: '496-0011',
						data: JSON.stringify({
							...formData,
							fileList: JSON.stringify(fileList)
						})
					};

					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code === '1') {
							this.$message.success(res.data.msg || '保存成功');
							setTimeout(() => {
								uni.navigateBack();
							}, 1500);
						} else {
							this.$message.error(res.data.msg || '保存失败');
						}
					}, (error) => {
						// 添加失败回调，处理网络错误等情况
						console.error('接口调用失败:', error);
						this.$message.error('网络异常，请稍后重试');
					});
				});
			},
			downloadTemplate() {
				// 调用通用下载方法，使用POST请求下载认定表
				this.$base.commonDownload({
					method: 'get',
					url: '/api/file/downLoadWord',
					options: {
						fileName: '职业技能等级认定补贴申请表.xls',
					},
					fileName: '职业技能等级认定补贴申请表.xls'
				}).then(() => {
					console.log('职业技能等级认定补贴申请表下载成功');
				}).catch((error) => {
					console.error('下载职业技能等级认定补贴申请表失败', error);
					this.$message.error('下载失败，请重试');
				});
			},
			setHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height;
						if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
							terminalUtil._setIframeHeight(data.height);
						}
					}
				}).exec();
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import url("../../../static/css/sass/form.scss");
</style>