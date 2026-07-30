<template>
	<view class="service-page" id="contrainer">
		<view class="service-box">
			<view class="form-page">
				<!-- 步骤一：基本信息 -->
				<view v-show="headerIndex == 0">
					<view class="uform">
						<u-form :model="infoForm" ref="infoForm" label-position="left" :rules="rules">
							<view class="tips">
								注：请将户口所在地选择到市县(区)，所选户口所在地即为审核地<br />
								注：申请就业困难人员灵活就业人员社保补贴，须认定就业困难人员+就业登记<br />
								注：高校毕业生申请就业困难人员灵活就业人员社保补贴，毕业时间须不超过两年<br />
								注：补贴金额按养老所缴纳金额的2/3补贴;女性年龄小于40岁，男性年龄小于50只能申请3次，女性年龄大于等于40岁，男性年龄大于等于50岁可申请5次<br />
							</view>
							<!-- 个人基本信息 -->
							<view class="title-line-blue">
								<view class="title">个人基本信息</view>
							</view>
							<u-form-item label="姓名" prop="aac003" label-width="150">
								<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
							</u-form-item>
							<u-form-item label="身份证号码" prop="yac002" label-width="150">
								<u-input v-model="infoForm.yac002" :border="false" placeholder="身份证号码" disabled />
							</u-form-item>
							<u-form-item label="性别" prop="aac004" label-width="150">
								<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="AAC004"
									v-model="infoForm.aac004" disabled></mini-picker>
							</u-form-item>
							<u-form-item label="民族" prop="aac005" label-width="150">
								<mini-picker disabled placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
									v-model="infoForm.aac005" disabled></mini-picker>
							</u-form-item>
							<u-form-item label="出生日期" prop="aac006" label-width="150">
								<u-input v-model="infoForm.aac006" :border="false" placeholder="出生日期" disabled />
							</u-form-item>
							<u-form-item label="户口所在地" prop="hyy002" label-width="150" required>
								<u-input v-model="infoForm.hyy002_desc" :border="false" placeholder="请选择户口所在地"
									:disabled="isDisabled" />
								<view class="addressBox" @click="openArea('infoForm','hyy002_desc')"></view>
							</u-form-item>
							<u-form-item label="灵活就业地" prop="hyy003" label-width="150" required>
								<u-input v-model="infoForm.hyy003" :border="false" placeholder="请输入灵活就业地"
									:disabled="isDisabled" />
							</u-form-item>
							<u-form-item label="开户银行" prop="hyy007" label-width="150" required>
								<u-input v-model="infoForm.hyy007" :border="false" placeholder="请选择开户银行"
									@click="visibleBank = true" :disabled="isDisabled" />
							</u-form-item>
							<u-form-item label="银行卡户名" prop="hyy006" label-width="150" required>
								<u-input v-model="infoForm.hyy006" :border="false" placeholder="银行卡户名" disabled />
							</u-form-item>
							<u-form-item label="开户支行银行" prop="hyy008" label-width="150" required>
								<u-input v-model="infoForm.hyy008" :border="false" placeholder="开户支行银行" disabled />
							</u-form-item>
							<u-form-item label="银行账号" prop="hyy010" label-width="150" required>
								<u-input v-model="infoForm.hyy010" :border="false" placeholder="银行账号" disabled />
							</u-form-item>
							<u-form-item label="就业困难人员类型" prop="hyy012" label-width="150" required>
								<mini-picker :disabled="isDisabled" placeholder="请选择就业困难人员类型" selectPrompt="请选择就业困难人员类型"
									collection="YCC131_RD" v-model="infoForm.hyy012"
									@change="fromChange($event, 'infoForm', 'hyy012')"></mini-picker>
							</u-form-item>
							<u-form-item label="灵活就业内容" prop="hyy004" label-width="150" required>
								<u-input v-model="infoForm.hyy004" :border="false" placeholder="请输入灵活就业内容"
									:disabled="isDisabled" />
							</u-form-item>

							<!-- 补贴信息 -->
							<view class="title-line-blue">
								<view class="title">补贴信息</view>
							</view>
							<u-form-item label="补贴开始年月" prop="hyy102" label-width="150" required>
								<u-input v-model="infoForm.hyy102" :border="false" placeholder="请选择补贴开始年月"
									@click="hyy102Show = true" :disabled="isDisabled" />
								<u-calendar v-model="hyy102Show" max-date="2099-12-31"
									@change="fnChangsbStart"></u-calendar>
							</u-form-item>
							<u-form-item label="补贴结束年月" prop="hyy103" label-width="150" required>
								<u-input v-model="infoForm.hyy103" :border="false" placeholder="请选择补贴结束年月"
									@click="hyy103Show = true" :disabled="isDisabled" />
								<u-calendar v-model="hyy103Show" max-date="2099-12-31"
									@change="fnChangsbEnd"></u-calendar>
							</u-form-item>
							<u-form-item label="养老缴费金额" prop="hyy104" label-width="150" required>
								<u-input v-model="infoForm.hyy104" :border="false" placeholder="养老缴费金额" disabled />
							</u-form-item>
							<u-form-item label="养老补贴金额" prop="hyy104_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy104_bt" :border="false" placeholder="养老补贴金额" disabled />
							</u-form-item>
							<u-form-item label="医疗缴费金额" prop="hyy114" label-width="150" required>
								<u-input v-model="infoForm.hyy114" :border="false" placeholder="医疗缴费金额" disabled />
							</u-form-item>
							<u-form-item label="医疗补贴金额" prop="hyy114_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy114_bt" :border="false" placeholder="医疗补贴金额" disabled />
							</u-form-item>
							<u-form-item label="失业缴费金额" prop="hyy124" label-width="150" required>
								<u-input v-model="infoForm.hyy124" :border="false" placeholder="失业缴费金额" disabled />
							</u-form-item>
							<u-form-item label="失业补贴金额" prop="hyy124_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy124_bt" :border="false" placeholder="失业补贴金额" disabled />
							</u-form-item>
							<u-form-item label="工伤缴费金额" prop="hyy134" label-width="150" required>
								<u-input v-model="infoForm.hyy134" :border="false" placeholder="工伤缴费金额" disabled />
							</u-form-item>
							<u-form-item label="工伤补贴金额" prop="hyy134_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy134_bt" :border="false" placeholder="工伤补贴金额" disabled />
							</u-form-item>
							<u-form-item label="生育缴费金额" prop="hyy144" label-width="150" required>
								<u-input v-model="infoForm.hyy144" :border="false" placeholder="生育缴费金额" disabled />
							</u-form-item>
							<u-form-item label="生育补贴金额" prop="hyy144_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy144_bt" :border="false" placeholder="生育补贴金额" disabled />
							</u-form-item>
							<u-form-item label="总补贴金额" prop="hyy200" label-width="150" required>
								<u-input v-model="infoForm.hyy200" :border="false" placeholder="总补贴金额" disabled />
							</u-form-item>
							<u-form-item label="补贴总金额" prop="hyy200_bt" label-width="150" required>
								<u-input v-model="infoForm.hyy200_bt" :border="false" placeholder="补贴总金额" disabled />
							</u-form-item>
							<u-form-item label="预计可享受月数" prop="enjoymonth" label-width="150" required>
								<u-input v-model="infoForm.enjoymonth" :border="false" placeholder="预计可享受月数" disabled />
							</u-form-item>
							<u-form-item label="申请总月数" prop="months" label-width="150" required>
								<u-input v-model="infoForm.months" :border="false" placeholder="申请总月数" disabled />
							</u-form-item>
							<u-form-item label="实际缴费月数" prop="sjmonths" label-width="150" required>
								<u-input v-model="infoForm.sjmonths" :border="false" placeholder="实际缴费月数" disabled />
							</u-form-item>
							<u-form-item label="剩余享受月数" prop="leavemonth" label-width="150" required>
								<u-input v-model="infoForm.leavemonth" :border="false" placeholder="剩余享受月数" disabled />
							</u-form-item>

							<view class="btn-box">
								<u-button type="primary" @click="handleRead"
									style="margin-right: 10px;">阅读承诺书</u-button>
								<u-button type="primary" @click="nextFn"
									:disabled="isDisabled || !hasReadCommitment">下一步</u-button>
							</view>
						</u-form>
					</view>
				</view>

				<!-- 步骤二：材料上传 -->
				<view v-show="headerIndex == 1">
					<view class="title-line-blue">
						<view class="title">上传材料</view>
					</view>
					<service-upload ref="materialUploadTable" :yda020="showUploadFile" />
					<view class="btn-box">
						<u-button @click="headerIndex = 0" style="width: 45%;">上一步</u-button>
						<u-button type="primary" @click="handleConfirm" style="width: 45%;">确认提交</u-button>
					</view>
				</view>

				<!-- 步骤三：完成页面 -->
				<service-complete v-show="headerIndex == 2" />
			</view>
		</view>

		<!-- 承诺弹窗 -->
		<u-modal v-model="visibleCommit" :show-cancel-button="true" title="个人申请灵活就业社会保险补贴承诺书"
			:close-on-click-overlay="false" @confirm="handleCommitConfirm" @cancel="handleCommitCancel">
			<view class="tips" style="text-align: center; line-height: 1.8; padding: 20px 0;">
				本人灵活就业，以灵活就业人员身份缴纳社会保险，未与任何单位签订《劳动合同》或形成事实劳动关系，以上表格所填社会保险待遇信息准确，现申请社会保险补贴。本人承诺以上内容真实有效，如与实际情况不一致，愿承担相应法律责任
			</view>
			<view class="commitment-radio">
				<u-radio-group v-model="radioValue" @change="radioGroupChange">
					<u-radio v-for="(item, index) in list" :key="index" :name="item.value" :disabled="item.disabled">
						{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
		</u-modal>

		<!-- 地址选择器弹窗 -->
		<view v-if="!showAreaModal">
			<mini-address required label="户口所在地" @addressBack="areaChange" @clickMaskClose="clickMaskClose"
				:disabled="isDisabled" ref="addressRef"></mini-address>
		</view>
		<aae017-select-tree ref="aae017SelectTree" :data="aae017Data" :showSearch="true" placeholder="请选择审核人社机构"
			:disabled="isDisabled" @change="handleAae017Change" />
		<!-- 银行选择器 -->
		<bankCard ref="bankCardRef" :allow-add="true" :params="paramsBankCard" :visible="visibleBank"
			:disabled="isDisabled" @onClose="closeBank" />
	</view>
</template>

<script>
	import moment from 'moment'
	import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'
	export default {
		name: 'empEntreFlexibleEmpSubsidyApply',
		components: {
			aae017SelectTree,
		},
		data() {
			return {
				headerIndex: 0,
				showAreaModal: true,
				currentAreaField: 'hyy002',
				isDisabled: false,
				// 日期选择器显示控制
				hyy102Show: false,
				hyy103Show: false,
				// 日期范围控制
				minYearMonth: '',
				currentYearMonth: '',
				// 承诺书控制
				visibleCommit: false,
				hasReadCommitment: false,
				commitmentSelection: '',
				radioValue: '',
				// 用户信息
				userInfo: {},
				paramsBankCard: {},
				list: [{
						value: 1,
						name: '我已阅读并接受',
						disabled: false
					},
					{
						value: 2,
						name: '我不接受',
						disabled: false
					},
				],
				// 表单数据
				infoForm: {
					hyy001: '', // 就业困难人员灵活就业补贴明细流水号
					aac001: '', // 个人编号
					aac003: '', // 姓名
					yac002: '', // 身份证号码
					aac004: '', // 性别
					aac005: '', // 民族
					aac006: '', // 出生日期
					hyy002: '', // 户口所在地值
					hyy002_desc: '', // 户口所在地文本
					hyy003: '', // 灵活就业地
					hyy007: '', // 开户银行
					hyy006: '', // 银行卡户名
					hyy008: '', // 开户支行银行
					hyy009: '', // 银行联行号
					hyy010: '', // 银行账号
					hyy012: '', // 就业困难人员类型
					hyy004: '', // 灵活就业内容
					hyy102: '', // 补贴开始年月
					hyy103: '', // 补贴结束年月
					hyy104: '', // 养老缴费金额
					hyy104_bt: '', // 养老补贴金额
					hyy114: '', // 医疗缴费金额
					hyy114_bt: '', // 医疗补贴金额
					hyy124: '', // 失业缴费金额
					hyy124_bt: '', // 失业补贴金额
					hyy134: '', // 工伤缴费金额
					hyy134_bt: '', // 工伤补贴金额
					hyy144: '', // 生育缴费金额
					hyy144_bt: '', // 生育补贴金额
					hyy200: '', // 总补贴金额
					hyy200_bt: '', // 补贴总金额
					enjoymonth: '', // 预计可享受月数
					months: '', // 申请总月数
					sjmonths: '', // 实际缴费月数
					leavemonth: '' // 剩余享受月数
				},
				rules: {
					hyy002: [{
						required: true,
						message: '请选择户口所在地',
						trigger: 'blur'
					}],
					hyy003: [{
						required: true,
						message: '请输入灵活就业地',
						trigger: 'blur'
					}],
					hyy007: [{
						required: true,
						message: '请选择开户银行',
						trigger: 'blur'
					}],
					hyy006: [{
						required: true,
						message: '请输入银行卡户名',
						trigger: 'blur'
					}],
					hyy008: [{
						required: true,
						message: '请选择开户支行银行',
						trigger: 'blur'
					}],
					hyy009: [{
						required: true,
						message: '请输入银行联行号',
						trigger: 'blur'
					}],
					hy010: [{
						required: true,
						message: '请输入银行账号',
						trigger: 'blur'
					}],
					hy012: [{
						required: true,
						message: '请选择就业困难人员类型',
						trigger: 'blur'
					}],
					hyy004: [{
						required: true,
						message: '请输入灵活就业内容',
						trigger: 'blur'
					}],
					hyy102: [{
						required: true,
						message: '请选择补贴开始年月',
						trigger: 'blur'
					}],
					hyy103: [{
						required: true,
						message: '请选择补贴结束年月',
						trigger: 'blur'
					}],
					hyy104: [{
						required: true,
						message: '养老缴费金额不能为空',
						trigger: 'blur'
					}],
					hyy104_bt: [{
						required: true,
						message: '养老补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy114: [{
						required: true,
						message: '医疗缴费金额不能为空',
						trigger: 'blur'
					}],
					hyy114_bt: [{
						required: true,
						message: '医疗补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy124: [{
						required: true,
						message: '失业缴费金额不能为空',
						trigger: 'blur'
					}],
					hyy124_bt: [{
						required: true,
						message: '失业补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy134: [{
						required: true,
						message: '工伤缴费金额不能为空',
						trigger: 'blur'
					}],
					hyy134_bt: [{
						required: true,
						message: '工伤补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy144: [{
						required: true,
						message: '生育缴费金额不能为空',
						trigger: 'blur'
					}],
					hyy144_bt: [{
						required: true,
						message: '生育补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy200: [{
						required: true,
						message: '总补贴金额不能为空',
						trigger: 'blur'
					}],
					hyy200_bt: [{
						required: true,
						message: '补贴总金额不能为空',
						trigger: 'blur'
					}],
					enjoymonth: [{
						required: true,
						message: '预计可享受月数不能为空',
						trigger: 'blur'
					}],
					months: [{
						required: true,
						message: '申请总月数不能为空',
						trigger: 'blur'
					}],
					sjmonths: [{
						required: true,
						message: '实际缴费月数不能为空',
						trigger: 'blur'
					}],
					leavemonth: [{
						required: true,
						message: '剩余享受月数不能为空',
						trigger: 'blur'
					}]
				},


				// 通用
				aae017Data: [],
				aae017Value: '',
				treeData: [],
				paramsBankCard: {},
				// 银行选择相关
				visibleBank: false,
				showUploadFile: '478',
			}
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
				this.$refs.infoForm.setRules(this.rules);
			});
			this.init();
		},
		onShow() {
			// 页面显示时的处理逻辑
		},
		methods: {

			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(22, e);
				this.radioValue = e
			},
			// 初始化数据
			init() {
				const param = {
					no: '478-0008',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
						aac001: this.userInfo.ext03
					})
				};
				this.initAae017Data();
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code == '1') {
							this.infoForm = {
								...this.infoForm,
								...res.data.info
							};
						} else if (res.data.code == '0') {
							this.$message.error(res.data.msg);
							this.isDisabled = res.data.form1 == 'disabled';
						}
					} else {
						this.$message.error(res.data.msg);
					}
					this.setHeight()
				}, (error) => {
					this.$message.error('初始化数据失败，请重试');
					console.error('初始化数据失败:', error);
				});
			},


			// 地址选择回调
			areaChange(addressData) {
				if (addressData) {
					const {
						fullAddress,
						areaCode
					} = addressData;
					this.infoForm[this.currentAreaField] = areaCode;
					this.infoForm[`${this.currentAreaField}_desc`] = fullAddress;
				}
				this.showAreaModal = true;
			},

			// 补贴开始年月选择
			fnChangsbStart(e) {
				// YYYY-MM-DD格式时间数据转为YYYYMM格式
				let res = e.result
				this.infoForm.hyy102 = this.formatToYYYYMM(res);
				this.hyy102Show = false;
				this.$forceUpdate()
			},
			// 补贴结束年月选择
			fnChangsbEnd(e) {
				// YYYY-MM-DD格式时间数据转为YYYYMM格式
				let res = e.result
				this.infoForm.hyy103 = this.formatToYYYYMM(res);
				this.hyy103Show = false;
				this.$forceUpdate()
				this.fnChangsb();
			},
			formatToYYYYMM(dateString) {
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				return year + '-' + month;
			},
			// 将 YYYY-MM 转换为数字进行比较
			compareYyyyMm(date1, date2) {
				// 移除连字符，转换为数字
				const num1 = parseInt(date1.replace('-', ''), 10);
				const num2 = parseInt(date2.replace('-', ''), 10);

				if (num1 > num2) return 1; // date1 更大
				if (num1 < num2) return -1; // date2 更大
				return 0; // 相等
			},
			// 社保时间校验和数据查询
			fnChangsb() {
				let {
					hyy102,
					hyy103
				} = this.infoForm;
				// 检查日期是否都已选择
				if (hyy102 && hyy103) {
					// 格式化日期为YYYYMM格式进行比较
					const formatDate = (dateStr) => {
						// return dateStr.replace('-', '');
						return dateStr;
					};

					const startDate = formatDate(hyy102);
					const endDate = formatDate(hyy103);
					console.log('startDate: ', startDate);
					console.log('endDate: ', endDate);
					// 校验结束日期不能早于开始日期
					console.log('this.compareYyyyMm(startDate, endDate): ',this.compareYyyyMm(startDate, endDate));
					if (this.compareYyyyMm(startDate, endDate) == 1) {
						this.$message.error('补贴申请结束日期不能早于申请开始日期!');
						this.infoForm.hyy103 = '';
						return;
					}
					// return
					// 计算申请总月数
					const startYear = parseInt(startDate.substring(0, 4));
					const startMonth = parseInt(startDate.substring(4, 6));
					const endYear = parseInt(endDate.substring(0, 4));
					const endMonth = parseInt(endDate.substring(4, 6));

					const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
					this.infoForm.months = months.toString();

					// 获取申请人信息
					const {
						yac002,
						aac003,
						aac006
					} = this.infoForm;

					// 检查申请人信息是否完整
					if (yac002 && aac003) {
						// 准备参数调用社保数据接口
						const param = {
							no: '478-0010',
							data: JSON.stringify({
								hyy102: startDate,
								hyy103: endDate,
								yac002: yac002,
								aac003: aac003,
								aac006: aac006
							})
						};

						this.$base.post('', param, (res) => {
							if (res.serviceSuccess) {
								// 处理接口返回的社保数据
								if (res.data.code == '1' && res.data.maplh) {
									this.infoForm = {
										...this.infoForm,
										...res.data.maplh
									};
								} else if (res.data.code == '0') {
									this.$message.error(res.data.msg);
									// 设置默认测试数据
									this.infoForm.hyy104 = '10.00';
									this.infoForm.hyy104_bt = '12';
									this.infoForm.hyy114 = '11';
									this.infoForm.hyy114_bt = '21';
									this.infoForm.hyy124 = '23';
									this.infoForm.hyy124_bt = '44';
									this.infoForm.hyy134 = '55';
									this.infoForm.hyy134_bt = '66';
									this.infoForm.hyy144 = '222';
									this.infoForm.hyy144_bt = '111';
									this.infoForm.hyy200 = '11123';
									this.infoForm.hyy200_bt = '5545';
									this.infoForm.enjoymonth = '2';
									this.infoForm.months = '3';
									this.infoForm.sjmonths = '1';
									this.infoForm.leavemonth = '1';
								}
							} else {
								this.$message.error(res.data.msg);
							}
						}, (error) => {
							this.$message.error('获取社保数据失败，请重试');
							console.error('获取社保数据失败:', error);
						});
					} else {
						this.$message.error('申请人信息不完整，无法获取社保数据');
						this.infoForm.hyy102 = '';
						this.infoForm.hyy103 = '';
						this.infoForm.months = '';
					}
				}
			},

			// 阅读承诺书
			handleRead() {
				this.visibleCommit = true;
				this.radioValue = '';
			},

			// 确认承诺书
			handleCommitConfirm() {
				if (this.radioValue == 1) {
					// 用户选择了"我已阅读并接受"
					this.hasReadCommitment = true;
					this.visibleCommit = false;
					this.isDisabled = false;
				} else if (this.radioValue == 2) {
					// 用户选择了"我不接受"
					this.hasReadCommitment = false;
					this.isDisabled = true;
					this.visibleCommit = false;
					this.$message.warning('您已拒绝承诺书，无法继续申请');
				} else {
					this.$message.warning('请选择是否接受承诺书');
				}
			},

			// 取消承诺书
			handleCommitCancel() {
				this.visibleCommit = false;
			},
			nextFn() {
				// 表单验证
				this.$refs.infoForm.validate((valid) => {
					if (!valid) {
						return false;
					}

					// 检查是否已阅读承诺书
					if (!this.hasReadCommitment) {
						this.$message.warning('请先阅读并接受承诺书');
						return false;
					}

					this.headerIndex = 1
				});
			},
			// 提交申请
			handleConfirm() {
				// 表单验证
				this.$refs.infoForm.validate((valid) => {
					if (!valid) {
						return false;
					}

					// 检查是否已阅读承诺书
					if (!this.hasReadCommitment) {
						this.$message.warning('请先阅读并接受承诺书');
						return false;
					}

					// 检查上传材料
					const materialUploadTable = this.$refs.materialUploadTable;
					let fileList = [];
					if (materialUploadTable && materialUploadTable.check) {
						fileList = materialUploadTable.check() || [];
					}

					if (fileList.length == 0 || fileList[0].files.length == 0) {
						this.$message.error('请上传必要的材料');
						return false;
					}

					// 处理表单数据
					const formData = {
						...this.infoForm
					};
					formData.aac001 = this.userInfo.ext03;
					// 添加aae017字段映射（aae017等于hyy002）
					formData.aae017 = formData.hyy002;
					// 处理日期格式
					formData.hyy102 = formData.hyy102 ? formData.hyy102.replace(/\//g, '') : '';
					formData.hyy103 = formData.hyy103 ? formData.hyy103.replace(/\//g, '') : '';
					formData.aac006 = formData.aac006 ? formData.aac006.replace(/\//g, '') : '';

					// 提交数据
					const param = {
						no: '478-0011',
						data: JSON.stringify({
							...formData,
							fileList: JSON.stringify(fileList),
						})
					};

					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code == '1') {
							this.$message.success(res.data.msg || '保存成功');
							// 进入完成页面
							this.headerIndex = 2;
						} else {
							this.$message.error(res.data.msg || '保存失败');
						}
					}, (error) => {
						// 添加失败回调，处理网络错误等情况
						this.$message.error('网络异常，请稍后重试');
						console.error('请求失败:', error);
					});
				});
			},

			// 通用函数

			// 关闭银行选择器
			closeBank(data) {
				console.log('data: ', data);
				this.visibleBank = false
				let allData = []
				this.$dict.getDictList("BANKID", res => {
					allData = res
					console.log('银行列表数据: ', res);
					if (data !== null) {
						const selectedItem = allData.find(item => item.value == data.aaf200)
						console.log('selectedItem: ', selectedItem);
						let values = {
							'hyy007': selectedItem.label, //银行类别
							'hyy010': data.aae010, //银行卡号
							'hyy006': data.aae009, //开户名称
							'hyy009': data.aae008, //银联号
							'hyy008': data.aae044 //开户支行银行
						}
						console.log('values: ', values);
						this.infoForm = {
							...this.infoForm,
							...values
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

	.commitment-radio {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>