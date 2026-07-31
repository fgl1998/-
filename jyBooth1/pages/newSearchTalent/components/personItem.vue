<!-- 单个人才数据项 -->
<template>
  <div class="personItem">
    <div class="person_left">
      <div class="person_head">
        <div class="person_head_img">
          <img :src="personInfoItem.aae707" alt="" />
          <div class="icon_img">
            <img
              v-if="personInfoItem.aac004 == 1"
              :src="getRealImgUrl('img/xjPublicImg/man.png')"
              alt=""
            />
            <img
              v-else
              :src="getRealImgUrl('img/xjPublicImg/woman.png')"
              alt=""
            />
          </div>
        </div>
<!--        <el-button class="chart" @click="toUim(personInfoItem)">-->
<!--          <i class="el-icon-chat-dot-square" ></i>-->
<!--          沟通-->
<!--        </el-button>-->
      </div>

      <div
        class="person_info"
        @click="
          toTalentDetails(
            personInfoItem.aac001,
            personInfoItem.acc200,
            personInfoItem.user_id
          )
        "
      >
        <div class="person_info_top">
          <div class="name" :title="personInfoItem.aac003">
            {{ personInfoItem.aac003 }}
          </div>
          
          <div class="icon_imgs">
            <img
              :src="getRealImgUrl('img/unitCenterNew/pic_1.png')"
              alt=""
              title="实名认证已通过"
              @click.stop="noTo"
            />
            <img
              :src="getRealImgUrl('img/unitCenterNew/pic_2.png')"
              alt=""
              title="手机号已绑定"
              @click.stop="noTo"
            />
            <img
              :src="getRealImgUrl('img/unitCenterNew/pic_3.png')"
              alt=""
              title="邮箱已绑定"
              @click.stop="noTo"
              v-if="personInfoItem.email"
            />
            <img
              :src="getRealImgUrl('img/unitCenterNew/pic_4.png')"
              alt=""
              title="微信公众号已关注"
              @click.stop="noTo"
              v-if="personInfoItem.wx_openId"
            />
            <div class="up" v-if="personInfoItem.acc20d && personInfoItem.acc20d != 0">
              <img
                :src="getRealImgUrl('img/xjPublicImg/ic_up.png')"
                alt=""
                title="已置顶"
              />
            </div>
          </div>
        </div>
		<div class="info">
		  <span>年龄：{{personInfoItem.age ? personInfoItem.age : '未知'}}</span>
		  <span>学历：{{ personInfoItem.aac011 ? $codeConfig.getCodeLabel("AAC011", personInfoItem.aac011) : '未知' }}</span>
		  <span>工作经验：{{ personInfoItem.acc217 ? $codeConfig.getCodeLabel("ACC217", personInfoItem.acc217) : '未知'}}</span>
		  <span>期望薪资：{{ personInfoItem.acb242 ? personInfoItem.acb242 : '0' }} - {{personInfoItem.acb241 ? personInfoItem.acb241 : '不限'}}</span>
		</div>
        <div class="wish_box">
          <span>期望职位：{{ personInfoItem.aca112 ? personInfoItem.aca112 : '暂无' }}</span>
          <span>期望工作地：{{ personInfoItem.acb202 ? personInfoItem.acb202 : '暂无' }}</span>
        </div>
      </div>
    </div>

    <div class="person_right">
      <div class="person_right_left">
		  <h6>自我描述：</h6>
		  <span>{{personInfoItem.acc209}}</span>
      </div>
      <div class="person_right_right">
        <!--        <div class="up"><img :src="getRealImgUrl('img/unitCenterNew/ic_up.png')" alt=""> 置顶</div>-->
        <div class="interview" id="interview" @click="fnClick(personInfoItem)">
          邀请面试
        </div>
        <div class="time">{{ personInfoItem.aae396 ? personInfoItem.aae396 : '暂无' }} 更新时间</div>
      </div>
    </div>

    <talent-details
      :aac001="aac001"
      :acc200="acc200"
      :show-modal="showModal"
      @modalClose="modalClose"
      :userId="userId"
    ></talent-details>
    <el-dialog
      width="50%"
      :visible.sync="showInvitate"
      title="面试邀请"
      :modal-append-to-body="false"
    >
      <invitate-interview
        @colseInvitate="colseInvitate"
        @getInvitateMesg="getInvitateMesg"
        :aac001="aac001"
        :aac003="aac003"
        :acc200="acc200"
        :showInvitate="showInvitate"
      ></invitate-interview>
    </el-dialog>

    <!-- <company-uim-box ref="cpUimBox"></company-uim-box> -->

    <!-- <publish-job-list
      :visible="showPublishJobList"
      :user-info="userInfo"
      @getChoseJob="getChoseJob"
      @closePublishJobList="closePublishJobList"
    /> -->
  </div>
