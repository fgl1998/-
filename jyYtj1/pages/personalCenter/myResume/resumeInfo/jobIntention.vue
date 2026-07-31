<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>求职意向</span>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">意愿岗位</div>
          <div class="group-th">薪资范围</div>
          <div class="group-th">工作方式</div>
          <div class="group-th">工作地点</div>
        </div>
        <div class="group-body" v-if="jobIntentInfo.length > 0">
          <div class="group-tr" v-for="(item, index) in jobIntentInfo" :key="index">
            <div class="group-td">{{ item.aca112 }}</div>
            <div class="group-td">
              <label class="text-red" v-if="item.acb21h && item.acb21j">{{ item.acb21h }}~{{ item.acb21j }}元</label>
              <label class="text-red" v-else-if="item.acb21h">{{ item.acb21h }}元</label>
              <label class="text-red" v-else-if="item.acb21j">{{ item.acb21j }}元</label>
              <!-- <label class="text-red" v-else-if="item.acb241">{{ item.acb241 }}元</label>
              <label class="text-red" v-else-if="item.acb242">{{ item.acb242 }}元</label> -->
              <!-- <label class="text-red" v-else>{{ item.acc034Desc }}</label> -->
            </div>
            <div class="group-td">{{ $utils.queryCodeDesc('acb469', item.acb469) }}</div>
            <div class="group-td">{{ item.acb202 }}</div>
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
  name: 'jobIntention',
  props: {
    // 数据
    jobIntent: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      jobIntentInfo: [],
    }
  },
  watch: {
    jobIntent: {
      handler(newVal, oldVal) {
        this.jobIntentInfo = newVal
        this.init()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    init() {
      this.jobIntentInfo = this.jobIntentInfo.map((item) => {
        if (item.acb241) {
          item.acb241 = parseInt(item.acb241)
        }

        if (item.acb242) {
          item.acb242 = parseInt(item.acb242)
        }
        return item
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/resume.scss';
</style>
<label class="text-red" v-if="item.acb241 && item.acb242">{{item.acb241}}~{{item.acb242}}元</label>
