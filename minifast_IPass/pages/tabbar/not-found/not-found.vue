<template>
  <view class="not-found h5-page page-wrapper">
    <ComponentNotFound type="building-02"></ComponentNotFound>
    <ComponentPopupNotice></ComponentPopupNotice>
  </view>
</template>

<script>
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentNotFound from '@/components/common/ez-not-found/ez-not-found.vue'
  export default {
    name: 'pageNotFound',
    components: {
      ComponentNotFound,
      ComponentPopupNotice
    },
    data() {
      return {
        name: ''
      }
    },
    onLoad(e) {},
    onReady() {},
    onShow() {},
    onHide() {},
    methods: {},
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
