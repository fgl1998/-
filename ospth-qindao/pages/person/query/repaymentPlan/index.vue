<!-- 还款计划 -->
<template>
  <query-layout :before-previous="beforePrevious">
    <view ref="childContent" class="con_layout">
      <!-- 头部卡片 — 和 accountInfo 风格一致 -->
      <view v-if="currentLoanInfo" class="header-card">
        <view class="one-line">
          <text>贷款账号：{{ currentLoanInfo.dkzh | middleFormat }}</text>
        </view>
        <van-divider />
        <view class="two-line">
          <text>贷款余额</text>
          <van-icon size="20" name="eye-o" color="#fff" />
        </view>
        <view class="three-line">
          ￥{{ currentLoanInfo.dkye | moneyFormat }}
        </view>
        <view class="four-line">
          <text>贷款状态：{{ currentLoanInfo.dkzt || '--' }}</text>
          <text>发放日期：{{ currentLoanInfo.dkffrq || '--' }}</text>
        </view>
      </view>
      <view v-else class="empty_wrap">
        <text>暂无贷款信息</text>
      </view>

      <!-- 公积金贷款还款计划 -->
      <view class="tab_gjj">
        <box-title title="近一年还款计划"/>
        <!-- 还款计划列表（上拉加载更多） -->
        <view class="repay_list">
          <scroll-view scroll-y class="scroll_list" :lower-threshold="100" @touchstart="touchStart"
                       @touchend="touchEnd" @scrolltolower="loadMore">
            <view class="repay_item" v-for="(row, i) in displayList" :key="i">
              <van-cell title="还款日期" :value="row.yhkr"/>
              <van-cell title="年利率(%)" :value="2.6"/>
              <van-cell title="还款总额(元)" :value="row.yhkcs"/>
              <van-cell title="还款本金(元)" :value="row.yhbj"/>
              <van-cell title="还款利息(元)" :value="row.yhlx"/>
              <van-cell title="贷款余额(元)" :value="row.sydkye"/>
            </view>
            <view v-if="!repayPlanData || repayPlanData.length === 0" class="empty_tip">暂无还款计划</view>
            <view v-else class="load_more_footer">
              <text v-if="hasMore">上拉加载更多</text>
              <text v-else>没有更多了</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </query-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'

