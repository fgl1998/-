<template>
  <view class="web-view h5-page">
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        // 最终显示在web-view中的路径
        url: ''
      }
    },
    onLoad(e) {
      const { url } = e
      this.url = url
    },
    methods: {}
  }
</script>

<style lang="scss" scoped></style>
