<template>
  <div class="page">
    <!-- 首页 -->
    <common-header :key="key"></common-header>
    <div class="index-wrap">
      <div class="index-nav">
        <div class="left-user">
          <div class="robot-top">
            <div class="robot-img" @click="toIntelligentCustomerService">
              <!-- <div class="robot-img"> -->
              <image src="../../static/images/index/robot2.gif" mode="aspectFit" class="robot-logo" />
            </div>
            <div class="robot-text"><span>Hi，我是智能客服小圆，点我可咨询哦～</span></div>
          </div>
          <div class="user-bottom">
            <div class="title-name" @click="toCenterPage">用户中心</div>

            <div class="title-ul">
              <div class="title-list" v-for="(item, index) in userNav" :key="index" @click="toPageUser(item)">
                <span>
                  <image :src="item.logo" mode="aspectFit" class="userNav-logo" />
                </span>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="right-link">
          <div class="top-info">
            <div class="message" @click="toPageNews">
              <vueSeamlessScroll :data="source" class="seamless-warp" :class-option="optionSingleHeightTime">
                <div v-for="(item, index) in source" :key="index" class="list">
                  <div class="text">
                    <span class="left-arrow"></span>
                    <span :title="item.acz02q">{{ item.acz02q }}</span>
                  </div>

                  <div class="date">{{ $utils.dateFormat(item.acc645) }}</div>
                </div>
              </vueSeamlessScroll>
            </div>
            <div class="btn" @click="toPageNews">更多政策</div>
          </div>
          <div class="center-link">
            <div
              :class="['nav-item', 'nav-bg' + index]"
              v-for="(item, index) in indexNav"
              :key="index"
              @click="toPage(item)"
            >
              <image :class="['nav-icon', 'nav-icon' + index]" :src="item.icon" mode="aspectFit"></image>
              <div class="nav-record">
                <div class="nav-name">{{ item.name }}</div>
                <div class="nav-text">{{ item.text }}</div>
              </div>
            </div>
          </div>
          <div class="bottom-menu">
            <div class="use-nav">
              <div
                :class="['use-item', 'use-bg' + index]"
                v-for="(item, index) in useNav"
                :key="index"
                @click="toPage(item)"
              >
                <div class="use-img">
                  <image :src="item.logo" mode="aspectFit" class="use-logo"></image>
                </div>
                <div class="use-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-modal ref="modalPopup"></common-modal>

    <common-footer-index
      ref="footer"
      :userName="userInfo.aac003"
      :userSex="userInfo.aac004"
      :isLogin="isLogin"
      @login="login"
    ></common-footer-index>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import DOMPurify from 'dompurify';
