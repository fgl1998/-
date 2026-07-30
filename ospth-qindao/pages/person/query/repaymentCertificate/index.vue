<!-- 还款明细 -->
<template>
  <query-layout :beforePrevious="beforePrevious">
    <view class="con_layout">
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

      <!-- 公积金贷款还款凭证 -->
      <view class="tab_gjj">
        <box-title title="还款记录"/>

        <!-- 🔥 精致横向查询栏 -->
        <view class="query_section">
          <view class="date_row">
            <view class="date-item" @click="showStartPicker=true">
              <van-icon name="calendar-o" color="#1677ff"/>
              <text>{{ startDate }}</text>
              <van-icon name="arrow-down" size="12" color="#999"/>
            </view>
            <text class="split">~</text>
            <view class="date-item" @click="showEndPicker=true">
              <van-icon name="calendar-o" color="#1677ff"/>
              <text>{{ endDate }}</text>
              <van-icon name="arrow-down" size="12" color="#999"/>
            </view>
          </view>
          <view class="btn_row">
            <van-button size="small" color="#1677ff" class="query-btn" @click="queryRepayVoucher">查询</van-button>
            <van-button size="small" plain color="#1492ff" @click="handleClickDownInfo">下载</van-button>
          </view>
        </view>
        <!-- 还款记录列表 -->
        <view class="repay_list">
          <scroll-view scroll-y class="scroll_list" :lower-threshold="100"@touchstart="touchStart"
                       @touchend="touchEnd" @scrolltolower="loadMore">
            <view class="repay_item" v-for="(row, i) in displayList" :key="i">
              <van-cell title="摘要" value="正常还款"/>
              <van-cell title="还款合计(元)" :value="row.ychje"/>
              <van-cell title="还款本金(元)" :value="row.ychbj"/>
              <van-cell title="还款利息(元)" :value="row.ychlx"/>
              <van-cell title="还款罚息(元)" :value="row.ychfxfl"/>
              <van-cell title="记账日期" :value="row.hkyf"/>
              <van-cell title="贷款余额(元)" value="600000"/>
            </view>
            <view v-if="!reversedRecordData || reversedRecordData.length === 0" class="empty_tip">暂无还款记录</view>
            <view v-else class="load_more_footer">
              <text v-if="hasMore">上拉加载更多</text>
              <text v-else>没有更多了</text>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 日期选择 -->
      <van-popup v-model="showStartPicker" position="bottom">
        <van-datetime-picker
            type="date"
            :value="startDate ? new Date(startDate) : minStartDate"
            :min-date="minStartDate"
            :max-date="endDate ? new Date(endDate) : maxEndDate"
            @confirm="onConfirmStartDate"
            @cancel="showStartPicker = false"
        />
      </van-popup>
      <van-popup v-model="showEndPicker" position="bottom">
        <van-datetime-picker
            type="date"
            :value="endDate ? new Date(endDate) : maxEndDate"
            :max-date="maxEndDate"
            @confirm="onConfirmEndDate"
            @cancel="showEndPicker = false"
        />
      </van-popup>
    </view>
  </query-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'

