<template>
	<view class="service-page" id="contrainer">
		<view class="service-box">
			<view class="form-page">
				<view class="uform">
					<u-form :model="infoForm" ref="infoForm" label-position="left">
						<view class="tips">
							注：请将户口所在地选择到市县(区)，所选户口所在地即为审核地<br />
							注：申请就业困难人员灵活就业人员社保补贴，须认定就业困难人员+就业登记<br />
							注：高校毕业生申请就业困难人员灵活就业人员社保补贴，毕业时间须不超过两年<br />
							注：补贴金额按养老所缴纳金额的2/3补贴;女性年龄小于40岁，男性年龄小于50只能申请3次，女性年龄大于等于40岁，男性年龄大于等于50岁可申请5次<br />
						</view>
						<!-- 个人基本信息 -->
						<view class="title-line-blue">
							<view class="title">人员信息</view>
						</view>
						<u-form-item label="就业困难人员灵活就业补贴明细流水号" prop="hyy001" label-width="150" v-show="false">
							<u-input v-model="infoForm.hyy001" :border="false" disabled />
						</u-form-item>
						<u-form-item label="个人编号" prop="aac001" label-width="150" v-show="false">
							<u-input v-model="infoForm.aac001" :border="false" disabled />
						</u-form-item>
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
						<u-form-item label="文化程度" prop="aac011" label-width="150">
							<mini-picker disabled placeholder="请选择文化程度" selectPrompt="请选择文化程度" collection="AAC011"
								v-model="infoForm.aac011" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="户口所在地" prop="hyy002" label-width="150">
							<u-input v-model="infoForm.hyy002" :border="false" placeholder="户口所在地" disabled />
						</u-form-item>
						<u-form-item label="灵活就业地" prop="hyy003" label-width="150">
							<u-input v-model="infoForm.hyy003" :border="false" placeholder="灵活就业地" disabled />
						</u-form-item>
						<u-form-item label="开户银行" prop="hyy007" label-width="150">
							<u-input v-model="infoForm.hyy007" :border="false" placeholder="开户银行" disabled />
						</u-form-item>
						<u-form-item label="银行卡户名" prop="hyy006" label-width="150">
							<u-input v-model="infoForm.hyy006" :border="false" placeholder="银行卡户名" disabled />
						</u-form-item>
						<u-form-item label="开户支行银行" prop="hyy008" label-width="150">
							<u-input v-model="infoForm.hyy008" :border="false" placeholder="开户支行银行" disabled />
						</u-form-item>
						<u-form-item label="银行联行号" prop="hyy009" label-width="150" v-show="false">
							<u-input v-model="infoForm.hyy009" :border="false" disabled />
						</u-form-item>
						<u-form-item label="银行账号" prop="hyy010" label-width="150">
							<u-input v-model="infoForm.hyy010" :border="false" placeholder="银行账号" disabled />
						</u-form-item>
						<u-form-item label="就业困难人员类型" prop="hyy012" label-width="150">
							<mini-picker disabled placeholder="请选择就业困难人员类型" selectPrompt="请选择就业困难人员类型"
								collection="YCC131_RD" v-model="infoForm.hyy012"></mini-picker>
						</u-form-item>
						<u-form-item label="灵活就业内容" prop="hyy004" label-width="150">
							<u-input v-model="infoForm.hyy004" :border="false" placeholder="灵活就业内容" disabled />
						</u-form-item>

						<!-- 补贴信息 -->
						<view class="title-line-blue">
							<view class="title">补贴信息</view>
						</view>
						<u-form-item label="补贴开始年月" prop="hyy102" label-width="150">
							<u-input v-model="infoForm.hyy102" :border="false" placeholder="补贴开始年月" disabled />
						</u-form-item>
						<u-form-item label="补贴结束年月" prop="hyy103" label-width="150">
							<u-input v-model="infoForm.hyy103" :border="false" placeholder="补贴结束年月" disabled />
						</u-form-item>
						<u-form-item label="养老缴费金额" prop="hyy104" label-width="150">
							<u-input v-model="infoForm.hyy104" :border="false" placeholder="养老缴费金额" disabled />
						</u-form-item>
						<u-form-item label="养老补贴金额" prop="hyy104_bt" label-width="150">
							<u-input v-model="infoForm.hyy104_bt" :border="false" placeholder="养老补贴金额" disabled />
						</u-form-item>
						<u-form-item label="医疗缴费金额" prop="hyy114" label-width="150">
							<u-input v-model="infoForm.hyy114" :border="false" placeholder="医疗缴费金额" disabled />
						</u-form-item>
						<u-form-item label="医疗补贴金额" prop="hyy114_bt" label-width="150">
							<u-input v-model="infoForm.hyy114_bt" :border="false" placeholder="医疗补贴金额" disabled />
						</u-form-item>
						<u-form-item label="失业缴费金额" prop="hyy124" label-width="150">
							<u-input v-model="infoForm.hyy124" :border="false" placeholder="失业缴费金额" disabled />
						</u-form-item>
						<u-form-item label="失业补贴金额" prop="hyy124_bt" label-width="150">
							<u-input v-model="infoForm.hyy124_bt" :border="false" placeholder="失业补贴金额" disabled />
						</u-form-item>
						<u-form-item label="工伤缴费金额" prop="hyy134" label-width="150">
							<u-input v-model="infoForm.hyy134" :border="false" placeholder="工伤缴费金额" disabled />
						</u-form-item>
						<u-form-item label="工伤补贴金额" prop="hyy134_bt" label-width="150">
							<u-input v-model="infoForm.hyy134_bt" :border="false" placeholder="工伤补贴金额" disabled />
						</u-form-item>
						<u-form-item label="生育缴费金额" prop="hyy144" label-width="150">
							<u-input v-model="infoForm.hyy144" :border="false" placeholder="生育缴费金额" disabled />
						</u-form-item>
						<u-form-item label="生育补贴金额" prop="hyy144_bt" label-width="150">
							<u-input v-model="infoForm.hyy144_bt" :border="false" placeholder="生育补贴金额" disabled />
						</u-form-item>
						<u-form-item label="总补贴金额" prop="hyy200" label-width="150">
							<u-input v-model="infoForm.hyy200" :border="false" placeholder="总补贴金额" disabled />
						</u-form-item>
						<u-form-item label="补贴总金额" prop="hyy200_bt" label-width="150">
							<u-input v-model="infoForm.hyy200_bt" :border="false" placeholder="补贴总金额" disabled />
						</u-form-item>
						<u-form-item label="预计可享受月数" prop="enjoymonth" label-width="150">
							<u-input v-model="infoForm.enjoymonth" :border="false" placeholder="预计可享受月数" disabled />
						</u-form-item>
						<u-form-item label="申请总月数" prop="months" label-width="150">
							<u-input v-model="infoForm.months" :border="false" placeholder="申请总月数" disabled />
						</u-form-item>
						<u-form-item label="实际缴费月数" prop="sjmonths" label-width="150">
							<u-input v-model="infoForm.sjmonths" :border="false" placeholder="实际缴费月数" disabled />
						</u-form-item>
						<u-form-item label="剩余享受月数" prop="leavemonth" label-width="150">
							<u-input v-model="infoForm.leavemonth" :border="false" placeholder="剩余享受月数" disabled />
						</u-form-item>

						<!-- 上传材料 -->
						<view class="title-line-blue">
							<view class="title">上传材料</view>
						</view>
						<view class="material-box">
							<service-upload :yae421="userInfo.yae421" :yda020="'478'" :yda031="yda031Value" :is-edit="false"></service-upload>
						</view>

						<view class="btn-box">
							<u-button type="primary" @click="back">返回</u-button>
						</view>
					</u-form>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import serviceUpload from '@/components/service-upload/service-upload.vue';
	export default {
		name: 'empEntreFlexibleEmpSubsidyDetail',
		components: {
			serviceUpload
		},
		data() {
			return {
				isDisabled: true,
				// 用户信息
				userInfo: {},
				// 表单数据
				infoForm: {
					hyy001: '', // 就业困难人员灵活就业补贴明细流水号
					aac001: '', // 个人编号
					aac003: '', // 姓名
					yac002: '', // 身份证号码
					aac004: '', // 性别
					aac005: '', // 民族
					aac006: '', // 出生日期
					aac011: '', // 文化程度
					hyy002: '', // 户口所在地
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
				yda031Value:''
			}
		},
		onLoad(options) {
			console.log('options: ', options);
			if (options.params) {
				try {
					this.userInfo = JSON.parse(decodeURIComponent(options.params));
					this.yda031Value = this.userInfo.hyy001
					console.log('获取到的用户信息:', this.userInfo);
				} catch (error) {
					console.error('解析参数失败:', error);
				}
			}
		},
		onReady() {
			this.init();
		},
		onShow() {
			// 页面显示时的处理逻辑
		},
		methods: {
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
							terminalUtil._setIframeHeight(data.height)
						}
					}
				}).exec()
				// 兼容性处理：如果外部没有定义terminalUtil，则忽略
				if (typeof terminalUtil == 'undefined') {
					window.terminalUtil = {
						_setIframeHeight: function() {}
					}
				}
			},
			// 初始化数据
			init() {
				if (!this.userInfo.hyy001) {
					this.$message.error('缺少必要参数，无法获取详情！');
					return;
				}
				const param = {
					no: '478-0012',
					data: JSON.stringify({
						hyy001: this.userInfo.hyy001,
						yae421: this.userInfo.yae421
					})
				};
				this.setHeight()
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.code == '1') {
							let arr = res.data.detailInfo || {};
							// 格式化日期
							if (arr.aac006) {
								const date = new Date(arr.aac006);
								arr.aac006 = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
							}
							this.infoForm = {
								...this.infoForm,
								...arr
							};
							// 获取户口所在地文本
							this.getHyy002Data();
						} else if (res.data.code == '0') {
							this.$message.error(res.data.msg);
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
			// 获取户口所在地文本
			getHyy002Data() {
				const param = {
					no: '478-0009',
					data: JSON.stringify({
						yac002: this.userInfo.yac002 || ''
					})
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data.code === '1' && res.data.listtree) {
						const hyy002Data = res.data.listtree;
						// 根据hyy002值查找对应的name
						if (this.infoForm.hyy002) {
							const targetItem = hyy002Data.find(item => item.id === this.infoForm.hyy002);
							if (targetItem) {
								this.infoForm.hyy002 = targetItem.name;
							}
						}
					}
				});
			},
			// 返回上一页
			back() {
				uni.navigateBack();
			}
		}
	};
</script>


<style lang="scss" scoped>
	@import url("../../../static/css/sass/form.scss");
	.material-box {
		margin-bottom: 20px;
	}
	.tips {
		color: red;
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 20px;
	}
</style>