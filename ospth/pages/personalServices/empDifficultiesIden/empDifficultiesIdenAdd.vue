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
						<u-form-item label="证件号码" prop="yac002" label-width="150" required>
							<u-input v-model="infoForm.yac002" :border="false" placeholder="证件号码" disabled />
						</u-form-item>
						<u-form-item label="姓名" prop="aac003" label-width="150" required>
							<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
						</u-form-item>
						<u-form-item label="性别" prop="aac004" label-width="150" required>
							<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="SEX"
								v-model="infoForm.aac004"></mini-picker>
						</u-form-item>
						<u-form-item label="民族" prop="aac005" label-width="150" required>
							<mini-picker disabled placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
								v-model="infoForm.aac005"></mini-picker>
						</u-form-item>
						<u-form-item label="出生年月" prop="aac006" label-width="150" required>
							<u-input v-model="infoForm.aac006" :border="false" placeholder="出生年月" disabled />
						</u-form-item>
						<u-form-item label="文化程度" prop="aac011" label-width="150" required>
							<mini-picker disabled placeholder="请选择文化程度" selectPrompt="请选择文化程度" collection="AAC011"
								v-model="infoForm.aac011"></mini-picker>
						</u-form-item>
						<u-form-item label="户籍详细地址" prop="aac010" label-width="180" required>
							<u-input disabled v-model="infoForm.aac010" :border="false" placeholder="请输入户籍详细地址" />
						</u-form-item>
						<u-form-item label="家庭地址" prop="aae006" label-width="150" required>
							<u-input disabled v-model="infoForm.aae006" :border="false" placeholder="请输入家庭地址" />
						</u-form-item>
						<u-form-item label="联系电话" prop="aae005" label-width="150" required>
							<u-input disabled v-model="infoForm.aae005" :border="false" placeholder="请输入联系电话" />
						</u-form-item>


						<!-- 就业困难人员信息 -->
						<view class="title-line-blue">
							<view class="title">就业困难人员信息</view>
						</view>
						<u-form-item label="就业困难人员申请编号" prop="ycc130" label-width="180" v-show="false">
							<u-input v-model="infoForm.ycc130" :border="false" placeholder="" disabled
								style="display:none" />
						</u-form-item>
						<u-form-item label="就业困难人员类别" prop="ycc131" label-width="180" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择就业困难人员类别" selectPrompt="请选择就业困难人员类别"
								collection="YCC131_RD" v-model="infoForm.ycc131"
								@change="fromChange($event, 'infoForm', 'ycc131', fnSelect)"></mini-picker>
						</u-form-item>
						<u-form-item label="领取失业保险金情况" prop="aae013" label-width="180" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择领取失业保险金情况" selectPrompt="请选择领取失业保险金情况"
								:range="aae013Options" v-model="infoForm.aae013"
								@change="fromChange($event, 'infoForm', 'aae013')"></mini-picker>
						</u-form-item>
						<u-form-item label="是否援助对象" prop="ycc13g" label-width="180" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择是否援助对象" selectPrompt="请选择是否援助对象"
								collection="YESORNO" v-model="infoForm.ycc13g"
								@change="fromChange($event, 'infoForm', 'ycc13g', fnYzSelect)"></mini-picker>
						</u-form-item>
						<u-form-item label="就业援助起始日期" prop="ycc136" label-width="180" :required="ycc13gYes">
							<u-input v-model="infoForm.ycc136" :border="false" placeholder="请选择就业援助起始日期"
								@click="ycc136Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ycc136Show" mode="date"
								@change="dateConfirmYcc136"></u-calendar>
						</u-form-item>
						<u-form-item label="就业援助结束日期" prop="ycc137" label-width="180" :required="ycc13gYes">
							<u-input v-model="infoForm.ycc137" :border="false" placeholder="请选择就业援助结束日期"
								@click="ycc137Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ycc137Show" mode="date"
								@change="dateConfirmYcc137"></u-calendar>
						</u-form-item>
						<u-form-item label="援助项" prop="ycc025" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择援助项" selectPrompt="请选择援助项"
								collection="YCC025_YZX" v-model="infoForm.ycc025"
								@change="fromChange($event, 'infoForm', 'ycc025')"></mini-picker>
						</u-form-item>
						<u-form-item label="援助完成情况" prop="ycc026" label-width="180" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择援助完成情况" selectPrompt="请选择援助完成情况"
								collection="YCC026_YZWC" v-model="infoForm.ycc026"
								@change="fromChange($event, 'infoForm', 'ycc026')"></mini-picker>
						</u-form-item>
						<u-form-item label="就业创业证编号" prop="aac021" label-width="180" required>
							<u-input disabled v-model="infoForm.aac021" :border="false" placeholder="请输入就业创业证编号" />
						</u-form-item>
						<u-form-item label="失业时间" prop="ycc024" label-width="150" required>
							<u-input v-model="infoForm.ycc024" :border="false" placeholder="请选择失业时间"
								@click="ycc024Show = true" disabled />
							<u-calendar max-date="2099-12-31" v-model="ycc024Show" mode="date"
								@change="dateConfirmYcc024"></u-calendar>
						</u-form-item>
						<u-form-item label="就业困难人员认定时间" prop="ycc13d" label-width="180" required>
							<u-input v-model="infoForm.ycc13d" :border="false" placeholder="请选择就业困难人员认定时间"
								@click="ycc13dShow = true" disabled />
							<u-calendar max-date="2099-12-31" v-model="ycc13dShow" mode="date"
								@change="dateConfirmYcc13d"></u-calendar>
						</u-form-item>
						<u-form-item label="审核地" prop="aae017" label-width="150" required>
							<u-input v-model="infoForm.aae017_desc" :border="false" placeholder="请选择审核地"
								:disabled="isDisabled" />
							<view class="addressBox" @click="openArea('infoForm','aae017_desc')"></view>
						</u-form-item>

						<view class="btn-box">
							<u-button type="primary" @click="handleConfirm" v-show="headerIndex != 3"
								style="width: 100%;" :disabled="isDisabled">下一步</u-button>
						</view>
					</u-form>
				</view>
				<view v-show="headerIndex == 1">
					<!-- <view > -->
					<view class="title-line-blue">
						<view class="title">材料上传</view>
					</view>
					<view class="tips" @click="downloadTemplate">点击此处下载就业业困难人员申请认定表</view>
					<service-upload ref="materialUploadTable" :yda020="showUploadFile" />
					<view class="btn-box">
						<u-button @click="--headerIndex" style="width: 45%;">上一步</u-button>
						<u-button type="primary" @click="confirmSave" style="width: 45%;">确认提交</u-button>
					</view>
				</view>
				<service-complete v-show="headerIndex == 2" />
			</view>
		</view>
		<!-- 地址选择器弹窗-西藏 -->
		<aae017-select-tree ref="aae017SelectTree" :data="aae017Data" :showSearch="true" placeholder="请选择审核人社机构"
			:disabled="isDisabled" @change="handleAae017Change" />
	</view>
