<template>
  <view class="employment-record">
    <view class="main">
      <!-- 功能入口卡片（顶部通栏卡片，浅蓝底色） -->
      <view class="function-entry-card">
        <view class="entry-title">就业服务</view>
        <view class="entry-actions">
          <view class="action-btn primary-btn" @click="goToService">事项办理</view>
          <view class="action-btn secondary-btn active" @click="goToQuery">信息查询</view>
        </view>
      </view>
      
      <!-- 查询筛选卡片（浅灰底色，折叠/展开式设计） -->
      <view class="filter-card">
        <view class="filter-header" @click="toggleFilter">
          <text class="filter-toggle-btn">{{ isFilterExpanded ? '收起筛选' : '展开筛选' }}</text>
          <text class="filter-arrow" :class="{ 'rotate': isFilterExpanded }">▼</text>
        </view>
        <view class="filter-content" v-show="isFilterExpanded">
          <!-- 就业状态筛选 -->
          <view class="filter-item">
            <text class="filter-label">就业状态</text>
            <view class="filter-select">
              <text>{{ selectedEmploymentStatus }}</text>
              <text class="select-arrow">▼</text>
            </view>
          </view>
          
          <!-- 经办时间筛选 -->
          <view class="filter-item">
            <text class="filter-label">经办时间</text>
            <view class="date-range">
              <view class="date-input">
                <text>{{ startDate || '请选择' }}</text>
              </view>
              <text class="date-separator">至</text>
              <view class="date-input">
                <text>{{ endDate || '请选择' }}</text>
              </view>
            </view>
          </view>
          
          <!-- 审批状态筛选 -->
          <view class="filter-item">
            <text class="filter-label">审批状态</text>
            <view class="filter-select">
              <text>{{ selectedApprovalStatus }}</text>
              <text class="select-arrow">▼</text>
            </view>
          </view>
          
          <!-- 操作按钮 -->
          <view class="filter-actions">
            <view class="filter-btn reset-btn" @click="resetFilter">重置筛选</view>
            <view class="filter-btn confirm-btn" @click="confirmFilter">确认查询</view>
          </view>
        </view>
      </view>
      
      <view class="content-box">
        <!-- 查询结果 - 基本信息卡片 -->
        <view class="result-section">
          <view class="section-title">查询结果信息</view>
          <view class="info-card">
            <view class="info-item">
              <text class="info-label">姓名：</text>
              <text class="info-value">吴锋</text>
            </view>
            <view class="info-item">
              <text class="info-label">身份证号：</text>
              <text class="info-value">511623199803212779</text>
            </view>
            <view class="info-item">
              <text class="info-label">联系电话：</text>
              <text class="info-value">13733719194</text>
            </view>
          </view>
          
        </view>
        <!-- 查询结果 - 申请记录卡片 -->
        <view class="record-section">
          <view class="section-title">申请记录详情</view>
          <view class="record-card">
            <view class="record-header">
              <view class="status-tag">待审核</view>
            </view>
            <view class="record-content">
              <view class="record-item">
                <text class="record-label">申请事项：</text>
                <text class="record-value">就业登记</text>
              </view>
              <view class="record-item">
                <text class="record-label">核心信息：</text>
                <text class="record-value">灵活就业 / 2025-11-15 提交</text>
              </view>
              <view class="record-item">
                <text class="record-label">进度：</text>
                <text class="record-value status-text">录入待审核</text>
              </view>
            </view>
            <view class="record-actions">
              <view class="record-btn border-btn" @click="viewDetails">查看详情</view>
              <view class="record-btn fill-btn" @click="filterOtherRecords">筛选其他记录</view>
            </view>
          </view>
        </view>
          <view class="page-controls">
            <button size="mini" :disabled="current <= 1" @click="changePage(current - 1)">上一页</button>
            <text class="page-num">{{ current }} / {{ Math.ceil(total / pageSize) || 1 }}</text>
            <button size="mini" :disabled="current >= Math.ceil(total / pageSize)" @click="changePage(current + 1)">下一页</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'employmentRecord',
  data() {
    return {
      // 响应式数据
      total: 1,
      current: 1,
      pageSize: 10,
      
      // 筛选卡片状态
      isFilterExpanded: false,
      selectedEmploymentStatus: '全部',
      startDate: '',
      endDate: '',
      selectedApprovalStatus: '全部'
    };
  },
  methods: {
    // 页面方法
    toggleFilter() {
      this.isFilterExpanded = !this.isFilterExpanded;
    },
    
    resetFilter() {
      this.selectedEmploymentStatus = '全部';
      this.selectedApprovalStatus = '全部';
      this.startDate = '';
      this.endDate = '';
      // 显示提示
      console.log('筛选条件已重置');
    },
    
    confirmFilter() {
      // 模拟查询中状态
      console.log('查询中...');
      
      // 检查日期范围
      if (this.startDate && !this.endDate) {
        console.log('请补充结束日期');
        return;
      }
      
      // 执行查询逻辑
      console.log('执行查询，筛选条件：', {
        employmentStatus: this.selectedEmploymentStatus,
        approvalStatus: this.selectedApprovalStatus,
        startDate: this.startDate,
        endDate: this.endDate
      });
    },
    
    goToService() {
      console.log('跳转到事项办理页面');
      uni.showToast({ title: '事项办理功能', icon: 'success' });
    },
    
    goToQuery() {
      console.log('已在信息查询页面');
      uni.showToast({ title: '信息查询功能', icon: 'success' });
    },
    
    viewDetails() {
      // 查看详情
      console.log('查看详情');
    },
    
    filterOtherRecords() {
      // 筛选其他记录
      console.log('筛选其他记录');
      // 可以打开筛选卡片让用户选择其他条件
      this.isFilterExpanded = true;
    },
    
    changePage(pageNum) {
      if (pageNum >= 1 && pageNum <= Math.ceil(this.total / this.pageSize)) {
        this.current = pageNum;
        console.log('切换到第', pageNum, '页');
      }
    }
  },
  mounted() {
    // 组件挂载时的初始化操作
    console.log('就业记录页面已加载');
  }
};
</script>

