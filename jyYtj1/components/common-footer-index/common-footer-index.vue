<template>
  <div class="footer">
    <div class="index-footer">
      <div class="is-login login-part" v-if="isLogin">
        <div class="islogin-text">
          <div class="login-name">{{ userName ? userName : '' }}，您好，欢迎登录太原就业自助服务一体机！</div>
        </div>
        <button class="index-fbtn index-btn-out" @click="loginOut">退出登录</button>
      </div>

      <div class="un-login login-part" v-else>
        <div class="islogin-text">
          <div class="login-name">您好，欢迎使用就业自助服务系统！</div>
        </div>
        <button class="index-fbtn index-btn-register" @click="toPage(1)">立即登录</button>
      </div>
    </div>

    <view class="container-modal-outLogin">
      <!-- 普通弹窗 -->
      <uni-popup ref="popup">
        <!-- ... -->
        <div class="modal-part">
          <div class="part-top"><span @click="cancelBtn"></span></div>
          <div class="part-bottom">
            <div class="part-bottom-text">温馨提示</div>
            <div class="part-bottom-text-tip">您好，请您确认是否需要退出登录呢？</div>
            <div class="part-bottom-btn-box">
              <div class="part-bottom-btn btn-cancel" @click="cancelBtn">取消</div>
              <div class="part-bottom-btn btn-verify" @click="verifyBtn">确定</div>
            </div>
          </div>
        </div>
      </uni-popup>
    </view>
  </div>
</template>

<script>
export default {
  name: 'common-footer-index',
  mounted() {
    this.countDown()
    this.seeChange()
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true,
    },
    isRegist: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      default: '',
    },
    userSex: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      timer: 90,
      clickHandler: null,
    }
  },

  methods: {
    seeChange() {
      // 监听点击事件
      this.clickHandler = () => {
        if (this.isLogin) {
          this.timer = 90
        } else {
          this.timer = 300
        }
      }
      window.addEventListener('click', this.clickHandler)
    },
    toPage(index) {
      switch (index) {
        case 0:
          this.$utils.redirectTo('/pages/register/register')
          break
        case 1:
          this.$utils.navigateToLogin()
          break
        case 2:
          this.$utils.redirectTo('/pages/index/index')
          break
        default:
          const pages = getCurrentPages() // 获取当前页面栈的实例
          const prevPage = pages[pages.length - 2] // 上一个页面
          if (prevPage && prevPage.route && prevPage.route.indexOf('/login') != -1 && this.isLogin) {
            //console.log('用户已登陆');
          } else {
            this.$utils.navigateBack(1)
          }
          break
      }
    },
    countDown() {
      if (this.isLogin) {
        clearInterval(uni.getStorageSync('timerTask'))
        this.timer = 90
        let timerTask = setInterval(() => {
          if (this.timer <= 0) {
            clearInterval(uni.getStorageSync('timerTask'))
            uni.setStorageSync('userInfo', '')
            this.$emit('login', false)
            //console.log("倒计时退出");
          } else {
            // console.log(11);
            this.timer--
          }
        }, 1000)
        uni.setStorageSync('timerTask', timerTask)
      } else {
        clearInterval(uni.getStorageSync('timerTask'))
        this.timer = 300
        let timerTask = setInterval(() => {
          if (this.timer <= 0) {
            clearInterval(uni.getStorageSync('timerTask'))
            uni.setStorageSync('userInfo', '')

            let ace711 = uni.getStorageSync('ace711') //避免在设备注册页等待过长进入等待页面（即没有注册机器，没有ace711设备码时，不允许进入等待页面）
            if (ace711) {
              this.$utils.navigateTo('/pages/waitPage/index')
            }
            //console.log("倒计时退出");
          } else {
            // console.log(this.timer);
            this.timer--
          }
        }, 1000)
        uni.setStorageSync('timerTask', timerTask)
      }
    },
    //退出登录
    loginOut() {
      this.$refs.popup.open()
    },
    cancelBtn() {
      this.$refs.popup.close()
    },
    verifyBtn() {
      uni.setStorageSync('userInfo', '')
      uni.setStorageSync('resumeInfo', '')
      uni.setStorageSync('setToken', '')
      this.$emit('login', false)
      this.$refs.popup.close()
      this.$utils.showToast('退出成功')
      setTimeout(() => {
        this.$utils.navigateTo('/pages/index/index')
      }, 1000)
      clearInterval(uni.getStorageSync('timerTask'))
    },
    beforeDestroy() {
      // 取消监听点击事件
      window.removeEventListener('click', this.clickHandler)
    },
  },
}
</script>

<style lang="less">
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .index-footer {
    width: 1200px;
    height: 120px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 120px 120px 120px 120px;
    margin: 0 auto;
    display: flex;
    align-items: center;

    .login-part {
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      .islogin-text {
        width: 800px;
        height: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 30px;
        color: #002152;
        line-height: 35px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .index-fbtn {
        width: 260px;
        height: 95px;
        background: url('../../static/images//index/Rectangle.png') center no-repeat !important;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 30px;
        color: #ffffff;
        line-height: 75px;
        text-shadow: 0px 2px 1px rgba(0, 70, 198, 0.45);
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin: 10px 0 0;
        padding: 0;
        border: none;
        outline: none;
        border-radius: 0;

        &::after {
          border: 0;
        }
      }
    }
  }

  .other-footer {
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    padding: 0 80px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 0px 0px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .footer-lt {
      width: 760px;
      height: 42px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 30px;
      color: #002152;
      line-height: 42px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }

    .footer-rt {
      width: 410px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
