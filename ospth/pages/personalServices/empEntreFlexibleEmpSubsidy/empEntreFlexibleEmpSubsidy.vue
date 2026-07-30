<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="就业困难人员灵活就业补贴" :border-bottom="false" title-color="#000"
			back-icon-color="#000" :background="{ background: '#FFF' }" back-icon-name="arrow-left"
			back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="function-entry-card">
				<view class="entry-title">就业困难人员灵活就业补贴</view>
				<view class="entry-actions">
					<view class="action-btn primary-btn" @click="openAddPage">补贴申请</view>
					<view class="action-btn secondary-btn active" @click="handleSearch">查询</view>
				</view>
			</view>
			<!-- 个人基本信息卡片组件 -->
			<view>
				<infoCard :userInfo="infoForm" />
			</view>
			<!-- 申请记录信息卡片 -->
			<view>
				<view class="common-section">
					<view class="common-section-title">申请记录信息</view>
					<view class="common-card" v-for="(record, index) in tableData" :key="index">
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
								<span class="common-label">性别：</span>
								<span class="common-value">{{$dict.getDict('AAC004', record.aac004)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">民族：</span>
								<span class="common-value">{{$dict.getDict('AAC005', record.aac005)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业困难人员类别：</span>
								<span class="common-value">{{$dict.getDict('YCC131_RD', record.hyy012)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">户口所在地：</span>
								<span class="common-value">{{$dict.getDict('AAE017', record.hyy002)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">灵活就业地：</span>
								<span class="common-value">{{ record.hyy003 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">银行账号：</span>
								<span class="common-value">{{ record.hyy010 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">补贴开始月：</span>
								<span class="common-value">{{ record.hyy102 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">补贴结束月：</span>
								<span class="common-value">{{ record.hyy103 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">补贴总金额：</span>
								<span class="common-value">{{ record.hyy200 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">养老保险金额：</span>
								<span class="common-value">{{ record.hyy104 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">医疗保险金额：</span>
								<span class="common-value">{{ record.hyy114 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">补贴总月数：</span>
								<span class="common-value">{{ record.months }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">申请日期：</span>
								<span class="common-value">{{ record.aae036 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">审核状态：</span>
								<span class="common-value">{{$dict.getDict('YAE421', record.yae421)}}</span>
							</view>
							<view class="common-item">
								<view class="action-btn small-btn detail-btn" @click="handleDetail(record)">查看申请明细
								</view>
							</view>
						</view>
					</view>
					<view class="employment-record-empty" v-if="tableData.length === 0">
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
		name: 'empEntreFlexibleEmpSubsidy',
		components: {
			infoCard,
			uniPagination
		},
		data() {
			return {
				info: {},
				userInfo: {},
				infoForm: {},
				tableData: [],
				current: 1,
				pageSize: 10,
			};
		},
		mounted() {
			// 获取用户信息
			try {
				const info = this.$base.getUser(true, true)
				if (info && info.naturalBo) {
					this.userInfo = info.naturalBo
					this.init()
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
		// 页面初次渲染完成时触发，一个页面只会调用一次
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
						_setIframeHeight: function() {}
					}
				}
			},
			init() {
				const param = {
					no: '000-0016',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						if (!res.data) {
							this.$message.error('查询失败,未找到数据！')
							return
						} else {
							this.info = res.data || {}
							this.infoForm = this.info
							this.queryPageList()
						}
					}
				})
			},
			queryPageList() {
				if (!this.info) {
					this.$message.error('查询失败,未找到数据！')
					return
				}
				const param = {
					no: '478-0002',
					data: JSON.stringify({
						aac003: this.info.aac003,
						yav002: this.info.aac002,
						aac004: this.info.aae005,
						aac011: this.info.aac011,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data) {
						this.tableData = res.data || []
						// 判断数据是否为空
						if (!this.tableData || this.tableData.length === 0) {
							this.$message.success('查询成功，数据为空！')
						} else {
							this.$message.success('查询成功')
						}
						this.$nextTick(() => {
							this.setHeight()
						})
					} else {
						this.$message.error(res.message || '查询失败')
					}
				})
			},
			handleSearch() {
				this.queryPageList()
			},
			openAddPage() {
				if (!this.userInfo || !this.userInfo.certNo) {
					this.$message.error('用户信息不完整，无法新增')
					return
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/empEntreFlexibleEmpSubsidy/empEntreFlexibleEmpSubsidyApply?params=${encodeURIComponent(JSON.stringify(this.userInfo))}`
					});

				} catch (error) {
					console.error('导航到申请页面失败:', error)
					this.$message.error('无法打开申请页面，请稍后重试')
				}
			},
			handleReset() {
				this.current = 1
				this.pageSize = 10
				this.init()
			},
			handleDetail(row) {
				if (!row) {
					this.$message.error('数据异常，无法操作');
					return;
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/empEntreFlexibleEmpSubsidy/empEntreFlexibleEmpSubsidyDetail?params=${encodeURIComponent(JSON.stringify(row))}`
					});
				} catch (error) {
					console.error('导航到明细页面失败:', error)
					this.$message.error('无法打开明细页面，请稍后重试')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");

	.small-btn {
		padding: 4px 12px;
		font-size: 14px;
		margin-top: 10px;
	}

	.detail-btn {
		background-color: #409EFF;
		color: white;
	}
</style>