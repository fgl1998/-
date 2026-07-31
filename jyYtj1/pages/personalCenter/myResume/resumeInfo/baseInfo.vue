<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>基本信息</span>
      </div>
    </div>
    <div class="group-con">
      <uni-row class="uni-row table-horizontal">
        <uni-col :span="20" class="clo-tr">
          <uni-col :span="24" class="clo-td no-top">
            <div class="form-item">
              <div class="form-label">姓名</div>
              <div class="form-value">{{ baseInfo.aac003 || '待完善' }}</div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">身份证号</div>
              <div class="form-value">{{ baseInfo.aac002 ? $utils.idHide(baseInfo.aac002) : '待完善' }}</div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">性别</div>
              <div class="form-value">
                {{ baseInfo.aac004 ? $utils.queryCodeDesc('aac004', baseInfo.aac004) : '待完善' }}
              </div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">出生日期</div>
              <div class="form-value">{{ baseInfo.aac006 ? formataac006(baseInfo.aac006) : '' || '待完善' }}</div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">最高学历</div>
              <div class="form-value">{{ baseInfo.aac011Desc || '待完善' }}</div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">联系方式</div>
              <div class="form-value">{{ baseInfo.aae005 || '待完善' }}</div>
            </div>
          </uni-col>
          <uni-col :span="12" class="clo-td">
            <div class="form-item">
              <div class="form-label">常住地址</div>
              <div class="form-value">{{ baseInfo.aae006 || '待完善' }}</div>
            </div>
          </uni-col>
        </uni-col>
        <uni-col :span="4" class="clo-td no-top left">
          <div class="form-head">
            <image class="head" :src="baseInfo.imgUrl" mode="scaleToFill" />
          </div>
        </uni-col>
      </uni-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import imgMan from '../../../../static/images/resume/resume_man.png'
import imgWoman from '../../../../static/images/resume/resume_woman.png'
export default {
  name: 'baseInfo',
  props: {
    // 数据
    resumeBase: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      downLoadImgSrc: this.$downLoadImgSrc,
      baseInfo: {},
      imgMan,
      imgWoman,
    }
  },
  watch: {
    resumeBase: {
      handler(newVal, oldVal) {
        let userInfo = uni.getStorageSync('userInfo').customMap
        this.baseInfo = {
          ...userInfo,
          ...newVal,
          aac002: userInfo.aac147,
        }
        this.init()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    init() {
      if (this.baseInfo.aae707) {
        this.baseInfo.imgUrl = this.downLoadImgSrc + this.baseInfo.aae707
      } else {
        if (this.baseInfo.aac004 === '1') {
          this.baseInfo.imgUrl = this.baseImgSrc + '/resume/resume_man.png'
        } else {
          this.baseInfo.imgUrl = this.baseImgSrc + '/resume/resume_woman.png'
        }
        if (!this.baseInfo.aac004) {
          this.baseInfo.imgUrl = ''
        }
      }
    },
    handleImageError(e) {
      console.log(e)
      if (this.baseInfo.aac004 === '1') {
        e.target.src = imgMan
      } else {
        e.target.src = imgWoman
      }
    },
    formataac006(val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD')
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/resume.scss';

.form-head {
  height: 168px;
  box-sizing: border-box;
  padding: 10px 16px;
  @include s-flex(center);

  .head {
    width: 112px;
    height: 144px;
  }
}
</style>
