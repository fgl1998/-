<template>
  <!-- 查询页面专用公共布局 -->
  <view class="query-layout">
    <!-- 查询页面 专属导航栏（你要的：返回+标题，不空白，完美靠左） -->
    <van-nav-bar
        left-arrow
        left-text="返回"
        @click-left="navigateBack"
        class="nav-bar"
    />
    <!-- 页面内容插槽 -->
    <view class="content">
      <slot/>
    </view>
  </view>
</template>

<script>
export default {
  name: "QueryLayout",
  props: {
    beforePrevious: {
      type: Function,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    async navigateBack() {
      if (this.beforePrevious) {
        const pass = await this.beforePrevious()
        if (pass === false) return
      }
      uni.navigateBack();
    }
  },
};
</script>

<style scoped lang="less">
.query-layout {
  background: #F5F5F5;
  height: 100%;
  overflow: scroll;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: unset;
}

.nav-bar ::v-deep .van-nav-bar__left {
  margin-left: 24rpx;
  padding-left: 0;
}

.content{
  padding: 0 24rpx;
  flex: 1;
}

/deep/ .van-icon {
  color: #4788FE;
}

/deep/ .van-nav-bar__text {
  color: #4788FE;
  font-weight: 500;
}

</style>
