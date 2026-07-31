<template>
  <div class="page">
    <!-- 简历修改 -->
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
              <!-- <div class="resume-switch">
                <label>是否公开</label>
                <i :class="['ic', isOpen ? 'ic-switch' : 'ic-un-switch']" @click="switchChange"></i>
              </div> -->
              <div class="resume-schedule">
                <div class="progress">
                  <div>简历完成度：</div>
                  <div>{{ values }}%</div>
                  <div class="progressLine">
                    <div :style="{ width: values + '%' }"></div>
                  </div>
                </div>
                <!--                <button type="primary" class="btn" @click="fnSave">保存简历</button> -->
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

                  <!-- 求职意向 4-->
                  <div id="jobIntention">
                    <job-intention
                      ref="jobIntention"
                      :acc200="resumeInfo.baseInfo.acc200"
                      @delCcList="delCcList"
                      :jobIntent="cc27List"
                      :userInfo="userInfo"
                      @refresh="refresh"
                    ></job-intention>
                  </div>

                  <!-- 工作经历 2-->
                  <div id="workExper">
                    <work-exper
                      ref="workExper"
                      :acc200="resumeInfo.baseInfo.acc200"
                      :userInfo="userInfo"
                      @delCcList="delCcList"
                      @refresh="refresh"
                      :workExperience="cc25List"
                    ></work-exper>
                  </div>

                  <!-- 教育背景 3-->
                  <div id="education">
                    <education
                      ref="education"
                      :acc200="resumeInfo.baseInfo.acc200"
                      :userInfo="userInfo"
                      @delCcList="delCcList"
                      @refresh="refresh"
                      :eduExperience="cc26List"
                    ></education>
                  </div>
                  <!-- 项目经验 5-->
                  <div id="projectExper">
                    <project-exper
                      ref="projectExper"
                      :acc200="resumeInfo.baseInfo.acc200"
                      :userInfo="userInfo"
                      @delCcList="delCcList"
                      @refresh="refresh"
                      :projectExperience="cc28List"
                    ></project-exper>
                  </div>
				  <!-- 培训经历 -->
				  <div id="train">
					  <train 
					  ref="train" 
					  :acc200="resumeInfo.baseInfo.acc200" 
					  :userInfo="userInfo"
					  @delCcList="delCcList"
					  @refresh="refresh"
					  :trainExperience="cc29List"></train>
				  </div>
                  <!-- 语言能力 1-->
                  <div id="language">
                    <language
                      ref="language"
                      :acc200="resumeInfo.baseInfo.acc200"
                      :userInfo="userInfo"
                      @delCcList="delCcList"
                      @refresh="refresh"
                      :langExperience="cc24List"
                    ></language>
                  </div>
				  <div id="myCertificate">
					  <myCertificate
					  ref="myCertificate"
					  :acc200="resumeInfo.baseInfo.acc200"
					  :userInfo="userInfo"
					  @delCcList="delCcList"
					  @refresh="refresh"
					  :certificateList="cc30List"
					  ></myCertificate>
				  </div>
                  <div class="group-item" id="evaluate">
                    <div class="group-title">
                      <div class="title-lt">
                        <i class="ic ic-resume-title"></i>
                        <span>自我评价</span>
                      </div>
                      <div class="title-rt">
                        <button type="primary" size="mini" @click="fnSave" plain>保存</button>
                      </div>
                    </div>
                    <div class="group-con">
                      <div class="form-value">
                        <uni-easyinput
                          type="text"
                          v-model="textareaValue"
                          :clearable="false"
                          placeholder="请输入自我评价"
                        />
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

    <common-modal-check
      ref="checkPopup"
      :tipInfo="titleTip"
      @triggerClick="triggerClick"
      @openCheckPopup="openCheckPopup"
    ></common-modal-check>

    <!--二维码弹出框-->
    <uni-popup ref="popup" type="center">
      <div class="code-box">
        <div class="code-title">
          <i class="ic ic-user-tip"></i>
          <p>请用微信<span>扫描二维码</span>关注小程序</p>
        </div>
        <div class="code-center">
          <div class="wx-code">
            <image :src="baseImgSrc + '/app_code.jpg'" mode="aspectFill" class="code-img"></image>
          </div>
        </div>
        <div class="code-btn">
          <button class="btn btn-gary" @click="closeWxCode">取消</button>
        </div>
      </div>
    </uni-popup>
  </div>
