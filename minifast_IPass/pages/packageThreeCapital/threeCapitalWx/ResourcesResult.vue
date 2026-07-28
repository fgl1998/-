<template>
  <div class="result" v-if="isRequestOver">
    <div class="title d-f ai-c" v-if="getName">
      <div class="iconimg iconimg-subsidy"></div>
      <div class="text">{{ getName }}</div>
    </div>

    <div class="items" v-if="newRenderData && newRenderData.length > 0">
      <div class="item" v-for="(item, index) in newRenderData" :key="index">
        <div class="top d-f ai-c jc-sb" @click="handleExpand(index)">
          <div class="name">{{ item.resourcesName }}</div>
          <div
            class="iconimg iconimg-arrow-right"
            :class="item.show ? 'expanded' : ''"
          ></div>
        </div>
        <div class="con-wrapper" v-if="item.show">
          <div class="con">
            <div class="con-item d-f ai-c jc-sb">
              <div class="key">位置：</div>
              <div class="value">{{ item.sit }}</div>
            </div>
            <div class="con-item d-f ai-c jc-sb">
              <div class="key">面积：</div>
              <div class="value">{{ item.number }}{{ item.unit }}</div>
            </div>
            <div class="con-item d-f ai-c jc-sb">
              <div class="key">使用情况：</div>
              <div class="value">{{ item.resourcesStatus }}</div>
            </div>
            <div class="con-item d-f ai-c jc-sb">
              <div class="key">附件：</div>
              <div
                class="value attachment"
                @click="handleJumpRoute(item.resourcesId)"
              >
                查看附件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <block v-else>
      <ComponentNoData tip="暂无数据" v-if="isRequestOver"></ComponentNoData>
    </block>

    <div class="load-more-wrapper" v-if="isExceedLimit">
      <ComponentLoadMore
        :isOver="isLoadOver"
        height="76rpx"
        name="加载更多"
        type="primary"
        @click="handleClickLoadMore"
      ></ComponentLoadMore>
    </div>
    <div class="footer">以上数据来自于宜宾市农业农村局</div>
  </div>
</template>
<script>
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
import { navigateTo } from '@/utils/uni-api'
export default {
  name: 'Property',
  data() {
    return {
      newRenderData: []
    }
  },
  components: {
    ComponentNoData,
    ComponentLoadMore
  },
  props: {
    renderData: {
      type: Array,
      required: true
    },
    unitName: {
      type: String,
      default: ''
    },
    isRequestOver: {
      type: Boolean,
      default: false
    },
    isExceedLimit: {
      type: Boolean,
      default: false
    },
    isLoadOver: {
      type: Boolean,
      default: false
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleExpand(index) {
      this.newRenderData[index].show = !this.newRenderData[index].show
    },
    // 加载更多
    handleClickLoadMore() {
      this.$emit('loadMore')
    },
    handleJumpRoute(resourcesId) {
      navigateTo('attachment', 'packageThreeCapital', { resourcesId })
    }
  },
  computed: {
    getName() {
      let str = ''
      if (this.unitName) {
        str = `${this.unitName}资源台账`
        if (this.startTime && this.endTime) {
          str = `${this.unitName}${this.startTime}至${this.endTime}资源台账`
        }
      }
      return str
    }
  },
  watch: {
    renderData: function (newval, oldval) {
      this.newRenderData = [...newval]
      this.newRenderData.forEach((item) => this.$set(item, 'show', false))
    }
  }
}
</script>
<style lang="scss" scoped>
.result {
  background-color: #fff;
  border-radius: 12rpx;
  .title {
    width: 100%;
    padding: $spacing;

    .iconimg {
      flex-shrink: 0;
    }
    .text {
      line-height: 24rpx;
      margin-left: 16rpx;
      font-size: 30rpx;
      font-weight: bold;
      line-height: 1.2;
    }
  }
  .items {
    .item {
      box-shadow: $box-shadow-base;
      border-bottom: 1px solid #eee;
      padding: 0 $spacing;
      .top {
        padding: 30rpx 0;
        .iconimg {
          transition: all 0.3s;
        }
        .expanded {
          transform: rotate(90deg);
        }
        .name {
          font-size: 28rpx;
          font-weight: 500;
          flex: 1;
          overflow: hidden;
          margin-right: $spacing;
        }
      }
      .con-wrapper {
        padding-bottom: $spacing;
      }
      .con {
        width: 100%;
        background-color: #eef4ff;
        border-radius: 12rpx;
        padding: 0 $spacing;
        &-item {
          padding: 20rpx 0;
          .key {
            font-size: 28rpx;
            font-weight: 400;
            color: #a1a7b3;
            white-space: nowrap;
          }
          .value {
            font-size: 24rpx;
            font-weight: 400;
          }
          .attachment {
            color: rgba(56, 130, 255, 1);
          }
        }
      }
      &:last-child {
        border: 0;
      }
    }
  }

  .footer {
    padding-bottom: 30rpx;
    width: 100%;
    text-align: center;
    font-weight: 500;
    font-size: 24rpx;
    line-height: 1;
    color: #c8c9cc;
  }
}
</style>
