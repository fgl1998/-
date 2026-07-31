<template>
  <xu-common-shell :title="userInfo.aab004">
    <div class="interview">
      <xu-common-title zh="面试管理">
        <view slot="btn" class="type-botton">
          <view :style="item.value === buttonValue ? style1 : style2" @click="changeType(item)"
            v-for="(item, index) in buttonType" :key="index">
            {{ item.label }}
          </view>
        </view>
      </xu-common-title>
      <div class="center">
        <div v-if="dataList.length > 0">
          <div v-for="(item,index) in dataList" :key="index">
            <div @click="openResume(item)">
              <image
                :src="item.aac004 ==2 ? getRealImgUrl('img/recruitTalents/female.png') : getRealImgUrl('img/recruitTalents/male.png')" />
              <div>{{ formatSalary(item.acb241, item.acb242) }}</div>
            </div>
            <div>
              <div>
                <view>{{ item.aac003 }}</view>
                <view v-if="item.special == 1">
                  <image :src="getRealImgUrl('img/interview/icon_knqt.png')" />
                  <span>招用可享补贴</span>
                </view>
              </div>
              <div>
                <view>{{ item.age }}岁</view>
                <view>{{ item.acc217 ? $codeConfig.getCodeLabel('ACC217', item.acc217) : '未知工作经验' }}</view>
                <view>{{ item.aac011Desc ?item.aac011Desc : '未知学历' }}</view>
                <!-- <view>{{ item.acc04t ? $codeConfig.getCodeLabel('acc04t', item.acc04t) : '未知状态' }}</view> -->
              </div>
              <div>期望：
                <span>{{ (item.acb202 ? item.acb202 + '·' : '') + item.aca112 }}</span>
              </div>
              <div class="textArea-box">优势：
                <span>{{ item.acc209 ? item.acc209 : '暂无' }}</span>
              </div>
            </div>
            <div>
              <view>
				<view>面试职位</view>
                <view>{{ item.acb213 }}</view>
              </view>
              <view>
                <view>面试方式</view>
				<view>{{ $codeConfig.getCodeLabel('acc315', item.acc315) }}</view>
              </view>
              <view>
                <view>面试时间</view>
				<view>{{ item.acb222 }}</view>
              </view>
            </div>
            <div v-if="!item.acc04z">
              <image src="../../static/images/img/publicImg/interview_wait.png" />
            </div>
            <div v-else-if="item.acc04z && item.acc04z == '0'">
              <image src="../../static/images/img/publicImg/interview_wait.png" />
            </div>
            <div v-else-if="item.acc04z && item.acc04z == '1'">
              <image src="../../static/images/img/publicImg/interview_agree.png" />
            </div>
            <div v-else>
              <image src="../../static/images/img/publicImg/interview_refuse.png" />
            </div>
            <div>
              <view class="interviewItem" @click="interviewSpms(item)"
                v-if="item.acc310 && item.adz210 && item.acc04z == '1' && item.acc312 == '0'"
                :style="item.acc04z == '1' && item.acc312 == '0' ? style1 : style2">视频面试
              </view>
              <view class="interviewItem" @click="interviewBack(item)"
                v-if="item.acc310 && item.adz210 && item.acc04z == '1' && item.acc312 == '0'"
                :style="item.acc04z == '1' && item.acc312 == '0' ? style1 : style2">面试结束
              </view>
              <!-- <view class="interviewItem" @click="interviewBack(item)"
                v-else-if="item.acc04z == '0' || (item.acc04z == '1' && item.acc312 == '0')"
                :style="item.acc04z == '1' && item.acc312 == '0' ? style1 : style2">面试反馈
              </view> -->
              <!-- <view class="interviewItem" @click="interviewBack(item)"
                v-else-if="item.acc04z == '1' && item.acc312 != '0' && item.acc301 == '0'"
                :style="item.acc04z == '1' && item.acc312 != '0' ? style1 : style2">面试评价
              </view> -->
              <!-- <view v-else class="evaluation" :style="style2">
                <span>面试评价：{{ item.acc677 ? item.acc677 : '暂无评价' }}</span>
              </view> -->
              <!--<view class="interviewItem" @click="interviewBack(item)">面试评价</view>-->
            </div>
          </div>
        </div>
        <view v-else class="noData">
          <image src="../../static/images/img/publicImg/noData.png" />
          <view>暂无数据</view>
        </view>
      </div>
      <div class="bottom">
        <el-pagination @size-change="handleSizeChange" @current-change="changePage" :current-page="pageNumber"
          :page-size="pageSize" layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <common-resume :data="resumeInfo" :visible="commonResumeVisible"
      @close="commonResumeVisible = false"></common-resume>
    <common-feedback :isShow="commonFeedbackVisibe" :data="resumeInfo" @close="closeFeedBack"></common-feedback>
    <common-evaluation :is-show="commonEvaluationVisible" :data="resumeInfo"
      @close="closeCommonEvaluation"></common-evaluation>
    <!-- 视频面试弹窗 -->
    <el-dialog :visible.sync="visibleInterview" :append-to-body="true" width="1000px" :close-on-click-modal="false"
      custom-class="dialog" :before-close="handleInterviewClose" title="视频面试">
      <div class="video-interview">
        <div class="local-video">
          <div id="local-video">
          </div>
          <div class="control-bar">
            <img v-if="isOpenAudio" src="../../static/images/trtc/audio.svg" @click="openAudio('0')"></img>
            <img v-else src="../../static/images/trtc/audio-muted.svg" @click="openAudio('1')"></img>
            <img v-if="isOpenVideo" src="../../static/images/trtc/video.svg" @click="openVideo('0')"></img>
            <img v-else src="../../static/images/trtc/video-muted.svg" @click="openVideo('1')"></img>
          </div>
        </div>
        <div id="remote-video" class="remote-video"></div>
      </div>
    </el-dialog>
  </xu-common-shell>
