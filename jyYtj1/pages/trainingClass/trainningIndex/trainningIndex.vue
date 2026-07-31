<template>
  <div class="page" style="position: relative">
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">计划</text> 列表 </span>
                  /点击可查询详情，右侧查找您感兴趣的培训计划
                </div>
              </div>
              <div class="title-rt" style="width: 400px">
                <uni-row class="demo-uni-row" width="600" :gutter="20">
                  <uni-col :span="18">
                    <modal-address
                      areaid="aab301"
                      :areaCode="aab301"
                      v-model="aab301Desc"
                      @setAreaValue="getAreaValue"
                      placeholder="选择地区"
                    ></modal-address>
                  </uni-col>
                  <uni-col :span="6">
                    <button class="btn btn-white" @click="resetInputAll">重置</button>
                  </uni-col>
                </uni-row>
              </div>
            </div>
            <div class="wrap-ul">
              <template v-if="classList.length > 0">
                <div class="wrap-list" v-for="(item, index) in classList" :key="index" @click="toPage(item)">
                  <div class="cover">
                    <image v-if="item.aae708" :src="item.coverImg" mode="scaleToFill" />
                    <image
                      v-if="!item.aae708"
                      src="../../../static/images/trainClass/class_default.png"
                      mode="scaleToFill"
                    />
                  </div>
                  <div class="info">
                    <div class="info-top">
                      <div class="class-name">
                        <span
                          :class="
                            item.status == 0
                              ? 'status0'
                              : item.status == 1
                              ? 'status1'
                              : item.status == 2
                              ? 'status2'
                              : ''
                          "
                        >
                          {{
                            item.status == 0 ? '报名中' : item.status == 1 ? '培训中' : item.status == 2 ? '已结束' : ''
                          }}
                        </span>
                        {{ item.adf077 }}
                      </div>
                      <div class="info-item">
                        <image src="../../../static/images/trainClass/icon_unit.png" mode="scaleToFill" />
                        <span>培训机构：</span>{{ item.aaf011 }}
                      </div>
                      <div class="info-item">
                        <image src="../../../static/images/trainClass/icon_locate.png" mode="scaleToFill" />
                        <span>培训地址：</span>{{ item.adf081 }}
                      </div>
                    </div>
                    <div class="info-bottom">
                      <div>
                        <span>{{ item.signed }}人</span>已预约
                      </div>
                      <template v-if="item.status == 0">
                        <div class="rt-btn type0" v-if="!isLogin || (isLogin && item.issign != '1')">马上预约</div>
                        <div class="rt-btn type1" v-if="isLogin && item.issign == '1'">已预约</div>
                      </template>
                      <template v-if="item.status != 0">
                        <div class="rt-btn type2">预约结束</div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="nodata">
                  <div class="nodata-pic">
                    <image src="../../../static/images/personalCenter/noData.png" mode="aspectFit" class="pic-img" />
                    <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="wrap-page" v-if="classList.length > 0">
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

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>
    <common-modal ref="modalPopup"></common-modal>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  onLoad: function (option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    const currentLocation = uni.getStorageSync('currentLocation')
    if (currentLocation) {
      this.aab301 = currentLocation.areaCode || ''
      this.aab301Desc = currentLocation.areaName || ''
    }
    this.init()
  },
  onShow: function () {
    this.init()
  },
  data() {
    return {
      userInfo: {},
      adf088: '',
      isLogin: false,
      classList: [],
      currentPage: 1,
      pageSize: 4,
      pageTotal: 0,
      adf153All: '',
      adf153: '',
      checkBtn: {},
      cancelItem: {},
      itemDetail: {},
      aab301: '',
      aab301Desc: '',
    }
  },
  methods: {
    moment,
    init() {
      this.currentPage = 1
      this.handleGetData()
    },

    getAreaValue(val) {
      this.aab301 = val.areaCode
      this.handleGetData()
    },

    restLogin(item) {
      this.$refs.modalCheckPopup.open()
      this.cancelItem = item
    },

    // 查询数据
    handleGetData() {
      let param = {
        method: 'jy306_service01',
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        aab301: this.aab301,
        paginationModel: 'mostCount',
      }

      if (this.isLogin && this.userInfo.aac147) {
        param.aac147 = this.userInfo.aac147

        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          let pageBean = res.pageBean
          if (pageBean.total > 0) {
            this.classList = pageBean.list.map((item) => {
              if (item.aae708) {
                let coverImg = this.$downLoadImgSrc + item.aae708
                return { ...item, coverImg }
              } else {
                return { ...item }
              }
            })
            this.pageTotal = pageBean.total
          } else {
            this.classList = []
          }
        })
      }

      if (!this.isLogin) {
        this.$utils.request(null, param, true).then((res) => {
          let pageBean = res.pageBean
          if (pageBean.total > 0) {
            this.classList = pageBean.list.map((item) => {
              if (item.aae708) {
                let coverImg = this.$downLoadImgSrc + item.aae708
                return { ...item, coverImg }
              } else {
                return { ...item }
              }
            })
            this.pageTotal = pageBean.total
          } else {
            this.classList = []
          }
        })
      }
    },

    //分页返回页码
    currentChange(val) {
      //console.log("翻到第" + val + "页了");
      this.currentPage = val
      this.handleGetData()
    },

    resetInputAll() {
      this.aab301 = ''
      this.currentPage = 1
      this.pageSize = 4
      this.handleGetData()
    },

    toPage(item) {
      console.log('item.adf070', item.adf070)
      const info = {
        adf070: item.adf070,
      }

      this.$utils.navigateTo(
        '/pages/trainingClass/trainClassDetail/trainClassDetail?item=' + encodeURIComponent(JSON.stringify(info)),
      )
    },
  },
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
  flex-wrap: wrap;

  .wrap-list {
    width: 800px;
    height: 228px;
    background: #ffffff;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
    padding: 24px;
    margin-right: 40px;
    display: flex;
    align-items: center;
    &:nth-child(2n) {
      margin-right: 0;
    }

    .cover {
      padding-right: 24px;
      > image {
        width: 250px;
        height: 180px;
      }
    }

    .info {
      width: 442px;
      height: 170px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .info-top {
        width: 100%;
        .class-name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
          font-size: 22px;
          padding-bottom: 16px;
        }
        .info-item {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
          > image {
            width: 16px;
            height: 16px;
            padding-right: 3px;
          }
          > span {
            color: rgba(0, 0, 0, 0.6);
          }
          padding-bottom: 8px;
          &:nth-child(3) {
            padding-bottom: 0;
          }
        }
      }
      .info-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        span {
          font-weight: 500;
          color: #eb3527;
          padding-right: 4px;
        }
        .rt-btn {
          width: 120px;
          height: 48px;
          line-height: 48px;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          &.type0 {
            background: #0c6af7;
          }
          &.type1 {
            background: #e4a128;
          }
          &.type2 {
            background-color: #bfbfbf;
          }
        }
      }
    }
  }
}

.pic-img {
  width: 100%;
  height: 100%;
}

.status0,
.status1,
.status2 {
  color: #fff;
  padding: 2px 6px;
  margin-right: 12px;
}
.status0 {
  background-color: #1890ff;
}
.status1 {
  background-color: #52c41a;
}
.status2 {
  background-color: #bfbfbf;
}
</style>
