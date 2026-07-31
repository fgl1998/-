<template>
  <view class="unitHead">
    <view>
      <view>
        <image :src="headImg" class="logoHead"></image>
      </view>
      <view>
        <view>{{ uniTitle }}</view>
        <!-- <view>{{ welCome }}</view> -->
      </view>
    </view>
    <view>
      <view
        v-for="(item, index) in navList"
        :key="'nav1' + index"
        @click="goOtherPage(index)"
        v-show="navTypeIndex == 1"
      >
        <view>
          <image :src="item.URL"></image>
        </view>
        <view>{{ item.title }}</view>
      </view>

      <view
        v-for="(item, index) in centerNavList"
        :key="'nav2' + index"
        @click="handleOperate(index)"
        v-show="navTypeIndex == 2"
      >
        <view>
          <image :src="item.URL"></image>
        </view>
        <view>{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'common-unitHeader',
  props: {
    navTypeIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      isFlag: true,
      userInfo: {},
      uniTitle: '',
      headImg: '',
      // welCome: "欢迎来到，中国新疆人才网智能展位系统！",
      navList: [
        {
          title: '职位管理',
          URL: require('../../static/images/icon_head1.png'),
        },
        {
          title: '简历管理',
          URL: require('../../static/images/icon_head2.png'),
        },
        {
          title: '人才搜索',
          URL: require('../../static/images/icon_head3.png'),
        },
        {
          title: '面试管理',
          URL: require('../../static/images/icon_head4.png'),
        },
        { title: '岗位补录', URL: require('../../static/images/icon_head4.png') },
        // {
        //   title: "",
        //   URL: require("../../static/images/icon_checkBox.png"),
        // },
        {
          title: '企业中心',
          URL: require('../../static/images/icon_head4.png'),
        },
      ],
      centerNavList: [
        {
          title: '投屏管理',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
        },
        {
          title: '统计信息',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
        },
        {
          title: '签到',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
        },
        {
          title: '签退',
          URL: require('../../static/images/img/unitCenter/icon_out.png'),
        },
        {
          title: '退出登录',
          URL: require('../../static/images/icon_head3.png'),
        },
        // {
        //   title: "",
        //   URL: require("../../static/images/icon_checkBox.png"),
        // },
        {
          title: '企业中心',
          URL: require('../../static/images/icon_head4.png'),
        },
      ],

      path: window.location.origin + window.location.pathname + '#',
    }
  },
  mounted() {
    let loginInfo = uni.getStorageSync('loginInfo')
    this.userInfo = uni.getStorageSync('loginInfo')
    this.uniTitle = loginInfo.aab004
    this.headImg = loginInfo.aae707
      ? this.utils.getFileLoadUrl(loginInfo.aae707)
      : this.getRealImgUrl('img/publicImg/default_company.png')
  },
  methods: {
    goOtherPage(index) {
      switch (index) {
        // 职位管理
        case 0:
          uni.navigateTo({
            // url: '/pages/recruitment/recruitment'
            // url: '/pages/newSearchTalent/newSearchTalent'
            url: '/pages/newPositionManage/newPositionManage',
          })
          break
        // 简历管理页面
        case 1:
          uni.navigateTo({
            url: '/pages/newResumeManage/newResumeManage',
            fail(error) {
              //console.log(error);
            },
          })
          break
        // 人才搜索
        case 2:
          uni.navigateTo({
            url: '/pages/newSearchTalent/newSearchTalent',
          })
          break
        // 面试管理
        case 3:
          uni.navigateTo({
            url: '/pages/newInterviewManage/newInterviewManage',
          })
          break
        // 岗位补录页面
        case 4:
          uni.navigateTo({
            url: '/pages/positionRecording/positionRecording',
          })
        // 	break;
        // // 屏幕旋转
        // case 4:
        //   this.$emit("checkRotate");
        //   break;
        // // 企业中心页面
        case 4:
          uni.navigateTo({
            url: '/pages/uniCenter/index',
          })
          break

        default:
          break
      }
    },

    // 单位中心操作栏
    handleOperate(index) {
      let params = {}
      // 0:投屏管理 1:统计信息 2:招聘会反馈 3:签到 4:签退 5:退出登录 6: 企业中心
      switch (index) {
        case 0: {
          uni.navigateTo({
            url: '/pages/unitMessage/unitMessage',
          })
          break
        }
        case 1: {
          uni.navigateTo({
            url: '/pages/tongji/tongji',
          })
          break
        }
        // case 2: {
        // 	uni.navigateTo({
        // 	  url: "/pages/recruitment/recruitment",
        // 	});
        // 	break;
        // }
        case 2: {
          params.apiCode = 'jy201_hrm201'
          params.method = 'jy201_hrm201'
          if (this.userInfo) {
            params.acb340 = this.userInfo.acb340
            params.acb330 = this.userInfo.acb330
            params.aab001 = this.userInfo.aab001
            params.aac001 = this.userInfo.aac001
            params.ace220 = this.userInfo.ace220
            params.aac003 = this.userInfo.aac003
            params.acb494 = '1'
          }
          this.$http.request('/api/business/getData.do', 'post', params, true).then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg)
            } else {
              this.$utils.showMessageModal('签到提示', '企业签到成功')
            }
          })
          break
        }
        case 3: {
          params.apiCode = 'jy201_hrm202'
          params.method = 'jy201_hrm202'
          if (this.userInfo) {
            params.acb340 = this.userInfo.acb340
            params.acb330 = this.userInfo.acb330
            params.aab001 = this.userInfo.aab001
            params.aac001 = this.userInfo.aac001
            params.ace220 = this.userInfo.ace220
            params.aac003 = this.userInfo.aac003
            params.acb494 = '0'
          }
          this.$http.request('/api/business/getData.do', 'post', params, true).then((data) => {
            if (data.errors.length > 0) {
              this.$message.error(data.errors[0].msg)
            } else {
              this.$utils.showMessageModal('签退提示', '企业签退成功')
            }
          })
          break
        }
        case 4: {
          // this.$http.request("/api/security/token/logout.do", "post", {}, true)
          uni.removeStorageSync('hr-token')
          uni.removeStorageSync('loginInfo')
          uni.removeStorageSync('userInfo')
          uni.removeStorageSync('person-token')
          uni.removeStorageSync('acb330')
          // this.$utils.openScreen(
          // 	"/pages/businessPersonnel/personnelWelcome",
          // 	"/pages/loginPage/companyNoLogin"
          // );
          uni.navigateTo({
            url: '/',
          })
          break
        }
        default: {
          break
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.unitHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 75px;
  padding: 15px;

  > view:first-child {
    width: 50%;
    display: flex;
    align-items: center;

    > view > image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }

    > view:last-child {
      > view {
        height: 37px;
        font-size: 26px;
        font-weight: 400;
        color: #e8e8e8;
        line-height: 37px;
      }

      > view:first-child {
        height: 51px;
        font-size: 36px;
        font-weight: bold;
        color: #ffffff;
        line-height: 51px;
      }
    }
  }

  > view:last-child {
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;

    > view {
      display: flex;
      align-items: center;
      cursor: pointer;
      > view:first-child {
        margin-right: 8px;
        padding-top: 5px;

        > image {
          width: 20px;
          height: 20px;
        }
      }

      > view:last-child {
        height: 30px;
        font-size: 20px;
        font-weight: 400;
        color: #ffffff;
        line-height: 30px;
      }
    }
  }
}
</style>
