<template>
  <div class="page">
    <!-- 机构详情 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="work-wrap wrap-box">
          <div class="wrap-con" style="height: 65px">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7">机构</text> 详情 </span> /了解机构，放心参与培训
                </div>
              </div>
              <div class="title-rt rt-address">
                <div>
                  <image src="../../../static/images/findWork/icon_home.png" mode="aspectFit" class="icon_home"></image>
                  <span>首页&nbsp;&gt;&nbsp;培训班级&nbsp;&gt;&nbsp;机构详情</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 上:机构详情 -->
          <div class="work-top">
            <div class="top-lt">
              <div>
                <image v-if="orgInfo.logoSrc" :src="orgInfo.logoSrc" mode="scaleToFill" class="headImg" />
                <image
                  v-else
                  src="../../../static/images/trainClass/avatar_trainorg.png"
                  mode="aspectFill"
                  class="headImg"
                />
              </div>
              <div>
                <div class="class-name">{{ orgInfo.aaf011 }}</div>
                <div class="info-item">
                  单位性质：<span style="padding-right: 80px">{{ orgInfo.adf090 ? orgInfo.adf090 : '' }}</span>
                  联系电话：<span style="color: #0c6af7">{{ orgInfo.adf023 ? orgInfo.adf023 : '暂无' }}</span>
                </div>
                <div class="info-item">所属行业：<span>技能培训、教育辅助及其他教育</span></div>
              </div>
            </div>
          </div>
          <!-- 下:机构信息和机构简介 -->
          <div class="work-bottom">
            <!--  -->
            <div class="bottom-lt">
              <div class="main-title">
                <div>机构信息</div>
              </div>
              <div class="bottom-box">
                <div class="info-item"><span>校长：</span>{{ orgInfo.aae004 }}</div>
                <div class="info-item" v-if="orgInfo.adf024"><span>机构地址：</span>{{ orgInfo.adf024 }}</div>
                <div class="info-item" v-if="orgInfo.aab023"><span>主管部门：</span>{{ orgInfo.aab023 }}</div>
                <div class="info-item" v-if="orgInfo.adf013">
                  <span>人员规模：</span>{{ $utils.queryCodeDesc('adf013', orgInfo.adf013) }}
                </div>
                <div class="info-item" v-if="orgInfo.adf039">
                  <span>年培训规模：</span>{{ $utils.queryCodeDesc('adf039', orgInfo.adf039) }}
                </div>
              </div>
            </div>
            <!--  -->
            <div class="bottom-rt">
              <div class="main-title">
                <div
                  :class="titleIndex == index ? 'active' : ''"
                  v-for="(i, index) in titles"
                  :key="index"
                  @click="chooseTitle(index)"
                >
                  {{ i }}
                </div>
              </div>
              <div class="bottom-box" v-if="titleIndex == 0">
                <div class="bottom-con" v-if="orgInfo.adf043">
                  <common-scroll>
                    <div class="intro" v-dompurify-html="orgInfo.adf043"></div>
                  </common-scroll>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>暂无机构简介</p>
                </div>
              </div>
              <div class="bottom-box" v-if="titleIndex == 1">
                <div class="bottom-con" v-if="orgInfo.aae707">
                  <swiper-box :imgList="orgInfo.aae707list" />
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>暂无图片</p>
                </div>
              </div>
              <div class="bottom-box" v-if="titleIndex == 2">
                <div class="bottom-con" v-if="orgInfo.adf044">
                  <video
                    show-mute-btn
                    ref="videoPlayer"
                    :src="orgInfo.adf044"
                    id="videoPlayer"
                    style="height: 100%; width: 100%"
                  ></video>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>暂无视频简介</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>
    <common-modal ref="modalPopup"></common-modal>
  </div>
</template>