</template>

<script>
	import moment from 'moment'
	import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'
	export default {
		name: 'empDifficultiesIdenAdd',
		components: {
			aae017SelectTree
		},
		data() {
			return {
				headerIndex: 0,
				isDisabled: false,
				ycc13gYes: false,
				ycc136Show: false,
				ycc137Show: false,
				ycc024Show: false,
				ycc13dShow: false,
				userInfo: {},
				showUploadFile: '',
				// 通用
				aae017Data: [],
				aae017Value: '',
				aae017DESC: '',
				formName: 'infoForm',
				areaField: 'aae017_desc',
				infoForm: {
					yac002: '',
					aac003: '',
					aac004: '',
					aac005: '',
					aac006: '',
					aac011: '',
					aac010: '',
					aae006: '',
					aae005: '',
					aac021: '',
					ycc130: '',
					ycc131: '',
					aae013: '',
					ycc13g: '',
					ycc136: '',
					ycc137: '',
					ycc025: '',
					ycc026: '',
					ycc024: '',
					ycc13d: '',
					aae017: '',
					aae017_desc: '',
					aac001: ''
				},
				rules: {
					yac002: [{
						required: true,
						message: '请输入证件号码',
						trigger: 'blur'
					}],
					aac003: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					aac006: [{
						required: true,
						message: '请选择出生年月',
						trigger: 'blur'
					}],
					ycc131: [{
						required: true,
						message: '请选择就业困难人员类别',
						trigger: 'blur'
					}],
					aae013: [{
						required: true,
						message: '请选择领取失业保险金情况',
						trigger: 'blur'
					}],
					ycc13g: [{
						required: true,
						message: '请选择是否援助对象',
						trigger: 'blur'
					}],
					ycc136: [{
						required: false,
						message: '请选择就业援助起始日期',
						trigger: 'blur'
					}],
					ycc137: [{
						required: false,
						message: '请选择就业援助结束日期',
						trigger: 'blur'
					}],
					ycc025: [{
						required: true,
						message: '请选择援助项',
						trigger: 'blur'
					}],
					ycc026: [{
						required: true,
						message: '请选择援助完成情况',
						trigger: 'blur'
					}],
					ycc024: [{
						required: true,
						message: '请选择失业时间',
						trigger: 'blur'
					}],
					ycc13d: [{
						required: true,
						message: '请选择就业困难人员认定时间',
						trigger: 'blur'
					}],
					aae017: [{
						required: true,
						message: '请选择审核地',
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
					aac011: [{
						required: true,
						message: '请选择文化程度',
						trigger: 'blur'
					}],
					aae005: [{
						required: true,
						message: '请输入联系电话',
						trigger: 'blur'
					}, {
						pattern: /^1[3-9]\d{9}$/,
						message: '请输入正确的手机号码格式',
						trigger: 'blur'
					}],
					aac010: [{
						required: true,
						message: '请输入户籍详细地址',
						trigger: 'blur'
					}],
					aae006: [{
						required: true,
						message: '请输入家庭地址',
						trigger: 'blur'
					}],
					aac021: [{
						required: true,
						message: '请输入就业创业证编号',
						trigger: 'blur'
					}]
				},
				aae013Options: [{
						label: '领取失业保险金期间',
						value: '1'
					},
					{
						label: '领取失业保险金期满',
						value: '2'
					},
					{
						label: '本次失业不享受失业保险待遇',
						value: '3'
					}
				]
			}
		},
		onLoad(options) {
			console.log('接收到的options:', options)
			if (options.params) {
				try {
					// 解码并解析参数
					const decodedParams = decodeURIComponent(options.params)
					const params = JSON.parse(decodedParams)
					console.log('params: ', params);
					this.userInfo = params;
					// 设置当前日期为就业困难人员认定时间
					this.infoForm.ycc13d = moment().format('YYYY-MM-DD')
				} catch (error) {
					console.error('参数解析失败:', error)
					this.$message.error('数据解析失败')
				}
			} else {
				this.$message.error('缺少必要参数')
			}
		},
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.$nextTick(() => {
				this.setHeight()
				this.init()
				this.$refs.infoForm.setRules(this.rules);
			})
		},
		onShow() {
			this.$nextTick(() => {
				this.setHeight()
			})
		},
		watch: {
			headerIndex: {
				handler: function(newVal, oldVal) {
					console.log('newVal, oldVal: ', newVal, oldVal);
					this.$nextTick(() => {
						this.setHeight()
					})
				}
			},
			ycc13gYes: {
				handler: function(newVal) {
					this.rules.ycc136[0].required = newVal
					this.rules.ycc137[0].required = newVal
					this.$nextTick(() => {
						if (this.$refs.infoForm) {
							this.$refs.infoForm.setRules(this.rules)
						}
					})
				}
			}
		},
		methods: {
			downloadTemplate() {
				// 调用通用下载方法，使用POST请求下载认定表
				this.$base.commonDownload({
					method: 'get',
					url: '/api/file/downLoadWord',
					options: {
						fileName: 'RD001.docx',
					},
					fileName: '就业困难人员申请认定表.docx'
				}).then(() => {
					console.log('下载就业困难人员申请认定表成功')
				}).catch((error) => {
					console.error('下载就业困难人员申请认定表失败', error)
					this.$message.error('下载失败，请重试')
				})
			},
			dateConfirmYcc136(e) {
				this.infoForm.ycc136 = e.result
				this.ycc136Show = false
				this.$forceUpdate()
			},
			dateConfirmYcc137(e) {
				this.infoForm.ycc137 = e.result
				this.ycc137Show = false
				this.$forceUpdate()
			},
			dateConfirmYcc024(e) {
				this.infoForm.ycc024 = e.result
				this.ycc024Show = false
				this.$forceUpdate()
			},
			dateConfirmYcc13d(e) {
				this.infoForm.ycc13d = e.result
				this.ycc13dShow = false
				this.$forceUpdate()
			},
			init() {
				const param = {
					no: '409-0005',
					data: JSON.stringify({
						yac002: this.userInfo.certNo || '',
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code === '1') {
							let forms = res.data.info || {}
							// 格式化日期字段
							this.formatDateFields(forms)
							// 将数据赋值给infoForm
							this.infoForm = {
								...this.infoForm,
								...forms
							}
						}
						if (res.data.code === '0') {
							this.$message.error(res.data.msg || '查询失败')
							if (res.data.formReadOnly === 'true') {
								this.isDisabled = true
							} else {
								this.isDisabled = false
							}
							let forms = res.data.ac01Info || {}
							// 格式化日期字段
							this.formatDateFields(forms)
							// 将数据赋值给infoForm
							this.infoForm = {
								...this.infoForm,
								...forms
							}
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})

				// 初始化就业地数据
				setTimeout(() => {
					this.initAae017Data();
				}, 100);
			},
			// 格式化日期字段
			formatDateFields(formData) {
				// 需要格式化的日期字段列表
				const dateFields = ['aac006', 'ycc136', 'ycc137', 'ycc024', 'ycc13d']
				dateFields.forEach(field => {
					if (formData[field]) {
						// 如果是moment对象或Date对象，转换为YYYY-MM-DD格式的字符串
						if (formData[field].format || formData[field] instanceof Date) {
							formData[field] = moment(formData[field]).format('YYYY-MM-DD')
						}
					}
				})
			},
			// 初始化就业地数据
			async initAae017Data() {
				const selectTree = this.$refs.aae017SelectTree;
				if (selectTree && selectTree.queryAae017Data) {
					try {
						// 调用组件内置的查询方法，传入证件号码
						this.aae017Data = await selectTree.queryAae017Data(this.userInfo.certNo);
					} catch (error) {
						console.error('初始化就业地数据失败:', error);
						this.$message.error('获取就业地数据失败，请重试');
					}
				}
			},
			// 选择就业困难人员类别时的处理
			fnSelect(value) {
				console.log('value: ', value);
				if (value == '010' || value == '020' || value == '050' || value == '070') {
					this.showUploadFile = '409_6'
				} else if (value == '030') {
					this.showUploadFile = '409_1'
				} else if (value == '040') {
					this.showUploadFile = '409_2'
				} else if (value == '060') {
					this.showUploadFile = '409_3'
				} else if (value == '080') {
					this.showUploadFile = '409_4'
				} else if (value == '990') {
					this.showUploadFile = '409_5'
				} else {
					this.showUploadFile = ''
				}
			},
			// 选择是否援助对象时的处理
			fnYzSelect(value) {
				console.log('value: ', value);
				this.ycc13gYes = value == '1'
			},
			handleConfirm() {
				// 先进行表单验证
				this.$refs.infoForm.validate((valid) => {
					console.log('valid: ', valid);
					if (!valid) {
						return
					}

					uni.showModal({
						title: '提示',
						content: '本人目前处理失业状态，申请认定就业困难人员，并愿意接受人力资源社会保障部门提供的各项就业服务。本人所提供的申请资料真是有效，如有虚假，愿承担相应的法律责任。',
						showCancel: true,
						success: (res) => {
							if (res.confirm) {
								this.headerIndex++
							}
						}
					})
				})
			},
			// 确认保存
			confirmSave() {
				try {
					// 先验证表单数据的业务逻辑
					if (!this.fnCheckTime()) {
						return
					}

					// 获取表单数据
					const formData = {
						...this.infoForm
					}

					// 验证审核地，不允许选择西藏自治区服务中心
					if (formData.aae017 === '5400000000') {
						this.$message.error('请选择西藏自治区服务中心进行审核!')
						return
					}

					// 处理日期字段格式
					// if (formData.ycc136) formData.ycc136 = moment(formData.ycc136).format('YYYY-MM-DD')
					// if (formData.ycc137) formData.ycc137 = moment(formData.ycc137).format('YYYY-MM-DD')
					// if (formData.ycc024) formData.ycc024 = moment(formData.ycc024).format('YYYY-MM-DD')
					// if (formData.ycc13d) formData.ycc13d = moment(formData.ycc13d).format('YYYY-MM-DD')

					// 设置个人编号
					formData.aac001 = this.userInfo.ext03 || ''
					formData.aae017DESC = this.infoForm.aae017_desc || ''

					// 获取上传的文件列表
					let fileList = []
					if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
						fileList = this.$refs.materialUploadTable.check() || []
					}

					// 安全地检查文件列表
					if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files.length ===
						0) {
						this.$message.error('请上传必要的材料')
						return;
					}

					const param = {
						no: '409-0006',
						data: JSON.stringify({
							...formData,
							fileList: JSON.stringify(fileList)
						})
					}

					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code === '1') {
							this.$message.success(res.data.msg || '保存成功')
							this.headerIndex++
						} else {
							this.$message.error(res.data.msg || '保存失败')
						}
					}, (error) => {
						// 添加失败回调，处理网络错误等情况
						console.error('接口调用失败:', error)
						this.$message.error('网络异常，请稍后重试')
					})
				} catch (error) {
					console.error('confirmSave方法执行出错:', error)
					this.$message.error('处理数据时发生错误，请检查表单数据')
				}
			},
			// 日期检查函数
			fnCheckTime() {
				// 验证援助起始日期和结束日期的关系
				if (this.infoForm.ycc13g === '1') {
					if (this.infoForm.ycc136 && this.infoForm.ycc137) {
						const startDate = moment(this.infoForm.ycc136)
						const endDate = moment(this.infoForm.ycc137)

						if (endDate.isBefore(startDate)) {
							this.$message.error('就业援助结束日期不能早于起始日期')
							return false
						}
					}
				}

				// 验证失业时间和认定时间的关系
				if (this.infoForm.ycc024 && this.infoForm.ycc13d) {
					const unemployedDate = moment(this.infoForm.ycc024)
					const recognizeDate = moment(this.infoForm.ycc13d)

					if (recognizeDate.isBefore(unemployedDate)) {
						this.$message.error('就业困难人员认定时间不能早于失业时间')
						return false
					}
				}

				// 验证认定时间不能晚于当前日期
				if (this.infoForm.ycc13d) {
					const recognizeDate = moment(this.infoForm.ycc13d)
					const currentDate = moment()

					if (recognizeDate.isAfter(currentDate)) {
						this.$message.error('就业困难人员认定时间不能晚于当前日期')
						return false
					}
				}

				return true
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
			handleAae017Change(selected) {
				if (selected && selected.value && selected.label) {
					this[this.formName][this.areaField] = selected.label; //label
					this[this.formName][this.areaField.slice(0, -5)] = selected.value; //value--去除_desc
					this.$forceUpdate()
				}
			},
			openArea(formName = 'infoForm', fieldName = 'aae017_desc') {
				this.formName = formName;
				this.areaField = fieldName;
				this.$refs.aae017SelectTree.handleShowPopup()
			},
			fromChange(e, formName, name, callback) {
				console.log('e, formName, name, : ', e, formName, name, );
				this[formName][name] = e.value
				this[formName][name + "_desc"] = e.name || e.label
				if (callback && typeof callback === 'function') {
					callback(e.value)
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import url("../../../static/css/sass/form.scss");
</style>