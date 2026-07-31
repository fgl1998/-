<template>
  <div v-if="isShowUim" class="uim">
    <div v-if="uimStyle == 0" class="uimContent uimBox">
      <img :src="getRealImgUrl('img/personInterview/close.png')" class="close" @click="closeUim">
      <pc-chat v-if="isLogin" :uim-type="uimType" :show-title="showTitle" :com-info="comInfo">
        <template slot="header">
          <uimHeader :header-type="headerType" :communicator="comInfo.communicator"/>
        </template>
        <template slot="tools">
          <uimTools :fuc="fuc"/>
        </template>
      </pc-chat>
    </div>

    <!--    <div v-else-if="uimStyle == 1" class="uimContent uimBox">-->
    <!--      <pc-chat v-if="isLogin" :uim-type="uimType" :show-title="false" :com-info="comInfo"/>-->
    <!--    </div>-->
    <div v-else-if="uimStyle == 1" class="liveComment">
      <div class="commentBody">
        <pc-chat v-if="isLogin" :uim-type="uimType" :show-title="false" :com-info="comInfo"/>
      </div>
    </div>
  </div>
</template>

<script>
import {PcChat, PcSessionList, UIMClient,} from '@yh/uim-web-ui'
import Config from './../../../static/public/uim/config.js'

