<template>
  <div class="page" style="position: relative;">
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text"> <span><text style="color:#0C6AF7 !important">创业</text>项目列表 </span>
                  / 浏览下方创业活动列表</div>

              </div>
              <!-- 							<div class="wrap-title-top">
								<div class="img-left">
									<image src="../../../static/images/project/title-left.png" mode="aspectFit">
								</div>
								<div class="img-text"><text style="color:#0C6AF7">创业</text>活动</div>
								<div class="img-right">
									<image src="../../../static/images/project/title-right.png" mode="aspectFit">
								</div>
							</div> -->
            </div>
            <div class="wrap-ul">
              <template v-if='projectList.length>0'>
                <div class="wrap-list" v-for="(item,index) in projectList" :key="index" @click="openDetail(item)">
                  <div class="wrap-list-left">
                    <image src="../../../static/images/project/pic-bg-1.png" mode="aspectFit" />
                  </div>
                  <div class="wrap-list-right">
                    <div class="wrap-list-right-title">{{item.acb606}}</div>
                    <div class="wrap-list-right-box">
                      <div class="wrap-list-right-info"><text
                          style="color: rgba(0,0,0,0.9);">项目单位：</text>{{item.aab004}}</div>
                      <div class="wrap-list-right-info"><text
                          style="color: rgba(0,0,0,0.9);">项目来源：</text>{{item.acb608?$utils.queryCodeDesc('ACB608',item.acb608):''}}
                      </div>
                      <div class="wrap-list-right-time"><text
                          style="color: rgba(0,0,0,0.9);">活动时间：</text>{{item.aae036}}</div>
                    </div>

                  </div>
                </div>
              </template>
              <template v-else>
                <div class="nodata">
                  <div class="nodata-pic">
                    <image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img">
                      <div class="nodata-text">暂时检索不到你要的数据哦~</div>

                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="wrap-page">
            <common-pager :totals="pageTotal" :currentPage="currentPage" :pageSize="pageSize"
              @currentChange="currentChange"></common-pager>
          </div>
        </div>
      </div>
    </div>


    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>

    <div id="detailBox" v-if="showDetail">
      <div class="detailContent">
        <div class="top">
          <div class="title">详情查看</div>
          <div class="close" @click="showDetail = false">x</div>
        </div>
        <div class="bottom">
          <div class="wrap-list-top">
            <div class="wrap-list-left">
              <image src="../../../static/images/project/pic-bg-1.png" mode="aspectFit" />
            </div>
            <div class="wrap-list-right">
              <div class="wrap-list-right-title">{{itemDetail.acb606}}</div>
              <div class="wrap-list-right-box">
                <div class="wrap-list-right-info"><text
                    style="color: rgba(0,0,0,0.9);">项目单位：</text>{{itemDetail.aab004}}</div>
                <div class="wrap-list-right-info"><text
                    style="color: rgba(0,0,0,0.9);">项目来源：</text>{{itemDetail.acb608?$utils.queryCodeDesc('ACB608',itemDetail.acb608):''}}
                </div>
                <div class="wrap-list-right-time"><text
                    style="color: rgba(0,0,0,0.9);">活动时间：</text>{{itemDetail.aae036}}</div>
              </div>
            </div>
          </div>

          <div class="wrap-list-bottom">
            <div class="wrap-list-bottom-title">
              项目介绍：
            </div>
            <div class="wrap-list-bottom-content">
              <div v-if="itemDetail.acb615">{{ itemDetail.acb615 }}</div>
              <div v-else class="nodata">
                <div class="nodata-pic">
                  <image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img" />
                  <div class="nodata-text">暂无内容~</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment/moment';

  export default {
    onLoad: function(option) {
      this.userInfo = uni.getStorageSync("userInfo");
      if (this.userInfo) {
        this.isLogin = true;
      } else {
        this.isLogin = false;

      }
      this.init();
    },
    data() {
      return {
        userInfo: {},
        isLogin: false,
        projectList: [],
        currentPage: 1,
        pageSize: 4,
        pageTotal: 0,
        showDetail: false,
        itemDetail: {},
      }
    },
    methods: {
      
      moment,
      
      init() {
        this.currentPage = 1;
        this.handleGetData()
      },
      // 查询数据
      handleGetData() {
        //console.log(this.userInfo)
        let param = {
          method: "entrepreneurshipCommon_esp100",
          // "callCode": "I01047",
          // "aae400": "18",
          // "aab301": '5116',
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          apiCode:'entrepreneurshipCommon_esp100',
          //acb613:this.userInfo.acb613,
          // acb606: this.userInfo.acb606,
          paginationModel:'mostCount'

        }
         this.$utils.request('/api/business/invoke',  param, true, true, 'cipher').then((res) => {
         let pageBean = res.pageBean
            if (pageBean.total > 0) {
              this.projectList = pageBean.list;
              this.projectList.forEach((item) => {
                if (item.aae036) {
                  item.aae036 = moment(item.aae036).format('YYYY-MM-DD');
                }
              })
              this.pageTotal = pageBean.total;
            } else {
              this.projectList = [];

            }
        })
      },
      //分页返回页码
      currentChange(val) {
        //console.log("翻到第" + val + "页了");
        this.currentPage = val;
        this.handleGetData()
      },


      openDetail(item) {
        this.showDetail = true
        this.itemDetail = item
      },

    }
  }
