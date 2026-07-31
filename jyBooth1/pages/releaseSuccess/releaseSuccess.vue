<template>
  <view class="release-box">
    <unit-preview :releaseSuc="true"></unit-preview>
  </view>
</template>

<script>
import unitPreview from '../unitMessage/component/unitPreview.vue'
export default {
  components: {
    unitPreview,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.release-box {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