</template>
<script>
import talentDetails from "./talentDetails.vue";
import invitateInterview from "./invitateInterview.vue"; //面试邀请组件
// import companyUimBox from "@/corePage/common/part/companyUimBox.vue";
// import publishJobList from "@/corePage/unitCenter/common/part/publishJobList.vue";

export default {
  name: "personItem",
  props: {
    personInfoItem: {
      type: Object,
    },
  },

  components: {
    talentDetails,
    invitateInterview,
    // companyUimBox,
    // publishJobList,
  },

  data() {
    return {
      // 打开简历详情
      showModal: false,
      userId: "", //当前打开uim的userId
      // 人才详情参数
      aac001: '',
      acc200: '',
      aac003: "", //个人姓名
      // 当前账号信息
      userInfo: {},
      showInvitate: false, //面试邀请组件开关
      showPublishJobList: false, // 打开职位列表
      chatPersonInfo: {}, // 选中聊天人
    };
  },

  created() {
    //as设置用户信息
    this.userInfo = this.$loginConfig.getLoginInfo();
  },

  methods: {
    //跳转打开个人简历详细页面
    toTalentDetails(aac001, acc200, user_id) {
      this.aac001 = aac001;
      this.acc200 = acc200;
      if (this.userInfo && this.userInfo.aab001) {
        this.user_id = user_id;
        this.showModal = true;
      } else {
        this.$confirm('当前未登录单位用户', '是否返回首页登录后进行操作', {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          uni.navigateTo({
						url:'/pages/index/index'
					})
        }).catch(() => {
        });
        // this.$message.warning("当前未登录单位用户，请返回首页登录后进行操作");
      }
    },

    // 关闭人才详情页面
    modalClose(item) {
      this.showModal = item;
    },

    fnClick(item) {
      //邀请面试单击事件
      this.aac001 = item.aac001;
      (this.aac003 = item.aac003), (this.acc200 = item.acc200);
      this.showInvitate = true;
      //console.log("面试邀请页面");
    },

    colseInvitate(item) {
      //console.log(111)
      // 面试邀请组件关闭方法
      this.showInvitate = false;
    },

    getInvitateMesg(item) {
      // 获取面试邀请信息
    },

    // 跳转uim界面
    toUim(item) {
      //console.log("item", item);
      if (item.user_id) {
        this.showPublishJobList = true;
        this.chatPersonInfo = item;
      }
    },
    getChoseJob(item) {
      //console.log("item", item);
      if (item.acb210) {
        let data = {
          ...this.chatPersonInfo,
          ...item,
        };
        this.$refs.cpUimBox.openUim(data);
      }
    },
    closePublishJobList() {
      this.showPublishJobList = false;
    },
    // 不做跳转
    noTo() {},
  },
};
</script>
<style lang="less" scoped>
.interviewModal {
  width: 90vw;
  height: 90vh;
  position: fixed;
  top: 5vh;
  left: 5vw;
  right: 5vw;
  bottom: 5vh;
  z-index: 999;

  > .title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0065f1;
    padding: 0 50px;
    font-size: 16px;
    color: #ffffff;
    border-bottom: 1px solid #999;

    > img {
      cursor: pointer;
    }
  }

  > .invitateInterview {
    padding-top: 20px !important;
    height: calc(100% - 40px);
  }
}