</template>

<script>
import baseInfo from './resumeInfo/baseInfo'
import jobIntention from './resumeInfo/jobIntention.vue'
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
      values: 15,
      userInfo: {}, //个人基本信息

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

      resumeInfo: {
        aac011: '', //最高学历
        acb215: '', // 工作地点
        ycb213: '', // 工作方式
        acc035: '', // 到岗时间
        baseInfo: {},
      }, //简历信息
      isEdit: false, //是否编辑
      isOpen: false, //是否公开

      cc24List: [], //语言能力
      cc25List: [], //工作经历
      cc26List: [], //教育经历
      cc27List: [], //求职意愿
      cc28List: [], //项目经历
	  cc29List: [], // 培训经历
	  cc30List: [], // 证书
      titleTip: '是否确定删除?',
      delFlag: '',
      delId: '',
      textareaValue: '',
    }
  },
  onLoad(option) {
    //用onLoad不加载
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
      if (option.item) {
        this.init()
      }
    }
  },
  methods: {
    refresh() {
      this.init()
    },
    // 查询简历完整度
    getResumeCompleteness(acc200) {
      let param = {
        acc200,
        method: 'jy202_hrm157',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        if (res && res.result) {
          this.values = res.result.rate
        } else {
          this.values = 0
        }
      })
    },
    // 查询个人简历信息
    init() {
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm119',
      }
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        let resumeInfo = res.resumeMap
        this.textareaValue = resumeInfo.baseInfo.acc209
        if (resumeInfo.baseInfo.acc202 == '1') {
          this.isOpen = true
        } else {
          this.isOpen = false
        }
        if (resumeInfo) {
          this.getResumeCompleteness(resumeInfo.baseInfo.acc200)
          this.resumeInfo = {
            ...resumeInfo,
          }
          //工作经历
          if (this.resumeInfo.workExperience && this.resumeInfo.workExperience.length > 0) {
            this.resumeInfo.workExperience.forEach((x) => {
              x.workDate = [x.aae030, x.aae031]
            })
            this.cc25List = this.resumeInfo.workExperience.map((item) => {
              return item
            })
          }
          // 教育经历
          if (this.resumeInfo.eduExperience && this.resumeInfo.eduExperience.length > 0) {
            this.resumeInfo.eduExperience.forEach((x) => {
              x.workDate = [x.aae030, x.aae031]
            })
            this.cc26List = this.resumeInfo.eduExperience
          }
          //cc27 培训  （改成工作意向）
          if (this.resumeInfo.jobIntent && this.resumeInfo.jobIntent.length > 0) {
            this.cc27List = this.resumeInfo.jobIntent.map((item) => {
              return item
            })
          }
          // 项目经验
          if (this.resumeInfo.projectExperience && this.resumeInfo.projectExperience.length > 0) {
            this.resumeInfo.projectExperience.forEach((x) => {
              x.workDate = [x.aae030, x.aae031]
            })
            this.cc28List = this.resumeInfo.projectExperience
          }
		  // 培训经历
		  if (this.resumeInfo.trainExperience && this.resumeInfo.trainExperience.length > 0) {
		    this.resumeInfo.trainExperience.forEach((x) => {
		      x.workDate = [x.aae030, x.aae031]
		    })
		    this.cc29List = this.resumeInfo.trainExperience
		  }
		  if(this.resumeInfo.certificate && this.resumeInfo.certificate.length > 0){
			  this.cc30List = this.resumeInfo.certificate
		  }
          if (this.resumeInfo.language && this.resumeInfo.language.length > 0) {
            this.cc24List = this.resumeInfo.language.map((item) => {
              return item
            })
          }
        }
      })
    },

    navChange(index, item) {
      this.navCur = index
      this.navViewId = item.id
    },

    //是否公开
    switchChange() {
      this.isOpen = !this.isOpen
      this.publish(this.isOpen)
    },

    //微信二维码
    openWxCode() {
      this.$refs.popup.open()
    },

    closeWxCode() {
      this.$refs.popup.close()
    },

    //保存自我评价
    fnSave() {
      // 开始保存
      if (this.textareaValue) {
        let param = {
          method: 'jy202_hrm137',
          aae400: '14',
          aac001: this.userInfo.aac001,
          acc200: this.resumeInfo.baseInfo.acc200,
          acb241: this.resumeInfo.baseInfo.acb241,
          acb242: this.resumeInfo.baseInfo.acb242,
          acc217: this.resumeInfo.baseInfo.acc217,
          acc209: this.textareaValue,
        }
        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          if (res.code === -1) {
            this.$utils.showToast(res.message)
          } else {
            this.$utils.showToast('保存成功')
          }
        })
      } else {
        this.$utils.showToast('请输入自我评价')
      }
    },
    // 删除求职意向
    delCcList(flag, delId) {
      this.$refs.checkPopup.open()
      this.delFlag = flag
      this.delId = delId
    },

    delList(flag, delId) {
      if (flag == '1') {
        this.cc24List = this.cc24List.filter((item) => item.acc240 != delId)
      } else if (flag == '2') {
        this.cc25List = this.cc25List.filter((item) => item.acc250 != delId)
      } else if (flag == '3') {
        this.cc26List = this.cc26List.filter((item) => item.acc260 != delId)
      } else if (flag == '4') {
        this.cc27List = this.cc27List.filter((item) => item.acc210 != delId)
      } else if (flag == '5') {
        this.cc28List = this.cc28List.filter((item) => item.acc320 != delId)
      } else if (flag == '6') {
        this.cc29List = this.cc29List.filter((item) => item.acc270 != delId)
      } else if(flag=='7'){
		  this.cc30List = this.cc30List.filter((item) => item.acc280 != delId)
	  }
      this.getResumeCompleteness(this.resumeInfo.baseInfo.acc200)
      this.$utils.showToast('删除成功')
    },
    triggerClick() {
      let param = {
        aac001: this.userInfo.aac001,
        acc200: this.resumeInfo.baseInfo.acc200,
      }
      if (this.delFlag == '1') {
        param.acc240 = this.delId
        param.method = 'jy202_hrm132'
      } else if (this.delFlag == '2') {
        param.acc250 = this.delId
        param.method = 'jy202_hrm130'
      } else if (this.delFlag == '3') {
        param.acc260 = this.delId
        param.method = 'jy202_hrm131'
      } else if (this.delFlag == '4') {
        param.acc210 = this.delId
        param.method = 'jy202_hrm147'
      } else if (this.delFlag == '5') {
        param.acc320 = this.delId
		 param.method = 'jy202_hrm161'
      } else if (this.delFlag == '6') {
        param.acc270 = this.delId
		 param.method = 'jy202_hrm164'
      } else if(this.delFlag=='7'){
		  param.acc280 = this.delId
		   param.method = 'jy202_hrm145'
	  }

      this.$utils.request('', param, true, true, 'cipher').then((res) => {
        this.delList(this.delFlag, this.delId)
      })
    },
    publish(value) {
      let param = {
        method: 'jy202_hrm302',
        aac001: this.userInfo.aac001,
        acc200: this.userInfo.customMap.acc200,
        acc202: value ? '1' : '0',
      }
      this.$utils.request('/api/businessCommon/getData/jy202_hrm302', param, true, false, 'cipher').then((res) => {
        if (res.serviceSuccess) {
          //this.$utils.showToast("保存成功")
        } else {
          this.$utils.showToast('简历是否公开保存失败')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
@import '~@/static/scss/resume.scss';

.progress {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-left: 0 10px;

  > div:nth-child(2) {
    color: #0c6af7;
    font-size: 18px;
  }

  .progressLine {
    width: 150px;
    height: 12px;
    background: #ecf4fb;
    border-radius: 6px;
    border: 1px solid #d3d9db;

    > div {
      transition: all 0.3s linear;
      height: 12px;
      background: #00d8e6;
      box-shadow: inset 0px 0px 4px 0px #ffffff;
      border-radius: 6px 6px 6px 6px;
      border: 1px solid #0bbeca;
    }
  }
}

.form-value {
  border: 1px solid #a2a7a9;

  /deep/ uni-textarea {
    width: 100%;
  }
}
</style>
