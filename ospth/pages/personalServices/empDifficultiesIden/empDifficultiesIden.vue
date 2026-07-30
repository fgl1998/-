<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="就业困难人员认定" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="function-entry-card">
				<view class="entry-title">就业困难人员认定</view>
				<view class="entry-actions">
					<view class="action-btn primary-btn" @click="openAddPage">新增申请</view>
					<view class="action-btn secondary-btn active" @click="handleSearch">查询</view>
				</view>
			</view>
			<!-- 基本信息卡片组件 -->
			<view>
				<infoCard :userInfo="userInfo" />
			</view>
			<!-- 申请记录卡片组件 -->
			<view>
				<view class="common-section">
					<view class="common-section-title">申请记录</view>
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
								<span class="common-label">领取失业保险金情况：</span>
								<span class="common-value">{{ getUnemploymentBenefit(record.aae013) }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业困难人员类别：</span>
								<span class="common-value">{{$dict.getDict('YCC131_RD', record.ycc131)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">是否援助对象：</span>
								<span class="common-value">{{$dict.getDict('YESORNO', record.ycc13g)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业援助起始日期：</span>
								<span class="common-value">{{ record.ycc136 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业援助结束日期：</span>
								<span class="common-value">{{ record.ycc137 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">经办机构：</span>
								<span class="common-value">{{$dict.getDict('AAE017', record.aae017)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">审批状态：</span>
								<span class="common-value">{{$dict.getDict('YAE421', record.yae421)}}</span>
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
		name: 'empDifficultiesIden',
		components: {
			infoCard,
			uniPagination
		},
		data() {
			return {
				userInfo: {},
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
					this.queryPageList()
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
			// 获取失业保险金情况
			getUnemploymentBenefit(value) {
				console.log('value: ', value);
				if (value === '1') return '领取失业保险金期间';
				if (value === '2') return '领取失业保险金期满';
				if (value === '3') return '本次失业不享受失业保险待遇';
				return '';
			},
			// 设置页面高度
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						if (window.terminalUtil) {
							window.terminalUtil._setIframeHeight(data.height)
						}
					}
				}).exec()
			},
			// 查询列表数据
			queryPageList() {
				const param = {
					no: '409-0001',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						this.tableData = res.data || []
						// 判断数据是否为空
						if (!this.tableData || this.tableData.length === 0) {
							this.$message.success('查询成功，数据为空！')
						} else {
							// 有数据时显示后台返回的提示
							this.$message.success(res.data.message || '查询成功')
						}
						this.$nextTick(() => {
							this.setHeight()
						})

					} else {
						this.$message.error(res.message || '查询失败')
					}
				})
			},
			// 打开新增页面
			openAddPage() {
				if (!this.userInfo || !this.userInfo.certNo) {
					this.$message.error('用户信息不完整，无法新增')
					return
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/empDifficultiesIden/empDifficultiesIdenAdd?params=${encodeURIComponent(JSON.stringify(this.userInfo))}`
					});
				} catch (error) {
					console.error('导航到新增页面失败:', error)
					this.$message.error('无法打开新增页面，请稍后重试')
				}
			},
			// 查询操作
			handleSearch() {
				this.queryPageList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");
</style>