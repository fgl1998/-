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
						<u-form-item label="证件号码" prop="yac002" label-width="150">
							<u-input v-model="infoForm.yac002" :border="false" placeholder="证件号码" disabled />
						</u-form-item>
						<u-form-item label="姓名" prop="aac003" label-width="150">
							<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
						</u-form-item>
						<u-form-item label="性别" prop="aac004" label-width="150">
							<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="SEX"
								v-model="infoForm.aac004" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="民族" prop="aac005" label-width="150">
							<mini-picker disabled placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
								v-model="infoForm.aac005" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="出生年月" prop="aac006" label-width="150">
							<u-input v-model="infoForm.aac006" :border="false" placeholder="出生年月" disabled />
						</u-form-item>
						<u-form-item label="户口性质" prop="aac009" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择户口性质" selectPrompt="请选择户口性质"
								collection="AAC009" v-model="infoForm.aac009"
								@change="fromChange($event, 'infoForm', 'aac009')"></mini-picker>
						</u-form-item>
						<u-form-item label="户籍行政区划" prop="aab299" label-width="180" required>
							<u-input v-model="infoForm.aab299_desc" :border="false" placeholder="请选择户籍地址"
								:disabled="isDisabled" />
							<view class="addressBox" @click="openAreaSelector('infoForm','aab299')">
							</view>
						</u-form-item>
						<u-form-item label="户籍详细地址" prop="ycc004" label-width="180" required>
							<u-input v-model="infoForm.ycc004" :border="false" placeholder="请输入户籍详细地址"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="现住地址行政区划" prop="ycc299" label-width="180" required>
							<u-input v-model="infoForm.ycc299_desc" :border="false" placeholder="请选择现住地址"
								@click="openAreaSelector('infoForm','ycc299')" :disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="现住地址" prop="aac026" label-width="150" required>
							<u-input v-model="infoForm.aac026" :border="false" placeholder="请输入现住地址"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="个人身份" prop="ycc022" label-width="150">
							<mini-picker :disabled="isDisabled" placeholder="请选择个人身份" selectPrompt="请选择个人身份"
								collection="AAC012" v-model="infoForm.ycc022"
								@change="fromChange($event, 'infoForm', 'ycc022')"></mini-picker>
						</u-form-item>
						<u-form-item label="文化程度" prop="aac011" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择文化程度" selectPrompt="请选择文化程度"
								collection="AAC011" v-model="infoForm.aac011"
								@change="fromChange($event, 'infoForm', 'aac011', fnselect)"></mini-picker>
						</u-form-item>
						<u-form-item label="联系电话" prop="aae005" label-width="150" required>
							<u-input v-model="infoForm.aae005" :border="false" placeholder="请输入联系电话"
								:disabled="isDisabled" />
						</u-form-item>

						<!-- 学历信息 -->
						<view class="title-line-blue">
							<view class="title">学历信息</view>
						</view>
						<template>
							<u-form-item label="教育类别" prop="ycc03q" label-width="150" :required="showRequiredFields">
								<mini-picker :disabled="isDisabled" placeholder="请选择教育类别" selectPrompt="请选择教育类别"
									:range="ycc03qList" v-model="infoForm.ycc03q"
									@change="fromChange($event, 'infoForm', 'ycc03q')"></mini-picker>
							</u-form-item>
							<u-form-item label="毕业院校" prop="yau002" label-width="150" :required="showRequiredFields">
								<u-input v-model="infoForm.yau002" :border="false" placeholder="请输入毕业院校"
									:disabled="isDisabled" />
							</u-form-item>
							<u-form-item label="所学专业" prop="yac01f" label-width="150" :required="showRequiredFields">
								<u-input v-model="infoForm.yac01f" :border="false" placeholder="请输入所学专业"
									:disabled="isDisabled" />
							</u-form-item>
							<u-form-item label="毕业日期" prop="yac01g" label-width="150" required>
								<u-input v-model="infoForm.yac01g" :border="false" placeholder="请选择毕业日期"
									@click="yac01gShow = true" :disabled="isDisabled" />
								<u-calendar max-date="2099-12-31" v-model="yac01gShow" mode="date"
									@change="dateConfirmYac01g"></u-calendar>
							</u-form-item>
						</template>

						<!-- 失业登记信息 -->
						<view class="title-line-blue">
							<view class="title">失业登记信息</view>
						</view>
						<u-form-item label="是否申领失业保险" prop="ajc174" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择是否申领失业保险" selectPrompt="请选择是否申领失业保险"
								collection="YESORNO" v-model="infoForm.ajc174"
								@change="fromChange($event, 'infoForm', 'ajc174')"></mini-picker>
						</u-form-item>
						<u-form-item label="失业原因" prop="ycc028" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择失业原因" selectPrompt="请选择失业原因"
								collection="AJC093" v-model="infoForm.ycc028"
								@change="fromChange($event, 'infoForm', 'ycc028', fnSelects)"></mini-picker>
						</u-form-item>
						<u-form-item label="失业类型" prop="ycc027" label-width="150" required>
							<mini-picker disabled placeholder="请选择失业类型" selectPrompt="请选择失业类型" collection="YCC020_1"
								v-model="infoForm.ycc027" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="失业时间" prop="ycc024" label-width="150" required>
							<u-input v-model="infoForm.ycc024" :border="false" placeholder="请选择失业时间"
								@click="ycc024Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="ycc024Show" mode="date"
								@change="dateConfirmYcc024"></u-calendar>
						</u-form-item>
						<u-form-item label="失业前月收入情况" prop="ycc025" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择失业前月收入情况" selectPrompt="请选择失业前月收入情况"
								:range="incomeOptions" v-model="infoForm.ycc025"
								@change="fromChange($event, 'infoForm', 'ycc025')"></mini-picker>
						</u-form-item>
						<u-form-item label="原工作单位" prop="aab004" label-width="150">
							<u-input v-model="infoForm.aab004" :border="false" placeholder="没有则填无"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="求职意向" prop="ycc02h" label-width="150" required>
							<u-input v-model="infoForm.ycc02h" :border="false" placeholder="没有则填无"
								:disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="失业登记地类型" prop="acc412" label-width="150" required>
							<mini-picker :disabled="isDisabled" placeholder="请选择失业登记地类型" selectPrompt="请选择失业登记地类型"
								collection="ACC412" v-model="infoForm.acc412"
								@change="fromChange($event, 'infoForm', 'acc412')"></mini-picker>
						</u-form-item>
						<u-form-item label="失业登记日期" prop="aae043" label-width="150" required>
							<u-input v-model="infoForm.aae043" :border="false" placeholder="请选择失业登记日期" disabled />
						</u-form-item>
						<u-form-item label="就业登记地" prop="aae017" label-width="150" required>
							<u-input v-model="infoForm.aae017_desc" :border="false" placeholder="请选择就业登记地" disabled />
							<view class="addressBox" @click="openArea('infoForm','aae017_desc')"></view>
						</u-form-item>
						<u-form-item :label="'备注'" :prop="'ycc02m'" label-width="150" :required="ycc02mShow">
							<u-input v-model="infoForm.ycc02m" :border="false" placeholder="请输入"
								:disabled="isDisabled" />
						</u-form-item>

						<view class="btn-box">
							<u-button type="primary" @click="handleConfirm" v-show="headerIndex != 3"
								style="width: 100%;" :disabled="isDisabled">下一步</u-button>
						</view>
					</u-form>
				</view>
				<view v-show="headerIndex == 1">
					<view class="title-line-blue">
						<view class="title">材料上传</view>
					</view>
					<service-upload ref="materialUploadTable" :yda020="showUploadFile" />
					<view class="btn-box">
						<u-button @click="--headerIndex" style="width: 45%;">上一步</u-button>
						<u-button type="primary" @click="confirmSave" style="width: 45%;">确认提交</u-button>
					</view>
				</view>
				<service-complete v-show="headerIndex == 2" />
			</view>
		</view>
		<view v-if="!showAreaModal">
			<mini-address required label="期望工作地点" @addressBack="expectWorkPlaceChange" @clickMaskClose="clickMaskClose"
				:disabled="isDisabled" ref="addressRef"></mini-address>
		</view>
		<!-- 地址选择器弹窗-西藏 -->
		<aae017-select-tree ref="aae017SelectTree" :data="aae017Data" :showSearch="true" placeholder="请选择审核人社机构"
			:disabled="isDisabled" @change="handleAae017Change" />
		<!-- 树状选择器-所属行业 -->
		<tki-tree ref="tkitree" :range="treeData" rangeKey="title" confirmColor="#4e8af7" @confirm="confirmFn"
			:disabled="isDisabled" />
		<bankCard ref="bankCardRef" :allow-add="true" :params="paramsBankCard" :visible="visibleBank"
			:disabled="isDisabled" @onClose="closeBank" />
	</view>