export default {
  name: 'uimBox',
  components: {
    PcChat,
    PcSessionList,
  },
  props: {
    currentInfo: {
      type: Object,
    },
    uimType: {
      type: Number,
      default: 0,
    },
    isShowUim: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    uimStyle: {
      type: Number, // 0 - 仅聊天框， 1 - 手机端宽度， 2 - 聊天框+聊天列表
      default: 0,
    },
  },
  data() {
    return {
      fuc: [],
      loginId: '', // 当前方uim账号
      loginIdName: '', // 当前方uim名称
      chatto: '', // 对话方uim账号
      chattoName: '', // 对话方uim名称

      identity: '2', // 当前用户身份标识
      userInfo: {}, // 当前登录的账号信息
      comInfo: {}, // 传给uim的值
      isLogin: false, // uim是否登录
      // 其他聊天
      personInfo: {}, // 个人信息
      companyInfo: {}, // 单位信息
      // 灵活用工
      employerInfo: {}, // 雇主信息
      employeeInfo: {}, // 雇员信息
      // 共享用工
      ourCompanyInfo: {}, // 己方公司
      oppCompanyInfo: {}, // 己方公司
      headerType: '', // 1 个人 2 公司、机构
    }
  },
  computed: {
    loginMesg() {
      return {
        loginId: this.loginId,
        chatto: this.chatto,
      }
    },
  },
  watch: {
    // 是否显示聊天界面
    isShowUim(val) {
      if (val) {
        this.userInfo = this.$loginConfig.getLoginInfo();
        this.companyInfo = this.userInfo;
        this.identity = "2"
        this.comInfo = {
          ...this.currentInfo,
        }
        this.getCompanyInfo(this.userInfo.user_id);
        this.getPersonInfo(this.currentInfo.comuInfo.aac301)
      } else {
        this.isLogin = false
      }
    },
    // 监听操作信息
    currentInfo(val) {
      if (val) {
        this.comInfo = {
          ...val,
        }
        this.getPersonInfo(val.comuInfo.aac301)
      }
    },
    // 单位信息
    companyInfo(val) {
      if (val) {
        this.chatto = val.uid || val.aac301 ? val.aac301.toString() : val.aab500.toString()
        this.chattoName = val.nikeName || val.acb224 ? val.acb224.toString() : val.aab004.toString()
        this.comInfo = {
          ...this.comInfo,
          communicator: {
            ...val,
          },
        }
        uni.setStorageSync('comInfo', JSON.stringify(this.comInfo))
      }
    },
    // 个人信息
    personInfo(val) {
      if (val) {
        // 个人开启聊天
        this.loginId = val.uid || val.aac301 ? val.aac301.toString() : '';
        this.loginIdName = val.nikeName || val.aac003 ? val.aac003.toString() : '';
        this.comInfo = {
          ...this.comInfo,
          nowUser: {
            ...val,
          },
        }
        uni.setStorageSync('comInfo', JSON.stringify(this.comInfo))
      }
    },
    // 登录所需个人信息
    loginMesg(val) {
      if (val.loginId && val.chatto) {
        console.log("this.loginId1", this.loginId, val.loginId)
        this.doLogin()
      }
    },
  },
  created() {
    this.userInfo = this.$loginConfig.getLoginInfo();
    this.identity = '2';
    this.headerType = '2';
  },
  mounted() {
    console.log("登录：", this.userInfo, this.currentInfo)

    this.$nextTick(() => {
      this.comInfo = {
        about: {
          ...this.currentInfo,
        },
      }

      console.log("登录：", this.userInfo, this.currentInfo)
      // 单位登录
      this.getCompanyInfo(this.userInfo.user_id)
      this.getPersonInfo(this.currentInfo.comuInfo.aac301)
      this.fuc = [0, 3, 4]
    })
  },
  methods: {
    // 1.登录个人账号
    async doLogin() {
      const authRes = await this.getLoginKey(this.loginId)
      let loginKey
      if (
          authRes &&
          authRes.code === 200 &&
          authRes.data.data.success === true
      ) {
        loginKey = authRes.data.data.data.loginKey
      }
      if (!loginKey) {
        this.$utils.showToast('UIM登录失败')
        return
      }
      UIMClient.login(this.loginId, loginKey, res => {
        if (res.code === 0) {
          // 单位
          const user = {
            uid: this.loginId,
            nickName: this.loginIdName,
          }
          console.log("当前登录用户1：", user, res);
          UIMClient.setUserInfo(user, ret => {
            console.log("当前登录用户2：", user, ret);
            // 3.开启聊天
            this.chatTo()
          })
        } else {
          this.$utils.showToast(res.msg);
        }
      });
    },

    // 3.开启聊天
    async chatTo() {
      UIMClient.getUserByUserId(this.chatto, info => {
        if (info.code == 0) {
          UIMClient.chatTo(this.chatto, () => {
            this.isLogin = true
            console.log("聊天对象登录用户1：", this.chatto, info);
          })
        } else {
          // 4.设置对方用户信息
          const user = {
            uid: this.chatto,
            nickName: this.chattoName,
          }
          console.log("聊天对象登录用户2：", user, info);
          UIMClient.setUserInfo(user, ret => {
            // 4.开启聊天
            this.chatNewChatTo(this.chatto)
          })
        }
      })
      this.initLisentner()
    },

    // 5.设置对方用户开启聊天,开启聊天框
    async chatNewChatTo(chatto) {
      UIMClient.getUserByUserId(chatto, info => {
        if (info.code == 0) {
          UIMClient.chatTo(chatto, () => {
            this.isLogin = true
          })
        } else {
          this.$utils.showToast('开启聊天失败，联系管理员')
        }
      })
      this.initLisentner()
    },

    // 根据 aab500 查询公司信息 aac301 查询Hr信息
    getCompanyInfo(aab500) {
      if (aab500) {
        const params = {
          apiCode: 'jy001_base102',
          method: 'jy001_base102',
          uimId: aab500,
        }
        this.$http.post(this.$requestConstant.businessRequestType, 'jy001_base102', null, params, true).then((responseData) => {
          let data = responseData ? responseData.data : {};
          console.log("getCompanyInfo jy001_base102", responseData);
          // 业务信息成功处理
          if (data.serviceSuccess) {
            // hr信息
            this.companyInfo = {
              ...data.data.result.ab01Info,
              ...data.data.result.ab01ContactPo,
              nickName: data.data.result.nikeName,
              user_id: data.data.result.uid,
            }
            console.log("getCompanyInfo jy001_base102 personInfo", this.companyInfo);
          } else {
            this.$utils.showToast(data.errors[0].msg)
          }
        });
      }
    },

    // 根据aac301查询个人信息
    getPersonInfo(aac301) {
      if (aac301) {
        const params = {
          apiCode: 'jy001_base102',
          method: 'jy001_base102',
          uimId: aac301,
        }
        this.$http.post(this.$requestConstant.businessRequestType, 'jy001_base102', null, params, true).then((responseData) => {
          let data = responseData ? responseData.data : {};
          console.log("getPersonInfo jy001_base102", responseData);
          // 业务信息成功处理
          if (data.serviceSuccess) {
            this.personInfo = {
              ...data.data.result.ac01MemberInfo,
              ...data.data.result.ac01Info,
              nickName: data.data.result.nikeName,
              user_id: data.data.result.uid,
            }
            console.log("getPersonInfo jy001_base102 personInfo", this.personInfo);
          } else {
            this.$utils.showToast(data.errors[0].msg)
          }
        });
      }
    },

    // 监听
    initLisentner() {
      // 敏感词过滤
      UIMClient.removeListener('detectSensitiveWords')
      UIMClient.addListener('detectSensitiveWords', (ret) => {
        if (ret && ret.code === 0) {
          const param = {
            apiCode: 'checkWord',
            method: 'checkWord',
            words: ret.result.text,
          }
          this.$http.post(this.$requestConstant.businessRequestType, 'checkWord', null, param, true).then((responseData) => {
            let data = responseData;
            // 业务信息成功处理
            if (data.serviceSuccess) {
              const paramter = {
                sessionId: ret.result.session.sessionId,
                text: data.data.words,
              }
              UIMClient.sendMsg(paramter)
            } else {
              this.$utils.showToast(data.errors[0].msg)
            }
          });
        }
      })
    },

    // 关闭聊天界面
    closeUim() {
      this.loginId = ''
      this.chatto = ''
      this.userInfo = {}
      this.comInfo = {}
      this.isLogin = false
      this.personInfo = {}
      this.companyInfo = {}
      this.$emit('closeUim', false)
    },

    // 获取loginKey
    getLoginKey(loginId) {
      return new Promise(resolve => {
        const param = {
          apiCode: 'login_base006',
          loginId: loginId,
          url: Config.serverUrl,
        }
        this.$http.post(this.$requestConstant.businessRequestType, 'login_base006', null, param, true).then((responseData) => {
          let data = responseData ? responseData.data : {};
          resolve(data);
        });
      });
    },
  },
}
</script>

<style lang="less" scoped>
@import '@yh/uim-web-ui/lib/uim-web-ui.css';

.liveComment {
  width: 100%;
  height: 100%;

  * {
    //box-sizing: border-box;
    //border: 1px solid red;
  }

  > .commentBody {
    width: 100%;
    height: calc(100% - 6px);
    background-color: #E6EFFD;
    position: relative;
  }
}

/deep/ .uim-pc-wrap {
  width: 100%;
  height: 100%;
  position: relative !important;

  box-sizing: border-box;
}

/deep/ .uim-pc-main {
  min-height: 500px;
  height: calc(100% - 200px) !important;

  box-sizing: border-box;

  #scrollContainer {
    position: relative;

  }
}

/deep/ .chat-input-box {
  height: 200px !important;
  padding: 10px;

  box-sizing: border-box;

}

</style>
