<template>
  <div class="declare-list">
    <div class="title">
      <div class="con d-f ai-c">
        <span class="text1">申报中项目</span>
        <span class="text2">（{{ renderData.length }}个）</span>
      </div>
    </div>

    <div class="content">
      <div class="items" v-if="renderData.length > 0">
        <block v-for="item in renderData" :key="item.id">
          <ComponentSubsidyReview :renderData="item" declareType="01"></ComponentSubsidyReview>
        </block>
      </div>
      <ComponentNoData tip="未查询到相关数据" v-else></ComponentNoData>
    </div>
  </div>
</template>

<script>
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentSubsidyReview from '@/components/project/ez-subsidy-review/ez-subsidy-review.vue'

export default {
  name: 'pageDeclareList',
  components: {
    ComponentNoData,
    ComponentSubsidyReview,
  },
  props: {
    renderData: {
      type: Array,
      rquired: true,
    },
  },

  data() {
    return {
      declareProjectData: [
        {
          aae036: '2023-08-03',
          chi031Desc: ' 县级对义务教育经济困难寄宿生补助生活费',
          strStatus: '0',
          cpb100: '1212',
          id: '1',
        },
        {
          aae036: '2023-08-03',
          chi031Desc: ' 县级对义务教育经济困难寄宿生补助生活费',
          strStatus: '0',
          cpb100: '1212',
          id: '2',
        },
      ],
    }
  },

  mounted() {},

  methods: {},
  computed: {
    declareProjectButtonText() {
      let str = ''
      const declareProjectData = this.declareProjectData
      const len = declareProjectData.length
      if (len > 0) {
        str = '查看更多'
      }
      return str
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-list {
  margin-top: 52rpx;
  border-radius: 24rpx;
  background-color: #fff;
  padding: 28rpx;
  .title {
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
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
}
</style>
