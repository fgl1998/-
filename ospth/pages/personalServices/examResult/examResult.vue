<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="工考成绩查询" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="form-page">
				<view class="uform">
					<view class="content-box">
						<view class="sub-title">工考成绩查询</view>
						<u-form :model="infoForm" ref="infoForm" label-position="left">
							<u-form-item label="姓名" prop="aac003" label-width="120">
								<u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
							</u-form-item>
							<u-form-item label="身份证" prop="aac147" label-width="120">
								<u-input v-model="infoForm.aac147" :border="false" placeholder="身份证" disabled />
							</u-form-item>
							<u-form-item label="准考证号" prop="ygcr41" label-width="120">
								<u-input v-model="infoForm.ygcr41" :border="false" placeholder="请输入准考证号" />
							</u-form-item>
							<u-form-item>
								<u-button type="primary" @click="onQuery" :disabled="isLoading">查询</u-button>
							</u-form-item>
						</u-form>
					</view>

					<view class="content-box" style="margin-top: 20px;">
						<view class="sub-title">成绩结果</view>
						<u-form :model="queryForm" ref="queryForm" label-position="left">
							<u-form-item label="理论成绩" prop="ygcr82_1" label-width="120">
								<u-input v-model="queryForm.ygcr82_1" :border="false" placeholder="理论成绩" disabled />
							</u-form-item>
							<u-form-item label="实操成绩" prop="ygcr82_2" label-width="120">
								<u-input v-model="queryForm.ygcr82_2" :border="false" placeholder="实操成绩" disabled />
							</u-form-item>
							<u-form-item label="综合成绩" prop="ygcr82_3" label-width="120">
								<u-input v-model="queryForm.ygcr82_3" :border="false" placeholder="综合成绩" disabled />
							</u-form-item>
						</u-form>
						<view class="empty-result" v-if="showEmptyResult">
							暂无成绩记录
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'examResult',
		data() {
			return {
				userInfo: {},
				infoForm: {
					aac003: '2407175400000000001',
					aac147: '',
					ygcr41: ''
				},
				queryForm: {
					ygcr82_1: '',
					ygcr82_2: '',
					ygcr82_3: ''
				},
				isLoading: false,
				showEmptyResult: false
			}
		},
		computed: {},
		watch: {},
		onLoad() {
			// 获取用户信息
			try {
				const info = this.$base.getUser(true, true);
				if (info && info.naturalBo) {
					this.userInfo = info.naturalBo;
					this.init();
				} else {
					this.$message.error('获取用户信息失败，请重新登录');
				}
			} catch (error) {
				console.error('获取用户信息异常:', error);
				this.$message.error('系统异常，请稍后重试');
			}
		},
		onReady() {
			this.setHeight();
		},
		methods: {
			setHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
							terminalUtil._setIframeHeight(data.height);
						}
					}
				}).exec();
				// 兼容性处理：如果外部没有定义terminalUtil，则忽略
				if (typeof terminalUtil == 'undefined') {
					window.terminalUtil = {
						_setIframeHeight: function() {}
					}
				}
			},
			init() {
				const param = {
					no: '000-0016',
					data: JSON.stringify({
						yac002: this.userInfo.certNo || '',
					}),
				};
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (!res.data) {
							this.$message.error('查询失败,未找到数据！');
							return;
						} else {
							let info = res.data || {};
							this.infoForm = {
								...this.infoForm,
								aac003: info.aac003,
								aac147: info.aac002,
							};
						}
					}
					this.setHeight();
				}, (error) => {
					console.error('初始化数据失败:', error);
					this.$message.error('系统异常，请稍后重试');
				});
			},
			onQuery() {
				if (!this.infoForm.ygcr41) {
					this.$message.error('请输入准考证号');
					return;
				}

				this.isLoading = true;
				const param = {
					no: '496-0007',
					data: JSON.stringify({
						aac003: this.infoForm.aac003,
						aac147: this.infoForm.aac147,
						// aac003: '2407175400000000001',
						// aac147: 'grtest',
						ygcr41: this.infoForm.ygcr41,
					}),
				};
				this.$base.post('', param, (res) => {
					this.isLoading = false;
					if (res.serviceSuccess && res.data.code === '1') {
						let info = res.data.info || {};
						// 检查info是否为空对象
						if (!info || Object.keys(info).length === 0) {
							this.$message.error('暂无成绩记录！');
							this.showEmptyResult = true;
							this.queryForm = {
								ygcr82_1: '',
								ygcr82_2: '',
								ygcr82_3: ''
							};
							return;
						} else {
							this.showEmptyResult = false;
							this.queryForm = {
								...this.queryForm,
								ygcr82_1: info.ygcr82_1 || '',
								ygcr82_2: info.ygcr82_2 || '',
								ygcr82_3: info.ygcr82_3 || ''
							};
						}
					} else {
						this.$message.error(res.data?.msg || '查询失败');
						this.showEmptyResult = true;
					}
					this.setHeight();
				}, (error) => {
					this.isLoading = false;
					console.error('查询成绩失败:', error);
					this.$message.error('查询失败，请稍后重试');
				});
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import url("../../../static/css/sass/form.scss");

	.form-page {
		padding-top: 30rpx;
		box-sizing: border-box;
	}

	.u-form {
		padding: 20rpx;
		box-sizing: border-box;
	}

	.content-box {
		border: 1px solid #afd2f0;
		border-radius: 4px;
		background-color: #fff;
		overflow: hidden;
	}

	.sub-title {
		padding: 12px 16px;
		font-size: 18px;
		color: #333;
		font-weight: bold;
		background-color: #afd2f0;
		margin-bottom: 0;
	}

	.empty-result {
		text-align: center;
		padding: 30px 0;
		color: #999;
		font-size: 14px;
	}
</style>