<style scoped>
.employment-record {
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.main {
  width: 100%;
  padding: 16px 0;
}

/* 功能入口卡片样式 */
.function-entry-card {
  background-color: #e3f2fd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

/* 查询筛选卡片样式 */
  .employment-record .filter-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  
  .employment-record .filter-header {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  
  .employment-record .filter-toggle-btn {
    font-size: 14px;
    color: #333;
  }
  
  .employment-record .filter-arrow {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s ease;
  }
  
  .employment-record .filter-arrow.rotate {
    transform: rotate(180deg);
  }
  
  .employment-record .filter-content {
    padding: 0 16px 16px;
    animation: slideDown 0.2s ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .employment-record .filter-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .employment-record .filter-label {
    font-size: 14px;
    color: #333;
  }
  
  .employment-record .filter-select {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .employment-record .select-arrow {
    font-size: 10px;
    margin-left: 8px;
    color: #999;
  }
  
  .employment-record .date-range {
    display: flex;
    align-items: center;
  }
  
  .employment-record .date-input {
    padding: 6px 12px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #666;
    min-width: 120px;
  }
  
  .employment-record .date-separator {
    margin: 0 8px;
    color: #666;
  }
  
  .employment-record .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
  }
  
  .employment-record .filter-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .employment-record .reset-btn {
    background-color: #fff;
    border: 1px solid #ddd;
    color: #666;
  }
  
  .employment-record .confirm-btn {
    background-color: #1890ff;
    color: #fff;
    border: none;
  }

.entry-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.entry-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  margin-left: 12px;
  transition: all 0.2s ease;
}

.primary-btn {
  background-color: #1890ff;
  color: white;
  border: 1px solid #1890ff;
}

.secondary-btn {
  background-color: transparent;
  color: #1890ff;
  border: 1px solid #1890ff;
}

.secondary-btn.active {
  background-color: #1890ff;
  color: white;
}

.todo-tag {
  background-color: #ff4d4f;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
  display: inline-block;
}

/* 结果区域样式 */
  .employment-record .result-section {
    margin-bottom: 20px;
  }
  
  .employment-record .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
  
  /* 申请记录卡片样式 */
  .employment-record .record-section {
    margin-bottom: 20px;
  }
  
  .employment-record .record-card {
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 16px;
  }
  
  .employment-record .record-header {
    margin-bottom: 12px;
  }
  
  .employment-record .status-tag {
    display: inline-block;
    padding: 2px 8px;
    background-color: #ff4d4f;
    color: white;
    font-size: 12px;
    border-radius: 4px;
  }
  
  .employment-record .record-content {
    margin-bottom: 16px;
  }
  
  .employment-record .record-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .employment-record .record-item:last-child {
    border-bottom: none;
  }
  
  .employment-record .record-label {
    font-size: 14px;
    color: #666;
    min-width: 80px;
  }
  
  .employment-record .record-value {
    font-size: 14px;
    color: #333;
    flex: 1;
  }
  
  .employment-record .status-text {
    color: #ff4d4f;
  }
  
  .employment-record .record-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .employment-record .record-btn {
    flex: 1;
    padding: 8px 0;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    transition: all 0.2s ease;
  }
  
  .employment-record .border-btn {
    background-color: transparent;
    color: #1890ff;
    border: 1px solid #1890ff;
    margin-right: 8px;
  }
  
  .employment-record .fill-btn {
    background-color: #1890ff;
    color: white;
    border: 1px solid #1890ff;
    margin-left: 8px;
  }
  
  /* 基本信息卡片样式 */
  .employment-record .info-card {
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 16px;
  }
  
  .employment-record .info-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .employment-record .info-item:last-child {
    border-bottom: none;
  }
  
  .employment-record .info-item .info-label {
    font-size: 14px;
    color: #666;
    min-width: 80px;
  }
  
  .employment-record .info-item .info-value {
    font-size: 14px;
    color: #333;
    flex: 1;
  }
  
  /* 卡片基础样式 */
  .card-item {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
  }
  
  /* 基本信息查询卡片样式 */
  .info-query-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* 事项办理卡片样式 */
  .service-record-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

.main .title {
  color: #2f54eb;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.main .content-box {
  padding: 20px;
  background-color: #ffffff;
  margin-top: 16px;
  border: 1px solid #afd2f0;
  border-radius: 2px;
}

.sub-title {
  padding: 8px 16px;
  font-size: 22px;
  color: #666668;
  font-weight: bold;
  background-color: #afd2f0;
}

/* 表单样式 */
.form-box {
  margin-top: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-label {
  width: 120px;
  text-align: right;
  padding-right: 10px;
}

.form-input {
  width: 220px;
  height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  box-sizing: border-box;
}

/* 搜索筛选栏样式 */
.search-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  margin-bottom: 10px;
  border-radius: 4px;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 4px;
  padding: 0 10px;
  margin-right: 10px;
  position: relative;
}

.search-icon {
  color: #909399;
  margin-right: 5px;
}

.search-input {
  flex: 1;
  height: 32px;
  border: none;
  outline: none;
  font-size: 14px;
}

.filter-btn {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
  padding: 0 15px;
  height: 32px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.filter-btn uni-icons {
  margin-right: 5px;
}

/* 选项卡样式 */
.tabs {
  display: flex;
  padding: 0 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  overflow-x: auto;
  white-space: nowrap;
}

.tab {
  padding: 10px 15px;
  font-size: 14px;
  color: #606266;
  position: relative;
  cursor: pointer;
}

.tab.active {
  color: #409eff;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 15px;
  right: 15px;
  height: 2px;
  background-color: #409eff;
}

/* 按钮样式 */
.btn-box {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.btn {
  margin-right: 30px;
  display: flex;
  align-items: center;
}

.btn text {
  margin-left: 4px;
}

/* 卡片样式 */
.card-container {
  padding: 10px;
  box-sizing: border-box;
}

.card-list {
  width: 100%;
}

.card-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ebeef5;
}

.card-title-section {
  display: flex;
  align-items: center;
}

.card-title-text {
  font-size: 14px;
  color: #606266;
  margin-right: 5px;
}

.card-order-id {
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}

/* 状态标签样式 */
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.pending-tag {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #d9ecff;
}

.waiting-tag {
  background-color: #ffffff;
  color: #f56c6c;
  border: 1px solid #f56c6c;
}

/* 卡片内容样式 */
.card-content {
  padding: 15px 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.info-label {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.info-value {
  flex: 1;
  text-align: right;
  font-size: 14px;
  color: #303133;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.action-btn {
  padding: 6px 12px;
  margin-left: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  margin: 0 5px;
}

.border-normal-btn {
  background-color: #ffffff;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.border-primary-btn {
  background-color: #ffffff;
  color: #409eff;
  border: 1px solid #409eff;
}

.fill-primary-btn {
  background-color: #409eff;
  color: #ffffff;
  border: 1px solid #409eff;
}

/* 添加任务按钮样式 */
.add-task-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #67c23a;
  color: white;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.empty-data {
  text-align: center;
  padding: 50px 0;
  color: #909399;
  font-size: 16px;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.page-info {
  font-size: 14px;
  color: #606266;
}

.page-controls {
  display: flex;
  align-items: center;
}

.page-controls button {
  margin: 0 10px;
}

.page-num {
  margin: 0 10px;
  font-size: 14px;
}
</style>