</template>

<script>
  import commonResume from '../../components/common-resume/common-resume.vue';
  import commonFeedback from '../../components/common-feedback/common-feedback.vue';
  import commonEvaluation from '../../components/common-evaluation/common-evaluation.vue';
  import TRTC from 'trtc-sdk-v5';

  export default {
    components: {
      commonResume,
      commonFeedback,
      commonEvaluation
    },
    data() {
      return {
        visibleInterview: false,
        isOpenAudio: false,
        isOpenVideo: false,
        commonEvaluationVisible: false,
        commonFeedbackVisibe: false,
        commonResumeVisible: false,
        userInfo: this.$loginConfig.getLoginInfo(),
        buttonType: [{
            label: '全部',
            value: '',
          },
          {
            label: '待同意',
            value: 0,
            num: 0
          },
          {
            label: '待面试',
            value: 1,
            num: 0
          },
          {
            label: '待评价',
            value: 2
          },
          {
            label: '已完成',
            value: 3
          },
        ],
        buttonValue: '',
        style1: {
          'color': '#0682FE'
        },
        style2: {
          'color': '#999999'
        },
        dataList: [],
        pageSize: 5,
        pageNumber: 1,
        total: 0,
        resumeInfo: {},
        trtc: null
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.getDataList();
        //初始化组件
        this.trtc = TRTC.create();
        //监听对方视频状态
        this.trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, ({
          userId,
          streamType
        }) => {
          this.trtc.startRemoteVideo({
            'userId': userId,
            'streamType': streamType,
            'view': 'remote-video'
          })
        })
      })
    },

    methods: {

      closeCommonEvaluation() {
        this.commonEvaluationVisible = false
        this.getDataList()
      },

      closeFeedBack() {
        this.commonFeedbackVisibe = false
        this.getDataList()
      },

      async interviewSpms(item) {
        /* uni.navigateTo({
          url: "/pages/personInterview/personInterview?acc310=" + item.acc310,
        }); */
        const param = {
          adz210: item.adz210,
          adz221: '2',
          adz222: this.userInfo.loginId
        };
        this.$http.post(this.$requestConstant.businessRequestType, 'getUserInfo', null, param, true).then((data) => {
          const ret = data.data.data.data
          //进入房间
          try {
            this.trtc.enterRoom({
              'sdkAppId': ret.sdkappId,
              'userId': this.userInfo.loginId,
              'userSig': ret.userSign,
              'roomId': parseInt(ret.adz210)
            })
            console.log('enter room successfully')
          } catch (error) {
            console.error('failed to enter room ' + error)
          }
          this.visibleInterview = true
        });
      },

      //开关本地音频
      async openAudio(flag) {
        if (flag == '1') {
          await this.trtc.startLocalAudio()
          this.isOpenAudio = true
        } else {
          await this.trtc.stopLocalAudio()
          this.isOpenAudio = false
        }
      },

      //开关本地视频
      async openVideo(flag) {
        if (flag == '1') {
          await this.trtc.startLocalVideo({
            view: 'local-video'
          });
          this.isOpenVideo = true
        } else {
          await this.trtc.stopLocalVideo()
          this.isOpenVideo = false
        }
      },

      //关闭视频面试窗口
      async handleInterviewClose() {
        if (this.isOpenAudio) {
          try {
            this.isOpenAudio = false
            //停止音频
            await this.trtc.stopLocalAudio()
          } catch (error) {}
        }
        if (this.isOpenVideo) {
          try {
            this.isOpenVideo = false
            //停止视频
            await this.trtc.stopLocalVideo()
          } catch (error) {}
        }
        try {
          //停止远程视频
          this.trtc.stopRemoteVideo({
            userId: '*'
          })
          //退出房间
          await this.trtc.exitRoom()
        } catch (error) {}
        this.visibleInterview = false
      },

      interviewBack(item) {
        this.resumeInfo = item
        console.log(item.acc04z,item.acc312,'interviewback');
          // this.commonEvaluationVisible = true
        
        if (item.acc04z == '1' && item.acc312 == '0') {
          this.commonFeedbackVisibe = true
        } else if (item.acc04z == '1' && item.acc312 != '0') {
          this.commonEvaluationVisible = true
        }
      },

      openResume(item) {
        this.resumeInfo = item
        this.commonResumeVisible = true
      },

      formatSalary(salary1, salary2) {
        if (!salary1 && !salary2) {
          return '面议'
        }
        if (salary1 && !salary2) {
          return '最低' + parseFloat((parseInt(salary1) / 1000).toFixed(1)) + 'K'
        }
        if (!salary1 && salary2) {
          return '最高' + parseFloat((parseInt(salary2) / 1000).toFixed(1)) + 'K'
        }
        return parseFloat((parseInt(salary1) / 1000).toFixed(1)) + 'K' + '-' + parseFloat((parseInt(salary2) / 1000)
          .toFixed(1)) + 'K'
      },

      changeType(item) {
        this.buttonValue = item.value
        this.pageNumber = 1
        this.getDataList()
      },

      changePage(curPage) {
        this.pageNumber = curPage;
        this.getDataList();
      },

      handleSizeChange(val) {
        this.pageSize = val;
        this.getDataList();
      },

      // 数据查询
      getDataList() {
        const param = {
          action: this.buttonValue,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
            paginationModel: 'mostCount',
        };
        this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm121', null, param, true).then((data) => {
          this.dataList = data.data.pageBean.list;
          this.total = data.data.pageBean.total;
        });
      },
    }
  }
