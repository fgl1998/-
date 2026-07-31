<!--
    空提示组件
    isShow 是否显示该组件
    tip 文字描述
 -->
<template>
  <!-- 单位端底部导航栏 -->
  <view v-if="isShow" class="none-box">
    <image :src="'/static/images/none-data.png'" mode="widthFix"></image>
    <view class="none-data">
      {{ tip }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'yt-none',
  data() {
    return {
      //imgBase: this.$baseImgSrc
    }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: '~空空如也~'
    }
  },
  components: {},
  methods: {}
}
</script>

<style>
.none-box {
  /* height: 80px; */
  padding: 24px;
  text-align: center;
  margin-top: 150px;
}

.none-box > image {
  width: 240px;
  height: 120px;
}

.none-data {
  color: #666666;
  font-size: 30px;
  letter-spacing: 4px;
  line-height: 70px;
}
</style>
