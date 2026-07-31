<template>
  <div class="page">
    <!-- 政策列表 -->
    <common-header></common-header>

    <div class="pageAll">
      <div class="pageLeft">
        <div class="leftTitle">政策资讯</div>
        <div class="leftText">聚焦政策，把握机遇，原圆就业</div>
        <div :class="{ leftItem: true, leftItemActive: itemIndex == 1 }" @click="changeType(1)">
          <image
            src="../../../static/images/policyServices/icon_policy1.png"
            mode="aspectFill"
            class="icon_policy"
          ></image>
          <span>就业资讯</span>
        </div>
        <div :class="{ leftItem: true, leftItemActive: itemIndex == 2 }" @click="changeType(2)">
          <image
            src="../../../static/images/policyServices/icon_policy2.png"
            mode="aspectFill"
            class="icon_policy"
          ></image>
          <span>政策解读</span>
        </div>
      </div>
      <div class="wrap-box">
        <div class="wrap-con">
          <div class="wrap-title">
            <div class="title-lt">
              <div class="lt-text">
                <span>
                  <text style="color: #0c6af7 !important">{{ title1 }}</text>
                  {{ title2 }}
                </span>
                / 点击下方列表可查看
                <!-- <span style="margin-left: 10px; font-size: 16px; color: orangered" @click="hotSearch">最热</span> -->
              </div>
            </div>
          </div>
          <div class="wrap-service">
            <div class="service-rt">
              <div class="service-box">
                <div class="column-list">
                  <div class="list-tab">
                    <div class="list-con">
                      <div class="list-item" v-for="(item, index) in columnList" :key="index" @click="toPage(item)">
                        <div class="item-box">
                          <div class="item-lt">
                            <i :class="['ic ic-item', item.isHot === '0' ? 'ic-point' : 'ic-text-hot']"></i>
                            <div class="item-title">{{ item.acz02q }}</div>
                          </div>
                          <div class="item-rt">
                            {{ $utils.dateFormat(item.acc645) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <common-pager
          :totals="pageTotal"
          :currentPage="currentPage"
          :pageSize="pageSize"
          @currentChange="currentChange"
        ></common-pager>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </div>
</template>

<script>
export default {
  onLoad: function (option) {
    //this.titleName = this.columnTab[0].name;

    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    // this.init()
    const type = option.type || '1'
    this.changeType(type)
  },
  data() {
    return {
      userInfo: {},
      isLogin: false,
      currentPage: 1,
      pageSize: 7,
      pageTotal: 0,
      cate_id: '3004', //文章类别
      //栏目
      currentTab: 1,
      // columnTab: [{
      // 	name: '就业资讯'
      // }, {
      // 	name: '政策法规'
      // }],
      titleName: '政策法规',
      orderBy: '',
      title1: '就业',
      title2: '资讯',
      keyWord: '',
      columnList: [],
      // 传递给输入框及键盘组件，输入框样式
      classStyle: 'inputArea',
      itemIndex: 1, // 类目
      hot: '',
    }
  },
  methods: {
    hotSearch() {
      this.hot = '9'
      this.init()
    },
    // 切换栏目
    changeType(type) {
      // if (this.itemIndex == type) return
      this.currentPage = 1
      this.itemIndex = type
      if (type == 1) {
        this.title1 = '就业'
        this.title2 = '资讯'
      } else {
        this.title1 = '政策'
        this.title2 = '解读'
      }
      this.init()
    },
    init() {
      let param = {
        // method: 'A0060000036',
        // //searchInfo: this.keyWord,
        // // cate_id: this.cate_id,
        // pageNo: this.currentPage,
        // count: this.pageSize,
        // channelIds: this.itemIndex == 1 ? '967940581686620160' : '981086027872354304', // 测试环境
        // orderBy: this.hot
        // // channelName: this.titleName
        acz02p: this.itemIndex == 1 ? '1' : '3',
        aab301: '14',
        // acz02q: '1',
        method: 'jy232_hrm100',
        apiCode: 'jy232_hrm100',
        pageNumber: this.currentPage,
        pageSize: 7,
        paginationModel: 'mostCount',
      }
      this.$utils.request('/api/business/invoke', param, true).then((res) => {
        this.columnList = res.pageBean.list
        this.pageTotal = res.pageBean.total
      })
    },
    //分页返回页码
    currentChange(val) {
      console.log(val, 'val')

      this.currentPage = val
      this.init()
    },

    //跳转详情
    toPage(item) {
      this.$utils.navigateTo(
        '../policyDetail/policyDetail?detailInfo=' +
          encodeURIComponent(JSON.stringify(item)) +
          '&type=' +
          this.itemIndex,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.pageAll {
  width: 1760px;
  margin: 0 auto 40px auto;
  display: flex;
  .pageLeft {
    width: 340px;
    height: 760px;
    background: url('../../../static/images/policyServices/bg_pageLeft.png') right center no-repeat;
    background-size: cover;
    text-align: center;
    .leftTitle {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 36px;
      line-height: 42px;
      letter-spacing: 5px;
      text-shadow: 0px 4px 4px rgba(7, 84, 232, 0.5);
      color: #ffffff;
      padding-top: 67px;
      margin-bottom: 12px;
    }
    .leftText {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 90px;
    }
    .leftItem {
      width: 240px;
      height: 64px;
      border-radius: 40px 40px 40px 40px;
      margin: 30px auto;
      transition: all 0.3s linear;
      background: rgba(3, 32, 182, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      > span {
        display: inline-block;
        height: 40px;
        line-height: 32px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #ffffff;
        margin-left: 16px;
      }
      .icon_policy {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
    }
    .leftItemActive {
      background: #efa10f;
      box-shadow: 0px 8px 12px 0px rgba(3, 102, 202, 0.4);
    }
  }
  .wrap-box {
    width: 1420px;
    height: 760px;
    border-radius: 0 20px 20px 0;
    background-color: #ffffff;
  }
}
.wrap-service {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;

  .service-lt {
    width: 250px;
    height: 100%;
    background: url('../../../static/images/service_lt_bg.png') right center repeat-y;
    background-size: 37px 100%;
  }

  .service-rt {
    width: 100%;
    height: 100%;
    position: relative;

    .service-box {
      overflow: hidden;
      height: 100%;
      //padding: 40px 40px 20px;
      box-sizing: border-box;
      background: url('../../../static/images/service_rt_bg.png') left bottom repeat-x;
      background-size: 20px 12px;
    }

    .service-page {
      height: 100px;
    }
  }
}

.column-tab {
  padding: 44px 0;
  height: 100%;
  box-sizing: border-box;

  .tab-item {
    background: url('../../../static/images/tab_item.png') left center no-repeat;
    margin: 0 auto 10px;
    width: 206px;
    height: 82px;
    line-height: 65px;
    text-align: center;

    &.active {
      background: url('../../../static/images/tab_item_hover.png') left center no-repeat;
    }

    .tab-img {
      width: 22px;
      height: 24px;
      padding-right: 10px;
    }

    span {
      display: inline-block;
      font-size: 24px;
      color: #ffffff;
    }
  }
}

.column-list {
  .list-tab {
    .list-title {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-lt {
        background: url('../../../static/images/ic_fair_bg.png') left center no-repeat;
        width: 182px;
        height: 54px;
        line-height: 54px;
        text-align: center;

        span {
          font-size: 24px;
          color: #ff7200;
        }
      }

      .title-rt {
        .searchKey {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .search-inp {
            width: 380px;
            height: 54px;
            line-height: 54px;
            background-color: #ffffff;
            box-shadow: inset 3px 5px 7px 0px rgba(0, 72, 127, 0.06);
            border-radius: 4px;
            border: solid 1px #cccccc;
            padding: 0 30px;
            box-sizing: border-box;
            font-size: 22px;
            color: #666666;
            margin-right: 14px;
          }
        }
      }
    }

    .list-con {
      height: 560px;
      overflow: hidden;

      .list-item {
        width: 100%;
        cursor: pointer;
        height: 80px;
        line-height: 80px;
        border-bottom: 2px dashed #cccccc;
        box-sizing: border-box;

        &:last-child {
          border-bottom: none;
        }

        .item-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .item-lt {
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .ic-item {
              &.ic-text-hot {
                margin-right: 10px;
              }

              &.ic-point {
                margin-right: 20px;
              }
            }

            .item-title {
              font-size: 24px;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 94%;
            }
          }

          .item-rt {
            width: 180px;
            font-size: 24px;
            color: #999999;
            text-align: right;
            // padding-right: 24px;
          }
        }
      }
    }
  }
}
</style>
