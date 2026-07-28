<template>
  <div class="issue-list">
    <div class="title">
      <div class="con d-f ai-c">
        <span class="text1">发放中项目</span>
        <span class="text2">（{{ renderData.length }}个）</span>
      </div>
    </div>
    <div class="con">
      <div v-if="renderData.length > 0">
        <div class="item d-f ai-c jc-sb" v-for="(item, index) in renderData" :key="index">
          <div class="left d-f ai-c jc-sb">
            <div class="img"></div>
            <div class="text">{{ item.chi031 }}</div>
          </div>
          <div class="right">
            <div class="btn" @click="handleViewProcess(index)">发放流程</div>
          </div>
        </div>
      </div>
      <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
    </div>
  </div>
</template>

<script>
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

import { navigateTo } from '@/utils/uni-api'

export default {
  name: 'pageIssueList',
  components: { ComponentNoData },
  props: {
    renderData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {}
  },

  mounted() {},

  methods: {
    // 发放进度
    handleViewProcess(index) {
      const data = this.renderData[index]
      const { chb010, chi031 } = data
      navigateTo('process', 'packageDeclare', { chb010, chi031_desc: chi031 })
    },
  },
}
</script>

<style lang="scss" scoped>
.issue-list {
  margin-top: 52rpx;
  border-radius: 24rpx;
  background-color: #fff;
  padding: 28rpx;
  .title {
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
    margin-bottom: 16rpx;
    .con {
      position: relative;
      .text1 {
        font-size: 36rpx;
        font-weight: 500;
        padding-left: 18rpx;
        // line-height: 36rpx;
      }
      .text2 {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        margin-left: 14rpx;
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
  }
  .con {
    .item {
      border-radius: 12rpx;
      padding: 30rpx;
      margin-bottom: 26rpx;
      background: rgba(247, 250, 255, 1);
      border: 0rpx solid rgba(242, 242, 242, 1);
      .img {
        width: 36rpx;
        height: 30rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAA8BAMAAAA3cOGjAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAeUExURUdwTB90/CF0/h50+x90+x50+x50+x5z+iuA/x5z+ojSGzkAAAAJdFJOUwBhLuuoh83gBpKXmxsAAAB6SURBVEjHY2AY7oDJeSZOYKIAVRQ5Ew+YClHDOBMvEAArasevqAKsSBK/oolgRZ74FU0BK8rEr2gaWJElfkWTwYpmEgCjimZSOWGOBiYJivAE2YApGgkhjlXPgCmiXxBU4lcznfgiWhO/oknE1y0Mqsm4lZgFDfuaHABQpz3cNuomTAAAAABJRU5ErkJggg==);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        margin-right: 20rpx;
        flex-shrink: 0;
      }
      .text {
        font-size: 28rpx;
        font-weight: 700;
        color: rgba(51, 51, 51, 1);
        width: 320rpx;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 这里是超出几行省略 */
        overflow: hidden;
        line-height: 40rpx;
      }
      .btn {
        width: 152rpx;
        height: 64rpx;
        border-radius: 32rpx;
        background: rgba(69, 158, 250, 1);
        font-size: 28rpx;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 64rpx;
        text-align: center;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