</script>

<style lang="scss" scoped>
  .wrap-con {
    padding: 0 60px !important;
  }

  .wrap-title {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 140px !important;

    .wrap-title-top {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      margin: 0 auto;

      .img-left,
      .img-right {
        width: 236px;
        height: 18px;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .img-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 36px;
        color: #333;
        margin: 0 20px;
        line-height: 42px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }

  }

  .wrap-ul {
    width: 100%;
    height: 520px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .wrap-list {
      width: 800px;
      height: 220px;
      background: #F5F5F5;
      border-radius: 0px 0px 0px 0px;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;

      .wrap-list-left {
        width: 250px;
        height: 180px;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .wrap-list-right {
        width: 470px;
        height: 180px;
        display: flex;
        justify-content: space-around;
        flex-flow: column;

        .wrap-list-right-title {
          width: 100%;
          height: 64px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 22px;
          color: rgba(0, 0, 0, 0.9);
          line-height: 32px;
          text-align: left;
          font-style: normal;
          text-transform: none;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
        }

        .wrap-list-right-box {
          height: calc(100% - 70px);
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex-flow: column;

          .wrap-list-right-info {
            width: 100%;
            max-height: 44px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 22px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 2;
            padding-left: 25px;
            background: url('../../../static/images/project/icon-info.png') left 2px no-repeat;
          }

          .wrap-list-right-time {
            width: 100%;
            max-height: 44px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            line-height: 22px;
            text-align: left;
            font-style: normal;
            text-transform: none;
            overflow: hidden;
            padding-left: 25px;
            background: url('../../../static/images/project/icon-time.png') left center no-repeat;
          }
        }
      }
    }

  }

  .pic-img {
    width: 100%;
    height: 100%;
  }


  #detailBox {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);

    .detailContent {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      margin: auto;
      width: 800px;
      height: 800px;
      background: #fff;
      border-radius: 15px;

      .top {
        width: 100%;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        background: #0C6AF7;
        border-radius: 15px 15px 0 0;

        .title {
          width: 80%;
          font-size: 26px;
          height: 60px;
          text-indent: 30px;
          font-weight: bold;
          color: #fff;
        }

        .close {
          width: 30px;
          height: 30px;
          line-height: 25px;
          margin-right: 20px;
          color: #fff;
          font-size: 30px;
          border-radius: 50%;
          text-align: center;
          border: 2px solid #fff;
          cursor: pointer;
        }
      }

      .bottom {
        padding: 20px;
        box-sizing: border-box;

        .wrap-list-top {
          width: 760px;
          height: 180px;
          border-radius: 0px 0px 0px 0px;
          box-sizing: border-box;
          //padding: 20px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;

          .wrap-list-left {
            width: 250px;
            height: 180px;

            image {
              width: 100%;
              height: 100%;
            }
          }

          .wrap-list-right {
            width: 470px;
            height: 180px;
            display: flex;
            justify-content: space-around;
            flex-flow: column;

            .wrap-list-right-title {
              width: 100%;
              height: 64px;
              font-family: PingFang SC, PingFang SC;
              font-weight: 500;
              font-size: 22px;
              color: rgba(0, 0, 0, 0.9);
              line-height: 32px;
              text-align: left;
              font-style: normal;
              text-transform: none;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: 2;
            }

            .wrap-list-right-box {
              height: calc(100% - 70px);
              width: 100%;
              display: flex;
              justify-content: space-around;
              flex-flow: column;

              .wrap-list-right-info {
                width: 100%;
                max-height: 44px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.6);
                line-height: 22px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 2;
                padding-left: 25px;
                background: url('../../../static/images/project/icon-info.png') left 2px no-repeat;
              }

              .wrap-list-right-time {
                width: 100%;
                max-height: 44px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 16px;
                color: rgba(0, 0, 0, 0.6);
                line-height: 22px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                overflow: hidden;
                padding-left: 25px;
                background: url('../../../static/images/project/icon-time.png') left center no-repeat;
              }
            }
          }
        }

        .wrap-list-bottom {
          width: 100%;
          margin-top: 30px;

          .wrap-list-bottom-title {
            width: 100%;
            height: 40px;
            font-weight: 600;
            font-size: 18px;
            color: #333;
            line-height: 30px;
          }

          .wrap-list-bottom-content {
            width: 100%;
            height: 450px;
            //background: #333;
          }
        }

      }
    }
  }
</style>