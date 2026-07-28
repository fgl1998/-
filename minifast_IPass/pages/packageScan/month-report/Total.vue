<template>
  <div class="total">
    <div class="title">
      <div class="con d-f ai-c jc-sb">
        <span class="text">{{ month }}月发放统计</span>
        <div class="right d-f ai-c">
          <span class="money">{{
            Number(renderData.aae019_success || '0') + Number(renderData.aae019_in || '0')
          }}</span>
          <span class="unit">元</span>
        </div>
      </div>
    </div>
    <div class="center d-f jc-sb">
      <div class="item">
        <div class="item-title">已领取金额</div>
        <div class="money">{{ renderData.aae019_success }}</div>
        <div class="unit">元</div>
      </div>
      <div class="item item2">
        <div class="item-title">待领取金额</div>
        <div class="money">{{ renderData.aae019_in }}</div>
        <div class="unit">元</div>
      </div>
    </div>
    <div class="bottom">
      <div class="item item1">
        <div class="item-top d-f jc-sb ai-c">
          <div class="left d-f">
            <div class="text1">已领取金额</div>
            <div class="text2">占比（{{ getProportion(renderData.aae019_success) }}%）</div>
          </div>
          <div class="right">￥{{ Number(renderData.aae019_success || '0') }}</div>
        </div>
        <div class="item-bar">
          <progress
            class="progress"
            :percent="getProportion(renderData.aae019_success)"
            activeColor="#82B4FF"
            border-radius="3"
            stroke-width="6" />
        </div>
      </div>
      <div class="item">
        <div class="item-top d-f jc-sb ai-c">
          <div class="left d-f">
            <div class="text1">待领取金额</div>
            <div class="text2">占比（{{ getProportion(renderData.aae019_in) }}%）</div>
          </div>
          <div class="right">￥{{ Number(renderData.aae019_in || '0') }}</div>
        </div>
        <div class="item-bar">
          <progress
            class="progress"
            :percent="getProportion(renderData.aae019_in)"
            activeColor="#82B4FF"
            border-radius="3"
            stroke-width="6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pageTotal',
    props: {
      month: {
        type: String,
        required: true
      },
      renderData: {
        type: Object,
        required: true
      }
    },

    data() {
      return {}
    },

    mounted() {},

    methods: {
      getProportion(value) {
        return (
          (Number(value || '0') * 100) /
          (Number(this.renderData.aae019_success || '0') + Number(this.renderData.aae019_in || '0') || 1)
        ).toFixed(2)
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  .total {
    border-radius: 24rpx;
    background-color: #fff;
    padding: 28rpx;
    .title {
      position: relative;
      .con {
        padding-left: 18rpx;
        .text {
          font-size: 36rpx;
          font-weight: 500;
        }
        .money {
          font-size: 36rpx;
          font-weight: 500;
          color: rgba(255, 141, 26, 1);
          margin: 0 8rpx;
        }
        .unit {
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        margin-top: -16rpx;
        width: 8rpx;
        height: 32rpx;
        background-color: #3882ff;
        border-radius: 2rpx;
      }
    }
    .center {
      margin: 34rpx 0 50rpx 0;
      .item {
        width: 300rpx;
        height: 268rpx;
        border-radius: 24rpx;
        background: rgba(237, 247, 255, 1);
        box-shadow: 0rpx 4rpx 16rpx rgba(68, 96, 133, 0.15);
        padding: 40rpx;
        .item-title {
          font-size: 28rpx;
          font-weight: 400;
          color: rgba(0, 59, 141, 1);
        }
        .money {
          font-size: 72rpx;
          font-weight: 500;
          color: rgba(0, 59, 141, 1);
          height: 106rpx;
          line-height: 106rpx;
        }
        .unit {
          font-size: 28rpx;
          font-weight: 400;
          color: rgba(142, 172, 209, 1);
        }
      }
      .item2 {
        background: rgba(236, 255, 253, 1);
      }
    }
    .bottom {
      .item {
        .item-top {
          margin-bottom: 8rpx;
          .left {
            .text1 {
              font-size: 28rpx;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              text-align: left;
              margin-right: 8rpx;
            }
            .text2 {
              font-size: 28rpx;
              font-weight: 400;
              color: rgba(161, 167, 179, 1);
            }
          }
          .right {
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
      }
      .item1 {
        margin-bottom: 40rpx;
      }
    }
  }
</style>
