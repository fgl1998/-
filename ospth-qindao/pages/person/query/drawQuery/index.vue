<!-- 扣划协议查询 -->
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
        </view>
      </view>

      <!-- 结果列表卡片 -->
      <view class="result-card">
        <view class="card-head">
          <view class="card-title">
            <van-icon name="orders-o" class="title-icon" />
            <text>查询结果</text>
          </view>
          <text class="record-tip">共 {{ total }} 条</text>
        </view>

        <!-- 加载状态 -->
        <view v-if="loading" class="loading-box">
          <van-loading type="spinner" color="#4788fe" />
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 空数据状态 -->
        <view v-else-if="resultList.length === 0" class="empty-box">
          <van-empty description="暂无查询数据" />
        </view>

        <!-- 结果列表 -->
        <view v-else class="result-list">
          <view class="list-item" v-for="item in resultList" :key="item.businessNo">
            <!-- 列表头部 -->
            <view class="item-header">
              <text class="serial-no">{{ item.businessNo }}</text>
              <van-tag
                  :type="item.tradeStatus === '成功' ? 'success' : item.tradeStatus === '失败' ? 'danger' : 'warning'"
                  round
              >
                {{ item.tradeStatus }}
              </van-tag>
            </view>

            <!-- 明细内容 -->
            <view class="item-content">
              <view class="content-row" v-for="(row, idx) in getDetailRows(item)" :key="idx">
                <text class="row-label">{{ row.label }}</text>
                <text class="row-value" :class="row.cls || ''">{{ row.value }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </query-layout>
</template>

<script>
import drawQueryMixin from '@osppm/store/person/query/drawQuery/drawQueryMixin'

export default {
  name: 'DrawQuery',
  mixins: [drawQueryMixin],
  data() {
    return {
      resultList: [],
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
        { label: '个人账号', value: item.personalAccount },
        { label: '姓名', value: item.name },
        { label: '证件号码', value: item.idCard },
        { label: '缴款起始年月', value: item.payStartMonth },
        { label: '缴款结束年月', value: item.payEndMonth },
        { label: '产生结果', value: item.produceResult, cls: item.produceResult === '成功' ? 'success-text' : 'fail-text' },
        { label: '错误信息', value: item.errorMsg || '无' },
        { label: '登记日期', value: item.registerDate },
        { label: '银行返回描述', value: item.bankDesc || '无' },
      ]
    },
    // 查询
    onQuery() {
      this.loading = true
      this.resultList = []
      setTimeout(() => {
        this.resultList = [
          {
            businessNo: 'QY20250520001',
            personalAccount: '6228481234567890123',
            name: '张三',
            idCard: '110101199001011234',
            payStartMonth: '2025-01',
            payEndMonth: '2025-05',
            produceResult: '成功',
            errorMsg: '',
            registerDate: '2025-05-20',
            tradeStatus: '成功',
            bankDesc: '扣款成功'
          },
          {
            businessNo: 'QY20250520002',
            personalAccount: '6228481234567890456',
            name: '李四',
            idCard: '110101199102021234',
            payStartMonth: '2025-01',
            payEndMonth: '2025-05',
            produceResult: '失败',
            errorMsg: '账户余额不足',
            registerDate: '2025-05-20',
            tradeStatus: '失败',
            bankDesc: '账户余额不足，扣款失败'
          }
        ]
        this.total = this.resultList.length
        this.loading = false
      }, 1000)
    },
    // 重置
    onReset() {
      this.resetFormData()
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
      width: 200rpx;
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

.success-text { color: #07c160; }
.fail-text { color: #ee0a24; }
</style>
