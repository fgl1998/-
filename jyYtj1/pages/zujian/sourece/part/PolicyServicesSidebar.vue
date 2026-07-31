<template>
  <div class="page-left">
    <div class="left-title">{{ title }}</div>
    <div class="left-text">{{ description }}</div>
    <button
      v-for="item in menuList"
      :key="item.value"
      type="button"
      :class="{ leftItem: true, leftItemActive: activeIndex == item.value }"
      :aria-pressed="String(activeIndex == item.value)"
      @click="handleClick(item.value)"
    >
      <img :src="item.icon" class="icon_policy" alt="" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PolicyServicesSidebar',
  props: {
    /**
     * 左侧主标题
     * @values 任意字符串
     */
    title: {
      type: String,
      default: '政策资讯',
    },
    /**
     * 左侧说明文案
     * @values 任意字符串
     */
    description: {
      type: String,
      default: '聚焦政策，把握机遇，圆梦就业',
    },
    /**
     * 当前激活的菜单值
     * @values String | Number
     */
    activeIndex: {
      type: [String, Number],
      default: 1,
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
            icon: require('../assets/icon_policy1.png'),
          },
          {
            value: 2,
            label: '政策解读',
            icon: require('../assets/icon_policy2.png'),
          },
        ]
      },
    },
  },
  methods: {
    /**
     * 左侧菜单点击事件
     * @values emit('change', value)
     */
    handleClick(value) {
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.page-left {
  flex: 0 0 340px;
  width: 340px;
  height: 760px;
  background: url('../assets/bg_pageLeft.png') right center no-repeat;
  background-size: cover;
  text-align: center;

  .left-title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 36px;
    line-height: 42px;
    letter-spacing: 5px;
    text-shadow: 0px 4px 4px rgba(7, 84, 232, 0.5);
    color: #ffffff;
    padding-top: 67px;
    margin-bottom: 12px;
  }

  .left-text {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 90px;
  }

  .leftItem {
    appearance: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    width: 240px;
    height: 64px;
    border-radius: 40px;
    margin: 30px auto;
    transition: all 0.3s linear;
    background: rgba(3, 32, 182, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;

    > span {
      display: inline-block;
      height: 40px;
      line-height: 32px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 24px;
      color: #ffffff;
      margin-left: 16px;
    }

    .icon_policy {
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
  }

  .leftItemActive {
    background: #efa10f;
    box-shadow: 0px 8px 12px 0px rgba(3, 102, 202, 0.4);
  }

  .leftItem:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 4px;
  }
}
</style>
