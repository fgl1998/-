<template>
  <div
    class="query-result"
    :class="[isLoadOver && !isMultiplePages ? 'over' : '']"
  >
    <block v-if="renderList.length > 0">
      <div
        class="card"
        :class="[index == renderList.length - 1 ? 'last' : '']"
        v-for="(item, index) in renderList"
        :key="item.id"
      >
        <CardItem :renderData="item"></CardItem>
      </div>
    </block>
    <block v-else>
      <ComponentNoData
        v-if="isRequestOver"
        tip="未查询到相关数据"
      ></ComponentNoData>
    </block>
    <div class="load-more-wrapper" v-if="isMultiplePages">
      <ComponentLoadMore
        :isOver="isLoadOver"
        @click="handleClickLoadMore"
        bgc="transparent"
      ></ComponentLoadMore>
    </div>
  </div>
</template>
<script>
import CardItem from './CardItem.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

export default {
  name: 'pageEPRQueryResult',
  props: {
    renderList: {
      type: [Array],
      required: true,
    },
    isRequestOver: {
      type: [Boolean],
      required: true,
    },
    isLoadOver: {
      type: [Boolean],
      required: true,
    },
    isMultiplePages: {
      type: [Boolean],
      required: true,
    },
  },
  data() {
    return {}
  },
  components: {
    CardItem,
    ComponentNoData,
    ComponentLoadMore,
  },
  mounted() {},
  methods: {
    // 点击加载更多
    handleClickLoadMore() {
      this.$emit('loadMore')
    },
  },
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
.query-result {
  width: 100%;
  margin-top: $spacing;
  .card {
    margin-bottom: $spacing;
    &.last {
      margin-bottom: 0;
    }
  }
  &.over {
    padding-bottom: $spacing;
  }
}
</style>
