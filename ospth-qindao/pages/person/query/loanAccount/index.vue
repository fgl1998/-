<!-- 贷款账户查询 — 风格和 accountInfo 一致 -->
<template>
  <query-layout>
    <view class="con_layout">
      <!-- 加载中 -->
      <view v-if="!isShow" class="loading_wrap">
        <text>加载中...</text>
      </view>

      <template v-else>
        <!-- 无贷款 -->
        <view v-if="isEmpty" class="no_loan">
          <view class="no_loan_left">
            <text class="left_txt">无<br />贷<br />款</text>
          </view>
          <view class="no_loan_right">
            <view class="right_main">
              <view class="main_row">
                <text class="main_label">公积金最高贷款额：</text>
                <text class="main_val">￥780000</text>
              </view>
              <view class="main_des">5年以上贷款利率（首套房）：<text class="des_val">2.6%</text></view>
              <view class="main_des">5年以上贷款利率（二套房）：<text class="des_val">3.075%</text></view>
            </view>
            <view class="right_tags">
              <view class="tag_item"><view class="tag_icon" />手续简</view>
              <view class="tag_item"><view class="tag_icon" />渠道多</view>
              <view class="tag_item"><view class="tag_icon" />利率低</view>
              <view class="tag_item"><view class="tag_icon" />抵个税</view>
              <view class="tag_item"><view class="tag_icon" />还款易</view>
            </view>
          </view>
        </view>

        <!-- 有贷款 -->
        <template v-else>
          <!-- 头部卡片 — 和 accountInfo 同一背景 -->
          <view class="header-card">
            <view class="one-line">
              <text>贷款账号：{{ loanInfo.dkzh | middleFormat }}</text>
            </view>
            <van-divider />
            <view class="two-line">
              <text>贷款余额</text>
              <van-icon size="20" name="eye-o" color="#fff" />
            </view>
            <view class="three-line">
              ￥{{ loanInfo.dkye | moneyFormat }}
            </view>
            <view class="four-line">
              <text>贷款状态：{{ loanInfo.dkzt || '--' }}</text>
              <text>发放日期：{{ loanInfo.dkffrq || '--' }}</text>
            </view>
          </view>

          <!-- 贷款信息字段 — 和 accountInfo 的 form 一致 -->
          <van-form ref="form" class="form" :scroll-to-error="true">
            <van-form-item-map
                v-for="(item, index) in formConfig.fields"
                :key="index"
                :formItemConfig.sync="item"
                :formData="formData"
            />
          </van-form>

          <!-- 操作项 — 根据贷款状态展示 -->
          <view class="van-cell-group">
            <!-- 逾期状态 -->
            <template v-if="loanInfo.dkzt === '逾期'">
              <van-cell title="还款计划查询" is-link @click="goRepaymentPlan" />
              <van-cell title="还款凭证查询" is-link @click="goRepaymentCertificate" />
            </template>
            <!-- 结清状态 -->
            <template v-else-if="loanInfo.dkzt === '结清'">
              <van-cell title="结清证明打印" is-link @click="goSettleCertificate" />
            </template>
            <!-- 正常状态 -->
            <template v-else>
              <van-cell title="还款计划查询" is-link @click="goRepaymentPlan" />
              <van-cell title="还款凭证查询" is-link @click="goRepaymentCertificate" />
            </template>
          </view>

          <!-- 逾期信息 — 仅逾期状态展示 -->
          <view v-if="loanInfo.dkzt === '逾期'" class="overdue-card">
            <view class="overdue-title">逾期信息</view>
            <view class="overdue-row">
              <text class="overdue-label">当前欠还本金</text>
              <text class="overdue-value">￥{{ loanInfo.dqyhbj | moneyFormat }}</text>
            </view>
            <view class="overdue-row">
              <text class="overdue-label">当前欠还利息</text>
              <text class="overdue-value">￥{{ loanInfo.dqyhlx | moneyFormat }}</text>
            </view>
            <view class="overdue-row">
              <text class="overdue-label">逾期天数</text>
              <text class="overdue-value overdue-highlight">{{ loanInfo.yqts || '--' }}天</text>
            </view>
            <view class="overdue-row overdue-total">
              <text class="overdue-label">当前欠还总金额</text>
              <text class="overdue-value">￥{{ loanInfo.dqjhhkje | moneyFormat }}</text>
            </view>
          </view>
        </template>
      </template>
    </view>
  </query-layout>
</template>

<script>
import formConfig from '@osppm/store/person/query/loanAccount/formConfig'
import { mapActions, mapMutations, mapState } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'

