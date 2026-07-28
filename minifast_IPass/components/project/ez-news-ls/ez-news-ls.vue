<template>
  <view class="ez-news-wrapper">
    <div class="left">
      <span class="YouSheBiaoTiHei green">惠民</span>
      <span class="YouSheBiaoTiHei black">快讯</span>
    </div>
    <div class="right">
      <div class="swiper-wrapper" v-if="renderData && renderData.length > 0">
        <swiper
          vertical
          :interval="3000"
          :autoplay="renderData.length > 1"
          circular
          class="swiper"
        >
          <swiper-item
            class="swiper-item"
            v-for="(item, index) in renderData"
            :key="index"
          >
            <div class="name">
              {{ item.name }}
            </div>
          </swiper-item>
        </swiper>
      </div>
      <div class="no-data" v-else>暂无消息</div>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
/**
 * 最新动态 组件
 * @description 最新动态 组件
 * @param {Array} renderData 渲染数据
 * @param {String} httpSrc 图片网络链接
 * @param {String} width 图片宽度
 * @param {String} height 图片高度
 */
export default {
  name: 'ezNewsLS',
  props: {
    // 本地图片链接
    renderData: {
      type: [Array],
      default: () => {
        return [{ name: '投诉咨询电话 ：0833-2195720' }]
      },
    },
  },
  components: {
    ComponentButton,
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
$height: 112rpx;
.ez-news-wrapper {
  width: 100%;
  height: $height;
  background-color: #ffffff;
  box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.06);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx 0 12rpx;
  .left {
    width: 80rpx;
    margin-right: 24rpx;
    span {
      font-size: 40rpx;
      line-height: 1;
      color: $primary;
      &.green {
        color: #1fd3b3;
      }
      &.black {
        color: #313233;
      }
    }
  }
  .right {
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    .swiper-wrapper {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
    .no-data {
      flex: 1;
      overflow: hidden;
      color: $color-placeholder;
      font-size: 24rpx;
    }
    .swiper {
      width: 100%;
      height: $height;
      .swiper-item {
        width: 100%;
        height: $height;
        box-sizing: border-box;
        .name {
          color: $color;
          font-size: 24rpx;
          font-weight: 500;
          line-height: $height;
          padding-left: 20rpx;
        }
      }
    }
  }
}
</style>
