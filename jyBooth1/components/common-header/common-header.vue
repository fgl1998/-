<template>
  <div class="header">
    <div class="header-left">
      <div class="header-img">
        <image src="../../static/images/logo.png" class="logo" mode="aspectFit" />
      </div>
      <div class="title">
        <div class="compony-name">{{ aab004 }}</div>
        <div class="system-title">{{ title }}</div>
      </div>
    </div>
    <div class="header-center">
      <!-- <image src="../../static/images/header_center.png" mode="aspectFit"></image> -->
    </div>
    <div class="header-right">
      <view
        v-for="(item, index) in type == '1' ? unitMenu : centerNavList"
        :key="'nav1' + index"
        @click="handleOperate(index, item.key)"
        :style="item.titleItemStyle"
      >
        <view>
          <image :src="item.URL" style="margin-top: 7px"></image>
        </view>
        <view class="item-title">{{ item.title }}</view>
      </view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'common-header',
  props: {
    aab004: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '1',
    },
  },
  created() {},
  mounted() {},
  data() {
    return {
      userInfo: this.$loginConfig.getLoginInfo(),
      title: '太原市“原圆就业”智能招聘展位系统',
      centerNavList: [
        {
          title: '人员呼叫',
          key: 'ryhj',
          URL: require('../../static/images/icon_head3.png'),
          titleItemStyle: {
            width: '110px',
          },
          isActive: true,
        },
        {
          title: '企业中心',
          key: 'qyzx',
          URL: require('../../static/images/img/unitCenterNew/ic_gsxx_active.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
          isActive: true,
        },
        {
          title: '投屏管理',
          key: 'tpgl',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
          titleItemStyle: {
            width: '110px',
          },
          isActive: false,
        },
        {
          title: '统计信息',
          key: 'tjxx',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        {
          title: '签到',
          key: 'qydq',
          URL: require('../../static/images/img/unitCenter/icon_sign.png'),
          width: '70px',
          titleItemStyle: {
            width: '70px',
          },
        },
        {
          title: '签退',
          key: 'qyqt',
          URL: require('../../static/images/img/unitCenter/icon_out.png'),
          width: '70px',
          titleItemStyle: {
            width: '70px',
          },
        },
        {
          title: '退出登录',
          key: 'tcdl',
          URL: require('../../static/images/icon_head3.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
      ],
      unitMenu: [
        // {
        //   title: '人员呼叫',
        //   key: 'ryhj',
        //   URL: require('../../static/images/icon_head3.png'),
        //   titleItemStyle: {
        //     width: '110px',
        //   },
        //   // isActive: false,
        // },
        {
          title: '企业招聘',
          key: 'qyzp',
          URL: require('../../static/images/icon_head1.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        {
          title: '简历管理',
          key: 'jlgl',
          URL: require('../../static/images/icon_head2.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        // {
        //   title: '人才搜索',
        //   key: 'rcss',
        //   URL: require('../../static/images/icon_head3.png'),
        //   width: '110px',
        //   titleItemStyle: {
        //     width: '110px',
        //   },
        // },
        {
          title: '面试管理',
          key: 'msgl',
          URL: require('../../static/images/icon_head4.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        {
          title: '岗位补录',
          key: 'gwbl',
          URL: require('../../static/images/icon_head4.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        {
          title: '企业中心',
          key: 'qyzx',
          URL: require('../../static/images/img/unitCenterNew/ic_gsxx_active.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
        {
          title: '退出登录',
          key: 'tcdl',
          URL: require('../../static/images/icon_head3.png'),
          width: '110px',
          titleItemStyle: {
            width: '110px',
          },
        },
      ],
    }
  },
  methods: {
    handleOperate(index, key) {
      if (!this.$loginConfig.isLogin()) {
        this.$message.warning('您还未登录，请先登录!')
        this.$loginConfig.removeLoginInfo()
        uni.navigateTo({
          url: '/pages/loginPage/loginPage',
        })
        return
      }
      let params = {}
      if (this.type == '1') {
        // 0:企业招聘 1:简历管理 2:人才搜索3:面试管理4:企业中心
        switch (key) {
          case 'ryhj': {
            uni.navigateTo({
              url: '/pages/callNumManage/callNumManage',
            })
            break
          }
          case 'qyzp': {
            uni.navigateTo({
              url: '/pages/recruitment/recruitment',
            })
            break
          }
          case 'jlgl': {
            uni.navigateTo({
              url: '/pages/resumeManage/resumeManage',
            })
            break
          }
          case 'rcss': {
            uni.navigateTo({
              url: '/pages/newSearchTalent/newSearchTalent',
            })
            break
          }
          case 'msgl': {
            uni.navigateTo({
              url: '/pages/newInterviewManage/interviewManage',
            })
            break
          }
          case 'gwbl': {
            uni.navigateTo({
              url: '/pages/positionRecording/positionRecording',
            })
            break
          }
          case 'tcdl': {
            this.$msgbox({
              title: '提示',
              message: '是否退出登录',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.$http.logOut()
            })
            break
          }
          case 'qyzx': {
            uni.navigateTo({
              url: '/pages/uniCenter/index',
            })
            break
          }
          // case 'ryhj': {
          //   window.location.href = 'callNumberExe://'
          //   break
          // }
          default: {
            break
          }
        }
      } else {
        // 0:投屏管理 1:统计信息 2:招聘会反馈 3:签到 4:签退 5:退出登录 6: 企业中心
        switch (key) {
          case 'tpgl': {
            uni.navigateTo({
              url: '/pages/unitMessage/unitMessage',
            })
            break
          }
          case 'tjxx': {
            uni.navigateTo({
              url: '/pages/tongji/tongji',
            })
            break
          }
          case 'qydq': {
            params.apiCode = 'jy201_hrm201'
            params.method = 'jy201_hrm201'
            if (this.userInfo) {
              params.acb340 = this.userInfo.acb340
              params.acb330 = this.userInfo.acb330
              params.aab001 = this.userInfo.aab001
              //params.aac001 = this.userInfo.aac001
              params.ace220 = this.userInfo.ace220
              params.aac003 = this.userInfo.aac003
              params.acb494 = '1'
              params.acb391 = '2'
            }
            this.$http
              .post(this.$requestConstant.businessRequestType, 'jy201_hrm201', null, params, true)
              .then((data) => {
                if (data.data.code == -1) {
                  this.$utils.showToast(data.data.message, 'error')
                } else {
                  this.$utils.showMessageModal('签到提示', '企业签到成功')
                }
              })
            break
          }
          case 'qyqt': {
            params.apiCode = 'jy201_hrm202'
            params.method = 'jy201_hrm202'
            if (this.userInfo) {
              params.acb340 = this.userInfo.acb340
              params.acb330 = this.userInfo.acb330
              params.aab001 = this.userInfo.aab001
              //params.aac001 = this.userInfo.aac001
              params.ace220 = this.userInfo.ace220
              params.aac003 = this.userInfo.aac003
              params.acb494 = '0'
              params.acb391 = '2'
            }
            this.$http
              .post(this.$requestConstant.businessRequestType, 'jy201_hrm202', null, params, true)
              .then((data) => {
                if (data.data.code == -1) {
                  this.$utils.showToast(data.data.message, 'error')
                } else {
                  this.$utils.showMessageModal('签到提示', '企业签退成功')
                }
              })
            break
          }
          case 'tcdl': {
            this.$msgbox({
              title: '提示',
              message: '是否退出登录',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
              this.$http.logOut()
            })
            break
          }
          case 'qyzx': {
            uni.navigateTo({
              url: '/pages/uniCenter/index',
            })
            break
          }
          case 'ryhj': {
            // window.location.href = 'callNumberExe://'
            // break
            uni.navigateTo({
              url: '/pages/callNumManage/callNumManage',
            })
            break
          }
          default: {
            break
          }
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.click-style {
  border-radius: 5px;
  padding: 5px 10px;
  border: 2px solid #fff;
  box-shadow: inset 0 0 5px 0 #fff;
}

.header {
  width: 1920px;
  display: flex;
  position: relative;

  .header-left {
    position: absolute;
    left: 42px;
    top: 32px;
    display: flex;
    width: 539px;
    height: 82px;

    .logo {
      width: 60px;
      height: 63px;
      margin-top: 10px;
    }

    .title {
      margin-left: 5px;

      .compony-name {
        width: 600px;
        min-height: 36px;
        max-height: 120px;
        font-family: SourceHanSerifCN, SourceHanSerifCN;
        font-weight: bold;
        font-size: 36px;
        color: #ffffff;
        line-height: 1.6;
        text-align: left;
        font-style: normal;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .system-title {
        width: 600px;
        height: 37px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 26px;
        color: #ffffff;
        line-height: 45px;
        letter-spacing: 3px;
        text-align: left;
        font-style: normal;
        text-transform: uppercase;
      }
    }
  }

  .header-center {
    position: absolute;
    left: 777px;
    top: 48px;
    width: 216px;
    height: 51px;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .header-right {
    position: absolute;
    display: flex;
    top: 62px;
    left: 1085px;
    width: 803px;
    height: 22px;
    align-items: center;
    justify-content: space-between;

    > view {
      display: flex;
      // margin: 0 0 0 10px;
      cursor: pointer;

      > view {
        margin: auto;

        > image {
          width: 19px;
          height: 20px;
        }
      }

      .item-title {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #ffffff;
        text-align: center;
        font-style: normal;
        margin: 0 0 0 10px;
      }
    }
  }
}
</style>
