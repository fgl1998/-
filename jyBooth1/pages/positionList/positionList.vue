<template>
  <div class="positionList">
    <div class="top_head">
      <div class="left_box">
        <img :src="companyInfo.headImg" alt="" />
        <div class="info_box">
          <div>
            {{ companyInfo.aab004 ? companyInfo.aab004 : '未知公司名称' }}
          </div>
          <div>
            <span
              >企业类型：{{
                companyInfo.aab019 ? $codeConfig.getCodeLabel('AAB019', companyInfo.aab019) : '未知'
              }}</span
            >
            <span
              >企业规模：{{
                companyInfo.aab056 ? $codeConfig.getCodeLabel('AAB056', companyInfo.aab056) : '未知'
              }}</span
            >
            <span
              >所属行业：{{
                companyInfo.aab022 ? $codeConfig.getCodeLabel('AAB022', companyInfo.aab022) : '未知'
              }}</span
            >
            <span>工作地点：{{ companyInfo.aae006 ? companyInfo.aae006 : '未知' }}</span>
          </div>
        </div>
      </div>
      <div class="right_box">
        <div class="notice_box">
          <div>扫一扫，了解企业更多资讯</div>
          <img src="@/static/images/loginPage/ic_right.png" alt="" />
        </div>
        <div class="code">
          <img :src="codeUrl" @click="handleGetWxCode" alt="" />
        </div>
      </div>
    </div>
    <div class="container_box">
      <one-job :jobList="jobList" v-if="jobList.length == 1"></one-job>
      <two-job :jobList="jobList" v-if="jobList.length == 2"></two-job>
      <multiple-job :jobList="jobList" v-if="jobList.length > 2"></multiple-job>
    </div>
  </div>
</template>

<script>
import MultipleJob from './component/multipleJob.vue'
import oneJob from './component/oneJob.vue'
import TwoJob from './component/twoJob.vue'
export default {
  components: { oneJob, TwoJob, MultipleJob },
  name: 'positionList',
  data() {
    return {
      userInfo: {},
      companyInfo: {},
      jobList: [],
      // 二维码图片地址
      codeUrl: null,
      positionListTimer: null, // 职位列表定时器
    }
  },
  mounted() {
    this.userInfo = uni.getStorageSync('loginInfo')
    if (this.userInfo && this.userInfo.aab001) {
      this.getCompanyInfo()
      this.getPositionList()
      // 五分钟
      this.positionListTimer = setInterval(() => {
        this.getPositionList()
      }, 300000)
    }
  },
  watch: {
    userInfo(val) {
      if (val) {
        if (val.aab001) {
          this.handleGetWxCode()
        }
      }
    },
  },
  methods: {
    // 获取企业信息
    getCompanyInfo() {
      let param = {
        apiCode: 'jy201_hrm204',
        method: 'jy201_hrm204',
        aab001: this.userInfo.aab001,
      }
      this.$http.request('/api/business/getData.do', 'post', param, true).then((data) => {
        if (data.errors.length > 0) {
          uni.showToast({
            title: data.errors[0].msg,
            icon: 'error',
          })
        } else {
          if (data) {
            this.companyInfo = data.data.data
            this.companyInfo.headImg = this.companyInfo.aae707
              ? this.utils.getFileLoadUrl(this.companyInfo.aae707)
              : this.getRealImgUrl('img/publicImg/default_company.png')
          }
        }
      })
    },
    // 获取职位列表
    getPositionList() {
      let params = {
        apiCode: 'jy204_hrm252',
        method: 'jy204_hrm252',
        aab001: this.userInfo.aab001,
        acb330: this.userInfo.acb330,
      }
      this.$http.request('/api/business/getData.do', 'post', params, false).then((data) => {
        if (data.errors.length > 0) {
          // uni.showToast({
          //   title: data.errors[0].msg,
          //   icon: "error",
          // });
        } else {
          if (data) {
            this.jobList = data.data.data
            //console.log('list',this.jobList)
          }
        }
      })
    },
    // 获取小程序二维码
    handleGetWxCode() {
      let path = 'pages/find/newCompanyDetail/newCompanyDetail'
      let params = {
        method: 'wx_maqrcode',
        apiCode: 'wx_maqrcode',
        pageUrl: path,
        sceneStr: this.userInfo.aab001,
        type: 1, //体验版小程序2;正式版小程序1
      }
      this.$http.request('/api/business/getData.do', 'post', params, true).then((data) => {
        if (data.errors.length > 0) {
          uni.showToast({
            title: data.errors[0].msg,
            icon: 'error',
          })
        } else {
          //console.log(data,'二维码data')
          this.codeUrl = 'data:image/jpg;base64,' + data.data.data
          this.$emit('success')
        }
      })
    },
  },
  beforeDestroy() {
    clearInterval(this.positionListTimer)
  },
}
</script>

<style lang="less" scoped>
.positionList {
  width: 100%;
  height: 100vh;
  background-color: #00489e;
  padding: 48px;
  box-sizing: border-box;
  > .top_head {
    width: 100%;
    height: 344px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 16px;
    > .left_box {
      display: flex;
      align-items: center;
      width: calc(100% - 720px);
      padding: 0 0 0 46px;
      box-sizing: border-box;
      > img {
        width: 220px;
        height: 220px;
        margin-right: 54px;
      }
      > .info_box {
        width: calc(100% - 220px - 54px);
        height: 220px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        > div:nth-of-type(1) {
          font-size: 106px;
        }
        > div:nth-of-type(2) {
          font-size: 44px;
          display: flex;
          align-items: center;
          > span {
            display: inline-block;
            width: 20%;
          }
          > span:last-of-type {
            width: 40%;
          }
        }
      }
    }
    > .right_box {
      width: 720px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 0 40px;
      box-sizing: border-box;
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
      border-radius: 0px 16px 16px 0px;
      > .notice_box {
        display: flex;
        align-items: center;
        font-family: SourceHanSansCN-Regular;
        font-size: 44px;
        color: #ffffff;
        font-weight: 400;

        > div {
          width: 282px;
          margin-right: 6px;
          line-height: 72px;
        }
        > img {
          width: 32px;
        }
      }
      > .code {
        width: 328px;
        height: 328px;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  > .container_box {
    width: 100%;
    border-radius: 18px;
    height: calc(100% - 344px);
  }
}
</style>
