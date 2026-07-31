<template>
  <div class="page">
    <!-- 热门服务 -->
    <common-header @cityChange="cityChange" :key="key"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="job-type">
          <div
            :class="['type-item', 'type-bg' + index]"
            v-for="(item, index) in jobType"
            :key="index"
            @click="toPage(item)"
          >
            <image :src="item.logo" mode="scaleToFill" class="type-logo"></image>
            <div class="type-name">{{ item.name }}</div>
          </div>
        </div>

        <div class="job-list">
          <div class="list-title">
            <div class="title-lt">为您推荐<span>热门岗位</span>，点击查看详情</div>
            <div class="title-rt">
              <button class="btn btn-refresh" @click="changeQuery">
                <i class="ic ic-refresh"></i><span>换一批</span>
              </button>
            </div>
          </div>
          <div class="list-con">
            <div class="list-item" v-for="(item, index) in jobList" :key="index" @click="toShowDetail(item)">
              <div class="item-top">
                <div class="item-hot" v-show="item.acb212 > 10"><i class="ic ic-hot"></i></div>
                <div class="item-title">
                  <span class="title-name">{{ item.acb213 }}</span>
                  <!-- <span class="title-tag">热度：{{item.acb212?item.acb212:'0'}}</span> -->
                </div>
                <div class="item-info">
                  <div class="info-type">
                    <span>{{ item.acc217_dsc }}</span>
                    <span>{{ item.aac011_dsc }}</span>
                    <span>{{ item.ycb213_dsc }}</span>
                    <span>聘{{ item.acb21g }}人</span>
                  </div>
                  <div class="info-money">
                    <!-- <span>{{item.acb21l+'-'+item.acb21h}}</span>元/月 -->
                    <span>{{ item.acb21l && item.acb21h ? item.acb21l + '~' + item.acb21h : '' }}</span>
                    <span>{{ item.acb21l && !item.acb21h ? item.acb21l + '以上' : '' }}</span>
                    <span>{{ !item.acb21l && item.acb21h ? item.acb21h + '以下' : '' }}</span>
                    <span>{{ !item.acb21l && !item.acb21h ? '薪资面议' : '' }}</span>
                    <label style="padding-left: 6px">{{ item.acb21l || item.acb21h ? '元/月' : '' }}</label>
                  </div>
                </div>
              </div>
              <div class="item-company">{{ item.aab004 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </div>
</template>

<script>
export default {
  onShow: function () {
    this.key++
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
      // this.$utils.showToast("请登录")
      // setTimeout(()=>{
      // 	this.$utils.navigateToLogin();
      // },1000)
    }
    this.currentPage = 1
    this.init()
  },
  data() {
    return {
      key: 0,
      userInfo: {},
      jobType: [
        {
          logo: '../../../static/images/job_nav0.png',
          name: '岗位查询',
          url: '/pages/jobRecruitment/findWork/findWork',
        },
        {
          logo: '../../../static/images/job_nav1.png',
          name: '企业查询',
          url: '/pages/jobRecruitment/findUnit/findUnit',
        },
        {
          logo: '../../../static/images/job_nav2.png',
          name: '招聘会',
          url: '/pages/jobRecruitment/findJobFair/findJobFair',
        },
      ],
      jobList: [],
      currentPage: 1,
      pageSize: 8,
      status: false,
    }
  },
  methods: {
    changeQuery() {
      this.currentPage++
      this.init()
    },
    init() {
      let param = {}
      param.method = 'getRecommendJobList'
      param.aac001 = this.userInfo.aac001 //没有表
      param.currentPage = this.currentPage
      param.pageSize = this.pageSize
      param.ytjishot = '1'
      this.$utils.request(param, (res) => {
        if (res.code == '1') {
          if (res.data.code == '1') {
            if (this.status) {
              this.jobList = JSON.parse(res.data.list)
              this.status = false
            }
            if (JSON.parse(res.data.list).length > 0) {
              this.jobList = JSON.parse(res.data.list)
            } else {
              this.$utils.showToast('暂无更多推荐的岗位信息')
            }
          }
        } else {
          this.$utils.showToast(res.message)
        }
      })
    },
    toPage(item) {
      if (item.url) {
        this.$utils.navigateTo(item.url)
      } else {
        this.$utils.showToast('正在开发')
      }
    },
    toShowDetail(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },
    // 切换城市
    cityChange() {
      this.status = true
      this.currentPage = 1
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.job-type {
  padding: 30px 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  .type-item {
    margin-left: 80px;
    width: 302px;
    height: 280px;
    text-align: center;

    &:first-child {
      margin-left: 0;
    }

    &.type-bg0 {
      background: url('../../../static/images/job_nav_bg0.png') left center no-repeat;
      background-size: 100% 100%;
    }

    &.type-bg1 {
      background: url('../../../static/images/job_nav_bg1.png') left center no-repeat;
      background-size: 100% 100%;
    }

    &.type-bg2 {
      background: url('../../../static/images/job_nav_bg2.png') left center no-repeat;
      background-size: 100% 100%;
    }

    .type-logo {
      width: 120px;
      height: 120px;
      margin-top: 50px;
    }

    .type-name {
      font-size: 28px;
      color: #ffffff;
    }
  }
}

.job-list {
  padding: 16px 160px;
  border-top: 1px dashed #dddddd;

  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title-lt {
      font-size: 22px;
      line-height: 36px;
      color: #333333;
      position: relative;
      padding-left: 12px;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: #999999;
        border-radius: 50%;
      }

      span {
        color: #2778ff;
      }
    }

    .title-rt {
      .btn {
        span {
          font-size: 20px;
        }
      }
    }
  }

  .list-con {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;

    .list-item {
      width: 322px;
      height: 160px;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 1px 1px 6px 0px rgba(76, 109, 148, 0.17);
      border-radius: 2px;
      border: solid 1px rgba(221, 221, 221, 0.72);
      margin: 0 20px 24px;

      .item-top {
        height: 120px;
        padding: 14px 26px 8px;
        position: relative;
        box-sizing: border-box;

        .item-hot {
          position: absolute;
          top: 0;
          left: 0;
        }

        .item-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          position: relative;

          .title-name {
            width: 210px;
            font-size: 18px;
            line-height: 32px;
            color: #404040;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .title-tag {
            background: url('../../../static/images/ic_tag_bg.png') left center no-repeat;
            background-size: 100% 100%;
            width: 100px;
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            color: #2778ff;
            opacity: 0.99;
            padding-right: 16px;
            text-align: right;
            box-sizing: border-box;
            position: absolute;
            top: 0;
            right: -26px;
          }
        }

        .item-info {
          .info-type {
            font-size: 16px;
            line-height: 24px;
            color: #666666;
            opacity: 0.99;

            span {
              position: relative;
              padding-right: 8px;
              display: inline-block;
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &:after {
                content: '/';
                width: 8px;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                color: #666666;
                opacity: 0.99;
              }

              &:first-child {
                padding-left: 0;
              }

              &:last-child {
                &:after {
                  display: none;
                }
              }
            }
          }

          .info-money {
            font-size: 16px;
            color: #666666;

            span {
              font-size: 18px;
              line-height: 24px;
              color: #ff7e00;
            }
          }
        }
      }

      .item-company {
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        border-top: solid 1px rgba(221, 221, 221, 0.51);
        padding: 0 26px;
        font-size: 14px;
        color: #999999;
      }
    }
  }
}
</style>