.personItem {
  height: 100px;
  background-color: #fafcff;
  border: 1px solid #e8e9ea;
  overflow: hidden;
  display: flex;
  padding: 14px 19px 10px 19px;
  margin-bottom: 15px;

  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }

  .person_left {
    padding-top: 7px;
    width: calc(100% - 455px);
    border-right: 1px solid #e8e9ea;
    display: flex;

    .person_head {
      width: 68px;
      margin-right: 11px;

      .person_head_img {
        width: 57px;
        height: 57px;
        margin: 0 auto;
        position: relative;

        > img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .icon_img {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 20px;
          height: 20px;

          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .chart {
        margin-top: 16px;
        width: 68px;
        height: 25px;
        background-color: #f2fbf7;
        border-radius: 4px;
        border: solid 1px rgba(5, 159, 15, 0.82);
        color: #0cb56f;
        font-size: 14px;
        padding: 0;

        &:hover {
          background: #0cb56f;
          color: #fff;
        }
      }
    }

    .person_info {
      width: calc(100% - 79px);
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .person_info_top {
        display: flex;
        align-items: flex-end;

        .name {
          font-weight: 600;
          width: 80px;
          margin-right: 16px;
          font-family: MicrosoftYaHei-Bold;
          font-size: 18px;
          color: #4a515c;
        }

        

        .icon_imgs {
          display: flex;
          > img {
            width: 24px;
            height: 24px;
            object-fit: cover;
            vertical-align: top;
            margin-right: 2px;
            cursor: pointer;
          }
          .up {
            width: 26px;
            height: 25px;
            background-color: #f2fbf7;
            border-radius: 4px;
            border: solid 1px rgba(172, 234, 209, 0.82);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 12px;
            cursor: pointer;
          }
        }
		
      }
	  .info {
	    font-family: MicrosoftYaHei;
	    font-size: 14px;
	    color: #000000;
	    margin: 8px 0;
	    padding-bottom: 2px;
	  
	    > span {
	      &::after {
	        content: " | ";
	        display: inline;
	      }
	  
	      // &:nth-last-of-type(1) {
	      //   &::after {
	      //     display: none;
	      //   }
	      // }
	    }
	  }

      .wish_box {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #000000;

        > span {
          margin-right: 35px;
        }
      }

      .tips {
        height: 20px;

        > span {
          display: inline-block;
          padding: 4px 6px;
          vertical-align: top;
          background-image: linear-gradient(#e9edf2, #e9edf2),
            linear-gradient(#f2f5f9, #f2f5f9);
          border-radius: 2px;
          font-family: MicrosoftYaHei;
          font-size: 12px;
          color: #666666;
          margin-right: 6px;
        }
      }
    }
  }

  .person_right {
    width: 475px;
    display: flex;
    padding-left: 23px;

    .person_right_left {
      width: 50%;

      > h6 {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #56677e;
      }
	  >span {
		  margin-left: 20px;
	  }

      > p {
        font-family: MicrosoftYaHei;
        font-size: 18px;
        color: #ff7800;
        line-height: 33px;
      }

      .p_last {
        > span {
          // &::after {
          //   //content: '/';
          //   display: inline;
          // }

          // &:nth-last-of-type(1) {
          //   &::after {
          //     //content: '/';
          //     display: none;
          //   }
          // }
        }
      }
    }

    .person_right_right {
      display: flex;
      flex-direction: column;
      width: 50%;
      text-align: right;
      justify-content: space-between;

      .up {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #0cb56f;
        text-align: right;
        display: inline;
        cursor: pointer;

        > img {
          width: 12px;
          height: 12px;
          object-fit: cover;
        }
      }

      .interview {
        cursor: pointer;
        width: 105px;
        height: 36px;
        text-align: center;
        margin-right: 0;
        margin-left: auto;
        line-height: 36px;
        background-image: linear-gradient(#1380ff, #1380ff),
          linear-gradient(#0070f2, #0070f2);
        background-blend-mode: normal, normal;
        border-radius: 4px;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #ffffff;
      }

      .time {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #869bb3;
        opacity: 0.7;
      }
    }
  }

  // &:hover {
  //   height: 159px;
  //   transition: all 0.5s;

  //   .wish_box > span:nth-of-type(1) {
  //     display: block;
  //     margin-bottom: 12px;
  //   }

  //   #p_last {
  //     > span {
  //       display: block;

  //       &::after {
  //         display: none;
  //       }
  //     }
  //   }

  //   #interview {
  //     width: 80px;
  //     height: 86px;
  //     color: #1380ff;
  //     font-size: 14px;
  //     line-height: unset;
  //     background: #dcf0ff;
  //     border-radius: 2px;
  //     padding: 15px 11px;

	 //  &::before {
		// content: "";
		// display: block;
		// width: 44px;
		// height: 31px;
		// margin: 0 auto;
		// background: url("@/static/images/img/unitCenterNew/ic_interview_room.png")
		//   no-repeat center center;
		// background-size: cover;
		// margin-bottom: 10px;
	 //  }
  //   }
  // }
}
</style>
