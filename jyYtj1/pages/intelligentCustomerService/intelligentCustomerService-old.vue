<template>
  <div class="page">
    <!-- 岗位列表 -->
    <common-header></common-header>
    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div id="AILink" v-if="channelCod">
            <iframe :src="`https://www.schrss.org.cn/aipc/index.html#/?channel=guanganytj&aac001=${userInfo.aac001}&ddtk=5v4bJf3tUuYzKq8pXgRs`"
              width="100%" height="100%" frameborder="0" allow="camera *; microphone *" />
            <!-- <iframe
              :src="`https://gajy.org.cn/kfmobile/?apiChannelCode=3&channelCode=${channelCod}&botUserId=${botUserId}&token=${token}`"
              width="100%" height="100%" frameborder="0" /> -->
          </div>
        </div>
      </div>
    </div>
    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
    <!-- https://gajy.org.cn/kfmobile/ -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isLogin: false,
        userInfo: {},
        channelCod: '',
        botUserId: '', // 随机数或者是用户id
        token: '',
      }
    },
    onShow() {
      this.userInfo = uni.getStorageSync("userInfo");
      if (this.userInfo) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
      if (this.userInfo) {
        // 求职端
        this.channelCod = 'WEB30991597807'
        this.botUserId = userInfo.aac001
      } else {
        // 求职端
        this.channelCod = 'WEB30991597807'
        this.botUserId = Math.floor(Math.random() * 3000)
      }

    },
    mounted() {
      window.addEventListener("message", (data) => {
        // if (data.origin != "https://gajy.org.cn/kfmobile/")
        //     return;
        if (data.data.data.url) {
          this.$utils.navigateTo(data.data.data.url)
        }

      })
    },
    methods: {
      login() {
        this.$utils.navigateToLogin()
      }
    }
  }
</script>

<style lang="scss" scoped>
  // .wrap-box {
  // 	border: 1px solid #A2A7A9;
  // }
  #AILink {
    width: 1760px;
    height: 760px;
    z-index: 1000;
  }
</style>