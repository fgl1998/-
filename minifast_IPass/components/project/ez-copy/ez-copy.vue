<template>
  <view class="ez-card-intro-wrapper"> ez-card-intro-wrapper</view>
</template>

<script>
/**
 * Input 输入框
 * @description input输入框组件
 */
export default {
  name: 'yhCardIntro',
  props: {
    disabled: {
      type: [Boolean],
      default: false,
    },
  },
  components: {
    // yhButtonZdy
  },
  data() {
    return {}
  },
  created() {},
  mounted() {
    // console.log(this.$scopedSlots.prefix)
  },
  methods: {},
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.ez-card-intro-wrapper {
  width: 100%;
}
</style>
