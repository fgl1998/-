<!--
 * @Description: 邀请页面
 * @Date: 2022-03-16 16:58:10
 * @LastEditTime: 2022-03-29 15:57:33
-->
<template>
  <div class="invite-container">
    <div class="content" :class="isMobile && 'content-mobile'">
      <!-- rtc 房间 -->
      <comp-room v-show="flag"
                 type="invite"
                 :sdkAppId="sdkAppId"
                 :userSig="userSig"
                 :userId="this.baseInfo.user_id ? this.baseInfo.user_id : ''"
                 :roomId="adz210"
                 :communicator="communicator"
                 ref="rtc">
      </comp-room>
    </div>
  </div>
</template>

<script>
import CompRoom from "./../components/comp-room.vue";

export default {
  name: "Invite",
  props: {
    isShow: {
      type: Boolean,
    },
    adz210: {
      type: Number,
    },
    communicator: {
      type: String,
    },
  },
  data() {
    return {
      isMobile: false,
      userInfo: {}, // 面试人员
      baseInfo: {}, // 登录用户
      flag: this.isShow,
      sdkAppId: 0,
      userSig: "",

      // userId: "120",
      // roomId: 164,
    };
  },
  components: {
    CompRoom,
  },
  created() {
    this.baseInfo = this.$loginConfig.getLoginInfo();

    setTimeout(() => {
      if (this.baseInfo && this.adz210) {
        this.getSecretKey(this.baseInfo.user_id);
      }
    }, 100);
  },
  watch: {
    adz210(val) {
      if (val) {
        if (this.baseInfo && val) {
          this.getSecretKey(this.baseInfo.user_id);
        }
      }
    },
  },
  mounted() {
  },
  methods: {
    getSecretKey(key) {
      if (!this.adz210) {
        this.$utils.showToast('未获取到房间号，请重试！')
        return
      }

      const params = {
        apiCode: "getUserInfo",
        method: "getUserInfo",
        adz210: this.adz210,
        adz221: '2',
        adz222: key,
      };

      this.$http.post(this.$requestConstant.businessRequestType, 'getUserInfo', null, params, true).then((responseData) => {
        // 业务信息成功处理
        let res = responseData ? responseData.data : {};
        if (res.errors && res.errors.length > 0) {
          this.$utils.showToast(res.errors[0].msg);
        } else {
          this.userInfo = (res.data && res.data.data) || {};
          this.sdkAppId = this.userInfo.sdkappId;
          this.userSig = this.userInfo.userSign;
          this.flag = true;
        }
      });
    },

    async closeRoom() {
      await this.$refs.rtc.closeRoom();
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;

}
</style>
