<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="就业登记(新)" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="function-entry-card">
				<view class="entry-title">就业登记(新)</view>
				<view class="entry-actions">
					<view class="action-btn primary-btn" @click="openAddPage">新增</view>
					<view class="action-btn secondary-btn active" @click="handleSearch">查询</view>
				</view>
			</view>
			<!-- 查询筛选组件 -->
			<!-- <view>
				<filterCard @toggle="onFilterToggle" @reset="onFilterReset" @confirm="onFilterConfirm" />
			</view> -->
			<!-- 基本信息卡片组件 -->
			<view>
				<infoCard :userInfo="infoForm" />
			</view>
			<!-- 申请记录卡片组件 -->
			<!-- <span>{{$dict.getDict('SEX', '1')}}</span> -->
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
								<span class="common-label">性别：</span>
								<span class="common-value">{{$dict.getDict('AAC004', record.aac004)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">文化程度：</span>
								<span class="common-value">{{$dict.getDict('AAC011', record.aac011)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">身份证号：</span>
								<span class="common-value">{{ record.yac002 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">现住地址：</span>
								<span class="common-value">{{ record.aac026 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">联系电话：</span>
								<span class="common-value">{{ record.aae005 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">现工作单位：</span>
								<span class="common-value">{{ record.aab004 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业日期：</span>
								<span class="common-value">{{ record.ycc039 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">就业方式：</span>
								<span class="common-value">{{$dict.getDict('ADC111', record.yhc407)}}</span>
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
								<span class="common-label">录入审批状态：</span>
								<span class="common-value">{{$dict.getDict('YAE421', record.yae421)}}</span>
							</view>
							<view class="common-item">
								<span class="common-label">注销审批状态：</span>
								<span class="common-value">{{$dict.getDict('YAE421', record.ycc045)}}</span>
							</view>
						</view>
						<view class="common-actions">
							<van-button class="btnStyle" type="info"
								v-if="record.yae421 === '01' && record.aae100 === '1' && (record.ycc045 === undefined || record.ycc045 === '00')"
								@click="handleCancel(record)">注销</van-button>
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
	import filterCard from '@/components/common/filterCard.vue';
	import infoCard from '@/components/common/infoCard.vue';
	// import recordCard from '@/components/common/recordCard.vue';
	import uniPagination from "@/uni_modules/uni-pagination/components/uni-pagination/uni-pagination.vue"
	export default {
		name: 'employmentRecord',
		components: {
			filterCard,
			infoCard,
			// recordCard
			uniPagination
		},
		data() {
			return {
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
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						terminalUtil._setIframeHeight(data.height)
					}
				}).exec()
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
							let info = res.data || {}
							this.infoForm = info
						}
					}
				})
			},
			queryPageList() {
				console.log('this.userInfo: ', this.userInfo);
				const param = {
					no: '403-0006',
					data: JSON.stringify({
						aac001: this.userInfo.ext03
					}),
				}
				console.log('param: ', param);
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						this.tableData = res.data || []
						console.log('this.tableData : ', this.tableData);
						// 判断数据是否为空
						if (!this.tableData || this.tableData.length === 0) {
							this.$message.success('查询成功，数据为空！')
						} else {
							// 有数据时显示后台返回的提示
							this.$message.success('查询成功')
						}
					} else {
						this.$message.error(res.message || '查询失败')
					}
				})
			},
			handleSearch() {
				this.queryPageList()
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
						url: `/pages/personalServices/employmentRecord/employmentRecordAdd?params=${encodeURIComponent(JSON.stringify(this.userInfo))}`
					});
				} catch (error) {
					console.error('导航到新增页面失败:', error)
					this.$message.error('无法打开新增页面，请稍后重试')
				}
			},
			handleCancel(row) {
				console.log('row: ', row);
				// 确保row不为空
				if (!row) {
					this.$message.error('数据异常，无法操作');
					return;
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/employmentRecord/employmentRecordDelete?params=${encodeURIComponent(JSON.stringify({...this.userInfo,...row}))}`
					});
				} catch (error) {
					console.error('导航到新增页面失败:', error)
					this.$message.error('无法打开新增页面，请稍后重试')
				}

			},
			onFilterToggle(expanded) {
				console.log('筛选面板展开状态:', expanded);
			},
			onFilterReset() {
				console.log('筛选条件已重置');
			},
			onFilterConfirm(filters) {
				console.log('筛选条件已确认:', filters);
				uni.showToast({
					title: '查询条件已确认',
					icon: 'success'
				});
			},
		},

	};
</script>


<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");
</style>