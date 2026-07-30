<template>
	<view class="common-section">
		<view class="common-section-title">申请记录</view>
		<view class="common-card" v-for="(record, index) in records" :key="index">
			<view class="common-header">
				<view class="employment-record-status-tag">{{ record.status }}</view>
			</view>
			<view class="common-content">
				<view class="common-item">
					<span class="common-label">申请日期：</span>
					<span class="common-value">{{ record.applyDate }}</span>
				</view>
				<view class="common-item">
					<span class="common-label">申请类型：</span>
					<span class="common-value">{{ record.applyType }}</span>
				</view>
				<view class="common-item">
					<span class="common-label">申请内容：</span>
					<span class="common-value">{{ record.content }}</span>
				</view>
			</view>
			<view class="common-actions">
				<van-button class="btnStyle" type="info">查看详情</van-button>
				<van-button class="btnStyle" type="info">查看同类记录</van-button>
			</view>
		</view>
		<view class="employment-record-empty" v-if="records.length === 0">
			暂无申请记录
		</view>
		<uni-pagination :total="tableData.length" pageSize="10" />
	</view>
</template>

<script>
	import uniPagination from "@/uni_modules/uni-pagination/components/uni-pagination/uni-pagination.vue"
	export default {
		name: 'recordCard',
		components: {
			uniPagination
		},
		props: {
			records: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			viewDetails(record) {
				this.$emit('viewDetails', record);
			},
			filterOtherRecords(type) {
				this.$emit('filterOtherRecords', type);
			}
		}
	}
</script>

<style scoped>
	.common-section {
		margin-bottom: 24px;
	}

	.common-section-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-bottom: 12px;
		display: block;
	}

	.common-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		margin-bottom: 16px;
		position: relative;
	}

	.common-header {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 12px;
	}

	.employment-record-status-tag {
		background-color: #ff4d4f;
		color: #fff;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		font-weight: bold;
	}

	.common-content {
		margin-bottom: 16px;
	}

	.common-item {
		display: flex;
		margin-bottom: 12px;
		align-items: flex-start;
	}

	.common-item:last-child {
		margin-bottom: 0;
	}

	.common-label {
		font-size: 14px;
		color: #666;
		min-width: 80px;
	}

	.common-value {
		font-size: 14px;
		color: #333;
		flex: 1;
		word-break: break-all;
	}

	.common-actions {
		display: flex;
		gap: 12px;
		border-top: 1px solid #f0f0f0;
		padding-top: 12px;
	}

	.common-btn {
		flex: 1;
		height: 36px;
		border: 1px solid #007aff;
		border-radius: 4px;
		background-color: #fff;
		color: #007aff;
		font-size: 14px;
		cursor: pointer;
	}

	.common-btn:active {
		background-color: rgba(0, 122, 255, 0.1);
	}

	.employment-record-empty {
		text-align: center;
		padding: 40px 0;
		color: #999;
		font-size: 14px;
		background-color: #fff;
		border-radius: 8px;
	}
</style>