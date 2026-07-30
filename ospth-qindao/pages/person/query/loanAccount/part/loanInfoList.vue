<!-- 贷款信息列表 -->
<template>
  <view v-if="codeTableReady" class="loan_list">
    <!-- 🔥 key 改为唯一值：贷款账号 dkzh -->
    <view v-for="(item, index) of info" :key="item.dkzh || index" class="loan_card">
      <view class="card_head">
        <text
          class="loan_type"
          :class="item.dklx ? 'loan_type_active' : ''"
        >
          <!-- 🔥 规范使用全局 $codeTable -->
          {{ $codeTable.getCodeLabel('DKLX', item.dklx) | emptyToLine }}
        </text>
        <view class="status_row">
          <view :class="item.dkzt === '正常' ? 'mark mark_ok' : 'mark mark_other'" />
          <text class="status_txt" v-if="item.dkzt">{{ item.dkzt }}</text>
        </view>
      </view>
      <view class="card_body">
        <view class="flexList">
          <view class="flexList_item">
            <text class="label">借款人姓名：</text>
            <text class="value">*三</text>
          </view>
          <view class="flexList_item">
            <text class="label">身份证号：</text>
            <text class="value">{{ item.dkzh | middleFormat }}</text>
          </view>
          <view class="flexList_item">
            <text class="label">贷款账号：</text>
            <text class="value">{{ item.dkzh | middleFormat }}</text>
          </view>
          <view class="flexList_item">
            <text class="label">贷款银行：</text>
            <text class="value">{{ item.swtyhmc | emptyToLine }}</text>
          </view>
          <view class="flexList_item">
            <text class="label">发放时间：</text>
            <text class="value">{{ item.dkffrq | emptyToLine }}</text>
          </view>
          <view class="flexList_item">
            <text class="label">还款方式：</text>
            <text class="value">{{ $codeTable.getCodeLabel('DKHKFS', item.dkhkfs) | emptyToLine }}</text>
          </view>
          <view class="flexList_item">
            <text class="label">贷款金额：</text>
            <text class="value">{{ item.htdkje | moneyFormat }}</text>
          </view>
          <view class="flexList_item balance_row">
            <text class="label">贷款余额：</text>
            <text class="value balance">￥{{ item.dkzt === '结清' ? '0.00' : (item.dkye | moneyFormat) }}</text>
          </view>
        </view>
      </view>

      <view class="card_ops">
        <view class="op_btn" @click="openActionSheet(item)">
          <text class="op_text">操作</text>
        </view>
      </view>
    </view>

    <view v-if="showActionSheet" class="sheet_mask" @click="closeActionSheet">
      <view class="sheet_content" @click.stop>
        <view class="sheet_title">请选择操作</view>
        <view class="sheet_item" v-for="(action, idx) in actionList" :key="idx" @click="handleAction(action)">
          <text class="sheet_item_text">{{ action.name }}</text>
        </view>
        <view class="sheet_cancel" @click="closeActionSheet">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'

export default {
  name: 'loanInfoList',
  // 🔥 6. props 增加校验
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  mixins: [codeTableMixin],
  data() {
    return {
      codeTableReady: false,
      showActionSheet: false,
      actionList: [],
      currentLoan: {}
    }
  },
  computed: {
    ...mapState('loanAccount', ['accInfo'])
  },
  // 🔥 7. 增加 try/catch，防止崩溃
  async mounted() {
    try {
      await this.$codeTable.initCodeTable(['DKLX', 'DKHKFS'])
    } catch (err) {
      console.error('码表加载失败', err)
    } finally {
      // 无论成败，都显示页面
      this.codeTableReady = true
    }
  },
  methods: {
    // 打开操作弹窗
    openActionSheet(item) {
      this.currentLoan = item
      const actions = []

	  // 🔥 4. 结清判断（后期建议改成码表判断）
      if (item.dkzt !== '结清') {
        actions.push(
          { name: '还款计划', value: 2 },
          { name: '还款凭证', value: 3 }
        )
      } else {
        actions.push(
          { name: '还款凭证', value: 3 },
          { name: '结清证明', value: 5 }
        )
      }

      this.actionList = actions
      this.showActionSheet = true
    },

    // 关闭弹窗
    closeActionSheet() {
      this.showActionSheet = false
      this.actionList = []
      this.currentLoan = {}
    },

    // 处理操作
    handleAction(action) {
      this.jumpPage(action.value)
      this.closeActionSheet()
    },

    // 页面跳转
    jumpPage(val) {
      const loanData = encodeURIComponent(JSON.stringify(this.currentLoan))
      switch (val) {
        case 2:
          uni.navigateTo({ url: `/pages/person/query/repaymentPlan/index?loanData=${loanData}` })
          break
        case 3:
          uni.navigateTo({ url: `/pages/person/query/repaymentCertificate/index?loanData=${loanData}` })
          break
        case 5:
          uni.navigateTo({ url: `/pages/person/query/settleCertificate/index?loanData=${loanData}` })
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 你的样式完全没问题，保留不动
.loan_list {
  .loan_card {
    position: relative;
    margin-bottom: 24rpx;
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    border: 1rpx solid #f5f5f5;

    .card_head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      margin-bottom: 20rpx;

      .loan_type {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        &.loan_type_active {
          color: #005fe2;
          font-weight: 700;
        }
      }

      .status_row {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .mark {
          width: 16rpx;
          height: 16rpx;
          border-radius: 50%;
        }
        .mark_ok {
          background: linear-gradient(180deg, #5BB5FF 0%, #3B6CFE 100%);
        }
        .mark_other {
          background: linear-gradient(360deg, #E19348 0%, #FFC978 100%);
        }
        .status_txt {
          font-size: 26rpx;
          color: #666;
        }
      }
    }

    .card_body {
      .flexList {
        .flexList_item {
          display: flex;
          align-items: center;
          min-height: 52rpx;
          font-size: 26rpx;
          .label { min-width: 180rpx; color: #666; font-weight: 400; }
          .value { flex: 1; color: #333; font-weight: 500; word-break: break-all; }
          &.balance_row .value.balance { color: #005fe2; font-weight: 600; font-size: 28rpx; }
        }
      }
    }

    .card_ops {
      position: absolute;
      bottom: 28rpx;
      right: 28rpx;

      .op_btn {
        background: #f0f7ff;
        border: 1rpx solid #005fe2;
        border-radius: 40rpx;
        padding: 12rpx 24rpx;

        .op_text {
          font-size: 24rpx;
          color: #005fe2;
          font-weight: 500;
          line-height: 1.2;
        }
      }
    }
  }

  .sheet_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  }

  .sheet_content {
    width: 100%;
    max-width: 750rpx;
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 32rpx 24rpx 40rpx;
    box-sizing: border-box;
    animation: slideUp 0.3s ease;

    .sheet_title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      text-align: center;
      margin-bottom: 24rpx;
    }

    .sheet_item {
      padding: 28rpx 0;
      border-bottom: 1rpx solid #f0f0f0;
      text-align: center;
      transition: background 0.2s;

      &:active { background: #f7f8fa; }
      &:last-of-type { border-bottom: none; }

      .sheet_item_text {
        font-size: 30rpx;
        color: #333;
        font-weight: 500;
      }
    }

    .sheet_cancel {
      margin-top: 16rpx;
      padding: 28rpx 0;
      background: #f7f8fa;
      border-radius: 12rpx;
      text-align: center;
      font-size: 30rpx;
      color: #666;
      font-weight: 500;
    }
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
}
</style>
