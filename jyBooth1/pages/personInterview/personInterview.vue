<template>
  <xu-common-shell :title="loginInfo.aab004">
    <view class="contentBox">
      <view class="content">
        <div id="app">
          <div class="headerTop">
            <div>
              <div>
                <img :src="getRealImgUrl('img/personInterview/person.png')" alt="求职人员" />
              </div>
              <div>
                求职人员-<span>{{ videoInterviewInfo.aac003 ? videoInterviewInfo.aac003 : '未知人员' }}</span>
              </div>
            </div>
            <div>
              <div>
                <img :src="getRealImgUrl('img/personInterview/unitInter.png')" alt="面试单位" />
              </div>
              <div>
                面试单位-<span>{{ videoInterviewInfo.aab004 ? videoInterviewInfo.aab004 : '未知单位' }}</span>
              </div>
            </div>
            <div @click="goNavigateBack()">
              <div>
                <img :src="getRealImgUrl('img/personInterview/goindex.png')" alt="返回首页" />
              </div>
              <div>返回</div>
            </div>
          </div>
          <div class="headerBody">
            <div class="headerLeft">
              <remote-work
                ref="rw"
                :isShow="true"
                :adz210="videoInterviewInfo.adz210"
                :communicator="videoInterviewInfo.aac003"
              ></remote-work>
            </div>
            <div class="headerRight">
              <div class="tabList">
                <div :class="checkedTitle === 0 ? 'checkedTitle' : ''" @click="changeTitle(0)">
                  <div>职位描述</div>
                </div>
                <div :class="checkedTitle === 1 ? 'checkedTitle' : ''" @click="changeTitle(1)">
                  <div>聊天内容</div>
                </div>
              </div>
              <div v-if="checkedTitle === 0" class="workScript">
                <div>
                  <div>职位描述:</div>
                  <div>
                    <div v-for="(item, index) in jobProfileMesg.tags" :key="index" class="tags">
                      {{ item }}
                    </div>
                  </div>
                  <div class="discribe">
                    <span v-if="jobProfileMesg.acb216" v-dompurify-html="jobProfileMesg.acb216"> </span>
                    <div v-else class="noData">
                      <img :src="getRealImgUrl('img/personInterview/no_data.png')" alt="" />
                    </div>
                  </div>
                </div>

                <div>
                  <div>求职者信息:</div>
                  <div>
                    <div>
                      <div>
                        <img :src="getRealImgUrl('img/personInterview/headIcon.png')" alt="头像" />
                      </div>
                      <div>
                        {{
                          personInfo.baseInfo && personInfo.baseInfo.acc034
                            ? $codeConfig.getCodeLabel('acc034', personInfo.baseInfo.acc034)
                            : '未知'
                        }}
                      </div>
                    </div>
                    <div>
                      <div>
                        <span>{{ videoInterviewInfo.aac003 }}</span
                        >当前正在面试
                      </div>
                      <div>
                        <span>{{ videoInterviewInfo.age }}岁</span><span class="line">|</span
                        ><span>{{
                          personInfo.baseInfo && personInfo.baseInfo.acc217
                            ? $codeConfig.getCodeLabel('acc217', personInfo.baseInfo.acc217)
                            : '未知工作经验'
                        }}</span
                        ><span class="line">|</span
                        ><span>{{
                          personInfo.baseInfo && personInfo.baseInfo.aac011
                            ? $codeConfig.getCodeLabel('aac011', personInfo.baseInfo.aac011)
                            : '未知学历'
                        }}</span
                        ><span class="line">|</span
                        ><span>{{
                          personInfo.baseInfo && personInfo.baseInfo.acc04t
                            ? $codeConfig.getCodeLabel('acc04t', personInfo.baseInfo.acc04t)
                            : '未知状态'
                        }}</span>
                      </div>
                      <div>
                        <span>意向职位：</span>
                        <span v-for="(item, index) in personInfo.baseInfo.aca112" :key="index">
                          {{ item }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span>优势描述：</span>
                    <span
                      v-dompurify-html="
                        personInfo.baseInfo && personInfo.baseInfo.acc209 ? personInfo.baseInfo.acc209 : '暂无'
                      "
                    ></span>
                  </div>
                </div>
              </div>
              <div v-if="checkedTitle === 1" class="chatContent">
                <div class="uimBox">
                  <uim-box
                    :isShowUim="isShowUim"
                    :showTitle="false"
                    :currentInfo="currentInfo"
                    :uimType="1"
                    :uimStyle="1"
                  ></uim-box>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content">
          <div>更多职位信息</div>
        </div>
      </view>
    </view>
  </xu-common-shell>
</template>

<script>
import uimBox from './component/uimBox.vue'
import remoteWork from './component/remoteRoom/views/Invite.vue'
import { UIMClient } from '@yh/uim-web-ui'

export default {
  name: 'personInterview',
  components: {
    uimBox,
    remoteWork,
  },
  data() {
    return {
      // 登录账户信息
      loginInfo: {},
      // 面试信息
      videoInterviewInfo: {
        aac003: '未知姓名',
        age: 23,
        adz210: 0,
      },
      // 面试人员基本信息
      personInfo: {
        baseInfo: {
          acc217: '1',
          aac011: '11',
          acc04t: '1',

          aca112: ['人事', '行政', '管理行业'],

          acc209: '本人具有良好语言表达能力及沟通协调能力;对工作认真细心用心、积极主动、敬业爱岗;',
        },
      },
      // 0 职位描述 1 聊天内容 1 true, 0 false
      checkedTitle: 1,
      isShowUim: true,
      currentInfo: {},
      // 职位描述
      jobProfileMesg: {
        acb216:
          '职位描述的具体内容：职位要求：有创意性思维，熟悉设计类软件操作，具备较强的绘画和审美能力，了解各种设计风格和趋势，能够在团队中开展有效的创意讨论并成功设计出符合需求的作品。',
        tags: ['标签', '国企', '编制', '开发', 'IT'],
      },
      // 是否打开面试反馈弹框
      showFeedback: false,
      // 是否打开面试评价弹框
      showGrade: false,
      isFromUim: false,
      resumeMesg: {},
      // ----------面试题----------
      isShowTestList: false,
      isShowExamCompany: false,
      previewTest: {},
      isShowExamPerson: false,
    }
  },
  watch: {
    videoInterviewInfo: {
      handler: function (val, oldVal) {
        if (val) {
          this.currentInfo = {
            comuInfo: {
              ...val,
            },
          }

          this.getUserInfo(val.aac001)
          this.getInterviewPosition(val.acb210)
          this.initLisentner()
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.loginInfo = this.$loginConfig.getLoginInfo()

    if (this.$route.query.acc310) {
      let acc310 = this.$route.query.acc310
      this.getInterviewActivityInfo(acc310)

      this.currentInfo = {
        comuInfo: {
          ...this.videoInterviewInfo,
        },
      }

      this.getUserInfo(this.videoInterviewInfo.aac001)
      this.getInterviewPosition(this.videoInterviewInfo.acb210)
      this.initLisentner()
    } else {
      this.$utils.showToast('未获取到面试邀请编号，请重试！')
    }
  },

  methods: {
    changeTitle(index) {
      this.checkedTitle = index
      if (index == 1) {
        this.isShowUim = true
      }
    },

    // 查询该条面试信息
    getInterviewActivityInfo(acc310) {
      if (acc310) {
        let params = {
          apiCode: 'jy201_hrm121',
          method: 'jy201_hrm121',
          pageSize: 1,
          pageNumber: 1,
          acc310: acc310,
          paginationModel: 'mostCount',
        }
        this.$http
          .post(this.$requestConstant.businessRequestType, 'jy201_hrm121', null, params, true)
          .then((responseData) => {
            // 业务信息成功处理
            let res = responseData ? responseData.data : {}
            if (res.errors && res.errors.length > 0) {
              this.$utils.showToast(res.errors[0].msg)
            } else {
              let pageBean = (res && res.pageBean) || {}
              if (pageBean.list && pageBean.list.length > 0) {
                if (pageBean.list.length > 1) {
                  this.$utils.showToast('获取到多个面试邀请编号，请核实！')
                }
                let result = pageBean.list[0] || {}
                result.adz210 = Number(result.adz210)
                this.videoInterviewInfo = result
                console.log('videoInterviewInfo', JSON.stringify(this.videoInterviewInfo))
              } else {
                this.$utils.showToast('未获取到面试邀请编号，请重试！')
              }
            }
          })
      } else {
        this.$utils.showToast('未获取到面试邀请编号，请重试！')
      }
    },

    // 查询该条面试信息 面试人员基本信息
    getUserInfo(aac001) {
      if (aac001) {
        let params = {
          apiCode: 'jy202_hrm119',
          method: 'jy202_hrm119',
          aac001q: aac001,
          jqFilterFlag: 'yns',
        }
        this.$http
          .post(this.$requestConstant.businessRequestType, 'jy202_hrm119', null, params, true)
          .then((responseData) => {
            let res = responseData ? responseData.data : {}
            if (res.errors && res.errors.length > 0) {
              this.$utils.showToast(res.errors[0].msg)
            } else {
              this.personInfo = (res.data && res.data.resumeMap) || {}
              console.log('getUserInfo jy202_hrm119 personInfo', JSON.stringify(this.personInfo))
            }
          })
      }
    },

    // 查询面试职位详情
    getInterviewPosition(acb210) {
      if (acb210) {
        let params = {
          apiCode: 'jy202_hrm102',
          method: 'jy202_hrm102',
          acb210: acb210,
        }
        this.$http
          .post(this.$requestConstant.businessRequestType, 'jy202_hrm102', null, params, true)
          .then((responseData) => {
            let res = responseData ? responseData.data : {}
            if (res.errors && res.errors.length > 0) {
              this.$utils.showToast(res.errors[0].msg)
            } else {
              this.jobProfileMesg = (res.data && res.data.data) || {}
              this.jobProfileMesg.tags = this.jobProfileMesg.acb00r ? this.jobProfileMesg.acb00r.split(',') : ''
            }
          })
      }
    },

    // 初始化
    initLisentner() {
      console.log('this.initLisentner 1', this.videoInterviewInfo)
      // 点击自定义消息
      UIMClient.removeListener('oogeCallMethod')
      UIMClient.addListener('oogeCallMethod', (ret) => {
        console.log('this.initLisentner 2', ret, this.videoInterviewInfo)
        let result = ret.result
        // 传入uim指令 - 个人发送面试自定义消息
        if (result.method == 'applyInterviewEval') {
          if (this.userInfo && this.userInfo.aac001) {
            this.resumeMesg = this.videoInterviewInfo
            this.showGrade = true
            this.isFromUim = true
          }
        }
        if (result.method == 'openTestDetail') {
          if (this.userInfo && this.userInfo.aab001) {
            this.previewTest = result.args
            this.isShowExamCompany = true
          }
          if (this.userInfo && this.userInfo.aac001) {
            this.previewTest = result.args
            this.isShowExamPerson = true
          }
        }
      })
      // 打开模态框
      UIMClient.removeListener('openModal')
      UIMClient.addListener('openModal', (ret) => {
        let result = ret.result
        // 打开面试反馈模态框
        if (result.type == 'interviewFeedback') {
          this.resumeMesg = {
            acc310: this.videoInterviewInfo.acc310,
            aac003: this.videoInterviewInfo.aac003,
            acb213: this.videoInterviewInfo.acb213,
            age: this.videoInterviewInfo.age,
            aac004_dsc: this.videoInterviewInfo.aac004_dsc,
            aac011_dsc: this.videoInterviewInfo.aac011_dsc,
            aac183_dsc: '',
            aae707:
              this.$host +
              'api/base/downloadBusinessFile.do?fileId=' +
              this.personInfo.baseInfo.aae707 +
              '&channelCode=yns&sysCode=' +
              this.$requestConstant.systemCode,
            aae006: this.videoInterviewInfo.aae006,
            aae005: this.videoInterviewInfo.aae005,
            aae015: '',
          }
          this.showFeedback = true
          this.isFromUim = true
        }
        if (result.type === 'queryInterviewTestList') {
          this.isShowTestList = true
        }
      })
      //被踢下线通知
      UIMClient.removeListener('eventKickUser')
      UIMClient.addListener('eventKickUser', () => {
        this.$utils.showToast('您已超时下线，请重新登录')
      })
    },

    goNavigateBack() {
      this.$refs.rw.closeRoom().then(() => {
        uni.navigateBack()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.fontStyle {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 18px;
  line-height: 32px;
  text-align: left;
  font-style: normal;
}

.contentBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: auto;

  background: url('@/static/images/img/personInterview/child_page_banner.png') no-repeat center top,
    url('@/static/images/img/personInterview/child_page_bg.png') no-repeat center bottom;

  ::-webkit-scrollbar {
    width: 10px;
  }

  * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 24px 32px;

    #app {
      width: 100%;
      height: calc(100% - 240px);
      display: block;

      > .headerTop {
        width: 100%;
        height: 64px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        border-radius: 2px 2px 0px 0px;
        padding: 0px 24px;

        > div {
          display: flex;
          align-items: center;
          @extend .fontStyle;

          > div:last-child {
            margin-left: 8px;
          }
        }

        > div:last-child {
          color: white;
          cursor: pointer;
        }
      }

      > .headerBody {
        width: 100%;
        height: calc(100% - 64px);

        display: flex;

        > div.headerLeft {
          width: 70%;
          height: 100%;

          border-radius: 5px;
          padding: 10px;
        }

        > div.headerRight {
          width: calc(100% - 70% - 10px);
          height: 100%;
          display: block;
          margin-left: 10px;

          > div.tabList {
            height: 45px;

            display: flex;
            align-items: center;
            justify-content: space-around;

            > div {
              @extend .fontStyle;
              cursor: pointer;
            }
          }

          > div.workScript {
            // 职位描述
            > :first-child {
              > :first-child {
                font-weight: bold;
              }

              > :nth-child(2) {
                display: flex;

                > div.tags {
                  margin-right: 10px;
                }
              }
            }

            > :last-child {
              > :first-child {
                font-weight: bold;
              }

              > :nth-child(2) {
                display: flex;

                > div {
                  padding: 5px;
                }

                > :first-child {
                  text-align: center;

                  :last-child {
                    background: #ff4645;
                    border-radius: 14px;
                    color: #ffffff;
                    cursor: pointer;
                  }
                }

                > :last-child {
                  :first-child {
                    span {
                      padding: 0 10px 0 0;
                    }
                  }
                }

                .line {
                  margin: 0 5px;
                }
              }
            }
          }
        }
      }
    }

    .content {
      width: 100%;
      height: 240px;
    }
  }
}
</style>
O
