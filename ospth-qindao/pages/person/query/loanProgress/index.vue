<!-- 贷款办理进度查询：移动端适配 -->
<template>
  <view class="con_layout">
    <!-- 0 已发放，尚未结清的公积金贷款 -->
    <block v-if="blzt === 0">
      <view class="title_font">贷款办理进度查询</view>
      <view class="r_wff_list" />
    </block>

    <!-- 1 已受理未发放 -->
    <block v-if="blzt === 1">
      <view class="title_font">贷款办理进度查询</view>
      <view class="r_wff_list center-content">
        <view class="title_center">一手现房借款合同面签后，请扫码二维码进行税费缴纳：</view>
        <view class="qr-code-wrapper">
          <image :src="qrcodeImg" mode="widthFix" class="qrcode-img" />
        </view>
      </view>
      <view class="r_wff_list application-number-section">
        <view class="application-number">贷款申请表编号：{{ rList && rList.dkywh ? rList.dkywh : '--' }}</view>
      </view>
      <view v-if="rqList.length" class="loanStep">
        <view class="v_steps">
          <view v-for="(item, index) in rqList" :key="index">
            <view v-if="index !== 0" class="v_stepLine" :class="current === index || current > index ? 'active-stepLine' : ''" />
            <view class="stepText">
              <view class="active-title">
                <view class="title">{{ item.taskName }}</view>
              </view>
              <view v-if="item.taskState && item.taskState.code !== '3'" :class="['circle', item.taskState.code === '2' ? 'active-circle' : 'active-circle_no_start']">
                {{ index + 1 }}
              </view>
              <view v-if="item.taskState && item.taskState.code === '3'" class="circle active-circle-b">
                <van-icon name="success" />
              </view>
              <view>
                <view :class="item.taskState && item.taskState.code === '3' ? 'desc' : (item.taskState && item.taskState.code === '2' ? 'desc_active' : 'desc_no_start')">
                  {{ (item.taskState && item.taskState.description) || '' }}
                </view>
                <view class="create-time">创建时间：{{ item.createTime }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>

    <!-- 已发放弹窗：纯 view 实现，不依赖 Vant Popup 的 document/portal，H5 与小程序通用 -->
    <view v-if="modelVisible" class="loan_popup_mask">
      <view class="loan_popup_box">
        <view class="content-m">
          <van-icon name="info-o" class="info-img" />
          <view class="text">
            <view class="list">您的公积金贷款已发放！</view>
            <view class="list">公积金贷款账号：{{ rList.dkzh || '--' }}</view>
            <view class="list">贷款金额：{{ rList.htdkje || '--' }}</view>
            <view class="list">贷款期数：{{ rList.dkqs || '--' }}</view>
            <view class="list">发放日期：{{ rList.dkffrq || '--' }}</view>
          </view>
        </view>
        <view class="popup_footer">
          <van-button type="primary" block color="#4788fe" @click="modelVisible = false">知道了</van-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'loanDealProgress',
  data() {
    return {
      modelVisible: false,
      blzt: 1, // 0 已发放，尚未结清的公积金贷款；1 已受理未发放
      rList: {},
      current: 1,
      rqList: [],
      qrcodeImg: '',
      commonBizApply: {
        bizApplyType: 'MP020',
      },
    }
  },
  computed: {
    ...mapState('loanProgress', ['ywdjh']),
  },
  onLoad(options) {
    if (options && options.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted() {
    await this.queryLoanProgress()
  },
  methods: {
    ...mapActions('loanProgress', ['uriForQueryLoanProcessProgress1']),
    ...mapMutations('loanProgress', ['setYwdjh']),
    async queryLoanProgress() {
      try {
        const response = await this.uriForQueryLoanProcessProgress1({ ...this.commonBizApply })
        const data = response.data || response
        if (data && data.completed === 'false') {
          const errorMessage = data.errorMessage || '未获取贷款申报信息'
          uni.showToast({ title: errorMessage, icon: 'none' })
          return
        }
        if (data && data.completed === 'true') {
          // 已发放：ywhj===99 时弹窗展示，贷款信息在 loanInfo
          if (response.code === 200 && data.list[0].ywhj === '99') {
            this.rList = data.list[0]
            this.blzt = 0
            this.modelVisible = true
            return
          }
        }
        if (!data.loanData || !Array.isArray(data.loanData) || data.loanData.length === 0) {
          uni.showToast({ title: '未获取到贷款进度信息', icon: 'none' })
          return
        }
        const loanInfo = data.loanInfo || {}
        this.rList = loanInfo
        this.rqList = data.loanData || []
        this.rqList = [...this.rqList].sort((a, b) => (String(a.taskId || '')).localeCompare(String(b.taskId || '')))
      } catch (error) {
        const msg = (error && (error.message || error.msg)) ? (error.message || error.msg) : String(error)
        uni.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false,
          success: () => {
            uni.navigateBack()
          },
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  padding: 48rpx;
  background: #f5f5f5;
  box-sizing: border-box;
}

.content-m {
  padding: 32rpx 32rpx 0;

  .info-img {
    font-size: 80rpx;
    color: #4788fe;
    margin-bottom: 24rpx;
  }

  .text .list {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    color: #333;
  }
}

/* 已发放弹窗：遮罩 + 居中白框，不依赖 Vant Popup */
.loan_popup_mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  box-sizing: border-box;
}
.loan_popup_box {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
}

.popup_footer {
  padding: 24rpx 32rpx 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.title_font {
  margin-top: 0;
  margin-bottom: 48rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.r_wff_list {
  margin-top: 48rpx;
  line-height: 80rpx;

  &.center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.application-number-section {
  line-height: 1.5;
}

.qr-code-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;
}

.qrcode-img {
  width: 500rpx;
}

.title_center {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
}

.application-number {
  font-size: 32rpx;
  font-weight: bold;
  line-height: 1.5;
  color: #333;
}

/* 步骤条 */
.v_steps {
  min-height: 400rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.v_stepLine {
  width: 2rpx;
  height: 60rpx;
  margin-bottom: 40rpx;
  background: #808283;
}

.active-stepLine {
  background: #4788fe !important;
}

.stepText {
  background: #fff;
  color: #666;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200rpx;

  .text {
    margin-left: 140rpx;
    text-align: left;
  }

  .title {
    line-height: 50rpx;
    font-size: 32rpx;
    padding-top: 10rpx;
  }
}

.active-title {
  width: 180rpx;
  text-align: right;
  margin-left: 0;
  color: #4788fe;
  font-weight: bold;
}

.create-time {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #999;
}

.desc,
.desc_no_start,
.desc_active {
  font-size: 28rpx;
  width: 200rpx;
  text-align: center;
  height: 60rpx;
  line-height: 60rpx;
  border-radius: 50rpx;
}

.desc {
  border: 2rpx solid #e0ebff;
  color: #4788fe;
  background: #e0ebff;
}

.desc_no_start {
  border: 2rpx solid #e0ebff;
  color: #fff;
  background: #cccccc;
}

.desc_active {
  border: 2rpx solid #4788fe;
  color: #fff;
  background: #4788fe;
}

.circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #fff;
  font-size: 32rpx;
  border: 2rpx solid #ddd;
  margin: 0 16rpx;
}

.active-circle {
  color: #fff;
  background: #4788fe;
  border-color: #4788fe;
}

.active-circle_no_start {
  color: #cccccc;
  border-color: #ddd;
}

.active-circle-b {
  color: #4788fe;
  background: #fff;
  border-color: #4788fe;
}

.loanStep {
  margin-top: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