export default {
  components: {
    vueSeamlessScroll,
  },
  onShow: function () {
    this.userInfo = uni.getStorageSync('userInfo')
    this.initNews()
    if (this.userInfo) {
      this.isLogin = true
      if (this.$refs.modalPopup != undefined) {
        this.$refs.modalPopup.close()
      }
    } else {
      this.isLogin = false
      if (this.$refs.modalPopup != undefined) {
        this.$refs.modalPopup.close()
      }
    }
    this.key++
    this.initNews()
	const isNotifyed = uni.getStorageSync('isNotifyed')
	if(isNotifyed){
		return
	}
	this.initNotify()
  },
  computed: {
    optionSingleHeightTime() {
      return {
        singleHeight: 36,
        hoverStop: true,
        openWatch: true,
        waitTime: 7000,
        limitMoveNum: this.source ? this.source.length : 2,
      }
    },
  },
  data() {
    return {
      key: 0,
      userInfo: {},
      isLogin: true,
      allowScroll: true,
      source: [],
      userNav: [
        {
          logo: '../../static/images/index/left-icon-1.png',
          name: '我的简历',
          url: '/pages/personalCenter/myResume/myResume',
        },
        {
          logo: '../../static/images/index/left-icon-2.png',
          name: '我的投递',
          url: '/pages/personalCenter/myApplication/myApplication',
        },
        {
          logo: '../../static/images/index/left-icon-3.png',
          name: '我的收藏',
          url: '/pages/personalCenter/myCollection/myCollection',
        },
		{
		  logo: '../../static/images/index/left-icon-3.png',
		  name: '意愿采集',
		  url: '/pages/laborInformationCollection/labourIndex/labourIndex',
		},
      ],

      indexNav: [
        {
          logo: '../../static/images/index/icon-bg-1.png',
          icon: '../../static/images/index/icon-top-1.png',
          name: '办事指南',
          text: '服务事项，办事指南查询服务',
          url: '/pages/policyServices/workGuide/workGuide',
        },
        {
          logo: '../../static/images/index/icon-bg-2.png',
          icon: '../../static/images/index/icon-top-2.png',
          name: '找工作',
          text: '通过工作岗位，快速找工作',
          url: '/pages/jobRecruitment/findWork/findWork',
        },
        {
          logo: '../../static/images/index/icon-bg-3.png',
          icon: '../../static/images/index/icon-top-3.png',
          name: '找企业',
          text: '通过单位检索，快速定位单位',
          url: '/pages/jobRecruitment/findUnit/findUnit',
        },
        {
          logo: '../../static/images/index/icon-bg-4.png',
          icon: '../../static/images/index/icon-top-4.png',
          name: '零工市场',
          text: '找工作，就来零工市场',
          url: '/pages/jobRecruitment/findWork/findOddJob',
        },
      ],
      useNav: [
        // 	{
        // 	logo: '../../static/images/index/list-icon-1.png',
        // 	name: '创业项目',
        // 	url: '/pages/entrepreneurialProject/projectIndex/projectIndex',
        // },
        {
          logo: '../../static/images/index/list-icon-2.png',
          name: '招聘会',
          url: '/pages/jobRecruitment/findJobFair/findJobFair',
        },
        {
          logo: '../../static/images/index/list-icon-3.png',
          name: '培训计划',
          url: '/pages/trainingClass/trainningIndex/trainningIndex',
        },
        {
          logo: '../../static/images/index/list-icon-4.png',
          name: '就业服务网点',
          url: '/pages/personalCenter/servicePoint/servicePoint',
        },
        {
          logo: '../../static/images/index/list-icon-1.png',
          name: '创业项目',
          url: '/pages/entrepreneurialProject/projectIndex/projectIndex',
        },
      ],
    }
  },

  methods: {
    toIntelligentCustomerService() {
      this.$utils.navigateTo('/pages/intelligentCustomerService/intelligentCustomerService')
    },
    login: function (value) {
      this.isLogin = value
    },
    toPage: function (item) {
      if (!this.isLogin && item.name == '劳动力登记采集') {
        this.$refs.modalPopup.open()
      } else {
        this.$utils.navigateTo(item.url)
      }
    },
    async toPageUser(item) {
      if (this.isLogin) {
        if (item.name === '我的简历') {
          const res = await this.init()
          if (res) {
            this.$utils.navigateTo(item.url)
          }
        } else {
          this.$utils.navigateTo(item.url)
        }
      } else {
        this.$refs.modalPopup.open()
      }
    },

    initNews() {
      let param = {
        // method: 'A0060000036',
        // pageNo: 1,
        // count: 7,
        // channelIds: '967940581686620160',
        acz02p: '1',
        aab301: '14',
        // acz02q: '1',
        method: 'jy232_hrm100',
        apiCode: 'jy232_hrm100',
        pageNumber: this.currentPage,
        pageSize: 7,
      }
      // this.$utils.request(null, param, true).then((res) => {
      //   // console.log(res)
      //   if (res.list.length > 0) {
      //     this.source = res.list
      //   }
      // })
      this.$utils.request('/api/business/invoke', param, true).then((res) => {
        this.source = res.pageBean.list
      })
    },
	// 系统通知
	initNotify() {
	  let param = {
	    acz03d:'1',
	    method: 'jy242_hrm100',
	    apiCode: 'jy242_hrm100',
	  }
	  this.$utils.request('/api/business/invoke', param, true).then((res) => {
	    if(res.ce3hVOList&&res.ce3hVOList.length>0){
			uni.setStorageSync('isNotifyed',true)
			res.ce3hVOList.forEach((item)=>{
				const safeHtml = DOMPurify.sanitize(item.ace955);
				this.$notify({
				  title: '系统通知',
				  message: safeHtml,
				  dangerouslyUseHTMLString: true
				});
			})
	    }
	  })
	},
    init() {
      const url = '/api/business/invoke'
      let param = {
        aac001: this.userInfo.aac001,
        isSelf: '1',
        method: 'jy202_hrm1194',
      }
      return new Promise((resolve, reject) => {
        this.$utils
          .request(url, param, true, true, 'cipher')
          .then((res) => {
            // if (res.resumeMap && res.resumeInfo.baseInfo && !res.resumeInfo.baseInfo.acc200) {
            //   this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
            //   reject(false)
            // }
            if (!res.resumeMap.baseInfo.acc200) {
              this.$utils.showToast('暂无简历，请前往微信小程序或者网站创建简历')
              reject(false)
            }
            resolve(true)
          })
          .catch((err) => {
            reject(false)
          })
      })
    },
    //跳转详情
    toPageNews() {
      this.$utils.navigateTo('/pages/policyServices/policyServices/policyServices')
    },
    toCenterPage() {
      //跳转用户中心
      if (this.isLogin) {
        this.$utils.navigateTo('/pages/personalCenter/personalCenter/personalCenter')
      } else {
        this.$refs.modalPopup.open()
      }
    },
    loginPage() {
      //跳转登录页
      this.$utils.navigateToLogin()
    },
  },
}
</script>

