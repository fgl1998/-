<template>
  <view class="ez-popup-notice">
    <ComponentPopup type="center" ref="popup_notice">
      <!-- 泸州 -->
      <Content510300 v-if="areaCode === '510300'"></Content510300>
      <!-- 自贡 -->
      <Content510500 v-if="areaCode === '510500'"></Content510500>
    </ComponentPopup>
  </view>
</template>

<script>
  /**
   * @description 停机公告
   */

  import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'
  import Content510300 from './Content-510300.vue'
  import Content510500 from './Content-510500.vue'

  import config from '@/config'

  const { areaCode, isShowShutDownTips } = config

  export default {
    name: 'ezPopupNotice',
    props: {},
    components: {
      ComponentPopup,
      Content510300,
      Content510500
    },
    data() {
      return {
        areaCode
      }
    },
    created() {},
    mounted() {
      if (isShowShutDownTips) {
        this.openPopup()
      }
    },
    methods: {
      // 打开弹窗
      openPopup() {
        this.$refs['popup_notice'].open()
      },
      // 关闭弹窗
      closePopup() {
        this.$refs['popup_notice'].close()
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