export default {
  name: 'loanAccount',
  mixins: [codeTableMixin],
  data() {
    return {
      formConfig,
      formData: {},
      isEmpty: false,
      isShow: false,
      commonBizApply: { bizApplyType: 'MP020' },
    }
  },
  computed: {
    ...mapState('loanAccount', ['loanInfo']),
  },
  onLoad(options) {
    if (options?.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted() {
    await this.initCodeTable(['DKLX', 'DKHKFS']).catch(() => {})
    await this.init()
  },
  methods: {
    ...mapActions('loanAccount', ['uriForQueryMyLoan']),
    ...mapMutations('loanAccount', ['setYwdjh']),

    async init() {
      try {
        await this.uriForQueryMyLoan({ ...this.commonBizApply })
        this.isShow = true
        if (this.loanInfo && this.loanInfo.dkzh) {
          this.isEmpty = false
          this.buildFormData()
        } else {
          this.isEmpty = true
        }
      } catch (e) {
        this.isShow = true
        this.isEmpty = true
        uni.showToast({ title: e?.message || '查询失败', icon: 'none' })
      }
    },

    // 构建表单展示数据（码值转换 + 掩码处理）
    buildFormData() {
      const info = this.loanInfo || {}
      this.formData = {
        dkzh:      this.maskMiddle(info.dkzh),
        jkrxm:     info.jkrxm || '',
        jkrzjh:    this.maskMiddle(info.jkrzjh),
        swtyhmc:   info.swtyhmc || '',
        dkffrq:    info.dkffrq || '',
        dkhkfs:    this.$codeTable.getCodeLabel('DKHKFS', info.dkhkfs) || info.dkhkfs || '',
        htdkje:    this.formatMoney(info.htdkje),
      }
    },

    maskMiddle(val) {
      if (!val) return ''
      const s = String(val)
      if (s.length <= 8) return s
      return s.slice(0, 4) + '****' + s.slice(-4)
    },

    formatMoney(val) {
      if (val == null) return ''
      return Number(val).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },

    // 跳转
    goRepaymentPlan() {
      const loanData = encodeURIComponent(JSON.stringify(this.loanInfo))
      uni.navigateTo({ url: `/pages/person/query/repaymentPlan/index?loanData=${loanData}` })
    },
    goRepaymentCertificate() {
      const loanData = encodeURIComponent(JSON.stringify(this.loanInfo))
      uni.navigateTo({ url: `/pages/person/query/repaymentCertificate/index?loanData=${loanData}` })
    },
    goSettleCertificate() {
      const loanData = encodeURIComponent(JSON.stringify(this.loanInfo))
      uni.navigateTo({ url: `/pages/person/query/settleCertificate/index?loanData=${loanData}` })
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  background-color: #f5f5f5;

  .header-card {
    background: url("@/pages/person/query/accountInfo/image/bg_01.png");
    background-size: 100% 100%;
    font-size: 28rpx;
    padding: 32rpx 24rpx;
    color: #F5F5F5;

    .one-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .two-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .three-line {
      font-size: 64rpx;
      font-weight: bold;
      text-align: left;
      margin: 20rpx 0;
      letter-spacing: 2rpx;
    }

    .four-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .form {
    margin-top: 24rpx;
    border-radius: 12rpx !important;
    overflow: hidden !important;
  }

  .van-cell-group {
    margin-top: 24rpx;
    border-radius: 12rpx !important;
    overflow: hidden !important;
  }

  // 逾期信息卡片
  .overdue-card {
    margin-top: 24rpx;
    background: #fff;
    border-radius: 12rpx;
    padding: 28rpx 24rpx;

    .overdue-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #e64340;
      padding-left: 16rpx;
      border-left: 6rpx solid #e64340;
      margin-bottom: 24rpx;
    }

    .overdue-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 52rpx;
      font-size: 26rpx;
      margin-bottom: 16rpx;

      .overdue-label {
        color: #666;
      }

      .overdue-value {
        color: #333;
        font-weight: 500;
      }

      .overdue-highlight {
        color: #e64340;
        font-weight: 600;
      }
    }

    .overdue-total {
      padding-top: 20rpx;
      border-top: 1rpx solid #f0f0f0;

      .overdue-value {
        font-size: 30rpx;
        color: #e64340;
        font-weight: bold;
      }
    }
  }

  // 无贷款
  .no_loan {
    margin-top: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    display: flex;

    .no_loan_left {
      width: 80rpx;
      background: #1492ff;
      padding: 48rpx 0;
      text-align: center;

      .left_txt {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
        line-height: 1.5;
      }
    }

    .no_loan_right {
      flex: 1;
      padding: 32rpx 24rpx;
      display: flex;
      flex-direction: column;
      gap: 24rpx;

      .right_main {
        .main_row {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 16rpx;
          .main_val { color: #1492ff; font-weight: 600; }
        }
        .main_des {
          font-size: 26rpx;
          color: #666;
          line-height: 40rpx;
          .des_val { color: #ff9841; }
        }
      }

      .right_tags {
        display: flex;
        flex-wrap: wrap;
        gap: 24rpx;

        .tag_item {
          display: flex;
          align-items: center;
          gap: 8rpx;
          font-size: 24rpx;
          color: #666;

          .tag_icon {
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
            background: #1492ff;
          }
        }
      }
    }
  }
}

.loading_wrap {
  padding: 48rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #999;
}
</style>
