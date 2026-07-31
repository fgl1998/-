<template>
  <div class="page-all">
    <policy-services-sidebar
      :title="sidebarTitle"
      :description="sidebarDescription"
      :activeIndex="itemIndex"
      :menuList="menuList"
      @change="handleTypeChange"
    ></policy-services-sidebar>
    <policy-services-list-panel
      :title1="title1"
      :title2="title2"
      :columnList="columnList"
      @item-click="handleItemClick"
    ></policy-services-list-panel>
  </div>
</template>

<script>
import PolicyServicesSidebar from './part/PolicyServicesSidebar.vue'
import PolicyServicesListPanel from './part/PolicyServicesListPanel.vue'

export default {
  name: 'PolicyServicesSection',
  components: {
    PolicyServicesSidebar,
    PolicyServicesListPanel,
  },
  props: {
    /**
     * 左侧主标题
     * @values 任意字符串
     */
    sidebarTitle: {
      type: String,
      default: '政策资讯',
    },
    /**
     * 左侧说明文案
     * @values 任意字符串
     */
    sidebarDescription: {
      type: String,
      default: '聚焦政策，把握机遇，圆梦就业',
    },
    /**
     * 当前激活的菜单值
     * @values String | Number
     */
    itemIndex: {
      type: [String, Number],
      default: 1,
    },
    /**
     * 右侧标题第一段文字
     * @values 任意字符串
     */
    title1: {
      type: String,
      default: '就业',
    },
    /**
     * 右侧标题第二段文字
     * @values 任意字符串
     */
    title2: {
      type: String,
      default: '资讯',
    },
    /**
     * 右侧列表数据
     * @values [{ acz02q: 标题, acc645: 时间, isHot: 热点标识 }]
     */
    columnList: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 左侧菜单数据
     * @values [{ value: 菜单值, label: 菜单名称, icon: 图标地址 }]
     */
    menuList: {
      type: Array,
      default() {
        return [
          {
            value: 1,
            label: '就业资讯',
            icon: require('./assets/icon_policy1.png'),
          },
          {
            value: 2,
            label: '政策解读',
            icon: require('./assets/icon_policy2.png'),
          },
        ]
      },
    },
  },
  methods: {
    /**
     * 左侧菜单切换事件
     * @values emit('type-change', value)
     */
    handleTypeChange(value) {
      this.$emit('type-change', value)
    },
    /**
     * 右侧列表点击事件
     * @values emit('item-click', item)
     */
    handleItemClick(item) {
      this.$emit('item-click', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.page-all {
  width: 100%;
  max-width: 1760px;
  margin: 0 auto 40px auto;
  display: flex;
}
</style>
