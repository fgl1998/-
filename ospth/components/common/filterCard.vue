<template>
	<div class="employment-record-filter-section">
		<div class="employment-record-filter-header" @click="toggleFilter">
			<span class="employment-record-filter-title">查询筛选</span>
			<i class="uni-icon" :class="isFilterExpanded ? 'uni-icon-top' : 'uni-icon-bottom'"></i>
		</div>
		<div class="employment-record-filter-content" v-show="isFilterExpanded">
			<div class="employment-record-filter-item">
				<span class="employment-record-filter-label">就业状态：</span>
				<div class="employment-record-filter-select">
					<select v-model="selectedEmploymentStatus" class="employment-record-select">
						<option value="">全部</option>
						<option value="就业中">就业中</option>
						<option value="待就业">待就业</option>
						<option value="失业中">失业中</option>
					</select>
				</div>
			</div>
			<div class="employment-record-filter-item">
				<span class="employment-record-filter-label">时间段：</span>
				<div class="employment-record-date-range">
					<input type="date" v-model="startDate" class="employment-record-date-input" placeholder="开始日期" />
					<span class="employment-record-date-separator">至</span>
					<input type="date" v-model="endDate" class="employment-record-date-input" placeholder="结束日期" />
				</div>
			</div>
			<div class="employment-record-filter-item">
				<span class="employment-record-filter-label">申请类型：</span>
				<div class="employment-record-filter-select">
					<select v-model="selectedApplyType" class="employment-record-select">
						<option value="">全部</option>
						<option value="职业介绍">职业介绍</option>
						<option value="就业培训">就业培训</option>
						<option value="创业扶持">创业扶持</option>
						<option value="技能鉴定">技能鉴定</option>
					</select>
				</div>
			</div>
			<div class="employment-record-filter-actions">
				<button class="employment-record-filter-reset" @click="resetFilter">重置</button>
				<button class="employment-record-filter-confirm" @click="confirmFilter">确认</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'filterCard',
		data() {
			return {
				isFilterExpanded: false,
				selectedEmploymentStatus: '',
				startDate: '',
				endDate: '',
				selectedApplyType: ''
			}
		},
		methods: {
			toggleFilter() {
				this.isFilterExpanded = !this.isFilterExpanded;
				this.$emit('toggle', this.isFilterExpanded);
			},
			resetFilter() {
				this.selectedEmploymentStatus = '';
				this.startDate = '';
				this.endDate = '';
				this.selectedApplyType = '';
				this.$emit('reset');
			},
			confirmFilter() {
				if (this.startDate && this.endDate) {
					const start = new Date(this.startDate);
					const end = new Date(this.endDate);
					if (start > end) {
						uni.showToast({
							title: '开始日期不能晚于结束日期',
							icon: 'none'
						});
						return;
					}
				}
				this.$emit('confirm', {
					employmentStatus: this.selectedEmploymentStatus,
					startDate: this.startDate,
					endDate: this.endDate,
					applyType: this.selectedApplyType
				});
			}
		}
	}
</script>

<style scoped>
	.employment-record-filter-section {
		background-color: #f5f5f5;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 16px;
	}

	.employment-record-filter-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		padding-bottom: 8px;
	}

	.employment-record-filter-title {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.uni-icon {
		font-size: 14px;
		color: #666;
		transition: transform 0.3s ease;
	}

	/* 使用CSS伪元素实现箭头效果 */
	.uni-icon::after {
		content: '';
		display: inline-block;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 6px 5px 0 5px;
		border-color: #666 transparent transparent transparent;
	}

	.uni-icon-top::after {
		transform: rotate(180deg);
	}

	.uni-icon-bottom::after {
		transform: rotate(0deg);
	}

	.employment-record-filter-content {
		padding-top: 16px;
		border-top: 1px solid #e0e0e0;
	}

	.employment-record-filter-item {
		margin-bottom: 16px;
		display: flex;
		flex-direction: column;
	}

	.employment-record-filter-label {
		font-size: 14px;
		color: #333;
		margin-bottom: 8px;
	}

	.employment-record-filter-select {
		width: 100%;
	}

	.employment-record-select {
		width: 100%;
		height: 40px;
		line-height: 40px;
		padding: 0 12px;
		border: 1px solid #dcdcdc;
		border-radius: 4px;
		background-color: #fff;
		font-size: 14px;
		color: #333;
		appearance: none;
		background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23999" d="M6 9L1 4h10z"/></svg>');
		background-repeat: no-repeat;
		background-position: right 12px center;
	}

	.employment-record-date-range {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.employment-record-date-input {
		flex: 1;
		height: 40px;
		line-height: 40px;
		padding: 0 12px;
		border: 1px solid #dcdcdc;
		border-radius: 4px;
		background-color: #fff;
		font-size: 14px;
		color: #333;
	}

	.employment-record-date-separator {
		font-size: 14px;
		color: #666;
	}

	.employment-record-filter-actions {
		display: flex;
		gap: 12px;
		margin-top: 24px;
	}

	.employment-record-filter-reset,
	.employment-record-filter-confirm {
		flex: 1;
		height: 44px;
		line-height: 44px;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
	}

	.employment-record-filter-reset {
		background-color: #fff;
		color: #666;
		border: 1px solid #dcdcdc;
	}

	.employment-record-filter-confirm {
		background-color: #007aff;
		color: #fff;
	}

	.employment-record-filter-reset:active {
		background-color: #f5f5f5;
	}

	.employment-record-filter-confirm:active {
		background-color: #0056cc;
	}
</style>