<template>
  <div class="companyNoLogin" @click="toLogin">
    <h1>欢迎使用太原人力资源展位系统</h1>
  </div>
</template>

<script>
export default {
  name: 'companyNoLogin',
  data() {
    return {
      userInfo: {},
    }
  },
  mounted() {
    // this.userInfo = uni.getStorageSync("loginInfo");
  },
  methods: {
    toLogin() {
      uni.navigateTo({
        url: '/pages/loginPage/loginPage',
      })
    },
  },
}
</script>

<style lang="less" scoped>
.companyNoLogin {
  background: url('@/static/images/img/unitCenter/bg.png') no-repeat center center;
  background-size: 100% 100%;
  width: 1366;
  height: 768px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > h1 {
    text-align: center;
    font-size: 80px;
    color: #fff;
  }
}
</style>