</template>

<script>
	import moment from 'moment'
	import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	export default {
		name: 'UnemploymentRegistrationAdd',
		components: {
			aae017SelectTree,
			tkiTree
		},
		data() {
			return {
				headerIndex: 0,
				ycc02mShow: false,
				isDisabled: false,
				currentAreaField: 'ycc299',
				showAreaModal: true,
				showRequiredFields: false,
				yac01gShow: false,
				ycc024Show: false,
				userInfo: {},
				selectedAreaCodes: [],
				selectedAreaText: '',
				aae017DESC: '',
				infoForm: {
					yac002: '',
					aac003: '',
					aac004: '',
					aac005: '',
					aac006: '',
					aac009: '',
					aab299: '',
					ycc004: '',
					ycc299: '',
					aac026: '',
					ycc022: '',
					aac011: '',
					aae005: '',
					ycc03q: '',
					yau002: '',
					yac01f: '',
					yac01g: '',
					ajc174: '',
					ycc028: '',
					ycc027: '',
					ycc024: '',
					ycc025: '',
					aab004: '',
					ycc02h: '',
					acc412: '',
					aae043: '',
					aae017: '',
					ycc02m: '',
					aab301: '',
					ycc005: '',
					aac001: '',
					// 隐藏字段
					aab007: '',
					ycc020: '',
					aac021: '',
					ycc02e: '',
					aca111: '',
					ycc131: '',
					aab022: '',
					aab020: '',
					ycc029: '',
					ycc02j: '',
					ycc02k: '',
					aab009: '',
					aab003: '',
					aab001: '',
					ycc019: ''
				},
				rules: {
					aac009: [{
						required: true,
						message: '请选择户口性质',
						trigger: 'blur'
					}],
					aab299: [{
						required: true,
						message: '请选择户籍行政区划',
						trigger: 'blur'
					}],
					ycc004: [{
						required: true,
						message: '请输入户籍详细地址',
						trigger: 'blur'
					}],
					ycc299: [{
						required: true,
						message: '请选择现住地址行政区划',
						trigger: 'blur'
					}],
					aac026: [{
						required: true,
						message: '请输入现住地址',
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
					}],
					ajc174: [{
						required: true,
						message: '请选择是否申领失业保险',
						trigger: 'blur'
					}],
					ycc028: [{
						required: true,
						message: '请输入失业原因',
						trigger: 'blur'
					}],
					ycc027: [{
						required: true,
						message: '请选择失业类型',
						trigger: 'blur'
					}],
					ycc024: [{
						required: true,
						message: '请选择失业时间',
						trigger: 'blur'
					}],
					ycc025: [{
						required: true,
						message: '请选择失业前月收入情况',
						trigger: 'blur'
					}],
					ycc02h: [{
						required: true,
						message: '请输入求职意向',
						trigger: 'blur'
					}],
					acc412: [{
						required: true,
						message: '请选择失业登记地类型',
						trigger: 'blur'
					}],
					aae043: [{
						required: true,
						message: '请选择失业登记日期',
						trigger: 'blur'
					}],
					aae017: [{
						required: true,
						message: '请选择就业登记地',
						trigger: 'blur'
					}],

					// 学历信息验证
					ycc03q: [{
						required: false,
						message: '请选择教育类别',
						trigger: ['blur', 'change']
					}],
					yau002: [{
						required: false,
						message: '请输入毕业院校',
						trigger: ['blur', 'change']
					}],
					yac01f: [{
						required: false,
						message: '请输入所学专业',
						trigger: ['blur', 'change']
					}],
					yac01g: [{
						required: false,
						message: '请选择毕业日期',
						trigger: ['blur', 'change']
					}],

					ycc02m: [{
						required: false,
						message: '请填写备注',
						trigger: ['blur', 'change']
					}],

				},
				// 自定义选项
				educationTypeOptions: [{
						label: '全日制',
						value: '1'
					},
					{
						label: '非全日制',
						value: '2'
					}
				],
				incomeOptions: [{
						label: '2000以下',
						value: '1'
					},
					{
						label: '2000-3000',
						value: '2'
					},
					{
						label: '3000-5000',
						value: '3'
					},
					{
						label: '5000以上',
						value: '4'
					}
				],
				ycc03qList: [{
						label: '全日制',
						value: '1'
					},
					{
						label: '非全日制',
						value: '2'
					},
				],



				// 通用
				aae017Data: [],
				aae017Value: '',
				treeData: [],
				paramsBankCard: {},
				visibleBank: false,
				showUploadFile: '404',
			}
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
					// 设置当前日期为失业登记日期
					this.infoForm.aae043 = moment().format('YYYY-MM-DD')
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
			}
		},
		methods: {

			dateConfirmYac01g(e) {
				this.infoForm.yac01g = e.result;
				this.yac01gShow = false
				this.$forceUpdate()
			},
			dateConfirmYcc024(e) {
				this.infoForm.ycc024 = e.result;
				this.ycc024Show = false
				this.fnCheckTime(e.result)
				this.$forceUpdate()
			},
			query() {
				const param = {
					no: '404-0011',
					data: JSON.stringify({
						yac002: this.userInfo.certNo || '',
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code === '1') {
							let forms = res.data.info || {}
							forms.yac01g = this.$util.timeFormat(forms.yac01g)

							// 将数据赋值给infoForm
							this.infoForm = forms
							this.infoForm.aae043 = moment().format('YYYY-MM-DD')
							// 初始化文化程度相关字段
							this.fnselect();
						}
						if (res.data.code === '0') {
							this.$message.error(res.data.msg || '查询失败')
							if (res.data.formReadOnly === 'true') {
								this.isDisabled = true
							} else {
								this.isDisabled = false
							}
							let forms = res.data.info || {}
							this.infoForm = forms
							// 初始化文化程度相关字段
							this.fnselect();
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},
			init() {
				// 组件挂载后，检查是否有初始的就业困难人员类别值，如果有则更新材料列表
				setTimeout(() => {
					// 初始化就业地数据
					this.initAae017Data();
					this.query()
					// this.showUploadFile = ''
				}, 100);
			},
		


			//失业时间
			fnCheckTime(dateString) {
				// 使用传入的dateString直接进行日期比较
				let endTime = this.infoForm.aae043
				// 使用moment库进行日期比较
				if (moment(dateString).isAfter(moment(endTime))) {
					this.$message.error('失业日期不能大于失业登记日期')
					this.infoForm.ycc024 = ''
					return
				}
			},

			// 选择文化程度时的校验
			fnselect() {
				let value = this.infoForm.aac011;
				console.log('value: ', value);
				if (value == '11' || value == '14' || value == '20' || value == '30' || value == '40' || value ==
					'41') {
					// 设置为必填
					this.showRequiredFields = true;
					console.log('11: ', 11);
				} else {
					// 设置为非必填
					this.showRequiredFields = false;
					console.log('22: ', 22);
				}
				let changeRueList = ['ycc03q', 'yau002', 'yac01f', 'yac01g'];
				changeRueList.forEach(v => {
					this.rules[v][0].required = this.showRequiredFields
				})
				// 重新设置必填项
				this.$nextTick(() => {
					this.$refs.infoForm.setRules(this.rules);
				});
				this.fnSelects();
			},
			//失业原因
			fnSelects() {
				let value = this.infoForm.ycc028;
				console.log(value, '失业原因');
				if (value == '24' || value == '21' || value == '23' || value == '22' || value == '31') {
					this.infoForm.ycc027 = "10"
				} else if (value == '60' || value == '70' || value == '52' || value == '51' || value == '33' || value ==
					'40' ||
					value == '32' || value == '90') {
					this.infoForm.ycc027 = "30"
				} else if (value == '10') {
					this.infoForm.ycc027 = "20"
				}
				if (value == '90') {
					this.ycc02mShow = true
					this.rules.ycc02m[0].required = true
				} else {
					this.ycc02mShow = false
					this.rules.ycc02m[0].required = false
				}

				// 重新设置必填项
				this.$nextTick(() => {
					this.$refs.infoForm.setRules(this.rules);
				});
			},
			handleConfirm() {
				// 显示确认弹窗
				// uni.showModal({
				// 	title: '提示',
				// 	content: '本人承诺填报的以上内容均真实、准确、有效，如有实际情况不一致，本人愿意承担相应责任，同时纳入人社信用记录。',
				// 	showCancel: true,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.headerIndex++
				// 		}
				// 	}
				// })
				// 先进行表单验证
				this.$refs.infoForm.validate((valid) => {
					console.log('valid: ', valid);
					if (!valid) {
						return
					}

					// 获取表单数据
					const formData = this.infoForm

					// 获取当前日期作为经办日期
					const currentDate = moment()

					// 失业登记日期不能晚于经办日期
					if (formData.aae043) {
						const registerDate = moment(formData.aae043)
						// 添加isValid检查确保日期格式正确
						if (!registerDate.isValid()) {
							this.$message.error('失业登记日期格式不正确')
							return
						}
						if (registerDate.isAfter(currentDate, 'day')) {
							this.$message.error('失业登记日期不能晚于经办日期')
							return
						}
					}
					uni.showModal({
						title: '提示',
						content: '本人承诺填报的以上内容均真实、准确、有效，如有实际情况不一致，本人愿意承担相应责任，同时纳入人社信用记录。',
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
					// 获取表单数据
					const formData = {
						...this.infoForm
					}
					// 处理日期字段格式
					if (formData.yac01g) formData.yac01g = moment(formData.yac01g).format('YYYY-MM-DD')
					if (formData.ycc024) formData.ycc024 = moment(formData.ycc024).format('YYYY-MM-DD')
					// 设置个人编号
					formData.aac001 = this.userInfo.ext03 || ''

					// 获取上传的文件列表
					let fileList = []
					if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
						fileList = this.$refs.materialUploadTable.check() || []
					}
					if (fileList.length == 0) {
						return
					}
					// // 安全地检查文件列表
					// if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files.length ===
					// 	0) {
					// 	this.$message.error('请上传必要的材料')
					// 	return;
					// }

					const param = {
						no: '404-0012',
						data: JSON.stringify({
							...formData,
							fileList: JSON.stringify(fileList)
						})
					}

					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code === '1') {
							this.$message.error(res.data.msg || '保存成功')
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





			// 通用函数
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
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						terminalUtil._setIframeHeight(data.height)
					}
				}).exec()
			},
			clickMaskClose(e) {
				this.showAreaModal = true
			},
			// 设置期望工作地点
			expectWorkPlaceChange(lastObj) {
				this.showAreaModal = true
				this[this.formName][this.fieldName] = lastObj.areaid
				this[this.formName][this.fieldName + '_desc'] = lastObj.areaname
				this.$forceUpdate()
			},
			handleAae017Change(selected) {
				if (selected && selected.value && selected.label) {
					this[this.formName][this.areaField] = selected.label; //label
					this[this.formName][this.areaField.slice(0, -5)] = selected.value; //value--去除_desc
					this.$forceUpdate()
				}
			},
			openArea(formName = 'infoForm', fieldName = 'ycc299') {
				this.formName = formName;
				this.areaField = fieldName;
				this.$refs.aae017SelectTree.handleShowPopup()
			},
			openAreaSelector(formName = 'infoForm', fieldName = 'ycc299') {
				this.showAreaModal = false;
				this.$nextTick(() => {
					this.fieldName = fieldName;
					this.formName = formName;
					this.$refs.addressRef.handleShow()
				})
			},
			fromChange(e, formName, name, callback) {
				console.log('e, formName, name, : ', e, formName, name, );
				this[formName][name] = e.value
				this[formName][name + "_desc"] = e.name || e.label
				if (callback && typeof callback === 'function') {
					callback(e.value)
				}
			},
			workStartDateChange(e, formName, name) {
				this[formName][name] = e.detail.value
				this.$forceUpdate()
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import url("../../../static/css/sass/form.scss");
</style>