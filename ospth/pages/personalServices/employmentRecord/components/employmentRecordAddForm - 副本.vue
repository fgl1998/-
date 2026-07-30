<template>
	<view class="form-page">
		<!-- 按钮操作区 -->
		<view class="modal-btn">
			<u-button @click="handleReset" type="default">重置</u-button>
			<u-button @click="handleConfirm" type="primary">确认</u-button>
			<u-button @click="test" type="primary">测试</u-button>
		</view>
		<view class="uform">
			<u-form :model="infoForm" ref="infoForm" label-position="left" :rules="rules">
				<!-- 个人基本信息 -->
				<view class="title-line-blue">
					<view class="title">个人基本信息</view>
				</view>
				<!-- 银行卡组件 -->
				<!-- 	<u-form-item label="银行卡" prop="acb202" label-width="150" required>
					<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="请选择银行卡" disabled />
					<view class="addressBox" @click="visibleBank = true">
					</view>
				</u-form-item> -->
				<!-- 时间选择组件 -->
				<!-- <u-form-item label="请选择时间" prop="aae030" label-width="150" required>
					<picker ref="pickerRef" mode="date" start="1920-01-01" end="2050-09-01"
						@change="workStartDateChange($event,'infoForm','aae030')">
						<view class="conmmon-picker">
							<view v-if="infoForm.aae030">{{infoForm.aae030}}</view>
							<view class="placeholder" v-if="!infoForm.aae030">请选择时间</view>
						</view>
					</picker>
				</u-form-item> -->
				<!-- 时间组件-日历写法 -->
				<!-- <u-form-item label="毕业日期" prop="yac01g" label-width="150" required>
					<u-input v-model="infoForm.yac01g" :border="false" placeholder="请选择毕业日期"
						@click="yac01gShow = true" :disabled="isDisabled" />
					<u-calendar max-date="2099-12-31" v-model="yac01gShow" mode="date" @change="dateConfirmYac01g"></u-calendar>
				</u-form-item> -->
				<!-- 区域选择组件-西藏限定 -->
				<!-- <u-form-item label="期望工作地点" prop="acb202" label-width="150" required>
					<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="期望工作地点" disabled />
					<view class="addressBox" @click="openArea('infoInfm','acb202_desc')"></view>
				</u-form-item> -->
				<!-- 区域选择组件-全国 -->
				<!-- <u-form-item label="期望工作地点" prop="acb202" label-width="150" required>
					<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="请选择期望工作地点" disabled />
					<view class="addressBox" @click="handleAddress">
					</view>
				</u-form-item> -->

				<u-form-item label="身份证号" prop="yac002" label-width="150" required>
					<u-input v-model="infoForm.yac002" :border="false" placeholder="身份证号" disabled />
				</u-form-item>
				<u-form-item label="姓名" prop="aac003" label-width="150" required>
					<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
				</u-form-item>
				<u-form-item label="性别" prop="aac004" label-width="150" required>
					<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="SEX"
						v-model="infoForm.aac004" @change="fromChange($event, 'infoForm', 'aac004')"></mini-picker>
				</u-form-item>
				<u-form-item label="民族" prop="aac005" label-width="150" required>
					<mini-picker placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005" v-model="infoForm.aac005"
						@change="fromChange($event, 'infoForm', 'aac005')" disabled></mini-picker>
				</u-form-item>
				<u-form-item label="出生年月" prop="aac006" label-width="150" required>
					<u-input v-model="infoForm.aac006" :border="false" placeholder="出生年月" disabled />
				</u-form-item>
				<u-form-item label="户口性质" prop="aac009" label-width="150" required>
					<mini-picker placeholder="请选择户口性质" selectPrompt="请选择户口性质" collection="AAC009"
						v-model="infoForm.aac009" @change="fromChange($event, 'infoForm', 'aac009')"></mini-picker>
				</u-form-item>
				<u-form-item label="户籍行政区划" prop="aab299" label-width="180" required>
					<u-input v-model="infoForm.aab299_desc" :border="false" placeholder="请选择户籍地址"
						:disabled="isDisabled" />
					<view class="addressBox" @click="openAreaSelector('infoForm','aab299')">
					</view>
				</u-form-item>
				<u-form-item label="户籍详细地址" prop="ycc004" label-width="180" required>
					<u-input v-model="infoForm.ycc004" :border="false" placeholder="请输入户籍详细地址" :disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="现住地址行政区划" prop="ycc299" label-width="180" required>
					<u-input v-model="infoForm.ycc299_desc" :border="false" placeholder="请选择现住地址"
						@click="openAreaSelector('infoForm','ycc299')" :disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="现住地址" prop="aac026" label-width="150" required>
					<u-input v-model="infoForm.aac026" :border="false" placeholder="请输入现住地址" :disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="个人身份" prop="ycc022" label-width="150">
					<mini-picker placeholder="请选择个人身份" selectPrompt="请选择个人身份" collection="YCC022"
						v-model="infoForm.ycc022" @change="fromChange($event, 'infoForm', 'ycc022')"></mini-picker>
				</u-form-item>
				<u-form-item label="文化程度" prop="aac011" label-width="150" required>
					<mini-picker placeholder="请选择文化程度" selectPrompt="请选择文化程度" collection="AAC011"
						v-model="infoForm.aac011"
						@change="fromChange($event, 'infoForm', 'aac011',fnselect)"></mini-picker>
				</u-form-item>
				<u-form-item label="联系电话" prop="aae005" label-width="150" required>
					<u-input v-model="infoForm.aae005" :border="false" placeholder="请输入联系电话" :disabled="isDisabled" />
				</u-form-item>

				<!-- 学历信息 -->
				<view class="title-line-blue">
					<view class="title">学历信息</view>
				</view>
				<template>
					<u-form-item label="教育类别" prop="ycc03q" label-width="150" :required="showRequiredFields">
						<mini-picker placeholder="请选择教育类别" selectPrompt="请选择教育类别" :range="ycc03qList"
							v-model="infoForm.ycc03q" @change="fromChange($event, 'infoForm', 'ycc03q')"></mini-picker>
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


				<!-- 就业登记信息 -->
				<view class="title-line-blue">
					<view class="title">就业登记信息</view>
				</view>
				<u-form-item label="就业形式" prop="yhc407" label-width="150" required>
					<mini-picker placeholder="请选择就业形式" selectPrompt="请选择就业形式" collection="ADC111"
						v-model="infoForm.yhc407"
						@change="fromChange($event, 'infoForm', 'yhc407', fnSelects)"></mini-picker>
				</u-form-item>
				<u-form-item label="现工作单位" prop="aab004" label-width="150" :required="formFieldsRequired.aab004">
					<u-input v-model="infoForm.aab004" :border="false" placeholder="请输入现工作单位" :disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="就业单位区域" prop="ycc03n" label-width="180" v-if="formFieldsVisibility.ycc03n"
					:required="formFieldsRequired.ycc03n">
					<u-input v-model="infoForm.ycc03n" :border="false" placeholder="请输入就业单位区域" :disabled="isDisabled"
						:maxlength="5" />
				</u-form-item>
				<u-form-item label="所属行业" prop="ycc064" label-width="150" :required="formFieldsRequired.ycc064">
					<u-input v-model="infoForm.ycc064_desc" :border="false" placeholder="请选择所属行业"
						:disabled="isDisabled" />
					<view class="addressBox" @click="$refs.tkitree._show()"></view>
				</u-form-item>
				<u-form-item label="是否自主创业" prop="adc113" label-width="150" v-if="formFieldsVisibility.adc113"
					:required="formFieldsRequired.adc113">
					<mini-picker placeholder="请选择是否自主创业" selectPrompt="请选择是否自主创业" collection="YESORNO"
						v-model="infoForm.adc113" @change="fromChange($event, 'infoForm', 'adc113')"></mini-picker>
				</u-form-item>
				<u-form-item label="月平均工资" prop="ycc025" label-width="150">
					<u-input v-model="infoForm.ycc025" :border="false" placeholder="请输入月平均工资" :disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="就业日期" prop="ycc039" label-width="150" required>
					<u-input v-model="infoForm.ycc039" :border="false" placeholder="请选择就业日期" @click="ycc039Show = true"
						:disabled="isDisabled" />
					<u-calendar max-date="2099-12-31" v-model="ycc039Show" mode="date"
						@change="dateConfirmYcc039"></u-calendar>
				</u-form-item>
				<u-form-item label="是否签订劳动合同" prop="ycc03r" label-width="180" required>
					<mini-picker placeholder="请选择是否签订劳动合同" selectPrompt="请选择是否签订劳动合同" collection="YESORNO"
						v-model="infoForm.ycc03r"
						@change="fromChange($event, 'infoForm', 'ycc03r', fnelect)"></mini-picker>
				</u-form-item>
				<u-form-item label="合同开始日期" prop="aae031" label-width="180" v-if="formFieldsVisibility.aae031">
					<u-input v-model="infoForm.aae031" :border="false" placeholder="请选择合同开始日期"
						@click="aae031Show = true" :disabled="isDisabled" />
					<u-calendar max-date="2099-12-31" v-model="aae031Show" mode="date"
						@change="dateConfirmAae031"></u-calendar>
				</u-form-item>
				<u-form-item label="合同结束日期" prop="aae032" label-width="180" v-if="formFieldsVisibility.aae032">
					<u-input v-model="infoForm.aae032" :border="false" placeholder="请选择合同结束日期"
						@click="aae032Show = true" :disabled="isDisabled" />
					<u-calendar max-date="2099-12-31" v-model="aae032Show" mode="date"
						@change="dateConfirmAae032"></u-calendar>
				</u-form-item>
				<u-form-item label="合同年限" prop="ycc035" label-width="150" v-if="formFieldsVisibility.ycc035">
					<u-input v-model="infoForm.ycc035" :border="false" placeholder="自动计算" disabled />
				</u-form-item>
				<u-form-item label="就业登记日期" prop="aae043" label-width="150" required>
					<u-input v-model="infoForm.aae043" :border="false" placeholder="就业登记日期" disabled />
				</u-form-item>
				<u-form-item label="就业登记地" prop="aae017" label-width="150" required>
					<mini-picker :disabled="isDisabled" placeholder="请选择就业登记地" selectPrompt="请选择就业登记地"
						collection="AAE017" v-model="infoForm.aae017"
						@change="fromChange($event, 'infoForm', 'aae017')"></mini-picker>
				</u-form-item>
				<u-form-item label="劳务派遣单位名称" prop="ycc03m" label-width="180" v-if="formFieldsVisibility.ycc03m"
					:required="formFieldsRequired.ycc03m">
					<u-input v-model="infoForm.ycc03m" :border="false" placeholder="请输入劳务派遣单位名称"
						:disabled="isDisabled" />
				</u-form-item>
				<u-form-item label="灵活就业方式" prop="ycc66h" label-width="150" v-if="formFieldsVisibility.ycc66h">
					<mini-picker placeholder="请选择灵活就业方式" selectPrompt="请选择灵活就业方式" collection="YCC66H"
						v-model="infoForm.ycc66h" @change="fromChange($event, 'infoForm', 'ycc66h')"></mini-picker>
				</u-form-item>
				<u-form-item label="创业带动就业人数" prop="ycc03j" label-width="180" v-if="formFieldsVisibility.ycc03j">
					<u-input v-model="infoForm.ycc03j" :border="false" placeholder="请输入创业带动就业人数" :disabled="isDisabled"
						type="number" />
				</u-form-item>
				<u-form-item label="备注" prop="ycc001" label-width="150">
					<u-input v-model="infoForm.ycc001" :border="false" placeholder="请输入备注" :disabled="isDisabled" />
				</u-form-item>
			</u-form>
		</view>
		<!-- 地址选择器弹窗-全国 -->
		<view v-if="!showAreaModal">
			<mini-address required label="期望工作地点" @addressBack="expectWorkPlaceChange" @clickMaskClose="clickMaskClose"
				ref="addressRef"></mini-address>
		</view>
		<!-- 地址选择器弹窗-西藏 -->
		<aae017-select-tree ref="aae017SelectTree" :data="aae017Data" :showSearch="true" placeholder="请选择审核人社机构"
			@change="handleAae017Change" />
		<!-- 树状选择器-所属行业 -->
		<tki-tree ref="tkitree" :range="treeData" rangeKey="title" confirmColor="#4e8af7" @confirm="confirmFn" />
		<bankCard ref="bankCardRef" :allow-add="true" :params="paramsBankCard" :visible="visibleBank"
			@onClose="closeBank" />

	</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				// 表单数据
				infoForm: {
					// 个人基本信息
					yac002: '', // 身份证号
					aac003: '', // 姓名
					aac004: '', // 性别编码
					aac004_desc: '', // 性别描述
					aac005: '', // 民族编码
					aac005_desc: '', // 民族描述
					aac006: '', // 出生年月
					aac009: '', // 户口性质编码
					aac009_desc: '', // 户口性质描述
					aab299: '', // 户籍行政区划
					ycc004: '', // 户籍详细地址
					ycc299: '', // 现住地址行政区划
					aac026: '', // 现住地址
					ycc022: '', // 个人身份编码
					ycc022_desc: '', // 个人身份描述
					aac011: '', // 文化程度编码
					aac011_desc: '', // 文化程度描述
					aae005: '', // 联系电话

					// 学历信息
					ycc03q: '', // 教育类别编码
					ycc03q_desc: '', // 教育类别描述
					yau002: '', // 毕业院校
					yac01f: '', // 所学专业
					yac01g: '', // 毕业日期

					// 就业登记信息
					yhc407: '', // 就业形式编码
					yhc407_desc: '', // 就业形式描述
					aab004: '', // 现工作单位
					ycc03n: '', // 就业单位区域
					ycc064: '', // 所属行业编码
					ycc064_desc: '', // 所属行业描述
					adc113: '', // 是否自主创业编码
					adc113_desc: '', // 是否自主创业描述
					ycc025: '', // 月平均工资
					ycc039: '', // 就业日期
					ycc03r: '', // 是否签订劳动合同编码
					ycc03r_desc: '', // 是否签订劳动合同描述
					aae031: '', // 合同开始日期
					aae032: '', // 合同结束日期
					ycc035: '', // 合同年限
					aae043: '', // 就业登记日期
					aae017: '', // 就业登记地
					ycc03m: '', // 劳务派遣单位名称
					ycc66h: '', // 灵活就业方式编码
					ycc66h_desc: '', // 灵活就业方式描述
					ycc03j: '', // 创业带动就业人数
					ycc001: '' // 备注
				},

				// 表单字段显示控制
				formFieldsVisibility: {
					ycc03n: false, // 就业单位区域
					ycc064: false, // 所属行业
					adc113: false, // 是否自主创业
					aae031: false, // 合同开始日期
					aae032: false, // 合同结束日期
					ycc035: false, // 合同年限
					ycc03m: false, // 劳务派遣单位名称
					ycc66h: false, // 灵活就业方式
					ycc03j: false // 创业带动就业人数
				},

				// 表单字段必填控制
				formFieldsRequired: {
					aab004: true, // 现工作单位
					ycc03n: false, // 就业单位区域
					ycc064: true, // 所属行业
					adc113: false // 是否自主创业
				},

				// 日期选择器显示状态（仅保留日历相关的）
				yac01gShow: false,
				ycc039Show: false,
				aae031Show: false,
				aae032Show: false,


				// 表单禁用状态
				isDisabled: false,

				// 是否显示必填字段
				showRequiredFields: false,

				// 表单验证规则
				rules: {
					// 个人基本信息验证
					yac002: [{
						required: true,
						message: '请输入身份证号',
						trigger: ['blur', 'change']
					}, {
						pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
						message: '请输入有效的身份证号',
						trigger: ['blur']
					}],
					aac003: [{
						required: true,
						message: '请输入姓名',
						trigger: ['blur', 'change']
					}],
					aac004: [{
						required: true,
						message: '请选择性别',
						trigger: ['blur', 'change']
					}],
					aac005: [{
						required: true,
						message: '请选择民族',
						trigger: ['blur', 'change']
					}],
					aac006: [{
						required: true,
						message: '请输入出生年月',
						trigger: ['blur', 'change']
					}],
					aac009: [{
						required: true,
						message: '请选择户口性质',
						trigger: ['blur', 'change']
					}],
					aab299: [{
						required: true,
						message: '请选择户籍行政区划',
						trigger: ['blur', 'change']
					}],
					ycc004: [{
						required: true,
						message: '请输入户籍详细地址',
						trigger: ['blur', 'change']
					}],
					ycc299: [{
						required: true,
						message: '请选择现住地址行政区划',
						trigger: ['blur', 'change']
					}],
					aac026: [{
						required: true,
						message: '请输入现住地址',
						trigger: ['blur', 'change']
					}],
					ycc022: [{
						required: true,
						message: '请选择个人身份',
						trigger: ['blur', 'change']
					}],
					aac011: [{
						required: true,
						message: '请选择文化程度',
						trigger: ['blur', 'change']
					}],
					aae005: [{
						required: true,
						message: '请输入联系电话',
						trigger: ['blur', 'change']
					}, {
						pattern: /^1[3-9]\d{9}$/,
						message: '请输入有效的手机号',
						trigger: ['blur']
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

					// 就业登记信息验证
					yhc407: [{
						required: true,
						message: '请选择就业形式',
						trigger: ['blur', 'change']
					}],
					aab004: [{
						required: function() {
							return this.formFieldsRequired.aab004;
						},
						message: '请输入现工作单位',
						trigger: ['blur', 'change']
					}],
					ycc03n: [{
						required: function() {
							return this.formFieldsRequired.ycc03n;
						},
						message: '请选择就业单位区域',
						trigger: ['blur', 'change']
					}],
					ycc064: [{
						required: function() {
							return this.formFieldsRequired.ycc064;
						},
						message: '请选择所属行业',
						trigger: ['blur', 'change']
					}],
					adc113: [{
						required: function() {
							return this.formFieldsRequired.adc113;
						},
						message: '请选择是否自主创业',
						trigger: ['blur', 'change']
					}],
					ycc025: [{
						required: true,
						message: '请输入月平均工资',
						trigger: ['blur', 'change']
					}, {
						pattern: /^\d+(\.\d{1,2})?$/,
						message: '请输入有效的金额',
						trigger: ['blur']
					}],
					ycc039: [{
						required: true,
						message: '请选择就业日期',
						trigger: ['blur', 'change']
					}],
					ycc03r: [{
						required: true,
						message: '请选择是否签订劳动合同',
						trigger: ['blur', 'change']
					}],
					aae031: [{
						required: function() {
							return this.formFieldsVisibility.aae031 && this.infoForm.ycc03r === '1';
						},
						message: '请选择合同开始日期',
						trigger: ['blur', 'change']
					}],
					aae032: [{
						required: function() {
							return this.formFieldsVisibility.aae032 && this.infoForm.ycc03r === '1';
						},
						message: '请选择合同结束日期',
						trigger: ['blur', 'change']
					}],
					ycc03m: [{
						required: function() {
							return this.formFieldsRequired.ycc03m;
						},
						message: '请输入劳务派遣单位名称',
						trigger: ['blur', 'change']
					}],
					ycc66h: [{
						required: function() {
							return this.formFieldsVisibility.ycc66h;
						},
						message: '请选择灵活就业方式',
						trigger: ['blur', 'change']
					}],
					ycc03j: [{
						required: function() {
							return this.formFieldsVisibility.ycc03j;
						},
						message: '请输入创业带动就业人数',
						trigger: ['blur', 'change']
					}, {
						pattern: /^\d+$/,
						message: '请输入有效的人数',
						trigger: ['blur']
					}],
					ycc001: [{
						max: 200,
						message: '备注不能超过200个字符',
						trigger: ['blur', 'change']
					}],
					aae017: [{
						required: true,
						message: '请选择就业登记地',
						trigger: ['blur', 'change']
					}],
					aae043: [{
						required: true,
						message: '请输入就业登记日期',
						trigger: ['blur', 'change']
					}],
					acb202: [{
						required: true,
						message: '请选择期望工作地点',
						trigger: ['blur', 'change']
					}]
				},
				ycc03qList: [{
						label: '全日制',
						value: '1'
					},
					{
						label: '非全日制',
						value: '2'
					},
				],
				aae017Data: [],
				aae017Value: '',
				treeData: [],
				paramsBankCard: {},
				visibleBank: false,
				showUploadFile: ''

			};
		},
		mounted() {
			this.$nextTick(() => {
				this.$refs.infoForm.setRules(this.rules);
				this.init();
				this.getList()
			});
		},
		methods: {
			closeBank(data) {
				// return
				this.visibleBank = false
				let allData = []
				this.$dict.getDictList("BANKID", res => {
					allData = res
					console.log('银行列表数据: ', res);
				})
				if (data) {
					const selectedItem = allData.find((item) => item.value === data.aaf200)
					let values = {
						yhk031_desc: selectedItem.label, //银行类别
						yhk031: selectedItem.value, //银行类别
						ycc707: data.aae010, //银行账户
						yhk032: data.aae044, //开户银行
						yhk033: data.aae008, //银行联行号
					}
					console.log('values----: ', values);
					// this.queryForm.setFieldsValue(values)
				}
			},
			// 选择文化程度时的校验
			fnselect(value) {
				if (value == '11' || value == '14' || value == '20' || value == '30' || value == '40' || value ==
					'41') {
					// 设置为必填
					this.showRequiredFields = true;
				} else {
					// 设置为非必填
					this.showRequiredFields = false;
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
			// 选择就业形式时的校验
			fnSelects() {
				let value = this.infoForm.yhc407;
				var aac011 = this.infoForm.aac011;
				if (null == aac011 || '' == aac011) {
					this.$message.warning('请先选择文化程度！');
				}
				// 控制是否自主创业字段显示
				this.setFormFieldState('adc113', value == '21' || value == '99');
				// 根据就业形式和文化程度设置上传文件类型
				if (value == '21') { // 个体经营 
					if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
						aac011 == '41') {
						this.showUploadFile = '3_403';
					} else {
						this.showUploadFile = '2_403';
					}
				} else if (value == '22') { // 灵活就业 
					if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
						aac011 == '41') {
						this.showUploadFile = '7_403';
					} else {
						this.showUploadFile = '6_403';
					}
				} else if (value == '29') { // 单位就业个人身份登记申请 
					if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
						aac011 == '41') {
						this.showUploadFile = '5_403';
					} else {
						this.showUploadFile = '4_403';
					}
				} else if (value == '30') { // 公益性岗位就业 
					if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
						aac011 == '41') {
						this.showUploadFile = '9_403';
					} else {
						this.showUploadFile = '8_403';
					}
				} else {
					// 其他不必要上传材料的就业形式，重置showUploadFile以清空材料表格
					this.showUploadFile = '';
				}
				// 控制相关字段的显示和必填性
				if (value == '10' || value == '21' || value == '29' || value == '30') {
					this.setFormFieldState('ycc03n', true, true);
					this.setFormFieldState('ycc064', true, true);
				} else {
					this.setFormFieldState('ycc03n', false, false);
					this.setFormFieldState('ycc064', false, false);
				}

				// 单位就业个人身份登记申请或公益性岗位就业时查询工作单位
				if (value == '29' || value == '30') {
					let yac002 = this.infoForm.yac002;
					if (yac002 == null || yac002 == '') {
						this.$message.warning('请先填写身份证号码');
					} else {
						//查询就业单位信息
						const param = {
							no: '403-0015',
							data: JSON.stringify({
								yac002: this.userInfo.certNo,
							}),
						};
						this.$base.post('', param, (res) => {
							if (res.serviceSuccess) {
								this.$message.error(res.data.msg)
							} else {
								this.$message.error(res.data.msg)
							}
						})
					}
				}
			},
			//是否签订劳动合同
			fnelect() {
				let ycc03r = this.infoForm.ycc03r;
				// 根据是否签订劳动合同控制aae031、aae032和ycc035字段的显示
				if (ycc03r == '1') { // 是
					this.setFormFieldState('aae031', true, true);
					this.setFormFieldState('aae032', true, true);
					this.setFormFieldState('ycc035', true, false);
				} else {
					this.setFormFieldState('aae031', false, false);
					this.setFormFieldState('aae032', false, false);
					this.setFormFieldState('ycc035', false, false);
				}
			},
			// 劳务派遣单位就业校验
			fnChangeYcc03K(key, value) {
				// 使用统一方法控制字段状态
				this.setFormFieldState('ycc03m', value == '0', value == '0');
			},
			// 人员所属类型选择事件
			fnpersonType(key, value) {
				// 使用统一方法控制多个字段状态
				this.setFormFieldState('aab004', true, value == '010');
				this.setFormFieldState('ycc03n', value == '010', value == '010');
				this.setFormFieldState('ycc66h', value == '022');
				this.setFormFieldState('ycc03j', value == '020');
			},
			// 统一控制表单字段显示和必填性的方法
			setFormFieldState(field, visible = true, required = false) {
				if (Array.isArray(field)) {
					field.forEach(f => this.setFormFieldState(f, visible, required));
					return;
				}
				// 更新显示状态
				if (this.formFieldsVisibility.hasOwnProperty(field)) {
					this.formFieldsVisibility[field] = visible;
				}
				// 更新必填状态
				if (this.formFieldsRequired.hasOwnProperty(field)) {
					this.formFieldsRequired[field] = required;
				}
				// 如果字段被隐藏，清空其值
				if (!visible && this.queryForm && this.queryForm.setFieldsValue) {
					const resetValue = {};
					resetValue[field] = '';
					this.queryForm.setFieldsValue(resetValue);
				}
			}, // 检查就业日期不能大于就业登记日期
			fnCheckTime() {
				const ycc039 = this.infoForm.ycc039;
				const aae043 = this.infoForm.aae043;

				if (ycc039 && aae043) {
					if (moment(ycc039).isAfter(moment(aae043))) {
						this.$message.error('就业日期不能大于就业登记日期!');
						this.queryForm.setFieldsValue({
							ycc039: ''
						});
					}
				}
			},
			// 初始化教育相关字段的必填性
			fnInitEduction() {
				let aac011 = this.infoForm.aac011;
				if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' || aac011 ==
					'41') {
					// 设置为必填
					this.showRequiredFields = true;
				} else {
					// 设置为非必填
					this.showRequiredFields = false;
				}
			},
			confirmFn(e) {
				this.infoForm.ycc064 = e[0].id
				this.infoForm.ycc064_desc = e[0].title
				this.$forceUpdate()
			},
			getList() {
				const param = {
					no: '001-0002',
					data: JSON.stringify({}),
				}
				this.$base.post('', param, (response) => {
					this.treeData = this.buildTree(response.data)
				})

			},
			// 将数据处理为树状
			buildTree(data) {
				const map = {};
				const roots = [];

				// 创建一个映射，便于快速查找每个节点
				data.forEach(item => {
					map[item.id] = {
						...item,
						children: []
					};
				});

				// 遍历数据，构建树结构
				data.forEach(item => {
					if (item.parent_id === "-1") {
						roots.push(map[item.id]);
					} else {
						if (map[item.parent_id]) {
							map[item.parent_id].children.push(map[item.id]);
						} else {
							// 如果父节点不存在，则将其作为根节点
							roots.push(map[item.id]);
						}
					}
				});

				return roots;
			},
			test() {
				console.log('this.$refs.tkitree: ', this.$refs.tkitree._show());
			},
			// 处理就业登记地选择变化

			init() {
				// 组件挂载后，检查是否有初始的就业困难人员类别值，如果有则更新材料列表
				setTimeout(() => {
					// 初始化就业地数据
					this.initAae017Data();
					this.query()
					this.showUploadFile = ''

				}, 100);
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




			query() {
				const param = {
					no: '403-0014',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code == '1') {
							let forms = res.data.ac01Info || {}
							// 处理所有日期字段，确保它们是字符串格式
							const dateFields = ['aae043', 'ycc039', 'yac01g', 'aae031', 'aae032']
							forms.yac01g = this.$util.timeFormat(forms.yac01g)
							this.infoForm = forms
							this.infoForm.aae043 = moment().format('YYYY-MM-DD')
						}
						if (res.data.code == '0') {
							this.$message.error(res.data.msg || '查询失败')
							if (res.data.formReadOnly == 'true') {
								this.isDisabled = true
							} else {
								this.isDisabled = false
							}
							let forms = res.data.ac01Info || {}
							this.infoForm = forms
						}
					} else {
						this.$message.error(res.data.msg)
					}
				})
			},






			// 毕业日期确认
			dateConfirmYac01g(e) {
				this.infoForm.yac01g = e.result;
				this.yac01gShow = false;
			},

			// 就业日期确认
			dateConfirmYcc039(e) {
				this.infoForm.ycc039 = e.result;
				this.ycc039Show = false;

				// 校验就业日期
				this.fnCheckTimeYcc039();
			},

			// 合同开始日期确认
			dateConfirmAae031(e) {
				this.infoForm.aae031 = e.result;
				this.aae031Show = false;
			},

			// 合同结束日期确认
			dateConfirmAae032(e) {
				this.infoForm.aae032 = e.result;
				this.aae032Show = false;

				// 校验合同日期并计算年限
				this.fnAae032Change();
			},

			// 校验就业日期
			fnCheckTimeYcc039() {
				if (!this.infoForm.ycc039) return;

				let currentTime = moment(); //就业登记日期
				let ycc039Time = moment(this.infoForm.ycc039);
				if (ycc039Time.isAfter(currentTime)) {
					this.$message.error('就业日期不能大于就业登记日期');
					this.infoForm.ycc039 = '';
				}
			},

			// 合同结束日期变更
			fnAae032Change() {
				if (!this.infoForm.aae031 || !this.infoForm.aae032) return;

				let startDate = moment(this.infoForm.aae031);
				let endDate = moment(this.infoForm.aae032);

				// 校验合同开始日期不能晚于结束日期
				if (startDate.isAfter(endDate)) {
					this.$message.error('合同开始日期不能晚于结束日期');
					this.infoForm.aae032 = '';
					return;
				}

				// 计算合同年限
				let years = endDate.diff(startDate, 'years', true);
				this.infoForm.ycc035 = years.toFixed(1);
			},
			// 重置表单
			handleReset() {
				this.$refs.infoForm.resetFields();
				this.infoForm = {}
				this.init();
				this.$nextTick(() => {
					this.$forceUpdate()

				})
			},

			// 返回
			handleBack() {
				this.$emit('back');
			},

			// 确认提交
			handleConfirm(callback) {
				callback && callback(this.infoForm)
				return
				// 表单校验
				this.$refs.infoForm.validate(valid => {
					if (valid) {
						console.log('valid : ', valid);
						// 提交表单数据
						console.log('Form submitted:', this.infoForm);
						callback && callback(this.infoForm)

					} else {
						this.$message.error('请填写完整信息');
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.form-page {
		background-color: #ffffff;
		padding: 0 32rpx;
	}

	.title-line-blue {
		.title {
			font-size: 32rpx;
			font-weight: bold;
			background-color: #fff;
			padding: 32rpx;
			position: relative;

			&::before {
				content: "";
				width: 6rpx;
				height: 36rpx;
				background-color: #2979ff;
				position: absolute;
				left: 0rpx;
				top: 38rpx;
			}
		}
	}

	.red {
		color: red;
		font-size: 24rpx;
		position: absolute;
		left: 0rpx;
		bottom: -12rpx;
		line-height: 24rpx;
	}

	.uform {
		/deep/ .u-input {
			text-align: right !important;
		}

		/deep/ .u-form-item {
			line-height: 32rpx;
		}
	}
</style>