</script>

<style lang="less" scoped>

/deep/ .el-dialog{
  border-radius: 6px;
  .el-dialog__body{
    padding: 0px;
    .local-video{
      border: 1px solid #666;
    }
  }
}
  .video-interview {
    width: 100%;
    height: 600px;
    position: relative;

    #remote-video {
      width: 100%;
      height: 100%;
      background-color: black;
    }

    .local-video {
      position: absolute;
      width: 150px;
      height: 150px;
      right: 0;
      top: 0;
      background-color: black;
      border: 1px solid #fff;
      z-index: 999;

      #local-video {
        height: 100%;
        width: 100%;
      }

      .control-bar {
        position: absolute;
        width: 100%;
        height: 20px;
        bottom: 0;
        display: flex;
        background-color: #aaa;
        justify-content: center;
        gap: 20px;
        padding: 5px 0;

        >img {
          cursor: pointer;
        }
      }
    }

  }

  .noData {
    width: 100%;
    height: 100%;
    margin: auto;
	padding-top: 120px;
	text-align: center;

    >image {
      width: 30%;
      height: 50%;
    }

    >view {
      text-align: center;
	  font-size: 24px;
	  font-weight: bold;
	  margin-top: 32px;
	  color: #666666;
    }
  }

  .interview {
    width: calc(100% - 60px);
    height: calc(100% - 52px);
    padding: 26px 32px;
    background: #fff;
    border-radius: 8px;

    .type-botton {
      display: flex;
      width: 1600px;
      align-items: start;
      gap: 20px;

      >view {
        // width: 159px;
        height: 40px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 28px;
        color: #333333;
        line-height: 30px;
        text-align: center;
        font-style: normal;
        cursor: pointer;
      }
    }

    .center {
      height: 724px;

      >div {
        >div {
          width: calc(100% - 60px);
          height: 100px;
          margin: 10px 0;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #EEEEEE;
          padding: 24px 30px;
          display: flex;
          gap: 12px;

          >div:first-child {
            cursor: pointer;
            width: 80px;
            height: 100%;

            >image {
              width: 80px;
              height: 66px;
            }

            >div {
              width: 80px;
              background: #FF4645;
              border-radius: 14px;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 18px;
              color: #FFFFFF;
              line-height: 27px;
              text-align: center;
              font-style: normal;
            }
          }

          >div:nth-child(2) {
            width: 500px;
            height: 107px;

            >div:first-child {
              display: flex;
              gap: 20px;

              >view:first-child {
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 500;
                font-size: 20px;
                color: #333333;
                line-height: 30px;
                text-align: left;
                font-style: normal;
              }

              >view:nth-child(2) {
                width: 130px;
                height: 24px;
                background-color: #fff5e1;
                color: #FFAA0E;
                border-radius: 12px;
                text-align: center;
                line-height: 24px;

                >image {
                  width: 14px;
                  height: 14px;
                  margin-right: 2px;
                }

                >span {
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 500;
                  font-size: 16px;
                  text-align: left;
                  font-style: normal;
                }
              }
            }

            >div:nth-child(2) {
              display: flex;
              gap: 10px;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 16px;
              color: #666666;
              line-height: 24px;
              text-align: left;
              font-style: normal;
            }

            >div:nth-child(3) {
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 16px;
              color: #999999;
              line-height: 24px;
              text-align: left;
              font-style: normal;

              >span {
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 16px;
                color: #666666;
                line-height: 24px;
                text-align: left;
                font-style: normal;
              }
            }

            >div:nth-child(4) {
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 16px;
              color: #999999;
              line-height: 24px;
              text-align: left;
              font-style: normal;

              >span {
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 16px;
                color: #666666;
                line-height: 24px;
                text-align: left;
                font-style: normal;
              }
            }
			.textArea-box{
				width: 500px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
          }

          >div:nth-child(3) {
            min-width: 600px;
            width: calc(100% - 85px - 600px - 100px - 200px);
            height: 100%;
            display: flex;
            gap: 20px;

            >view {
              height: 48px;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 16px;
              color: #999999;
              line-height: 48px;
              text-align: center;
              font-style: normal;
              width: 200px;

              // overflow: hidden;
              // text-overflow: ellipsis;
              // white-space: nowrap;
              >view:first-child {
                color: #333333;
              }
            }
          }

          >div:nth-child(4) {
            width: 100px;
            height: 100%;
            text-align: center;
            align-content: center;

            >image {
              width: 78px;
              height: 78px;
            }
          }

          >div:nth-child(5) {
            width: 200px;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;

            > :first-child {
              align-content: center;
              text-align: center;
            }
          }

          .interviewItem {
            width: 200px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #0682FE;
            line-height: 80px;
            text-align: right;
            font-style: normal;
            cursor: pointer;
          }

          .evaluation {
            width: 200px;
            height: 80px;
            margin-left: 50px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 20px;
            color: #0682FE;
            text-align: left;
            font-style: normal;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow-wrap: break-word;
            // white-space: w;
          }
        }
      }
    }

    .bottom {
      text-align: right;
    }
  }
  .ys{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>