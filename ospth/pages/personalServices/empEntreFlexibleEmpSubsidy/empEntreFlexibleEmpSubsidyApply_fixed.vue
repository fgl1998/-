<template>
	<view class="wrap">
		<view class="header">
			<image class="logo" src="../../static/images/logo.png"></image>
			<text class="title">灵活就业社会保险补贴申请</text>
		</view>
		<view class="content">
			<view class="form-box">
				<view class="form-item">
					<text class="label required">姓名：</text>
					<text class="value">{{ userInfo.realName }}</text>
				</view>
				<view class="form-item">
					<text class="label required">身份证号：</text>
					<text class="value">{{ userInfo.idNumber }}</text>
				</view>
				<view class="form-item">
					<text class="label required">手机号码：</text>
					<text class="value">{{ userInfo.phoneNumber }}</text>
				</view>
			</view>

			<u-form :model="infoForm" ref="uForm" :rules="rules" :label-width="120" :disabled="false">
				<view class="section-title">人员信息</view>
				<view class="form-content">
					<u-form-item label="户口所在地" prop="hyy002" required>
						<view class="form-input-box" @tap="openAreaSelector(1)">
							<text v-if="infoForm.hyy002" class="input-text">{{ infoForm.hyy002 }}</text>
							<text v-else class="placeholder-text">请选择户口所在地</text>
						</view>
					</u-form-item>
					<u-form-item label="灵活就业地" prop="hyy003" required>
						<u-input v-model="infoForm.hyy003" placeholder="请输入灵活就业地" />
					</u-form-item>
					<u-form-item label="开户银行" prop="hyy007" required>
						<u-input v-model="infoForm.hyy007" placeholder="请输入开户银行" />
					</u-form-item>
					<u-form-item label="银行卡户名" prop="hyy006" required>
						<u-input v-model="infoForm.hyy006" placeholder="请输入银行卡户名" />
					</u-form-item>
					<u-form-item label="开户支行银行" prop="hyy008" required>
						<view class="form-input-box" @tap="openBank">
							<text v-if="infoForm.hyy008" class="input-text">{{ infoForm.hyy008 }}</text>
							<text v-else class="placeholder-text">请选择开户支行银行</text>
						</view>
					</u-form-item>
					<u-form-item label="银行联行号" prop="hyy009" required>
						<u-input v-model="infoForm.hyy009" placeholder="请输入银行联行号" />
					</u-form-item>
					<u-form-item label="银行账号" prop="hyy010" required>
						<u-input v-model="infoForm.hyy010" placeholder="请输入银行账号" />
					</u-form-item>
					<u-form-item label="灵活就业内容" prop="hyy004" required>
						<u-input v-model="infoForm.hyy004" placeholder="请输入灵活就业内容" />
					</u-form-item>
					<u-form-item label="就业困难人员类型" prop="hyy012" required>
						<u-select v-model="infoForm.hyy012" :list="hyy012List" :title="'选择就业困难人员类型'" :confirm="'确认'" :cancel="'取消'" />
					</u-form-item>
				</view>
				<view class="section-title">补贴信息</view>
				<view class="form-content">
					<u-form-item label="补贴开始年月" prop="hyy102" required>
						<u-input v-model="infoForm.hyy102" placeholder="请选择补贴开始年月" @tap="fnChangsbStart" />
					</u-form-item>
					<u-form-item label="补贴结束年月" prop="hyy103" required>
						<u-input v-model="infoForm.hyy103" placeholder="请选择补贴结束年月" @tap="fnChangsbEnd" />
					</u-form-item>
					<u-form-item label="养老缴费金额" prop="hyy104" required>
						<u-input v-model="infoForm.hyy104" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="养老补贴金额" prop="hyy104_bt" required>
						<u-input v-model="infoForm.hyy104_bt" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="医疗缴费金额" prop="hyy114" required>
						<u-input v-model="infoForm.hyy114" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="医疗补贴金额" prop="hyy114_bt" required>
						<u-input v-model="infoForm.hyy114_bt" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="失业缴费金额" prop="hyy124" required>
						<u-input v-model="infoForm.hyy124" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="失业补贴金额" prop="hyy124_bt" required>
						<u-input v-model="infoForm.hyy124_bt" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="工伤缴费金额" prop="hyy134" required>
						<u-input v-model="infoForm.hyy134" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="工伤补贴金额" prop="hyy134_bt" required>
						<u-input v-model="infoForm.hyy134_bt" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="生育缴费金额" prop="hyy144" required>
						<u-input v-model="infoForm.hyy144" placeholder="" disabled />
					</u-form-item>
					<u-form-item label="生育补贴金额" prop="hyy144_bt" required>
						<u-input v-model="infoForm.hyy144_bt" placeholder="" disabled />
					</u-form-item>
				</view>
			</u-form>

			<!-- 承诺书 -->
			<view class="commitment-box" v-if="visibleCommit">
				<view class="commitment-content">
					<view class="commitment-title">承诺书</view>
					<view class="commitment-text">
						本人承诺所提供的所有信息真实有效，并愿意承担相应的法律责任。如有虚假信息，本人将承担一切后果。
					</view>
					<view class="commitment-btns">
						<u-button type="primary" size="mini" @tap="handleCommit">我已阅读并同意</u-button>
						<u-button type="info" size="mini" @tap="handleCommitCancel">取消</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<u-button type="primary" @tap="handleConfirm">提交申请</u-button>
		</view>
	</view>