export default {
  name: 'repaymentPlan',
  mixins: [codeTableMixin, commonMixin],
  components: {},
  data () {
    return {
      srcImg: '',
      currentLoanInfo: {}, // 接收上一页传的【当前点击的贷款】
      commonBizApply: { bizApplyType: 'MP020' },
      pageSize: 10,
      displayPage: 1,
      showMore: false,
      showLoanInfo: true,
      startY: 0
    }
  },
  computed: {
    ...mapState('repaymentPlan', ['ywdjh', 'repayPlanData', 'loanInfo']),
    displayList () {
      const list = this.repayPlanData || []
      return list.slice(0, this.pageSize * this.displayPage)
    },
    hasMore () {
      const list = this.repayPlanData || []
      return this.pageSize * this.displayPage < list.length
    },
  },
  // 🔴 核心修改1：接收上一页传的 loanData 参数
  onLoad (options) {
    try {
      // 解析上一页传的贷款数据
      if (options?.loanData) {
        this.currentLoanInfo = JSON.parse(decodeURIComponent(options.loanData))
        console.log('接收的当前贷款信息：', this.currentLoanInfo)
      }
      // 兼容原有 projectNo 参数
      if (options?.projectNo) {
        this.setYwdjh(options.projectNo)
      }
    } catch (e) {
      console.error('解析贷款参数失败：', e)
      uni.showToast({ title: '参数异常', icon: 'none' })
    }
  },
  async mounted () {
    await this.initCodeTable(['DKLX', 'DKHKFS'])
    // 如果没传参数，再兼容原有逻辑（防止单独打开页面报错）
    if (!this.currentLoanInfo || Object.keys(this.currentLoanInfo) === 0) {
      if (this.loanInfo && Array.isArray(this.loanInfo) && this.loanInfo.length > 0) {
        this.currentLoanInfo = this.loanInfo[0]
      }
    }
    // 逾期提示（用传过来的贷款数据判断）
    if (this.currentLoanInfo && this.currentLoanInfo.sfyq === '逾期') {
      uni.showModal({
        title: '温馨提示',
        content: '尊敬的用户，您的贷款已逾期，请尽快还款以免影响信用。',
        showCancel: false,
      })
    }
    //await this.queryRemittance({ ...this.commonBizApply })
	//await this.init()
	await this.queryRepaymentPlan()

  },
  methods: {
    ...mapActions('repaymentPlan', [
      'uriForQueryRepaymentPlan',
      'queryRemittance',
      'uriForQueryMyLoan',
      'buildRepaymentPlanDownloadParams',
    ]),
    ...mapMutations('repaymentPlan', ['setYwdjh']),
    async init () {
      await this.queryRepaymentPlan()
    },
    // 🔴 核心修改3：用传过来的贷款账号查询还款计划
    async queryRepaymentPlan () {
      try {
        if (!this.currentLoanInfo || !this.currentLoanInfo.dkzh) {
          uni.showToast({ title: '未找到贷款信息', icon: 'none' })
          return
        }
        // 自动携带当前贷款的账号，查询对应还款计划
        await this.uriForQueryRepaymentPlan({
          ...this.commonBizApply,
          dkzh: this.currentLoanInfo.dkzh // 关键：传当前贷款账号
        })
        this.displayPage = 1
      } catch (e) {
        uni.showToast({ title: e?.message || '查询失败', icon: 'none' })
      }
    },
    loadMore () {
      if (this.hasMore) this.displayPage++
    },
    touchStart(e) {
      this.startY = e.changedTouches[0].clientY
    },
    touchEnd(e) {
      let endY = e.changedTouches[0].clientY
      if (this.startY - endY > 50) {
        this.showLoanInfo = false
      }
    },
    beforePrevious() {
      uni.navigateTo({ url: `/pages/person/query/loanAccount/index` })
      return false
    },
    async handleClickDownInfo () {
      if (!this.repayPlanData?.length) {
        uni.showToast({ title: '暂无数据，不支持下载', icon: 'none' })
        return
      }
      if (!this.currentLoanInfo) {
        uni.showToast({ title: '未找到贷款信息', icon: 'none' })
        return
      }
      uni.showModal({
        title: '温馨提示',
        content: '下载的报表将详细列出您当前尚未还清的还款计划，帮助您清晰了解剩余的还款情况',
        confirmText: '确定',
        success: async (res) => {
          if (!res.confirm) return
          try {
            const downloadParams = await this.buildRepaymentPlanDownloadParams({ ...this.commonBizApply })
            await this.downloadLoanReport(downloadParams)
          } catch (e) {
            const msg = e?.message || e?.toString() || '下载失败，请稍后重试'
            uni.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false,
              success: () => uni.navigateBack(),
            })
          }
        },
      })
    },
  },
}
</script>
<style scoped lang="scss">
/* 全局布局 - 统一柔和背景，手机端完美适配 */
.con_layout {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 头部卡片 — 和 accountInfo 同一渐变背景 */
.header-card {
  background: url("@/pages/person/query/accountInfo/image/bg_01.png");
  background-size: 100% 100%;
  font-size: 28rpx;
  padding: 32rpx 24rpx;
  color: #F5F5F5;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;

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

/* 空状态优化 */
.empty_wrap {
  text-align: center;
  padding: 80rpx 0;
  font-size: 26rpx;
  color: #999;
}

/* 下方还款计划卡片 - 🔥 核心优化：和上方风格完全统一 */
.tab_gjj {
  background-color: #fff;
  border-radius: 16rpx;
  //padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(230, 230, 230, 0.3);
  flex: 1;

  /* 标题精致化 - 左侧蓝色装饰条，档次拉满 */
  .tab_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;

    .tab_title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      padding-left: 16rpx;
      border-left: 6rpx solid #1492ff;
      line-height: 1.2;
    }
  }

  .repay_list {
    .scroll_list {
      height: 70vh;
      flex: 1;
      /* 永久隐藏滚动条 */
      /deep/ ::-webkit-scrollbar {
        display: none !important;
        width: 0;
        height: 0;
      }
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    /* 🔥 还款计划项：独立小卡片，告别朴素线条 */
    .repay_item {
      border-radius: 12rpx;
      padding: 24rpx 0;
      margin-bottom: 16rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

      &:last-child {
        margin-bottom: 0;
      }
    }

    /* 列表行优化：左右分栏，整齐美观 */
    .list_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 56rpx;
      font-size: 28rpx;
      margin-bottom: 12rpx;

      .label {
        color: #888;
        font-weight: 400;
      }
      .value {
        color: #333;
        font-weight: 500;
        text-align: right;
      }

      // 高亮关键金额：还款总金额 + 剩余贷款余额
      &.highlight-total .value {
        color: #1492ff;
        font-weight: bold;
      }
    }

    .empty_tip {
      text-align: center;
      color: #999;
      font-size: 26rpx;
      padding: 60rpx 0;
    }

    .load_more_footer {
      text-align: center;
      padding: 24rpx 0;
      font-size: 28rpx;
      line-height: 1.5;
      color: #999;
    }
  }
}
/* 贷款信息展开/收起过渡 */
.loan-info-content {
  overflow: hidden; /* 必须加，过渡才生效 */
}
.slideFade-enter-active, .slideFade-leave-active {
  transition: all 0.3s ease;
  height: auto;
  opacity: 1;
}
.slideFade-enter, .slideFade-leave-to {
  height: 0;
  opacity: 0;
}

/deep/ .van-cell{
  line-height: 28rpx;
  font-size: 28rpx;
}
</style>