export default {
  name: 'repayVoucher',
  components: {},
  mixins: [codeTableMixin, commonMixin],
  data () {
    return {
      info: {},
      srcImg: '',
      currentLoanInfo: {},
      reversedRecordData: [],
      startDate: '',
      endDate: '',
      showStartPicker: false,
      showEndPicker: false,
      minStartDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
      maxEndDate: new Date(),
      pageSize: 10,
      displayPage: 1,
      showLoanInfo: true,
      showMore: false
    }
  },
  onLoad (options) {
    try {
          if (options?.loanData) {
            this.currentLoanInfo = JSON.parse(decodeURIComponent(options.loanData))
          }
          if (options?.projectNo) {
            this.setYwdjh(options.projectNo)
          }
        } catch (e) {
          console.error('解析贷款参数失败：', e)
          uni.showToast({ title: '参数异常', icon: 'none' })
        }
  },
  async mounted () {
    if (this.currentLoanInfo && this.currentLoanInfo.sfyq === '逾期') {
      uni.showModal({
        title: '温馨提示',
        content: '尊敬的用户，您的贷款已逾期，请尽快还款以免影响信用。',
        showCancel: false,
      })
    }
    this.startDate = moment().subtract(6, 'months').format('YYYY-MM-DD')
    this.endDate = moment().format('YYYY-MM-DD')
    await this.init()
  },
  computed: {
    ...mapState('repaymentDetails', ['repayRecordData', 'loanInfo', 'ywdjh', 'accInfo']),
    reversedRepayRecordData () {
      if (!this.repayRecordData || this.repayRecordData.length === 0) return []
      return [...this.repayRecordData].reverse()
    },
    displayList () {
      const list = this.reversedRecordData || []
      return list.slice(0, this.pageSize * this.displayPage)
    },
    hasMore () {
      const list = this.reversedRecordData || []
      return this.pageSize * this.displayPage < list.length
    },
  },
  methods: {
    ...mapMutations('repaymentDetails', ['setYwdjh']),
    ...mapActions('repaymentDetails', [
      'uriForQueryMyLoan',
      'queryRemittance',
      'uriForQueryRepayVoucher',
      'uriForQuerySettlementCertificate',
      'buildRepaymentDetailsDownloadParams',
    ]),
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
    onConfirmStartDate (v) {
      this.startDate = moment(v).format('YYYY-MM-DD')
      this.showStartPicker = false
    },
    onConfirmEndDate (v) {
      this.endDate = moment(v).format('YYYY-MM-DD')
      this.showEndPicker = false
    },
    async init () {
      // if (!this.currentLoanInfo.dkye) {
      //   const response = await this.uriForQuerySettlementCertificate({ bizApplyType: 'MP020' })
      //   this.info = response?.list?.[0] || {}
      // }
      await this.queryRepayVoucher()
    },
    async queryRepayVoucher () {
      if (!this.startDate) {
        uni.showToast({ title: '请选择还款起始时间', icon: 'none' })
        return
      }
      if (!this.endDate) {
        uni.showToast({ title: '请选择还款结束时间', icon: 'none' })
        return
      }
      await this.uriForQueryRepayVoucher({
        kksjq: this.startDate,
        kksjz: this.endDate,
        bizApplyType: 'MP020',
        dkzh: this.currentLoanInfo.dkzh
      })
      if (this.repayRecordData) {
        this.reversedRecordData = this.reversedRepayRecordData
        this.displayPage = 1
        if (this.repayRecordData && this.repayRecordData.length > 0) {
          this.currentLoanInfo.jkhtll = this.repayRecordData[0].jkhtll
        }
      }
    },
    loadMore () {
      if (this.hasMore) this.displayPage++
    },

    async handleClickDownInfo () {
      if (!this.startDate || !this.endDate) {
        uni.showToast({ title: '请选择还款时间', icon: 'none' })
        return
      }
      try {
        const downloadParams = await this.buildRepaymentDetailsDownloadParams({
          startDate: this.startDate,
          endDate: this.endDate,
          bizApplyType: 'MP020',
        })
        await this.downloadLoanReport(downloadParams)
      } catch (e) {
        const errorMessage = e?.message || e?.toString() || '下载失败，请稍后重试'
        uni.showModal({
          title: '温馨提示',
          content: errorMessage,
          showCancel: false,
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
/* 全局布局 - 保持手机端适配 */
.con_layout {
  box-sizing: border-box;
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

/* 下方还款凭证卡片 - 统一风格 */
.tab_gjj {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(230, 230, 230, 0.3);
  flex: 1;

  /* 标题精致化 - 加左侧装饰条 */
  .tab_title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
    padding-left: 16rpx;
    border-left: 6rpx solid #1492ff;
    line-height: 1.2;
  }
}

// 查询区域 - 优化融合度
.query_section {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 16rpx;
  border-top: 1rpx solid #f5f5f5;
}
.date_row {
  display: flex;
  align-items: center;
  gap: 16rpx;

  /deep/ .van-field {
    flex: 1;
    --field-height: 64rpx;
    --field-font-size: 26rpx;
    background: #fff;
    border-radius: 8rpx;
    padding: 0 16rpx;
    border: 1rpx solid #e5e5e5;
  }
}
.btn_row {
  display: flex;
  gap: 8rpx;
  color: #1677ff;
  font-size: 26rpx;
  flex: 1;
  margin-left: 16rpx;
  /deep/ .van-button {
    flex: 1;
    height: 48rpx;
  }
}

// 🔥 还款列表 - 终极优化：告别朴素，精致卡片式
.repay_list {
  flex: 1;
  .scroll_list {
    height: 65vh;
    /deep/ ::-webkit-scrollbar {
      display: none;
    }
  }

  /* 列表项：独立卡片，精致感拉满 */
  .repay_item {
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx 0;
    margin-bottom: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 列表行：分两排，左标签右数值，整齐美观 */
  .list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
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

    // 🔥 突出还款合计：蓝色高亮，放大字号
    &.total-row {
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;

      .label {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }
      .value {
        font-size: 32rpx;
        font-weight: bold;
        color: #1492ff;
      }
    }
  }

  /* 空状态优化 */
  .empty_tip {
    text-align: center;
    padding: 60rpx 0;
    color: #999;
    font-size: 26rpx;
  }

  /* 加载更多优化 */
  .load_more_footer {
    text-align: center;
    padding: 24rpx 0;
    font-size: 24rpx;
    color: #999;
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
