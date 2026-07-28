<template>
  <div class="result" v-if="isRequestOver">
    <div v-if="newRenderData.length > 0">
      <div class="result-title d-f ai-c">
        <div class="img"></div>
        <div class="text">{{ startTime }}到{{ endTime }}资产台账</div>
      </div>
      <div class="item" v-for="(item, index) in newRenderData" :key="index">
        <div class="top d-f ai-c jc-sb">
          <div class="title">{{ item.assetsName }}</div>
          <div class="expand" :class="item.show ? 'expanded' : ''" @click="handleExpand(index)">></div>
        </div>
        <div class="con" v-if="item.show">
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">账面原值：</div>
            <div class="value">{{ item.originalValue }}元</div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">折旧：</div>
            <div class="value">{{ item.depreciationValue }}元</div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">净值：</div>
            <div class="value">{{ item.originalValue - item.newestDepreciationValue }}元</div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">存放地点：</div>
            <div class="value">{{ item.address }}</div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">使用年限：</div>
            <div class="value">{{ item.useYear }}</div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">管护人：</div>
            <div class="value">
              {{ item.owner || '--' }}
            </div>
          </div>
          <div class="con-item d-f ai-c jc-sb">
            <div class="key">附件：</div>
            <div class="value attachment" @click="handleJumpRoute('attachment', 'packageThreeCapital', item.assetsId)">
              查看附件
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data-wrapper" v-if="newRenderData.length === 0">
      <ComponentNoData tip="暂无数据" v-if="isRequestOver"></ComponentNoData>
    </div>
    <div class="button-wrapper" v-if="isExceedLimit">
      <ComponentLoadMore
        :isOver="isLoadOver"
        height="76rpx"
        name="加载更多"
        type="primary"
        @click="handleClickLoadMore"></ComponentLoadMore>
    </div>
    <div class="footer">以上数据来自于宜宾市农业农村局</div>
  </div>
</template>
<script>
  import { navigateTo } from '@/utils/uni-api'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  export default {
    name: 'Property',
    components: {
      ComponentNoData,
      ComponentLoadMore
    },
    props: {
      renderData: {
        type: Array,
        required: true
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
        default: true
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
    data() {
      return {
        // isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
        // isLoadOver: true, // 数据是否加载完成
        // isExceedLimit: false, // 数据是否超出 pageLmit 大小

        newRenderData: []
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {},
    methods: {
      handleExpand(index) {
        this.newRenderData[index].show = !this.newRenderData[index].show
      },
      handleJumpRoute(pageName, packageName, id) {
        if (id) {
          navigateTo(pageName, packageName, { assetsId: id })
        }
      },
      // 加载更多
      handleClickLoadMore() {
        this.$emit('loadMore')
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
    border-radius: 8rpx;
    padding: $spacing;
    padding-top: 0;
    .result-title {
      width: 100%;
      padding: $spacing;
      background-color: #fff;
      box-shadow: $box-shadow-base;
      .img {
        width: 32rpx;
        height: 24rpx;
        background: url('./images/bankCard.png') no-repeat center;
        background-size: cover;
        flex-shrink: 0;
      }
      .text {
        line-height: 24rpx;
        margin-left: 16rpx;
        font-size: 28rpx;
        font-weight: bold;
      }
    }
    .item {
      box-shadow: $box-shadow-base;
      padding: $spacing;
      .top {
        padding: 30rpx 0;
        .expanded {
          transform: rotate(90deg);
        }
        .title {
          font-size: 32rpx;
          font-weight: 700;
        }
        .expand {
          color: rgba(161, 167, 179, 1);
        }
      }
      .con {
        width: 100%;
        margin-top: $spacing;
        background-color: #fff;
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
    }

    .footer {
      width: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 24rpx;
      line-height: 1;
      color: #c8c9cc;
    }
  }
</style>
