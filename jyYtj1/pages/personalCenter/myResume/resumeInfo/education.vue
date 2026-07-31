<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>教育背景</span>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">学校名称</div>
          <div class="group-th">所学专业</div>
          <div class="group-th">学历</div>
          <div class="group-th">入学时间</div>
          <div class="group-th">毕业时间</div>
        </div>
        <div class="group-body" v-if="cc26List.length > 0">
          <div class="group-tr" v-for="(item, index) in cc26List" :key="index">
            <div class="group-td">{{ item.acc261 }}</div>
            <div class="group-td">{{ item.acc262Desc?item.acc262Desc:$utils.queryCodeDesc('aac183', item.acc262) }}</div>
            <div class="group-td">{{ $utils.queryCodeDesc('aac011', item.aac011) }}</div>
            <div class="group-td">{{ $utils.dateFormat(item.aae030) }}</div>
            <div class="group-td">{{ $utils.dateFormat(item.aae031) }}</div>
          </div>
        </div>
        <div class="group-none" v-else>
          <div class="none-box">
            <div class="none-img">
              <image :src="baseImgSrc + '/ic_no_data.png'" mode="scaleToFill" />
            </div>
            <div class="none-text">暂时没有录入数据~</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'education',
  props: {
    cc26List: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/resume.scss';
</style>