<script>
import swiperBox from './orgAlbulmSwiper'
export default {
  onLoad(option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (option) {
      this.orgInfo = JSON.parse(decodeURIComponent(option.item))
      console.log(this.orgInfo, 'orgInfo')
      if (this.orgInfo && this.orgInfo.aaf001) {
        this.getOrgInfo(this.orgInfo.aaf001)
      }
    }
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  onShow() {
    if (this.orgInfo.aae707) {
      let aae707list = this.orgInfo.aae707.split(',').map((item) => {
        let imgUrl = this.$downLoadImgSrc + item
        return imgUrl
      })
      this.orgInfo.aae707list = aae707list
      console.log(this.orgInfo.aae707list)
    }
  },
  name: '',
  data() {
    return {
      titleIndex: 0,
      titles: ['机构简介', '照片墙', '视频简介'],
      userInfo: {},
      isLogin: false,
      orgInfo: {},
      classInfo: {},
    }
  },
  components: { swiperBox },
  methods: {
    chooseTitle(index) {
      if (this.titleIndex == index) return
      this.titleIndex = index
    },
    getOrgInfo(aaf001) {
      let paramObj = {
        method: 'jy301_train101',
        apiCode: 'jy301_train101',
        aaf001,
      }
      this.$utils.request('/api/business/invoke', paramObj, true, true, 'cipher').then((res) => {
        this.classInfo.coverImg = this.$downLoadImgSrc + this.classInfo.aae708
        this.orgInfo = res.data
        if (this.orgInfo && this.orgInfo.adf031) {
          this.orgInfo.logoSrc = this.$downLoadImgSrc + this.orgInfo.adf031
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.rt-address {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .icon_home {
    width: 30px;
    height: 30px;
  }

  > div {
    display: flex;
    align-items: center;

    > span {
      height: 30px;
      display: inline-block;
      line-height: 30px;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      letter-spacing: 2px;
      margin-left: 6px;
    }
  }
}

.main-title {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px solid #d9d9d9;
  padding: 0 30px;
  display: flex;
  align-items: center;

  > div {
    height: 60px;
    box-sizing: border-box;
    font-weight: 600;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    border-radius: 2px;
    line-height: 60px;
    &.active {
      border-bottom: 4px solid #0c6af7;
      color: #0c6af7;
    }
    &:not(:last-child) {
      margin-right: 100px;
    }
  }
}
.work-wrap {
  height: 100%;

  .work-top {
    height: 160px;
    width: 1640px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin: 20px auto 0 auto;
    background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #d9d9d9;
    padding: 0 30px;

    .top-lt {
      display: flex;
      align-items: center;
      > div:nth-child(1) {
        image {
          width: 110px;
          height: 110px;
        }
        padding-right: 24px;
      }
      > div:nth-child(2) {
        width: 680px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .class-name {
          font-weight: 600;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.9);
          padding-bottom: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .info-item {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          span {
            color: rgba(0, 0, 0, 0.9);
          }
          &:nth-child(4) {
            span {
              color: #0c6af7;
            }
          }
        }
      }
    }
    .top-rt {
      display: flex;
      align-items: center;
      > div:nth-child(1) {
        font-size: 20px;
        margin-right: 30px;
        font-weight: 400;
        span {
          color: #eb3527;
          font-weight: 500;
          padding-right: 4px;
        }
      }
      .btn {
        width: 158px;
        height: 52px;
        line-height: 52px;
        color: #fff;
        border-radius: 4px 4px 4px 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 30px;
        font-size: 20px;
        &.status0 {
          background: #0c6af7;
        }
        &.status1 {
          background: #e4a128;
        }
        image {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .btn-div {
    width: 158px;
    height: 52px;
    border-radius: 4px 4px 4px 4px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon_vector {
      width: 20px;
      height: 20px;
      padding-top: 10px;
      margin-right: 3px;
    }
  }

  .btn-cancel {
    background-color: #e19613;
    color: #ffffff;
  }

  .btn-add {
    border: 1px solid #0c6af7;
    color: #0c6af7;
  }

  .btn-send {
    background-color: #0c6af7;
    color: #ffffff;
  }

  .work-bottom {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 212px);
    width: 1640px;
    margin: 30px auto 0 auto;
    box-sizing: border-box;
    overflow: hidden;

    .bottom-lt {
      height: 430px;
      width: calc(100% - 835px);
      margin-right: 30px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-lt-none {
      height: 430px;
      width: 100%;
      padding-right: 30px;
      box-sizing: border-box;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
    }

    .bottom-rt {
      width: 805px;
      height: 430px;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #d9d9d9;
      box-sizing: border-box;
    }
  }
}

.bottom-box {
  height: calc(100% - 65px);
  box-sizing: border-box;
  overflow: hidden;
  padding: 30px 0 0 30px;

  img {
    height: 300px;
  }

  .no-data {
    padding: 10px;

    img {
      width: 160px;
      height: 160px;
    }
  }

  .bottom-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title-blt {
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
    }

    .title-brt {
      .btn-refresh {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }

  .bottom-con {
    height: 95%;
    .scroll {
      padding-left: 0;
    }
  }

  .info-item {
    line-height: 30px;
    color: rgba(0, 0, 0, 0.6);
    span {
      color: rgba(0, 0, 0, 0.9);
    }
  }
}
</style>
