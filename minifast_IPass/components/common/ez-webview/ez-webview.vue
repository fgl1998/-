<template>
  <view class="ez-webview-wrapper">
    <web-view
      class="web-view"
      :webview-styles="webviewStyles"
      :src="src"
    ></web-view>
  </view>
</template>

<script>
/**
 * webview
 * @description webview
 */
export default {
  name: 'yhWebview',
  props: {
    src: {
      type: [String],
      default: '',
    },
  },
  components: {},
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333',
        },
      },
    }
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
view,
web-view {
  box-sizing: border-box;
  box-sizing: -webkit-border-box;
}
.ez-webview-wrapper {
  width: 100%;
  min-height: 100%;
  min-height: 100vh;
  .web-view {
    width: 100%;
    height: 100%;
  }
}
</style>
