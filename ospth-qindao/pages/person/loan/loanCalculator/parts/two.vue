<template>
  <view class="step_container">
    <box-title title="月还款额信息" />
    <van-form ref="payForm">
      <template v-for="(item, index) in formConfig.payFields">
        <van-form-item-map
          v-if="item.name !== 'hkfs'"
          :key="'pay_' + index"
          :formItemConfig.sync="item"
          :formData="formData"
        />
      </template>
    </van-form>

    <template v-if="calcDone">
      <box-title title="计算结果" />

      <!-- Tab 切换：等额本息 / 等额本金 -->
      <van-tabs v-model="activeTab" @change="onTabChange" class="result-tabs">
        <van-tab title="等额本息" name="01" />
        <van-tab title="等额本金" name="02" />
      </van-tabs>

      <van-cell-group>
        <van-cell title="月负债" :value="formData.ydz + ' 元'" />
        <van-cell title="公积金首月还款额" :value="formData.gjjsyyhke + ' 元'" />
        <van-cell title="公积金还款总利息" :value="formData.gjjhkzlx + ' 元'" />
        <van-cell title="公积金还款总额" :value="formData.gjjhkze + ' 元'" />
        <van-cell title="商贷首月还款额" :value="formData.sydysyhke + ' 元'" />
        <van-cell title="商贷还款总利息" :value="formData.sydyhkzlx + ' 元'" />
        <van-cell title="商贷还款总额" :value="formData.sydyhkze + ' 元'" />
        <van-cell title="还款日期" :value="formData.hkrq" />
      </van-cell-group>

      <box-title title="首月还款明细" />
      <van-cell-group>
        <van-cell title="公积金月还本金" :value="formData.gjjyhbj + ' 元'" />
        <van-cell title="公积金月还利息" :value="formData.gjjyhll + ' 元'" />
        <van-cell title="公积金月还款合计" :value="formData.gjjyhkhe + ' 元'" />
        <van-cell title="公贷余额" :value="formData.gjjye + ' 元'" />
        <van-cell title="商贷月还本金" :value="formData.sydyhbj + ' 元'" />
        <van-cell title="商贷月还利息" :value="formData.sydyhll + ' 元'" />
        <van-cell title="商贷月还款合计" :value="formData.sydyhkhe + ' 元'" />
        <van-cell title="商贷余额" :value="formData.sydyye + ' 元'" />
      </van-cell-group>

      <view class="plan-toggle" v-if="currentPlanList.length > 0">
        <van-button type="info" size="small" plain @click="togglePlanTable">
          {{ showPlanTable ? '收起还款计划明细' : '查看还款计划明细对比' }}
        </van-button>
      </view>

      <template v-if="showPlanTable && currentPlanList.length > 0">
        <box-title :title="activeTab === '01' ? '等额本息还款计划（按时间升序）' : '等额本金还款计划（按时间升序）'" />
        <view class="plan-table-wrap">
          <view class="plan-table">
            <view class="plan-row plan-header">
              <view class="plan-cell cell-date">还款日期</view>
              <view class="plan-cell">公积金月还本金</view>
              <view class="plan-cell">公积金月还利息</view>
              <view class="plan-cell">公积金合计</view>
              <view class="plan-cell">公贷余额</view>
              <view class="plan-cell">商贷月还本金</view>
              <view class="plan-cell">商贷月还利息</view>
              <view class="plan-cell">商贷合计</view>
              <view class="plan-cell">商贷余额</view>
            </view>
            <view
              class="plan-row"
              v-for="(row, idx) in currentPlanList"
              :key="idx"
              :class="{'plan-row-even': idx % 2 === 0}"
            >
              <view class="plan-cell cell-date">{{ row.hkrq }}</view>
              <view class="plan-cell">{{ row.gjjyhbj }}</view>
              <view class="plan-cell">{{ row.gjjyhll }}</view>
              <view class="plan-cell">{{ row.gjjyhkhe }}</view>
              <view class="plan-cell">{{ row.gjjye }}</view>
              <view class="plan-cell">{{ row.sydyhbj }}</view>
              <view class="plan-cell">{{ row.sydyhll }}</view>
              <view class="plan-cell">{{ row.sydyhkhe }}</view>
              <view class="plan-cell">{{ row.sydyye }}</view>
            </view>
          </view>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/loanCalculator/two/mixin'

export default {
  name: 'LoanCalculatorTwo',
  mixins: [mixin],
}
</script>

<style lang="less" scoped>
.result-tabs {
  margin: 16rpx 0;
}
.plan-toggle {
  display: flex;
  justify-content: center;
  margin: 24rpx 0;
}
.plan-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 12rpx 0 24rpx;
  padding: 0 12rpx;
}
.plan-table {
  min-width: 1600rpx;
  border: 1px solid #e8e8e8;
  border-radius: 8rpx;
  overflow: hidden;
}
.plan-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border-bottom: none;
  }
}
.plan-header {
  background: #1677ff;
  color: #fff;
  font-weight: 500;
  font-size: 24rpx;
  .plan-cell {
    color: #fff;
  }
}
.plan-row-even {
  background: #f7f8fa;
}
.plan-cell {
  flex: 1;
  min-width: 160rpx;
  padding: 16rpx 8rpx;
  font-size: 22rpx;
  text-align: center;
  color: #333;
  word-break: break-all;
}
.cell-date {
  min-width: 200rpx;
}
</style>