<style lang="scss" scoped>
.index-wrap {
  width: 100%;
  overflow: hidden;
  margin-bottom: 66px;
}
.index-nav {
  width: 100%;
  height: 606px;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  .left-user {
    width: 395px;
    display: flex;
    flex-flow: column;
    .robot-top {
      width: 100%;
      height: 189px;
      z-index: 10;
      .robot-img {
        width: 151px;
        height: 189px;
        display: inline-block;
        float: left;
        animation-name: iconRotate;
        animation-duration: 8s;
        animation-iteration-count: infinite;
        animation-delay: 1s;
        .robot-logo {
          width: 100%;
          height: 100%;
        }
      }
      .robot-text {
        display: inline-block;
        float: left;
        width: 231px;
        height: 90px;
        background: url('../../static/images//index/Union.png') center no-repeat;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 18px;
        color: #ffffff;
        line-height: 21px;
        font-style: normal;
        span {
          display: inline-block;
          padding: 10px 16px;
          // overflow: hidden; /* 确保文本不会溢出容器 */
          //  white-space: nowrap; /* 防止文本换行 */
          //  border-right: 0.25em solid; /* 打字效果的光标 */
          //  animation: type 3s steps(10, end), blink 0.7s step-end infinite;
        }
      }
    }
    .user-bottom {
      width: 360px;
      height: 500px;
      margin-top: -89px;
      overflow: hidden;
      display: flex;
      background: linear-gradient(180deg, #1fb4fd 0%, #2d70fd 100%);
      box-shadow: 0px 4px 20px 0px rgba(46, 134, 177, 0.24);
      border-radius: 40px 40px 40px 40px;
      padding: 70px 60px;
      box-sizing: border-box;
      flex-flow: column;
      justify-content: space-around;
      .title-name {
        width: 144px;
        height: 50px;
        margin: 0 auto;
        font-family: PingFang SC, PingFang SC;
        font-size: 36px;
        color: #ffffff;
        line-height: 50px;
        font-style: normal;
        text-transform: none;
      }
      .title-ul {
        width: 240px;
        height: 292px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        .title-list {
          width: 240px;
          height: 64px;
          text-align: center;
          line-height: 64px;
          background: rgba(8, 89, 243, 0.7);
          border-radius: 12px 12px 12px 12px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 24px;
          color: #ffffff;
          font-style: normal;
          text-transform: none;
          cursor: pointer;
          span {
            display: inline-block;
            width: 40px;
            height: 40px;
            vertical-align: middle;
            margin-right: 10px;
            .userNav-logo {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

  .right-link {
    width: 1266px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-flow: column;
    .top-info {
      width: 100%;
      height: 36px;
      display: flex;
      justify-content: space-between;
      .message {
        width: calc(100% - 130px);
        height: 36px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24px;
        color: #002152;
        line-height: 36px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        overflow: hidden;
        .list {
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          height: 36px;
          width: 100%;
          .text {
            width: calc(100% - 200px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span.left-arrow {
              display: inline-block;
              vertical-align: middle;
              width: 15px;
              height: 20px;
              margin-right: 10px;
              background: url('../../static/images//index/icon-arrow.png') center no-repeat;
            }
          }
          .date {
            width: 170px;
            font-size: 20px;
            text-align: center;
            color: #666;
          }
        }
      }
      .btn {
        width: 116px;
        height: 36px;
        font-family: PingFang SC, PingFang SC;
        font-size: 22px;
        color: #0c6af7;
        line-height: 36px;
        text-align: center;
        font-style: normal;
        border-radius: 8px 8px 8px 8px;
        border: 1px solid #0c6af7;
        cursor: pointer;
      }
    }
    .center-link {
      width: 1250px;
      height: 276px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      .nav-item {
        width: 320px;
        height: 276px;
        box-sizing: border-box;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        &.nav-bg0 {
          margin-left: 0;
          background: url('../../static/images/index/icon-bg-1.png') center no-repeat;
          background-size: 100% 100%;
        }

        &.nav-bg1 {
          background: url('../../static/images/index/icon-bg-2.png') center no-repeat;
          background-size: 100% 100%;
        }

        &.nav-bg2 {
          background: url('../../static/images/index/icon-bg-3.png') center no-repeat;
          background-size: 100% 100%;
        }

        &.nav-bg3 {
          background: url('../../static/images/index/icon-bg-4.png') center no-repeat;
          background-size: 100% 100%;
        }

        .nav-record {
          box-sizing: border-box;
          padding: 0 20px;
          width: 100%;
          height: 75px;
          margin-top: 70px;
          .nav-name {
            width: 100%;
            height: 55px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 32px;
            color: #ffffff;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }
          .nav-text {
            width: 100%;
            height: 25px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 25px;
            text-align: center;
            font-style: normal;
            text-transform: none;
          }
        }

        .nav-icon {
          position: absolute;
          width: 190px;
          height: 130px;
          top: -25px;
          left: 20px;
          animation-name: iconMove;
          animation-duration: 7.5s;
          animation-iteration-count: infinite;
          &.nav-icon0 {
            animation-delay: 1s;
          }
          &.nav-icon1 {
            animation-delay: 3s;
          }
          &.nav-icon2 {
            //animation-delay: 1s;
          }
          &.nav-icon3 {
            animation-delay: 2s;
          }
        }
      }
    }
    .bottom-menu {
      width: 1250px;
      height: 240px;
      background: url('../../static/images/index/list-bg.png') center no-repeat;
      .use-nav {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 100%;
        height: 230px;
        .use-item {
          border-radius: 10px;
          width: 280px;
          height: 180px;
          text-align: center;
          box-sizing: border-box;
          padding: 20px 0;
          background: url('../../static/images/index/icon-shadow.png') center no-repeat;
          background-size: cover;
          cursor: pointer;
          .use-img {
            width: 100%;
            height: 100%;
            text-align: center;
            margin: 0 auto;
            display: inline-block;
            width: 80px;
            height: 92px;
            .use-logo {
              width: 100%;
              height: 100%;
            }
          }
          .use-name {
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            height: 50px;
            font-size: 28px;
            color: #ffffff;
            line-height: 33px;
            text-shadow: 0px 2px 2px rgba(17, 151, 236, 0.69);
            text-align: center;
            font-style: normal;
            text-transform: none;
          }
          &.use-bg4 {
            width: 250px;
            background: url('../../static/images/index/icon-shadow-last.png') center no-repeat;
          }
        }
      }
    }
  }
}

/* 图标移动动画 */
@keyframes iconMove {
  0% {
    top: -25px;
  }
  50% {
    top: 20px;
  }
  100% {
    top: -25px;
  }
}
@keyframes iconRotate {
  0% {
    rotate: 0deg;
  }
  15% {
    rotate: 10deg;
  }
  30% {
    rotate: -10deg;
  }
  45% {
    rotate: 10deg;
  }
  60% {
    rotate: -10deg;
  }
  75% {
    rotate: 0deg;
  }
  100% {
    rotate: 0deg;
  }
  // 0% {transform:rotateY(360deg)}
  // 50% {transform:rotateY(0deg)}
  // 100% {transform:rotateY(360deg)}
}

// /* 定义打字机动画 */
// @keyframes type {
//   from { width: 0; }
//   to { width: 100%; }
// }

// /* 定义闪烁动画 */
// @keyframes blink {
//   to { border-color: transparent; }
// }
</style>