</template>

<script>
import moment from 'moment';

export default {
	data() {
		return {
			headerIndex: 0,
			userInfo: {
				realName: '',
				idNumber: '',
				phoneNumber: ''
			},
			infoForm: {
				hyy002: '', // 户口所在地
				hyy003: '', // 灵活就业地
				hyy004: '', // 灵活就业内容
				hyy006: '', // 银行卡户名
				hyy007: '', // 开户银行
				hyy008: '', // 开户支行银行
				hyy009: '', // 银行联行号
				hyy010: '', // 银行账号
				hyy012: '', // 就业困难人员类型
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
				hyy010: [{
						required: true,
						message: '请输入银行账号',
						trigger: 'blur'
					}],
				hyy012: [{
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
					}]
			},
			// 日期控制
			minYearMonth: '',
			currentYearMonth: '',
			maxYearMonth: '',
			// 承诺书控制
			visibleCommit: false,
			hasReadCommitment: false,
			// 用户信息
			userInfo: {
				realName: '',
				idNumber: '',
				phoneNumber: ''
			},
			// 银行选择相关
			showBank: false,
			bankList: [],
			loading: false,
			hyy012List: [
				{value: '1', label: '就业困难人员'},
				{value: '2', label: '高校毕业生'},
				{value: '3', label: '其他'}
			]
		};
	},
	onLoad() {
		// 用户信息初始化
		this.getUserInfo();
		// 设置日期范围
		this.setDateRange();
	},
	onReady() {

	},
	onShow() {

	},
	methods: {
		init() {
			this.loading = true;
			// 数据初始化
			this.$base.post('/api/initData', {}, res => {
				this.loading = false;
				if (res.code === 200) {
					// 初始化数据处理
				}
			}).catch(err => {
				this.loading = false;
				console.log(err);
			});
		},
		fromChange(e) {
			const { prop, value } = e;
			this.infoForm[prop] = value;
		},
		// 地址选择器相关方法
		openAreaSelector(type) {
			// 打开地址选择器
		},
		areaChange(e, type) {
			// 地址选择变化
			if (type === 1) {
				this.infoForm.hyy002 = e.fullAddress;
			}
		},
		clickMaskClose(type) {
			// 关闭地址选择器遮罩
		},
		// 银行选择相关方法
		closeBank() {
			// 关闭银行选择器
			this.showBank = false;
		},
		// 日期选择相关方法
		fnChangsbStart() {
			// 开始日期选择
		},
		fnChangsbEnd() {
			// 结束日期选择
		},
		fnChangsb() {
			// 社保时间校验
		},
		// 承诺书相关方法
		handleRead() {
			// 显示承诺书
			this.visibleCommit = true;
		},
		handleCommitConfirm() {
			// 确认承诺
			this.hasReadCommitment = true;
			this.visibleCommit = false;
		},
		handleCommitCancel() {
			// 取消承诺
			this.visibleCommit = false;
		},
		// 提交申请
		handleConfirm() {
			// 表单验证
			this.$refs.uForm.validate(valid => {
				if (valid) {
					// 检查承诺书状态
					if (!this.hasReadCommitment) {
						this.visibleCommit = true;
						return;
					}

					// 表单数据处理
					const formData = JSON.parse(JSON.stringify(this.infoForm));
					// 日期格式处理
					formData.hyy102 = formData.hyy102.replace(/\//g, '');
					formData.hyy103 = formData.hyy103.replace(/\//g, '');
					// 身份证号处理
					formData.aac006 = this.userInfo.idNumber.replace(/\//g, '');

					// 参数序列化
					const data = JSON.stringify({
						data: formData
					});

					// 提交数据
					this.loading = true;
					this.$base.post('/api/submitApply', data, res => {
						this.loading = false;
						if (res.code === 200) {
							// 成功处理
							this.$u.toast('申请提交成功');
						} else {
							this.$u.toast(res.message || '申请提交失败');
						}
					}).catch(err => {
						this.loading = false;
						this.$u.toast('网络异常，请稍后重试');
					});
				} else {
					// 表单验证失败
					this.$u.toast('请填写完整信息');
				}
			});
		}
	}
};
</script>

<style scoped>
.wrap {
	padding: 20rpx;
}

.header {
	text-align: center;
	padding: 40rpx 0;
}

.logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 20rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin: 30rpx 0 20rpx;
	color: #333;
}

.form-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1px solid #eee;
}

.label {
	width: 120rpx;
	font-size: 28rpx;
	color: #666;
}

.required {
	color: #f00;
}

.value {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.form-content {
	background: #fff;
	border-radius: 10rpx;
	padding: 20rpx;
}

.form-input-box {
	display: flex;
	align-items: center;
	height: 80rpx;
	border: 1px solid #ddd;
	border-radius: 6rpx;
	padding: 0 20rpx;
}

.input-text {
	font-size: 28rpx;
	color: #333;
}

.placeholder-text {
	font-size: 28rpx;
	color: #999;
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background: #fff;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.commitment-box {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.commitment-content {
	background: #fff;
	border-radius: 10rpx;
	padding: 30rpx;
	width: 80%;
}

.commitment-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 20rpx;
}

.commitment-text {
	font-size: 28rpx;
	line-height: 1.6;
	color: #666;
	margin-bottom: 30rpx;
}

.commitment-btns {
	display: flex;
	justify-content: space-around;
}
</style>