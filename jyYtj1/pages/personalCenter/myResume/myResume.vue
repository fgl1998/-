<template>
  <div class="page">
    <!-- 我的简历 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="resume-wrap">
          <div class="wrap-title">
            <div class="title-lt">
              <div class="name">
                <span>我的</span>
                <label>简历</label>
              </div>
              <div class="decr">/点击右侧按钮，可对简历进行编辑</div>
            </div>
            <div class="title-rt">
              <div class="resume-schedule">
                <button type="primary" class="btn" @click="fnEdit">编辑简历</button>
              </div>
              <div class="navigation">
                <i class="ic ic-home-blue"></i>
                <label>首页 > 个人中心 > 我的简历</label>
              </div>
            </div>
          </div>

          <div class="resume-box">
            <div class="resume-lt">
              <div class="resume-nav">
                <div
                  :class="['nav-item', navCur === index ? 'active' : '']"
                  v-for="(item, index) in resumeNav"
                  :key="index"
                  @click="navChange(index, item)"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
            <div class="resume-rt">
              <scroll-view :style="{ height: '100%' }" scroll-y :scrollIntoView="navViewId">
                <div class="resume-group">
                  <!-- 基本信息 -->
                  <div id="baseInfo">
                    <base-info ref="baseInfo" :resumeBase="resumeInfo.baseInfo"></base-info>
                  </div>

                  <!-- 求职意向 -->
                  <div id="jobIntention">
                    <job-intention ref="jobIntention" :jobIntent="resumeInfo.jobIntent"></job-intention>
                  </div>

                  <!-- 工作经历 -->
                  <div id="workExper">
                    <work-exper ref="workExper" :cc25List="resumeInfo.workExperience"></work-exper>
                  </div>

                  <!-- 教育背景 -->
                  <div id="education">
                    <education ref="education" :cc26List="resumeInfo.eduExperience"></education>
                  </div>
                  <!-- 项目经历 -->
                  <div id="projectExper">
                    <project-exper ref="projectExper" :cc28List="resumeInfo.projectExperience"></project-exper>
                  </div>
				  <!-- 培训经历 -->
				  <div id="train">
					  <train ref="train" :cc28List="resumeInfo.trainExperience"></train>
				  </div>
				  <!-- 语言 -->
                  <div id="language">
                    <language ref="language" :cc25List="resumeInfo.language"></language>
                  </div>
				  <!-- 证书 -->
				  <div id="myCertificate">
					  <my-certificate ref="myCertificate" :cc25List="resumeInfo.certificate"></my-certificate>
				  </div>
				  <!-- 自我评价 -->
                  <div class="group-item" id="evaluate">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>自我评价</span>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="group-text" v-if="resumeInfo.baseInfo && resumeInfo.baseInfo.acc209">
                        {{ resumeInfo.baseInfo.acc209 }}
                      </div>
                      <div class="none-box" v-else>
                        <div class="none-img">
                          <image :src="baseImgSrc + '/ic_no_data.png'" mode="scaleToFill" />
                        </div>
                        <div class="none-text">暂时没有录入数据~</div>
                      </div>
                    </div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>

    <common-modal-check ref="checkPopup" :tipInfo="titleTip" @triggerClick="triggerClick"></common-modal-check>
  </div>
</template>

<script>
import baseInfo from './resumeInfo/baseInfo'
import jobIntention from './resumeInfo/jobIntention'
import workExper from './resumeInfo/workExper'
import education from './resumeInfo/education'
import projectExper from './resumeInfo/projectExper'
import language from './resumeInfo/language1'
import train from './resumeInfo/train.vue'
import myCertificate from './resumeInfo/myCertificate.vue'

export default {
  components: {
    baseInfo,
    jobIntention,
    workExper,
    education,
    projectExper,
    language,
	train,
	myCertificate,
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      isLogin: false,
      userInfo: {},

      navViewId: 'baseInfo',
      navCur: 0,
      resumeNav: [
        {
          name: '基本信息',
          id: 'baseInfo',
        },
        {
          name: '求职意向',
          id: 'jobIntention',
        },
        {
          name: '工作经历',
          id: 'workExper',
        },
        {
          name: '教育背景',
          id: 'education',
        },
        {
          name: '项目经验',
          id: 'projectExper',
        },
		{
		  name: '培训经历',
		  id: 'train',
		},
        {
          name: '语言能力',
          id: 'language',
        },
		{
		  name: '我的证书',
		  id: 'myCertificate',
		},
        {
          name: '自我评价',
          id: 'evaluate',
        },
      ],

      resumeInfo: {},
      titleTip: '尚未创建个人简历信息,是否创建个人简历信息?',
    }
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
      this.init()
    }
  },
  methods: {
    init() {
      const url = '/api/business/invoke'
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm119',
      }
      this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        // this.resumeInfo = res.resumeMap
        // if (this.resumeInfo && this.resumeInfo.baseInfo && !this.resumeInfo.baseInfo.acc200) {
        //   this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
        //   return
        // }
        if (res.message == '尚未创建个人简历信息') {
          this.$refs.checkPopup.open()
        } else {
          this.resumeInfo = res.resumeMap
        }
      })
    },
    navChange(index, item) {
      this.navCur = index
      this.navViewId = item.id
    },
    triggerClick() {
      this.$utils.navigateTo('/pages/personalCenter/resumeEdit/resumeEdit')
    },
    //编辑
    fnEdit() {
      this.$utils.navigateTo(
        '/pages/personalCenter/resumeEdit/resumeEdit?item=' + this.resumeInfo.baseInfo.acc200
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
@import '~@/static/scss/resume.scss';
</style>
