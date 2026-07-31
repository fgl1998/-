import moment from "moment"
import { UIMClient } from "@yh/uim-web-ui";
const CustomMenu = class {
  init() {
    this.acceptInterView()
    this.interviewEvaluate()
    this.interviewEvaluateMsag()
    this.inertviewResult()
    // this.flexJobInviteResult()
    // this.seizeOrderResult()
    // this.handleSignSuccess()
  }
  setMenus() {
    this.menus = [
      {
        type: 'default',
        icon: "video",
        index: 1,
        funcType: 0,
        id: 0,
        menuName: "视频面试",
        callMethod: this.sendVedio.bind(this)
      },
      {
        type: 'default',
        icon: "todo-list",
        index: 1,
        funcType: 1,
        id: 1,
        menuName: "发送个人简历",
        callMethod: this.sendBrief.bind(this)
      },
      {
        type: 'default',
        icon: "wap-home",
        index: 1,
        funcType: 1,
        id: 2,
        menuName: "职位投递",
        callMethod: this.jobGive.bind(this)
      },
      {
        type: 'default',
        icon: "more",
        index: 1,
        funcType: 2,
        id: 3,
        menuName: "发送职位信息",
        callMethod: this.sendJobMsg.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 1,
        funcType: 2,
        id: 4,
        menuName: "邀约面试",
        callMethod: this.inviteInterView.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 1,
        id: 5,
        menuName: "发送个人意愿",
        callMethod: this.sendPersonWilling.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 1,
        id: 6,
        menuName: "抢单申请",
        callMethod: this.handleSeizeOrders.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 1,
        id: 7,
        menuName: "工单完成申请",
        callMethod: this.orderCompleteApply.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 1,
        id: 8,
        menuName: "发送工单信息",
        callMethod: this.sendFlexJobInfo.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 2,
        id: 9,
        menuName: "工单邀请",
        callMethod: this.flexJobInvit.bind(this)

      },
      {
        type: 'default',
        icon: "comment",
        index: 1,
        funcType: 2,
        id: 10,
        menuName: "工单结算确认申请",
        callMethod: this.orderSettleApply.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 1,
        funcType: 3,
        id: 11,
        menuName: "发送富余劳动力",
        callMethod: this.surplusLaborForce.bind(this)
      },
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 3,
        id: 12,
        menuName: "发送缺工信息",
        callMethod: this.lackJobInfo.bind(this)
      },
      // 灵工版
      {
        type: 'default',
        icon: "comment",
        index: 2,
        funcType: 3,
        id: 13,
        menuName: "视频交流",
        callMethod: this.videoCommunication.bind(this)
      },

    ]
  }
  sendVedio(type) {
    // 生成房间号
    let session = window.uimSDK.imControl.store.state.Chat.currentSession
    if (session.sessionId == 'YHSYS') return;
    UIMClient.event.$emit('openModal', { type: "startVideoInterview" })
    UIMClient.event.$off('generateRoomFinish')
    UIMClient.event.$on('generateRoomFinish', data => {
      this.chooseOperate('createdVideoRoom', data)
    })
  }
  // 招聘发送个人简历
  sendBrief(type) {
    let session = window.uimSDK.imControl.store.state.Chat.currentSession
    if (session.sessionId == 'YHSYS') return;
    UIMClient.event.$emit('sendPersonBrief')
    UIMClient.event.$off('sendPersonBriefFinish')
    UIMClient.event.$on('sendPersonBriefFinish', data => {
      this.chooseOperate('sendResume', data.result)
    })
  }
  jobGive(type) {
    // 职位投递
    let session = window.uimSDK.imControl.store.state.Chat.currentSession
    if (session.sessionId == 'YHSYS') return;
    UIMClient.event.$emit('jobGiveBrief')
    UIMClient.event.$off('jobGiveBriefFinish')
    UIMClient.event.$on('jobGiveBriefFinish', data => {
      this.chooseOperate('postResumeRes', data)
    })
  }
  sendJobMsg(type) {
    // 发送职位信息
    let session = window.uimSDK.imControl.store.state.Chat.currentSession
    if (session.sessionId == 'YHSYS') return;
    UIMClient.event.$emit("openModal", { type: "searchPoInfo", state: true });
    UIMClient.event.$off('sendRelateJobFinish')
    UIMClient.event.$on('sendRelateJobFinish', data => {
      this.chooseOperate('jobInfo', data)
    })
  }
  inviteInterView(type) {
    // 邀请面试
    let session = window.uimSDK.imControl.store.state.Chat.currentSession
    if (session.sessionId == 'YHSYS') return;
    UIMClient.event.$emit("openModal", { type: "startInvitate", state: true });
    UIMClient.event.$off('sendInviteInfoFinish')
    UIMClient.event.$on('sendInviteInfoFinish', (data) => {
      this.chooseOperate('invited', data)
    })
  }
  acceptInterView() {
    // 是否接收面试邀请  handleAccept
    UIMClient.event.$on('getAcceptInterView', (data) => {
      this.chooseOperate('handleAccept', data)
    })
  }
  interviewEvaluate() {
    // 面试评价申请  applyInterviewEval
    UIMClient.event.$on('getInterviewEvaluate', (data) => {
      this.chooseOperate('applyInterviewEval', data)
    })
  }
  interviewEvaluateMsag() {
    // 面试评价信息框发送  sendInterviewEval
    UIMClient.event.$on('getInterviewEvaluateMsag', (data) => {
      this.chooseOperate('sendInterviewEval', data)
    })
  }
  inertviewResult() {
    // 面试反馈结果  feedbackResult
    UIMClient.event.$on('inertviewResultFeedBack', (data) => {
      this.chooseOperate('feedbackResult', data)
    })
  }
  // 群聊---外部向内部发送自定义消息
  outerToInner(data) {
    window.uimSDK.imControl.message
      .sendOogeMsg(this.store.state.Chat.currentSession, data)
      .then(ret => {
        console.log("群聊外部向内部发送自定义消息");
        console.log(ret);
        UIMClient.event.$emit('groupSendMsgFinish', ret)
      })
      .catch(e => {
        console.error(e.message);
      });
  }
  // 发送个人意愿
  sendPersonWilling() {
    UIMClient.event.$emit('searchPerWilling')
    UIMClient.event.$off('sendPerWilling')
    UIMClient.event.$on('sendPerWilling', (data) => {
      this.chooseOperate('sendPerWilling', data.result)
    })
  }
  // 发送工单信息
  sendFlexJobInfo() {
    UIMClient.event.$emit('searchFlexJobInfo')
    UIMClient.event.$off('sendFlexJobInfo')
    UIMClient.event.$on('sendFlexJobInfo', (data) => {
      this.chooseOperate('sendFlexJobInfo', data.result)
    })
  }
  // 发送工单邀请
  flexJobInvit() {
    UIMClient.event.$emit('openFlexInvitModal')
    UIMClient.event.$off('invitFlexJob')
    UIMClient.event.$on('invitFlexJob', (data) => {
      this.chooseOperate('sendFlexJobInvite', data.result)
    })
  }
  // 工单邀请结果
  flexJobInviteResult() {
    UIMClient.event.$off('isAcceptSeizeOrder')
    UIMClient.event.$on('isAcceptSeizeOrder', (data) => {
      this.chooseOperate('isAcceptSeizeOrder', data.result);
    })
  }
  // 抢单申请
  handleSeizeOrders() {
    UIMClient.event.$emit('seizeOrders')
    UIMClient.event.$off('sendSeizeOrderApply')
    UIMClient.event.$on('sendSeizeOrderApply', (data) => {
      this.chooseOperate('sendSeizeOrderApply', data.result);
    })
  }
  // 抢单申请结果
  seizeOrderResult() {
    UIMClient.event.$off('respondSeizeOrder')
    UIMClient.event.$on('respondSeizeOrder', (data) => {
      console.log('respondSeizeOrder', data);
      this.chooseOperate('respondSeizeOrder', data.result);
    })
  }
  // 签约成功
  handleSignSuccess() {
    UIMClient.event.$off('signingSuccess')
    UIMClient.event.$on('signingSuccess', (data) => {
      console.log('signingSuccess', data);
      this.chooseOperate('signingSuccess', data.result);
    })
  }
  // 工单完成申请
  orderCompleteApply() {
    // this.event.$emit('searchCompleteOrders')
    // this.event.$off('sendCompleteApply')
    // this.event.$on('sendCompleteApply', (data) => {
    //   this.chooseOperate('sendCompleteApply', data.result);
    // })
  }
  // 工单结算申请
  orderSettleApply() {
    UIMClient.event.$emit('searchSettleOrders')
    UIMClient.event.$off('sendSettleApply')
    UIMClient.event.$on('sendSettleApply', (data) => {
      this.chooseOperate('sendSettleApply', data.result);
    })
  }
  // 发送富余劳动力
  surplusLaborForce() {
    UIMClient.event.$emit('searchSurplusLaborForce')
    UIMClient.event.$off('sendSurplusLaborForce')
    UIMClient.event.$on('sendSurplusLaborForce', (data) => {
      this.chooseOperate('sendSurplusLaborForce', data.result);
    })
  }
  // 发送缺工信息
  lackJobInfo() {
    UIMClient.event.$emit('searchLackJobInfo')
    UIMClient.event.$off('sendLackJobInfo')
    UIMClient.event.$on('sendLackJobInfo', (data) => {
      this.chooseOperate('sendLackJobInfo', data.result);
    })
  }
  // 灵工视频交流
  videoCommunication() {
    UIMClient.event.$emit('createdVideoCommunicateRoom')
    UIMClient.event.$off('createdVideoRoomFinish')
    UIMClient.event.$on('createdVideoRoomFinish', data => {
      console.log('data', data);
      this.chooseOperate('inviteToVideoRoom', data.result)
    })
  }
  // 完成成功
  chooseOperate(mesgType, mesg) {
    let comInfo = JSON.parse(window.localStorage.getItem("comInfo"))
    let identity = window.localStorage.getItem("identity")
    console.log("sendOogeMsg --- mesg");
    // console.log(mesg);
    var oogeMsg = {};
    // 发送职位信息
    if (mesgType === "jobInfo") {
      let html = ''
      for (let i = 0; i < mesg.length; i++) {
        html += `
        <div class="mesgBody">
          <div>
          <span>${mesg[i].acb213 || ''}【${mesg[i].acb303 || ''}】</span>
          </div>
          <div>
            <span>${mesg[i].acb21h || ''}-${mesg[i].acb21j || ''}</span>
            <span>${mesg[i].acc217_dsc || ''}</span>
            <span>${mesg[i].aac011_dsc || ''}</span>
          </div>
          <div>
            <span>岗位类别：${mesg[i].aca112 || ''}</span>
          </div>
        </div>

        `
      }
      oogeMsg = {
        title:
          "求职人员【" + comInfo.communicator.aac003 + "】,参考你的简历本公司为你推荐以下岗位："
        ,
        content: `
        <div class="sendPosition">
          ${html}
        </div>
          `,
        oogeOperation: [
          {
            hintText: "职位信息",
            callMethod: JSON.stringify({
              method: "sendPosition",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 发送个人简历
    if (mesgType === "sendResume") {
      oogeMsg = {
        content: `
        <div class="sendResume">
          <div class="top">
            <div>
              <span>${mesg.aac003}</span>
              <span>${mesg.age || ''}岁</span>
            </div>
            <div style="display:${mesg.acc034_desc ? 'block' : 'none'}">${mesg.acc034_desc}</div>
          </div>
          <div class="middle">
            <span style="display:${mesg.aac004_dsc ? 'inline-block' : 'none'}">${mesg.aac004_dsc || ''}</span>
            <span style="display:${mesg.aac011_dsc ? 'inline-block' : 'none'}">${mesg.aac011_dsc || ''}</span>
            <span style="display:${mesg.acc04t_dsc ? 'inline-block' : 'none'}">${mesg.acc04t_dsc || ''}</span>
          </div>
          <div class="intention">求职意向：${mesg.aca112 || ''}</div>
          <div class="bottom">
            优势：<span>${mesg.acc209 || '暂无'}</span>
          </div>
        </div>
        `,
        oogeOperation: [
          {
            hintText: "简历信息",
            callMethod: JSON.stringify({
              method: "sendResume",
              noBtn: true,
              args: {
                aac001: comInfo.nowUser.aac001,
                acc200: mesg.acc200
              }
            })
          }
        ]
      };
    }
    // 投递简历
    if (mesgType === "postResumeRes") {
      // 投递成功
      if (mesg.state === true) {
        oogeMsg = {
          content: `
           <div class ="postResumeRes">
            <div class="top">
            【简讯信息】：求职者<span>${comInfo.nowUser.aac003
            }</span>向<span>${comInfo.communicator.aab004
            }</span>发起职位投递
          </div>
          <div class="bottom">
            <span>投递职位：${comInfo.about.comuInfo.acb213}</span>
            <span>投递时间：${moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )}</span>
          </div>
        </div>

          `,
          oogeOperation: [
            {
              hintText: "",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      } else {
        // // 投递失败
        // oogeMsg = {
        //   content:
        //     `投递职位【${comInfo.about.comuInfo.acb213}】失败，` +
        //     mesg.mesg,
        //   oogeOperation: [
        //     {
        //       hintText: "",
        //       callMethod: JSON.stringify({
        //         method: "noClick",
        //         noBtn: true
        //       })
        //     }
        //   ]
        // };
      }
    }
    // 邀请面试
    if (mesgType === "invited") {
      if (!mesg.state) {
        oogeMsg = {
          content: mesg.err,
          oogeOperation: [
            {
              hintText: "",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      } else {
        oogeMsg = {
          titie: "【简讯信息】：" + mesg.aab004 + "向求职者" + mesg.aac003 + "发起了" + mesg.acc315_dsc + "面试邀请",
          content: `
        <div class ="inviteInterview">
          <div class="bottom">
            <div>面试职位：${mesg.cb21Po.acb213}</div>
            <div>面试时间：${mesg.acb222 || ''}</div>
            <div>HR信息： ${mesg.acb224 || ''}</div>
            <div>${mesg.acb223 ? "面试地点：" + mesg.acb223 : ""}</div>
          </div>
        </div>
          `,
          oogeOperation: [
            {
              hintText: "邀请面试",
              callMethod: JSON.stringify({
                method: "invited",
                noBtn: true,
                args: {
                  ...mesg
                }
              })
            }
          ]
        };
      }
    }
    // 发送是否接受面试邀请
    if (mesgType === "handleAccept") {
      if (mesg.state === true) {
        oogeMsg = {
          content: `
           <div class ="handleAccept">
            <div class="top">
            【简讯信息】：求职者<span>${comInfo.nowUser.aac003
            }</span>已<span>接受</span>了<span>${comInfo.communicator.aab004
            }</span>发起的${mesg.mesg.acc315_dsc}面试邀请
            </div>
            <div class="bottom">
              <span>面试职位：${mesg.mesg.cb21Po.acb213}</span>
              <span>面试时间：${mesg.mesg.acb222}</span>
              <span>${mesg.mesg.acb223 ? "面试地点：" + mesg.mesg.acb223 : ""
            }</span>
            </div>
          </div>

          `,
          oogeOperation: [
            {
              hintText: "",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      } else {
        oogeMsg = {
          content: `
           <div class ="handleAccept">
            <div class="top">
            【简讯信息】：求职者<span>${comInfo.nowUser.aac003}</span>已<span>拒绝</span>了<span>${comInfo.communicator.aab004}</span>发起的${mesg.mesg.acc315_dsc}面试邀请
          </div>
        </div>

          `,
          oogeOperation: [
            {
              hintText: "",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      }
    }
    // 发送视频面试邀请
    if (mesgType === "createdVideoRoom") {
      if (identity != '1') {
        oogeMsg = {
          content: `
          <div class="videoInterview">
            <div>
              <span>求职人员<span>${comInfo.communicator.aac003}</span></span>
              <span><span>${comInfo.nowUser.aab004}</span>邀请您参加面试</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "视频面试",
              callMethod: JSON.stringify({
                method: "videoInterview",
                noBtn: true,
                args: {
                  adz210: mesg.adz210
                }
              })
            }
          ]
        };
      }
      if (identity == '1') {
        oogeMsg = {
          content: `
          <div class="videoInterview">
            <div>
              <span><span>${comInfo.communicator.aab004}</span></span>
              <span>求职人员<span>${comInfo.nowUser.aac003}</span>申请参加面试</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "视频面试",
              callMethod: JSON.stringify({// 内部向外部传递的内容
                method: "videoInterview",
                noBtn: true,
                args: {
                  adz210: mesg.adz210
                }
              })
            }
          ]
        };
      }
    }
    // 面试评价申请
    if (mesgType === "applyInterviewEval") {
      oogeMsg = {
        content: `
          <div class="applyInterviewEval">
            <div class="top">
            【简讯信息】：<span>${comInfo.nowUser.aab004}</span>邀请求职者<span>${comInfo.communicator.aac003}</span>对<span>${comInfo.choseInfo.acb213}</span>职位进行面试评价
            </div>
          </div>
          `,
        oogeOperation: [
          {
            hintText: "面试评价",
            callMethod: JSON.stringify({
              method: "applyInterviewEval",
              noBtn: true,
              args: {}
            })
          }
        ]
      };
    }
    // 面试评价信息框发送
    // if (mesgType === "sendInterviewEval") {
    //   oogeMsg = {
    //     content: ``,
    //     oogeOperation: [
    //       {
    //         hintText: "面试评价",
    //         callMethod: JSON.stringify({
    //           method: "sendInterviewEval",
    //           noBtn: true,
    //           args: {
    //             aab004: comInfo.communicator.aab004,
    //             scoreList: [
    //               {
    //                 imgUrl: require("@/assets/images/zb/icon_20_score.png"),
    //                 activeImgUrl: require("@/assets/images/zb/icon_80_score(hover).png"),
    //                 scoreTitle: "非常不满意",
    //                 scorCode: "20",
    //                 isActive: false
    //               },
    //               {
    //                 imgUrl: require("@/assets/images/zb/icon_40_score.png"),
    //                 activeImgUrl: require("@/assets/images/zb/icon_80_score(hover).png"),
    //                 scoreTitle: "不满意",
    //                 scorCode: "40",
    //                 isActive: false
    //               },
    //               {
    //                 imgUrl: require("@/assets/images/zb/icon_60_score.png"),
    //                 activeImgUrl: require("@/assets/images/zb/icon_80_score(hover).png"),
    //                 scoreTitle: "一般",
    //                 scorCode: "60",
    //                 isActive: false
    //               },
    //               {
    //                 imgUrl: require("@/assets/images/zb/icon_60_score.png"),
    //                 activeImgUrl: require("@/assets/images/zb/icon_80_score(hover).png"),
    //                 scoreTitle: "满意",
    //                 scorCode: "80",
    //                 isActive: false
    //               },
    //               {
    //                 imgUrl: require("@/assets/images/zb/icon_100_score.png"),
    //                 activeImgUrl: require("@/assets/images/zb/icon_80_score(hover).png"),
    //                 scoreTitle: "非常满意",
    //                 scorCode: "100",
    //                 isActive: false
    //               }
    //             ]
    //           }
    //         })
    //       }
    //     ]
    //   };
    // }
    // 面试反馈结果
    if (mesgType === "feedbackResult") {
      if (mesg.state) {
        oogeMsg = {
          content: `
          <div class="feedbackResult">
            <div class="top">
            【招聘成功】：恭喜<span>${comInfo.communicator.aac003}</span>，经过招聘面试沟通，现诚挚的邀请您加入我们公司的<span>${mesg.mesg.acb213}</span>职位，期待您的到来！
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "面试评价",
              callMethod: JSON.stringify({
                method: "feedbackResult",
                noBtn: true
              })
            }
          ]
        };
      } else {
        oogeMsg = {
          content: `
          <div class="feedbackResult">
            <div class="top">
            【招聘失败】：<span>${comInfo.communicator.aac003}</span>您好，经过我司人事部初步审批，认为您现在暂时不符合我司<span>${mesg.mesg.acb213}</span>岗位的要求，如有机会，期盼下次再与您合作，为不耽误您的宝贵时间，特此通知，冒昧之处请见谅。
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "面试评价",
              callMethod: JSON.stringify({
                method: "feedbackResult",
                noBtn: true
              })
            }
          ]
        };
      }
    }
    // 发送个人意愿
    if (mesgType === "sendPerWilling") {
      oogeMsg = {
        content: `
        <div class="sendPerWillingMobile">
          <div class="mesgBody">
            <div>
              <span>${mesg.aac003 || "未知人员"}</span>
              <span>发布：${moment(mesg.aae036).format("YYYY-MM-DD") ||
          "未知时间"}</span>
            </div>
            <div>
              <div>
                <span>${mesg.aac004_desc || "未知性别"}</span>
                <span>${mesg.aac011_desc || "未知学历"}</span>
              </div>
              <div><span>意向择业地：</span>${mesg.aab301_str ||
          "未知地点"}</div>
            </div>
            <div><span>意向职位：</span>${mesg.acc3c3_desc ||
          "未知职位"}</div>
          </div>
        </div>
        `,
        oogeOperation: [
          {
            hintText: "发送个人灵工意愿",
            callMethod: JSON.stringify({
              method: "toPerWillingDetail",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 发送工单信息
    if (mesgType === "sendFlexJobInfo") {
      oogeMsg = {
        content: `
        <div class="sendFlexJobInfoMobile">
          <div class="title">雇主<span>${comInfo.nowUser.aab004 ||
          comInfo.nowUser.aac003}</span>为您推荐以下灵活用工工单</div>
          <div class="mesgBody">
            <div>
              <span>${mesg.acb213 || "未知职位"}</span>
              <span>${mesg.acb21g || 0}人 | ${mesg.acb2a3 || 0}元</span>
            </div>
            <div>
              <div>
                <div>${moment(mesg.acb2a5).format("HH:mm") ||
          "未知时间"} - ${moment(mesg.acb2a6).format("HH:mm") ||
          "未知时间"}工作</div>
                <div>${mesg.acb2a4_desc || "未知结算方式"}</div>
              </div>
              <div>发布时间：${moment(mesg.aae163).format("YYYY-MM-DD") ||
          "未知时间"}</div>
            </div>
            <div>【工作地点】：${mesg.acb303 || "未知工作地点"}</div>
          </div>
        </div>
        `,
        oogeOperation: [
          {
            hintText: "发送灵工信息",
            callMethod: JSON.stringify({
              method: "toFlexJobInfoDetail",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 发送工单邀请
    if (mesgType === "sendFlexJobInvite") {
      oogeMsg = {
        content: `
        <div class ="inviteInterview">
          <div class="top">
            【简讯信息】：雇主<span>${comInfo.nowUser.aab004 ||
          comInfo.nowUser.aac003}</span>向雇员<span>${mesg.aac003
          }</span>发起了灵活用工邀请，邀请岗位为【<span>${mesg.acb213 ? mesg.acb213 : "未知职位"
          }</span>】
          </div>
        </div>
          `,
        oogeOperation: [
          {
            hintText: "灵工邀请",
            callMethod: JSON.stringify({
              method: "isAcceptFlexInvite",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 是否同意灵工邀请
    if (mesgType === 'isAcceptSeizeOrder') {
      // 接受
      if (mesg.acc3b2 === "1") {
        oogeMsg = {
          content: `
           <div class ="isAcceptSeizeOrderMobile">
            <div class="top">
            【邀请成功】：雇员<span>${mesg.aac003
            }</span>已<span>接受</span>雇主<span>${comInfo.communicator
              .aab004 ||
            comInfo.communicator.aac003}</span>发起的灵活用工邀请
            </div>
            <div class="bottom">
              <span>邀请职位：${mesg.acb213 || "未知职位"}</span>
              <span>邀请时间：${mesg.aae036
              ? moment(mesg.aae036).format("YYYY-MM-DD HH:mm:ss")
              : "未知时间"
            }</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "接收邀请",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      }
      // 拒绝
      if (mesg.acc3b2 === "2") {
        oogeMsg = {
          content: `
          <div class ="isAcceptSeizeOrderMobile">
            <div class="top">
            【邀请失败】：雇员<span>${mesg.aac003
            }</span>已<span>拒绝</span>雇主<span>${comInfo.communicator
              .aab004 ||
            comInfo.communicator.aac003}</span>发起的灵活用工邀请
            </div>
            <div class="bottom">
              <span>邀请职位：${mesg.acb213 || "未知职位"}</span>
              <span>邀请时间：${mesg.aae036
              ? moment(mesg.aae036).format("YYYY-MM-DD HH:mm:ss")
              : "未知时间"
            }</span>
            </div>
            <div class="footer">拒绝原因：${mesg.acc3b3 || "未知原因"}</div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "拒绝邀请",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      }
    }
    // 抢单申请
    if (mesgType === 'sendSeizeOrderApply') {
      if (mesg.state === true) {
        // 抢单成功
        oogeMsg = {
          content: `
            <div class ="sendSeizeOrderApplyMobile">
              <div class="top">
                【抢单申请】：雇员<span>${comInfo.nowUser.aac003
            }</span>向雇主<span>${comInfo.communicator.aab004 ||
            comInfo.communicator.aac003}</span>发起抢单申请
              </div>
              <div class="bottom">
                <span>抢单职位：${mesg.mesg.acb213 || "未知职位"}</span>
                <span>抢单时间：${moment(mesg.mesg.aae036).format(
              "YYYY-MM-DD HH:mm:ss"
            )}</span>
              </div>
            </div>
          `,
          oogeOperation: [
            {
              hintText: "抢单成功",
              callMethod: JSON.stringify({
                method: "openApplyModal",
                noBtn: true,
                args: {
                  ...mesg
                }
              })
            }
          ]
        };
        // 抢单失败
      } else {
        oogeMsg = {
          content: `
            <div class="sendSeizeOrderApplyMobile">
              <div class="top">
              【简讯信息】：抢单<span>${comInfo.about.comuInfo.acb213 ||
            "未知职位"}</span>失败，失败原因：<span>${mesg.mesg}</span>
              </div>
            </div>
          `,
          oogeOperation: [
            {
              hintText: "抢单失败",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      }
    }
    // 同意/拒绝抢单申请
    if (mesgType === 'respondSeizeOrder') {
      // 同意
      if (mesg.state) {
        oogeMsg = {
          content: `
          <div class ="respondSeizeOrder">
            <div class="top">
              【申请成功】：雇主<span>${comInfo.nowUser.aab004 ||
            comInfo.nowUser
              .aac003}</span>已<span>同意</span>雇员<span>${mesg.mesg.aac003
            }</span>发起的、关于用工岗位<span>${mesg.mesg.acb213 ? mesg.mesg.acb213 : "未知职位"
            }</span>的抢单申请，请点击本条消息<span>进行签约</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "同意抢单申请",
              callMethod: JSON.stringify({
                method: "acceptSeizeOrder",
                noBtn: true,
                args: {
                  ...mesg.mesg
                }
              })
            }
          ]
        };
        // 拒绝
      } else {
        oogeMsg = {
          content: `
          <div class ="respondSeizeOrder">
            <div class="top">
              【申请失败】：雇主<span>${comInfo.nowUser.aab004 ||
            comInfo.nowUser
              .aac003}</span>已<span>拒绝</span>雇员<span>${mesg.mesg.aac003
            }</span>发起的、关于用工岗位<span>${mesg.mesg.acb213 ? mesg.mesg.acb213 : "未知职位"
            }</span>的抢单申请
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "拒绝抢单申请",
              callMethod: JSON.stringify({
                method: "noClick",
                noBtn: true
              })
            }
          ]
        };
      }
    }
    // 签约成功
    if (mesgType === 'signingSuccess') {
      oogeMsg = {
        content: `
        <div class="signingSuccess">
          <div class="top">【简讯信息】：雇主<span>${mesg.acb2b4}</span>与雇员<span>${mesg.aac003}</span>关于职位<span>${mesg.acb213}</span>签约成功</div>
        </div>
          `,
        oogeOperation: [
          {
            hintText: "灵工签约成功",
            callMethod: JSON.stringify({
              method: "noClick",
              noBtn: true
            })
          }
        ]
      };
    }
    // // 工单完成申请
    // if (mesgType === 'sendCompleteApply') {
    //   oogeMsg = {
    //     content: `
    //     <div class="sendCompleteApply">
    //       <div class="top">【简讯信息】：雇主<span>${mesg.acb2b4}</span>您好，雇员<span>${mesg.aac003_cb2b}</span>正在申请完成工单<span>${mesg.acb213}</span></div>
    //     </div>
    //     `,
    //     oogeOperation: [
    //       {
    //         hintText: "工单完成申请",
    //         callMethod: JSON.stringify({
    //           method: "openCompleteApplyModal",
    //           noBtn: true,
    //           args: {
    //             ...mesg
    //           }
    //         })
    //       }
    //     ]
    //   };
    // }
    // 工单结算确认申请
    if (mesgType === 'sendSettleApply') {
      oogeMsg = {
        content: `
        <div class="sendSettleApply">
          <div class="top">【简讯信息】：雇员<span>${mesg.aac003_cb2b}</span>您好，雇主<span>${mesg.acb2b4}</span>邀请您对工单<span>${mesg.acb213}</span>进行结算</div>
        </div>
        `,
        oogeOperation: [
          {
            hintText: "工单结算确认申请",
            callMethod: JSON.stringify({
              method: "openSettleApplyModal",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 完成/结算成功
    if (mesgType === 'settleSuccess') {
      oogeMsg = {
        content: `
        <div class="sendSettleApply">
          <div class="top">【结算成功】：工单<span>${mesg.acb213}</span>已结算</div>
        </div>
        `,
        oogeOperation: [
          {
            hintText: "工单结算确认申请",
            callMethod: JSON.stringify({
              method: "noClick",
              noBtn: true
            })
          }
        ]
      };
    }
    // 发送富余劳动力
    if (mesgType === "sendSurplusLaborForce") {
      oogeMsg = {
        content: `
        <div class="sendFlexJobInfoMobile sendSurplusLaborForce sendSurplusLaborForceMobile">
           <div class="title">企业<span>${comInfo.nowUser.aab004}</span>为您推荐以下富余劳动力职位</div>
          <div class="mesgBody">
             <div>
               <div>
                 <span>${mesg.acb603Desc || "未知职位"}</span>
                 <span>余</span>
               </div>
               <span>${mesg.acb601 || 0}人 | ${mesg.acb00w || 0}元</span>
             </div>
             <div>
               <div>
                 <div>${mesg.acb606 || '未知联系方式'}</div>
                 <div>${mesg.acb607 || '未知联系人'}</div>
               </div>
               <div>发布时间：${moment(mesg.acb609).format("YYYY-MM-DD") ||
          "未知时间"}</div>
             </div>
             <div>【工作地点】：${mesg.acb605 || "未知工作地点"}</div>
           </div>
         </div>
         `,
        oogeOperation: [
          {
            hintText: "发送富余劳动力",
            callMethod: JSON.stringify({
              method: "toSurplusLaborForceDetail",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 发送缺工信息
    if (mesgType === "sendLackJobInfo") {
      oogeMsg = {
        content: `
         <div class="sendFlexJobInfoMobile sendLackJobInfo sendSurplusLaborForceMobile">
           <div class="title">企业<span>${comInfo.nowUser.aab004}</span>为您推荐以下缺工职位</div>
           <div class="mesgBody">
             <div>
               <div>
                 <span>${mesg.acb603Desc || "未知职位"}</span>
                 <span>缺</span>
               </div>
               <span>${mesg.acb601 || 0}人 | ${mesg.acb00w || 0}元</span>
             </div>
             <div>
               <div>
                 <div>${mesg.acb606 || '未知联系方式'}</div>
                 <div>${mesg.acb607 || '未知联系人'}</div>
               </div>
               <div>发布时间：${moment(mesg.acb609).format("YYYY-MM-DD") ||
          "未知时间"}</div>
            </div>
             <div>【工作地点】：${mesg.acb605 || "未知工作地点"}</div>
           </div>
        </div>
         `,
        oogeOperation: [
          {
            hintText: "发送缺工信息",
            callMethod: JSON.stringify({
              method: "toLackJobInfoDetail",
              noBtn: true,
              args: {
                ...mesg
              }
            })
          }
        ]
      };
    }
    // 发送视频聊天信息
    if (mesgType === 'inviteToVideoRoom') {
      if (comInfo.about.certificatInfo.acc05b === '1') {
        oogeMsg = {
          content: `
          <div class="videoInterview">
            <div>
              <span>雇员<span>${mesg.aac003}</span>您好</span>
              <span>雇主<span>${mesg.aab004}</span>邀请您进行视频聊天</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "视频聊天",
              callMethod: JSON.stringify({
                method: "videoChat",
                noBtn: true,
                args: {
                  ...mesg
                }
              })
            }
          ]
        };
      }
      if (comInfo.about.certificatInfo.acc05b === '2') {
        oogeMsg = {
          content: `
          <div class="videoInterview">
            <div>
              <span>雇主<span>${mesg.aab004}</span>您好，</span>
              <span>雇员<span>${mesg.aac003}</span>邀请您进行视频聊天</span>
            </div>
          </div>
          `,
          oogeOperation: [
            {
              hintText: "视频聊天",
              callMethod: JSON.stringify({// 内部向外部传递的内容
                method: "videoChat",
                noBtn: true,
                args: {
                  ...mesg
                }
              })
            }
          ]
        };
      }
    }
    window.uimSDK.imControl.message
      .sendOogeMsg(window.uimSDK.imControl.store.state.Chat.currentSession, oogeMsg)
      .then(ret => {
        console.log("sendOogeMsgret");
        console.log(ret);
      })
      .catch(e => {
        console.error(e.message);
      });

  }
}
let singleton

/**
 * 单例
 * @returns {*}
 */
function getIntance() {
  if (singleton == null) {
    singleton = new CustomMenu()
  }
  return singleton
}

export default getIntance();
