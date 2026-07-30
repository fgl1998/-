<!-- 贷款利率查询：移动端适配 -->
<template>
  <query-layout>
    <view class="con_layout">
      <view class="table_section">
        <view class="table_header">
          <text class="col_type">类型</text>
          <text class="col_a">贷款年限≤5年</text>
          <text class="col_b">贷款年限>5年</text>
        </view>
        <view v-for="(row, i) in tableData" :key="i" class="table_row">
          <text class="col_type">{{ row.fwts || '--' }}</text>
          <text class="col_a">{{ row.hisjznll != null && row.hisjznll !== '' ? row.hisjznll : '--' }}</text>
          <text class="col_b">{{ row.hisjznll1 != null && row.hisjznll1 !== '' ? row.hisjznll1 : '--' }}</text>
        </view>
        <view v-if="loading && (!tableData || tableData.length === 0)" class="empty_tip">加载中...</view>
        <view v-else-if="!tableData || tableData.length === 0" class="empty_tip">暂无数据</view>
      </view>
    </view>
  </query-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'queryLoanYearRate',
  data () {
    return {
      tableData: [],
      loading: false,
      commonBizApply: {
        ywdjh: '',
        bizApplyType: 'MP020',
      },
    }
  },
  computed: {
    ...mapState('loanRates', ['ywdjh']),
  },
  onLoad (options) {
    if (options && options.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted () {
    // await this.getLoanRate()
    this.tableData = [
      {
        fwts: '首套房',
        hisjznll: '2.1%',
        hisjznll1: '2.6%',
      },
      {
        fwts: '二套房',
        hisjznll: '2.525%',
        hisjznll1: '3.075%',
      },
    ]
  },
  methods: {
    ...mapActions('loanRates', ['getLoanYearRate']),
    ...mapMutations('loanRates', ['setYwdjh']),
    async getLoanRate () {
      try {
        this.loading = true
        const res = await this.getLoanYearRate(this.commonBizApply)
        this.tableData = Array.isArray(res) ? res : []
      } catch (error) {
        const msg = (error && (error.message || error.msg)) ? (error.message || error.msg) : String(error)
        uni.showToast({ title: msg || '加载失败', icon: 'none' })
        this.tableData = []
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
}

.table_section {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.table_header,
.table_row {
  display: flex;
  align-items: center;
  min-height: 88rpx;
  font-size: 28rpx;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .col_type {
    flex: 0 0 200rpx;
    color: #333;
  }

  .col_a,
  .col_b {
    flex: 1;
    text-align: center;
    color: #333;
  }
}

.table_header {
  background: #f9f9f9;
  font-weight: 600;
  color: #666;

  .col_type {
    color: #666;
  }
}

.table_row:last-of-type {
  border-bottom: none;
}

.empty_tip {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 48rpx 0;
}
</style>
