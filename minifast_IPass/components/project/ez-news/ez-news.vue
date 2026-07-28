
<template>
  <view class="ez-news-wrapper">
    <div class="left" v-if="type === 'sunshine'">
      <span class="YouSheBiaoTiHei">最新动态</span>
    </div>
    <div class="left" v-if="type === 'home'">
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
            <block v-if="type === 'sunshine'">
              <div class="name">
                <!-- <div class="tag">最新</div> -->
                <div class="user-info">
                  <span>{{ item.aac003 }}</span>
                  <span>({{ item.aac002 | TMIdcard }}) </span>
                </div>
                <div class="status">{{ item.chb014 }}</div>
              </div>
              <div class="new-info">
                <span class="unit">{{ item.chi031_desc }}</span>
                <span>{{ item.aae036.substr(0, 10) }}</span>
              </div>
            </block>
            <block v-if="type === 'home'">
              <div class="name">
                <div class="tag">最新</div>
                <div class="user-info">
                  <span>{{ item.name }}</span>
                </div>
                <div
                  class="status"
                  :class="[item.chb014 == '打回' ? 'fail' : '']"
                  v-if="item.chb014"
                >
                  {{ item.chb014 }}
                </div>
              </div>
              <div class="new-info">
                <span class="unit">{{ item.aae017 }}</span>
                <span>{{ item.time }}</span>
              </div>
            </block>
          </swiper-item>
        </swiper>
      </div>
      <div class="no-data" v-else>暂无消息</div>
      <div class="button-wrapper" v-if="buttonName">
        <ComponentButton
          @click="$emit('click')"
          width="112rpx"
          height="48rpx"
          fontSize="24rpx"
          type="secondary"
          circle
          :name="buttonName"
        ></ComponentButton>
      </div>
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
  name: 'ezNews',
  props: {
    // 本地图片链接
    renderData: {
      type: [Array],
      requerid: true,
    },
    // 按钮名称
    buttonName: {
      type: [String],
      default: '',
    },
    // 类型 sunshine 村村响 home 首页
    type: {
      type: [String],
      default: 'sunshine',
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
      padding-right: 20rpx;
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
        padding-top: 24rpx;
        box-sizing: border-box;
        .name {
          color: $color;
          font-size: 24rpx;
          font-weight: 500;
          line-height: 26rpx;
          display: flex;
          align-items: center;
          .tag {
            color: #fff;
            width: 44rpx;
            height: 24rpx;
            background-color: #f66666;
            font-size: 18rpx;
            font-weight: 500;
            line-height: 24rpx;
            text-align: center;
            border-radius: 4rpx;
            margin-right: 16rpx;
          }
          .user-info {
            flex: 1;
            overflow: hidden;
            display: flex;
            align-items: center;
          }
          .status {
            color: green;
            &.fail {
              color: #f00;
            }
          }
        }
        .new-info {
          display: flex;
          align-items: center;
          font-size: 22rpx;
          line-height: 1;
          color: $color-placeholder;
          margin-top: 14rpx;
          .unit {
            flex: 1;
            margin-right: 12rpx;
            @include textOverflow(1);
          }
        }
      }
    }
  }
  .button-wrapper {
    button {
      width: 112rpx;
      height: 48rpx;
      line-height: 48rpx;
      background-color: $primary;
      border-radius: 23rpx;
      margin-left: 24rpx;
      font-size: 24rpx;
      color: #ffffff;
    }
  }
}
</style>
