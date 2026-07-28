<template>
  <div class="personal-subsidy">
    <div class="title">
      <div class="title-con d-f ai-c">
        <span class="text">我享受的发放补贴</span>
      </div>
    </div>
    <div class="content">
      <block v-if="renderData.length > 0">
        <div class="item" v-for="(item, index) in renderData" :key="index">
          <div class="box box1 d-f ai-c">
            <div class="img"></div>
            <div class="text">{{ item.chi031 }}</div>
          </div>
          <div class="box box2 d-f ai-c">
            <div class="img"></div>
            <div class="text d-f ai-c jc-sb">
              <span class="text1">{{ item.aae019 }}元</span>
              <span class="text2">
                {{
                  item.chb204 &&
                  item.chb204.substring(0, 4) + '-' + item.chb204.substring(4, 6) + '-' + item.chb204.substring(6, 8)
                }}号发放
              </span>
            </div>
          </div>
          <div class="box box3 d-f ai-c">
            <div class="img"></div>
            <div class="text d-f ai-c jc-sb">
              <span class="text1">{{ item.aae010 }}</span>
              <span class="text2">{{ item.aae044 }}</span>
            </div>
          </div>
        </div>
      </block>
      <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
    </div>
  </div>
</template>

<script>
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

export default {
  name: 'pagePersonalSubsidy',
  components: { ComponentNoData },
  props: {
    renderData: {
      type: Array,
      rquired: true,
    },
  },

  data() {
    return {}
  },

  mounted() {},

  methods: {},
}
</script>

<style lang="scss" scoped>
.personal-subsidy {
  margin-top: 52rpx;
  border-radius: 24rpx;
  background-color: #fff;
  padding: 28rpx;
  .title {
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
    position: relative;
    .title-con {
      padding-left: 18rpx;
      .text {
        font-size: 36rpx;
        font-weight: 500;
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      margin-top: -28rpx;
      width: 8rpx;
      height: 32rpx;
      background-color: #3882ff;
      border-radius: 2rpx;
    }
  }
  .content {
    .item {
      border-radius: 12rpx;
      padding: 28rpx;
      background: linear-gradient(180deg, rgba(247, 250, 255, 1) 0%, rgba(253, 254, 254, 1) 100%);
      margin: 18rpx 0 34rpx 0;
      &:last-child {
        margin-bottom: 0;
      }
      .box {
        .img {
          width: 32rpx;
          height: 32rpx;
        }
      }
      .box1 {
        .img {
          background: url('./images/box1.png') no-repeat center/cover;
          margin-right: 12rpx;
        }
        .text {
          flex: 1;
          font-size: 28rpx;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .box2 {
        margin: 18rpx 0;
        .img {
          background: url('./images/box2.png') no-repeat center/cover;
          margin-right: 12rpx;
        }
        .text {
          width: 100%;
        }
        .text1 {
          font-size: 32rpx;
          font-weight: 400;
          color: rgba(255, 141, 26, 1);
        }
        .text2 {
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(161, 167, 179, 1);
        }
      }
      .box3 {
        .img {
          background: url('./images/box3.png') no-repeat center/cover;
          margin-right: 12rpx;
        }
        .text {
          width: 100%;
        }
        .text1 {
          font-size: 28rpx;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        .text2 {
          font-size: 24rpx;
          font-weight: 400;
          color: rgba(161, 167, 179, 1);
        }
      }
    }
  }
}
</style>
