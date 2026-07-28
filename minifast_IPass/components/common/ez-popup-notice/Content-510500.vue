<template>
  <div class="popup-content">
    <div class="iconfont iconfont-close" @click="closePopup"></div>

    <div class="name">泸州市人力资源和社会保障局</div>
    <div class="name">关于惠民惠农“一卡通”平台第一次国产化改造升级停机公告</div>
    <div class="content">
      为全面落实计算机系统国产化相关要求，确保泸州市惠民惠农“一卡通”平台数据安全，按照工作安排，我局将于5月下旬对泸州市惠民惠农“一卡通”平台进行第一次国产化改造升级，现将有关事宜通知如下。
    </div>
    <div class="content">
      停机时间：2024年5月31日（星期五）18时至6月2日（星期天）24时。停机期间“一卡通”阳光审批系统、“一卡通”发放系统、“一卡通”公共服务网、“一卡通”微信小程序将无法使用。
    </div>
    <div class="content">
      请业务管理部门、广大群众合理安排业务办理时间，并请相互转告，由此带来的不便，敬请谅解。如有疑问，请致电0830-2987178咨询。
    </div>
    <div class="desc">特此公告</div>
    <div class="unit">泸州市人力资源和社会保障局</div>
    <div class="time">2024年5月27日</div>
  </div>
</template>

<script>
  /**
   * 泸州停机公告
   */
  export default {
    name: 'ezPopupNoticeContent510500',
    props: {},
    components: {},
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      closePopup() {
        this.$parent.close()
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped>
  @import url(./style.scss);
  .popup-content {
    position: relative;
    .iconfont-close {
      font-size: 38rpx;
      position: absolute;
      right: 15rpx;
      top: 15rpx;
    }
  }
</style>
