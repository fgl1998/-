<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="失业保险金申请" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="function-entry-card">
				<view class="entry-title">失业保险金申请</view>
				<view class="entry-actions">
					<view class="action-btn primary-btn" @click="openAddPage">新增失业保险</view>
					<!-- <view class="action-btn primary-btn" @click="openAddPage" v-if="showAddButton">新增失业保险</view> -->
					<view class="action-btn primary-btn" @click="onOpenVisible3">新增发放信息</view>
					<view class="action-btn secondary-btn active" @click="handleSearch">查询</view>
				</view>
			</view>
			<!-- 基本信息卡片组件 -->
			<view>
				<infoCard :userInfo="infoForm" />
			</view>
			<!-- 申请记录卡片组件 -->
			<view>
				<view class="common-section">
					<view class="common-section-title">申请记录</view>
					<view class="common-card" v-for="(record, index) in applyTableData" :key="index">
						<view class="common-content">
							<view class="common-item">
								<span class="common-label">姓名：</span>
								<span class="common-value">{{ record.aac003 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">身份证号：</span>
								<span class="common-value">{{ record.yac002 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">退休时间：</span>
								<span class="common-value">{{ record.txshij }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">领金后距离退休月数：</span>
								<span class="common-value">{{ record.betweens }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">银行卡号：</span>
								<span class="common-value">{{ record.yhk030 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">参保开始时间：</span>
								<span class="common-value">{{ record.aae003_s }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">参保结束时间：</span>
								<span class="common-value">{{ record.aae003_e }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">领取开始时间：</span>
								<span class="common-value">{{ record.aae030 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">领取结束时间：</span>
								<span class="common-value">{{ record.ajc106 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">缴费月数：</span>
								<span class="common-value">{{ record.dff001 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">失业时间：</span>
								<span class="common-value">{{ record.dff002 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">月发放金额：</span>
								<span class="common-value">{{ record.bxj010 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">经办时间：</span>
								<span class="common-value">{{ record.aae036 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">经办机构：</span>
								<span class="common-value">{{$dict.getDict('AAE017', record.aae017)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">审批状态：</span>
								<span class="common-value">{{$dict.getDict('YAE421', record.yae421)}}</span>
							</view>
							<view class="action-buttons">
								<view class="action-btn-sm" @click="cellDBLClickEvent({row: record})">{{'查看详情'}}
								</view>
								<view class="action-btn-sm" @click="onOpenVisible4(record)">{{'查看发放流程'}}</view>
								<view class="action-btn-sm" @click="onOpenVisible5(record)">{{'新增代缴企业职工养老保险'}}
								</view>
								<view class="action-btn-sm" @click="onOpenVisible6(record)">{{'申请代缴企业职工养老保险信息'}}
								</view>
							</view>
						</view>
					</view>
					<view class="employment-record-empty" v-if="applyTableData.length === 0">
						暂无申请记录
					</view>
					<uni-pagination :total="tableData.length" pageSize="10"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import infoCard from '@/components/common/infoCard.vue';
	import uniPagination from "@/uni_modules/uni-pagination/components/uni-pagination/uni-pagination.vue"
	export default {
		name: 'unemploymentInsurance',
		components: {
			infoCard,
			uniPagination
		},
		data() {
			return {
				visibleBank: false,
				paramsBankCard: {},
				formBankType: 'sybxjForm',
				zIndex: 99,
				dateDff002: '',
				infoForm: {},
				detailData: [],
				headers: '',
				isDisabled: true,
				applyTableData: [],
				current: 1,
				pageSize: 10,
				visible: false,

				visible3: false,
				visible4: false,
				visible5: false,
				visible6: false,
				jfData: [],
				userInfo: {},
				showAddButton: true,
				tableData: [],
				sybxjDetailForm: [],
				jfDetailData: [],
				ywshForm: {},
				ywshTableData: [],
				djbxTableData: [],
				ffxxForm: {},
				ffxxTableData: [],
				hdxxOptions: [],
				ylbxForm: {},
				ylbxTableData: [],
				showYlbxSubmitBtn: true,
				ylbxFormData: {},
				componentHeight: 0
			};
		},
		mounted() {
			// 获取用户信息
			this.init()
			this.queryPageList()
			try {
				const info = this.$base.getUser(true, true)
				if (info && info.naturalBo) {
					this.userInfo = info.naturalBo
					this.userInfo.userType = 'UT01'
					this.paramsBankCard = this.userInfo
					console.log(info, 'info-----------<>>>>');
					this.init()
					if (this.userInfo.certNo) {
						this.queryPageList()
					}
				} else {
					this.$message.error('获取用户信息失败，请重新登录')
				}
			} catch (error) {
				console.error('获取用户信息异常:', error)
				this.$message.error('系统异常，请稍后重试')
			}
			setTimeout(() => {
				this.setHeight()
			}, 500)
		},
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.setHeight()
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
				if (typeof terminalUtil === 'undefined') {
					window.terminalUtil = {
						_setIframeHeight: function () {}
					}
				}
			},
			init() {
				this.infoForm = {
					aac003: this.userInfo.name,
					aac002: this.userInfo.certNo,
					aae005: this.userInfo.mobile
				}
			},
			// 查询失业保险金申请数据列表
			queryPageList() {
				const requestParam = {
					no: '207-0026',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', requestParam, (response) => {
					this.handleResponse(response)
				})
			},
			handleResponse(response) {
				if (!response.serviceSuccess) {
					this.handleError(response.msg || '查询失败')
					return
				}
				// 处理新增按钮显示逻辑
				this.showAddButton = response.data.butAdd
				this.applyTableData = response.data.applyList || []
				// 处理业务状态码
				this.handleBusinessCode(response.data.code)
			},
			handleBusinessCode(code) {
				const messageMap = {
					'0': {
						type: 'warning',
						text: '接口出错，请联系管理员!'
					},
					'1': {
						type: 'success',
						text: '查询成功，暂无数据！'
					},
					'2': {
						type: 'warning',
						text: '该人员信息不全，请核实；'
					},
					'3': {
						type: 'warning',
						text: '未查询到该人员失业保险金(暂停缴费)或(终止缴费)，如有疑问请先去社保局核实社保信息！'
					},
					'4': {
						type: 'warning',
						text: '缴费未满一年或距离上次申请不足一年暂不符合申请，如对缴费月数有疑惑，请前往社保局进行社会信息核实！！！'
					}
				}
				const messageConfig = messageMap[code]
				if (messageConfig) {
					this.showMessage(messageConfig.type, messageConfig.text)
				}
			},
			handleError(errorMessage) {
				this.$message.error(errorMessage)
				this.showAddButton = false
			},
			showMessage(type, message) {
				if (this.$message[type]) {
					this.$message[type](message)
				}
			},
			// 打开新增失业保险弹窗
			openAddPage() {
				if (!this.userInfo || !this.userInfo.certNo) {
					this.$message.error('用户信息不完整，无法新增')
					return
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/unemploymentInsurance/unemploymentInsuranceAdd?params=${encodeURIComponent(JSON.stringify(this.userInfo))}`
					});
				} catch (error) {
					console.error('导航到新增页面失败:', error)
					this.$message.error('无法打开新增页面，请稍后重试')
				}
			},
			cellDBLClickEvent(row) {
				let yac002 = row.row.yac002
				let syy001 = row.row.syy001
				uni.navigateTo({
					url: `/pages/personalServices/unemploymentInsurance/unemploymentInsuranceAddDetail?params=${encodeURIComponent(JSON.stringify({yac002, syy001}))}`
				})
			},
			//打开新增发放信息弹窗
			onOpenVisible3() {
				let yac002 = this.userInfo.certNo
				uni.navigateTo({
					url: `/pages/personalServices/unemploymentInsurance/unemploymentInsuranceAddFfxx?params=${encodeURIComponent(JSON.stringify({yac002}))}`
				})
			},
			//查看发放流程
			onOpenVisible4(row) {
				let syy001 = row.syy001
				let aac001 = this.userInfo.ext03
				uni.navigateTo({
					url: `/pages/personalServices/unemploymentInsurance/unemploymentInsuranceCheckfflc?params=${encodeURIComponent(JSON.stringify({syy001,aac001}))}`
				})
			},
			//查询申请代缴企业职工养老保险信息
			onOpenVisible6(row) {
				// 在移动端版本中，我们可以通过弹窗或新页面实现
				this.$message.info('该功能在移动端暂未实现')
				const param = {
					no: '268-0001',
					data: JSON.stringify({
						syy001: row.syy001,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (res.data.length === 0) {
							this.$message.success('查询成功，暂无数据!')
							return
						}
						this.$message.success('代缴养老保险信息查询成功')
					} else {
						this.$message.error(res.msg || '接口查询失败！')
					}
				})
			},
			//新增代缴企业职工养老保险信息
			onOpenVisible5(row) {
				// 在移动端版本中，我们可以通过弹窗或新页面实现
				this.$message.info('该功能在移动端暂未实现')
			},
			//查询
			handleSearch() {
				this.queryPageList()
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #e0e0e0;

		.action-btn-sm {
			padding: 5px 10px;
			margin-right: 10px;
			margin-bottom: 10px;
			background-color: #1989fa;
			color: white;
			border-radius: 4px;
			font-size: 14px;
		}
	}
</style>