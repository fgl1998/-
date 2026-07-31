<template>
  <div class="page">
    <!-- 政策列表 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-service">
          <div class="service-lt">
            <!-- <span>点击右侧顶部分类，可查看相关主题下的政务服务指南，可了解相关办事细则。</span> -->
          </div>
          <div class="service-rt">
            <div class="service-box">
              <div class="column-list">
                <div class="list-tab" style="position: relative">
                  <div class="list-tab-top">
                    <div
                      :class="index == currentTab ? 'item-choose' : 'item'"
                      v-for="(item, index) in columnTab"
                      :key="index"
                    >
                      {{ item.mainName }}
                    </div>
                  </div>
                  <template v-if="columnList.length > 0">
                    <div class="list-con">
                      <div class="list-item" v-for="(item, index) in columnList" :key="index">
                        <div class="item-box">
                          <div class="item-lt">
                            <div class="item-title">{{ item.acz02q }}</div>
                          </div>
                          <div class="item-rt">
                            使用频率：
                            <image v-for="(item, index) in 5" :key="index" src="../../../static/images/Vector.png" />
                            <div class="item-btn" @click="toGuide(item)">
                              <span>办事指南</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="nodata" style="height: calc(100% - 64px)">
                      <div class="nodata-pic">
                        <div class="nodata-img"></div>
                        <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div class="service-page">
              <common-pager
                :totals="pageTotal"
                :currentPage="currentPage"
                :pageSize="pageSize"
                @currentChange="currentChange"
              ></common-pager>
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
  onLoad: function () {
    //this.titleName = this.columnTab[0].name;
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    // this.tabQuery()
    this.init()
  },
  data() {
    return {
      userInfo: {},
      isLogin: false,
      currentPage: 1,
      pageSize: 9,
      pageTotal: 0,
      cate_id: '3002', //文章类别
      //栏目
      currentTab: 0,
      columnTab: [
        {
          mainName: '办事指南列表',
        },
      ],
      titleCode: '',
      titleName: '',
      columnList: [],
    }
  },
  methods: {
    chooseTab(index) {
      this.currentTab = index
      this.currentPage = 1
      this.init()
    },

    tabQuery() {
      let param = {
        isSimple: '1',
        serviceTarget: '1',
      }
      this.$utils.request('/api/service/getSerDirGroup.do', param, true, false, 'guide').then((res) => {
        if (res.serviceSuccess) {
          this.columnTab = res.lists.data.list
          // 移除一件事专区
          this.columnTab.forEach((item, index) => {
            if (item.mainCode == '002046YYJ000') {
              console.log(index)
              this.columnTab.splice(index, 1)
            }
          })
          this.init()
        } else {
          this.$utils.showToast('调用服务异常')
          return
        }
      })
    },

    // init() {
    //   if (this.columnTab.length > 0) {
    //     let param = {
    //       isSimple: '1',
    //       yae100: '14',
    //       baseCode: this.columnTab[this.currentTab].mainCode,
    //       sdimItemCodes: 'GRWFSX',
    //       pageNo: this.currentPage,
    //       count: this.pageSize,
    //     }
    //     this.$utils.request('/api/service/queryServicePage.do', param, true, false, 'guide').then((res) => {
    //       this.columnList = res.lists.data.list
    //       this.pageTotal = res.lists.data.total
    //     })
    //   }
    // },
    init() {
      let param = {
        acz02p: '6',
        aab301: '14',
        method: 'jy232_hrm100',
        apiCode: 'jy232_hrm100',
        pageNumber: this.currentPage,
        pageSize: 9,
        paginationModel: 'mostCount',
      }
      this.$utils.request('/api/business/invoke', param, true).then((res) => {
        this.columnList = res.pageBean.list
        this.pageTotal = res.pageBean.total
      })
    },
    //分页返回页码
    currentChange(val) {
      this.currentPage = val
      this.init()
    },
    //变动栏目
    changeColumn(item, index) {
      if (this.currentTab == index) {
        return
      }
      this.titleName = item.mainName
      this.currentTab = index
      this.titleCode = item.mainCode
      this.currentPage = 1
      this.init()
    },

    //跳转详情
    toPage(item) {
      this.$utils.navigateTo('../policyDetail/policyDetail?detailInfo=' + encodeURIComponent(JSON.stringify(item)))
    },

    toGuide(item) {
      console.log(item)
      this.$utils.navigateTo(
        '/pages/policyServices/workGuide/workGuideDetail?acz02s=' + encodeURIComponent(JSON.stringify(item.acz02s)),
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-service {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;

  .service-lt {
    width: 340px;
    height: 100%;
    background-size: 37px 100%;
    background: url('../../../static/images/work-guide-left.png') right center repeat-y;
    position: relative;

    span {
      top: 265px;
      position: absolute;
      width: 286px;
      height: 40px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      line-height: 25px;
      text-align: center;
      font-style: normal;
      text-transform: none;
    }
  }

  .service-rt {
    width: calc(100% - 250px);
    height: 100%;
    position: relative;

    .service-box {
      overflow: hidden;
      height: calc(100% - 100px);
      padding: 40px 40px 20px;
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
    cursor: pointer;

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
  width: 100%;
  height: 100%;

  .list-tab {
    width: 100%;
    height: 100%;

    .list-tab-top {
      height: 70px;
      display: flex;
      gap: 40px;
      border-bottom: 1px solid #d9d9d9;

      .item {
        height: 66px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 60px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }

      .item-choose {
        height: 66px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 60px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        border-bottom: 4px solid #0c6af7;
        color: #0c6af7;
      }
    }

    .list-con {
      width: 100%;
      padding: 30px 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px 30px;

      .list-item {
        width: 370px;
        height: 90px;
        background: #f5f5f5;
        border-radius: 4px 4px 4px 4px;
        padding: 30px;

        .item-box {
          height: 90px;

          .item-title {
            width: 358px;
            height: 31px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 22px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 26px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }

          .item-rt {
            display: flex;
            margin-top: 30px;
            height: 22px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            text-align: left;
            font-style: normal;
            text-transform: none;

            image {
              width: 20px;
              height: 20px;
              margin-right: 6px;
            }
          }

          .item-btn {
            margin: -10px 0 0 40px;
            width: 75px;
            height: 20px;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #0c6af7;
            padding: 10px;
            cursor: pointer;

            span {
              width: 72px;
              height: 25px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 400;
              font-size: 18px;
              color: #0c6af7;
              line-height: 21px;
              text-align: left;
              font-style: normal;
              text-transform: none;
            }
          }
        }
      }
    }
  }
}
</style>
