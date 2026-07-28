<template>
  <div class="card-item">
    <div class="name">
      <div class="iconimg iconimg-subsidy"></div>
      <div class="name-text">{{ renderData.aac003 }}</div>
      <div
        v-if="renderData.aka131Desc"
        class="tag"
        :class="[renderData.aka131 == '01' ? 'tag-01' : '']"
      >
        {{ renderData.aka131Desc }}
      </div>
    </div>
    <div class="cell-wrapper">
      <div class="cell">
        <div class="key">登记时间</div>
        <div class="value">{{ renderData.handleTime }}</div>
      </div>
      <div class="cell">
        <div class="key">单位名称</div>
        <div class="value">{{ renderData.visitplace }}</div>
      </div>
      <div class="cell">
        <div class="key">来访内容</div>
        <div class="value">{{ renderData.content }}</div>
      </div>
      <div class="cell">
        <div class="key">访客来自地点</div>
        <div class="value">
          {{ renderData.place }}
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <button @click="handleViewDetail">查看详情>></button>
    </div>
  </div>
</template>
<script>
import { navigateTo } from '@/utils/uni-api'
export default {
  name: 'pageEPRcardItem',
  props: {
    // 渲染信息
    renderData: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {}
  },

  mounted() {},
  methods: {
    handleViewDetail() {
      const { id } = this.renderData
      navigateTo('epidemic-prevention-details', 'packageScan', { id })
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.card-item {
  background-color: #fff;
  box-shadow: $box-shadow-base;
  padding: 0 $spacing;
  font-size: 28rpx;
  color: $color;
  border-radius: 8rpx;
  font-weight: 500;
  .name {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    line-height: 1.4;
    font-weight: 700;
    border-bottom: 1px solid $border-color;
    .name-text {
      flex: 1;
      overflow: hidden;
      padding-left: 12rpx;
    }
    .tag {
      margin-left: 20rpx;
      font-size: 24rpx;
      padding: 6rpx 16rpx;
      background-color: rgba(126, 212, 135, 0.05);
      border: 1px solid #7ed487;
      color: #7ed487;
      border-radius: 4rpx;
      font-weight: 400;
      line-height: 1;
      &.tag-01 {
        background-color: rgba(255, 193, 139, 0.05);
        border-color: #ffc18b;
        color: #ffc18b;
      }
    }
  }
  .cell-wrapper {
    padding: 20rpx 0;
  }
  .cell {
    display: flex;
    line-height: 1.4;
    font-size: 28rpx;
    padding: 10rpx 0;
    .key {
      color: $color-placeholder;
    }
    .value {
      flex: 1;
      text-align: right;
      overflow: hidden;
      margin-left: 30rpx;
    }
    &:last-child {
      padding-bottom: 0;
    }
  }
  .button-wrapper {
    button {
      background-color: transparent;
      font-size: 32rpx;
      font-weight: 400;
      line-height: 46rpx;
      color: $primary;
      padding: 24rpx 0 30rpx;
    }
  }
}
</style>
