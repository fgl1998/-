<template>
	<div class="employment-record-result-section">
		<div class="employment-record-section-title">基本信息</div>
		<div class="employment-record-info-card">
			<div class="employment-record-info-item">
				<span class="employment-record-info-label">姓名：</span>
				<span class="employment-record-info-value">{{ userInfo.name|| userInfo.aac003 || '暂无' }}</span>
			</div>
			<div class="employment-record-info-item">
				<span class="employment-record-info-label">身份证号：</span>
				<span class="employment-record-info-value">{{ userInfo.idNumber|| userInfo.aac002||userInfo.ysv021 || '暂无' }}</span>
			</div>
			<div class="employment-record-info-item">
				<span class="employment-record-info-label">联系电话：</span>
				<span class="employment-record-info-value">{{ userInfo.phone || userInfo.aae005  || '暂无' }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'infoCard',
		props: {
			userInfo: {
				type: Object,
				default: () => ({
					name: '',
					idNumber: '',
					phone: '',
				})
			}
		}
	}
</script>

<style scoped>
	.employment-record-result-section {
		margin-bottom: 24px;
	}

	.employment-record-section-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-bottom: 12px;
	}

	.employment-record-info-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.employment-record-info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.employment-record-info-item:last-child {
		border-bottom: none;
	}

	.employment-record-info-label {
		font-size: 14px;
		color: #666;
	}

	.employment-record-info-value {
		font-size: 14px;
		color: #333;
		text-align: right;
		flex: 1;
		margin-left: 8px;
	}

	.employment-record-info-item:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.01);
	}

	.employment-record-info-item {
		position: relative;
		margin-bottom: 16px;
		border-bottom: none;
		flex-wrap: wrap;
	}

	.employment-record-info-item:last-child {
		margin-bottom: 0;
	}

	.employment-record-info-label {
		font-weight: normal;
		min-width: 80px;
	}

	.employment-record-info-value {
		flex: 1;
		word-break: break-all;
	}
</style>