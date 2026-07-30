<!-- 异地贷款缴存证明管理 -->
<template>
  <query-layout>
    <view class="con_layout">
      <!-- 查询条件卡片 -->
      <view class="query-card">
        <view class="card-title">
          <van-icon name="search" class="title-icon" />
          <text>查询条件</text>
        </view>

        <van-form ref="form" class="query-form">
          <van-form-item-map
              v-for="(item, index) in formConfig.fields"
              :key="index"
              :formItemConfig.sync="item"
              :formData="formData"
          />
        </van-form>

        <!-- 操作按钮 -->
        <view class="btn-group">
          <van-button plain hairline size="small" @click="onReset">重置</van-button>
          <van-button type="primary" size="small" color="#4788fe" :loading="loading" @click="onQuery">查询</van-button>
          <van-button type="primary" size="small" color="#07c160" @click="onOpen">开具证明</van-button>
        </view>
      </view>

      <!-- 结果列表卡片 -->
      <view class="result-card">
        <view class="card-head">
          <view class="card-title">
            <van-icon name="orders-o" class="title-icon" />
            <text>开具历史记录</text>
          </view>
          <text class="record-tip">共 {{ total }} 条</text>
        </view>

        <!-- 加载状态 -->
        <view v-if="loading" class="loading-box">
          <van-loading type="spinner" color="#4788fe" />
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 空数据状态 -->
        <view v-else-if="list.length === 0" class="empty-box">
          <van-empty description="暂无查询记录" />
        </view>

        <!-- 结果列表 -->
        <view v-else class="result-list">
          <view class="list-item" v-for="item in list" :key="item.serialNo">
            <!-- 列表头部 -->
            <view class="item-header">
              <text class="serial-no">{{ item.serialNo }}</text>
              <van-tag :type="item.status === '有效' ? 'success' : 'default'" round>
                {{ item.status }}
              </van-tag>
            </view>

            <!-- 明细内容 -->
            <view class="item-content">
              <view class="content-row" v-for="(row, idx) in getDetailRows(item)" :key="idx">
                <text class="row-label">{{ row.label }}</text>
                <text class="row-value">{{ row.value }}</text>
              </view>
            </view>

            <!-- 作废按钮 -->
            <view class="item-footer">
              <van-button
                  v-if="item.status === '有效'"
                  type="danger"
                  size="small"
                  plain
                  round
                  @click="onCancel(item)"
              >
                作废
              </van-button>
              <text v-else class="disabled-txt">已作废</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </query-layout>
</template>

<script>
import pDepositManagementMixin from '@osppm/store/person/PDepositManagement/pDepositManagementMixin'

export default {
  name: 'LoanProofManage',
  mixins: [pDepositManagementMixin],
  data() {
    return {
      list: [],
      total: 0,
      loading: false
    }
  },
  onLoad() {
    this.onQuery()
  },
  methods: {
    getDetailRows(item) {
      return [
        { label: '机构', value: item.orgName },
        { label: '职工姓名', value: item.name },
        { label: '证件类型', value: item.idType },
        { label: '证件号码', value: item.idCard },
        { label: '受理渠道', value: item.channel },
        { label: '预贷款中心', value: item.loanCenter },
        { label: '登记日期', value: item.createTime },
        { label: '登记柜员', value: item.createUser },
        { label: '注销日期', value: item.cancelTime || '-' },
        { label: '注销柜员', value: item.cancelUser || '-' },
      ]
    },
    // 查询
    onQuery() {
      this.loading = true
      setTimeout(() => {
        this.list = [
          {
            orgName: '广州市住房公积金管理中心',
            serialNo: 'YJZC202505200001',
            name: '张三',
            status: '有效',
            idType: '身份证',
            idCard: '110101199001011234',
            channel: '柜台',
            loanCenter: '上海市住房公积金管理中心',
            createTime: '2025-05-20 10:30',
            createUser: '柜员001',
            cancelTime: '',
            cancelUser: ''
          },
          {
            orgName: '深圳市住房公积金管理中心',
            serialNo: 'YJZC202505200002',
            name: '李四',
            status: '已作废',
            idType: '身份证',
            idCard: '110101199102021234',
            channel: '网上大厅',
            loanCenter: '杭州市住房公积金管理中心',
            createTime: '2025-05-20 11:20',
            createUser: '柜员002',
            cancelTime: '2026-04-14 15:10',
            cancelUser: '柜员003'
          }
        ]
        this.total = this.list.length
        this.loading = false
      }, 800)
    },
    // 重置
    onReset() {
      this.resetFormData()
    },
    // 开具证明
    onOpen() {
      uni.showModal({
        title: '提示',
        content: '确认开具异地贷款缴存证明？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '开具成功', icon: 'success' })
            this.onQuery()
          }
        }
      })
    },
    // 作废
    onCancel(item) {
      uni.showModal({
        title: '提示',
        content: `确认作废【${item.name}】的缴存证明？`,
        success: (res) => {
          if (res.confirm) {
            item.status = '已作废'
            item.cancelTime = '2026-04-14 16:00'
            item.cancelUser = '当前柜员'
            uni.showToast({ title: '作废成功', icon: 'success' })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.con_layout {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.query-card, .result-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;

  .title-icon {
    font-size: 36rpx;
    color: #4788fe;
    margin-right: 12rpx;
  }
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card-title {
    margin-bottom: 0;
  }

  .record-tip {
    font-size: 26rpx;
    color: #999;
  }
}

.query-form {
  border-radius: 12rpx;
  overflow: hidden;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  margin-top: 32rpx;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  .loading-text {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: #999;
  }
}

.empty-box {
  padding: 40rpx 0;
}

.result-list {
  margin-top: 24rpx;
}

.list-item {
  border: 2rpx solid #ebedf0;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: #fafbfc;
  transition: box-shadow 0.2s;

  &:active {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #ebedf0;
  margin-bottom: 20rpx;

  .serial-no {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
  }
}

.item-content {
  .content-row {
    display: flex;
    padding: 10rpx 0;
    font-size: 28rpx;
    line-height: 1.6;

    .row-label {
      width: 180rpx;
      color: #999;
      flex-shrink: 0;
    }

    .row-value {
      flex: 1;
      color: #333;
      word-break: break-all;
    }
  }
}

.item-footer {
  padding-top: 20rpx;
  border-top: 2rpx solid #ebedf0;
  margin-top: 16rpx;
  text-align: right;

  .disabled-txt {
    font-size: 26rpx;
    color: #c8c9cc;
  }
}
</style>
