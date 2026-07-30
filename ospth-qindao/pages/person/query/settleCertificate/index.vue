<!-- 贷款结清证明（可预览大图 · 真实图片版） -->
<template>
  <view class="con_layout">
    <!-- 头部卡片 — 和 accountInfo 风格一致 -->
    <view v-if="currentLoanInfo" class="header-card">
      <view class="one-line">
        <text>贷款账号：{{ currentLoanInfo.dkzh | middleFormat }}</text>
      </view>
      <van-divider />
      <view class="two-line">
        <text>贷款余额</text>
        <text class="settled-tag">已结清</text>
      </view>
      <view class="three-line">
        ￥0.00
      </view>
      <view class="four-line">
        <text>贷款状态：{{ currentLoanInfo.dkzt || '结清' }}</text>
        <text>发放日期：{{ currentLoanInfo.dkffrq || '--' }}</text>
      </view>
    </view>

    <!-- 结清证明核心区域（风格统一） -->
    <view class="tab_gjj">
      <view class="tab_title">贷款结清证明</view>
      
      <!-- 🔥 可点击预览的结清证明图片 -->
      <view class="cert_img_box">
        <image 
          :src="certImgUrl"
          class="cert_img"
          mode="widthFix"
          alt="贷款结清证明"
          @click="previewImage"
        />
        <view class="preview_tip">点击图片可预览大图</view>
      </view>
    </view>

    <!-- 🔥 图片预览弹窗（uni-app 内置预览） -->
  </view>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'

export default {
  name: 'settleCertificate',
  mixins: [codeTableMixin, commonMixin],
  data() {
    return {
      currentLoanInfo: {}, // 接收传参的贷款信息
      // 🔥 替换为你想要的真实图片链接（3选1）
      certImgUrl: 'https://ts1.tc.mm.bing.net/th/id/R-C.feffea9ea958c0a3f9847818bf3e8243?rik=EOsXr2HO9alTeA&riu=http%3a%2f%2fmy-knowledge.alicdn.com%2fpic20160805192441adafbc2d-dd9f-431d-a8d8-8edb6f20a456.jpg&ehk=ttOqgx879GjcfiDKZTSwYBrwP%2fM7tKMYGPHAWmn3nH4%3d&risl=&pid=ImgRaw&r=0',
      // certImgUrl: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/7d6e5f4a3b2c1d0e9f8e7d6e5f4a3b2c~tplv-a9rns2rl98-image.png',
      // certImgUrl: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/5a4b3c2d1e0f9a8b7c6d5e4f3a2b1~tplv-a9rns2rl98-image.png',
    }
  },
  // 接收上一页传递的 loanData 参数（和你现有跳转逻辑完全兼容）
  onLoad(options) {
    try {
      if (options?.loanData) {
        this.currentLoanInfo = JSON.parse(decodeURIComponent(options.loanData))
      }
      if (options?.projectNo) {
        this.setYwdjh(options.projectNo)
      }
    } catch (e) {
      console.error('解析参数失败：', e)
      uni.showToast({ title: '参数异常', icon: 'none' })
    }
  },
  computed: {
    ...mapState('repaymentDetails', ['ywdjh']),
  },
  methods: {
    ...mapMutations('repaymentDetails', ['setYwdjh']),
    // 🔥 点击预览大图（uni-app 原生预览，支持缩放、保存）
    previewImage() {
      uni.previewImage({
        urls: [this.certImgUrl], // 预览图片数组
        current: 0, // 当前显示第几张
        indicator: 'default', // 指示器样式
        loop: false, // 是否循环
      })
    },
  },
}
</script>

<style scoped lang="scss">
/* 🔥 完全复用还款明细的样式，保持视觉100%统一 */
.con_layout {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
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

  .settled-tag {
    font-size: 24rpx;
    background: rgba(255,255,255,0.25);
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
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

.tab_gjj {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(230, 230, 230, 0.3);

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

// 🔥 结清证明图片专属样式（精致、自适应）
.cert_img_box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  box-sizing: border-box;
  background: #fafbfc;
  border-radius: 12rpx;
  border: 1rpx solid #f0f0f0;
  cursor: pointer;
}
.cert_img {
  width: 100%;
  height: auto;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 12rpx;
}
.preview_tip {
  font-size: 24rpx;
  color: #888;
  text-align: center;
}

// 空状态（和还款明细统一）
.empty_tip {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 26rpx;
}
</style>