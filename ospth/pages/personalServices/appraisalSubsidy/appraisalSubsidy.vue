<template>
	<view class="service-page" id="contrainer">
		<h-navbar v-if="$base.isApp()" title="鉴定补贴(新)" :border-bottom="false" title-color="#000" back-icon-color="#000"
			:background="{ background: '#FFF' }" back-icon-name="arrow-left" back-icon-size="22"></h-navbar>
		<view class="service-box">
			<view class="function-entry-card">
				<view class="entry-title">个人申请记录</view>
				<view class="entry-actions">
					<view class="action-btn secondary-btn" @click="openAddPage">新增</view>
					<view class="action-btn primary-btn active" @click="handleSearch">查询</view>
				</view>
			</view>
			<!-- 基本信息卡片组件 -->
			<view>
				<infoCard :userInfo="userInfo" />
			</view>
			<!-- 申请记录列表 -->
			<view>
				<view class="common-section">
					<view class="common-section-title">申请记录</view>
					<view class="common-card" v-for="(record, index) in tableData" :key="index">
						<view class="common-content">
							<view class="common-item">
								<span class="common-label">姓名：</span>
								<span class="common-value">{{ record.ysv011 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">身份证号：</span>
								<span class="common-value">{{ record.ysv021 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">性别：</span>
								<span class="common-value">{{$dict.getDict('SEX', record.ysv012) }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">工种等级：</span>
								<span class="common-value">{{ getWorkLevel(record.ysv024) }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">证书类型：</span>
								<span class="common-value">{{ record.ysv026 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">证书编号：</span>
								<span class="common-value">{{ record.ysv028 }}</span>
							</view>
							<view class="common-item">
								<span class="common-label">审核状态：</span>
								<span class="common-value">{{ getAuditStatus(record.fstatus) }}</span>
							</view>
						</view>
						<view class="common-actions">
							<van-button class="btnStyle" type="info" v-if="record.fstatus === '1'"
								@click="onEdit(record)">编辑</van-button>
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
		name: 'appraisalSubsidy',
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
				componentHeight: 0
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
		// 页面初次渲染完成时触发
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.setHeight()
		},
		methods: {
			setHeight() {
				try {
					const query = uni.createSelectorQuery().in(this)
					query.select('#contrainer').boundingClientRect((data) => {
						if (data) {
							this.componentHeight = data.height
							if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
								terminalUtil._setIframeHeight(data.height)
							}
						}
					}).exec()
				} catch (error) {
					console.error('设置高度异常:', error)
				}
			},
			queryPageList() {
				const param = {
					no: '496-0008',
					data: JSON.stringify({
						ysv021: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					console.log('res: ', res);
					if (res.serviceSuccess && res.data.code === '1') {
						this.tableData = res.data.list || []
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
						url: `/pages/personalServices/appraisalSubsidy/appraisalSubsidyAdd?params=${encodeURIComponent(JSON.stringify(this.userInfo))}`
					});
				} catch (error) {
					console.error('导航到新增页面失败:', error)
					this.$message.error('无法打开新增页面，请稍后重试')
				}
			},
			onEdit(row) {
				if (!row || !row.ysv010) {
					this.$message.error('请选择要编辑的记录')
					return
				}
				if (row.fstatus !== '1') {
					this.$message.error("该信息处于审核阶段，不可修改")
					return;
				}
				try {
					uni.navigateTo({
						url: `/pages/personalServices/appraisalSubsidy/appraisalSubsidyAdd?params=${encodeURIComponent(JSON.stringify(row))}`
					});
				} catch (error) {
					console.error('导航到编辑页面失败:', error)
					this.$message.error('无法打开编辑页面，请稍后重试')
				}
			},
			getWorkLevel(code) {
				switch (code) {
					case '401':
						return '高级技师';
					case '402':
						return '技师';
					case '403':
						return '高级';
					case '404':
						return '中级';
					case '405':
						return '初级';
					default:
						return code;
				}
			},
			getCertificateType(code) {
				switch (code) {
					case '4':
						return '专项能力资格证书';
					case '6':
						return '职业技能等级认定证书';
					default:
						return code;
				}
			},
			getAuditStatus(code) {
				switch (code) {
					case '1':
						return '未审核';
					case '2':
						return '初审通过';
					case '3':
						return '复审通过';
					case '4':
						return '终审通过';
					case '9':
						return '审核不通过';
					default:
						return code;
				}
			}
		}
	};
</script>


<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");
</style>