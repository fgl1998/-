<template>
  <div class="page">
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con" style="height: 100%">
            <div class="wrap-left">
              <pc-chat></pc-chat>
            </div>
            <div class="wrap-right">
              <div class="wrap-title">
                <div class="wrap-title-top">
                  <view class="uni-padding-wrap uni-common-mt">
                    <uni-segmented-control
                      :current="current"
                      :values="items"
                      :style-type="styleType"
                      :active-color="activeColor"
                      @clickItem="onClickItem"
                    />
                  </view>
                </div>
              </div>
              <view class="wrap-content">
                <view v-if="current === 0" style="height: 100%">
                  <scroll-view scroll-y="true" style="height: 100%">
                    <div class="position-part">
                      <div class="title-text">薪酬福利：</div>
                      <div class="tip-list">
                        <template v-if="objInfo.acb214.length > 0">
                          <div class="tip-text" v-for="(item, index) in objInfo.acb214" :key="index">
                            {{ $utils.queryCodeDesc('acb214', item) }}
                          </div>
                        </template>
                        <template v-else>
                          <div class="tip-text">暂无</div>
                        </template>
                      </div>
                    </div>
                    <div class="position-part">
                      <div class="title-text">职责描述：</div>
                      <div class="content-text" v-if="objInfo.acb216">
                        <span v-dompurify-html="objInfo.acb216"></span>
                      </div>
                      <div v-else>暂无描述‌</div>
                    </div>
                    <div class="position-part">
                      <div class="title-text">职位要求：</div>
                      <div class="content-text">
                        工作年限:{{ objInfo.acc217 ? $utils.queryCodeDesc('acc217', objInfo.acc217) : '暂无要求' }}
                      </div>
                      <div class="content-text">
                        学历要求:{{ objInfo.aac011 ? $utils.queryCodeDesc('aac011', objInfo.aac011) : '暂无要求' }}
                      </div>
                    </div>
                  </scroll-view>
                </view>
                <view v-if="current === 1" style="height: 100%">
                  <scroll-view scroll-y="true" style="height: 100%">
                    <div class="unit-part">
                      <div class="left-image">
                        <image :src="companyInfo.headImg" mode="scaleToFill" class="head-img"></image>
                      </div>
                      <div class="right-info">
                        <div class="title-text">{{ companyInfo.aab004 }}</div>
                        <div class="content-text">
                          <div>
                            单位性质：<text style="color: #000">{{
                              companyInfo.aab019 ? $utils.queryCodeDesc('aab019', companyInfo.aab019) : '暂无信息'
                            }}</text>
                          </div>
                          <div>
                            单位规模：<text style="color: #000">{{
                              companyInfo.aab056 ? $utils.queryCodeDesc('aab056', companyInfo.aab056) : '暂无信息'
                            }}</text>
                          </div>
                          <div style="width: 100%">
                            所属行业：<text style="color: #000">{{
                              companyInfo.aab022 ? $utils.queryCodeDesc('aab022', companyInfo.aab022) : '暂无信息'
                            }}</text>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="position-part">
                      <div class="title-text">单位简介：</div>

                      <div class="content-text">{{ companyInfo.aab092 ? companyInfo.aab092 : '暂无信息' }}</div>
                      <div class="content-text">{{ companyInfo.aab092 ? companyInfo.aab092 : '暂无信息' }}</div>
                    </div>
                  </scroll-view>
                </view>
              </view>
            </div>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>
  </div>
</template>

<script>
// import { PcChat } from '@yh/uim-web-ui'
export default {
  components: {
    PcChat,
  },
  onLoad: function (option) {
    console.log(option)
    this.objInfo = JSON.parse(decodeURIComponent(option.item))
    console.log(this.objInfo)
    if (this.objInfo.acb214) {
      this.objInfo.acb214 = this.objInfo.acb214.split(',')
    }
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.init()
  },
  data() {
    return {
      userInfo: {},
      objInfo: {},
      companyInfo: {},
      isLogin: false,
      items: ['职位描述', '单位信息'],
      current: 0,
      activeColor: '#007aff',
      styleType: 'text',
    }
  },
  methods: {
    init() {
      let param = {
        method: 'jy202_hrm111',
        aab001: this.objInfo.aab001,
      }
      console.log(this.companyInfo)
      this.$utils.request(null, param, true).then((res) => {
        if (!res.serviceSuccess) {
          this.$utils.showToast('调用服务异常')
          return
        } else {
          this.companyInfo = res.data.data
          //console.log(this.companyInfo.aae707)
          if (this.companyInfo.aae707) {
            this.companyInfo.headImg = this.$downLoadImgSrc + this.companyInfo.aae707
            //console.log(this.companyInfo.headImg)
          } else {
            this.companyInfo.headImg = '../../../static/images/face/icon-logo.png'
          }
        }
      })
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-con {
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  .wrap-left {
    width: 1060px;
    height: 760px;
    background: #f5f5f5;
    box-sizing: border-box;
    padding: 0 40px 0 60px;
  }
  .wrap-right {
    width: 700px;
    height: 760px;
    box-sizing: border-box;
  }
}
.wrap-title {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 80px !important;
  border-bottom: 1px solid #ddd;

  .wrap-title-top {
    display: flex;
    //justify-content: center;
    align-items: center;
    height: 100%;
    //margin: 0 auto;
  }
}
.wrap-content {
  box-sizing: border-box;
  padding: 20px 40px;
  width: 100%;
  height: calc(100% - 81px);
  .tip-list {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .tip-text {
      display: inline-block;
      padding: 0 15px;
      height: 36px;
      line-height: 36px;
      background: rgba(39, 164, 255, 0.15);
      border-radius: 4px 4px 4px 4px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: #0c6af7;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
  .unit-part {
    display: flex;
    width: 100%;
    height: 110px;
    justify-content: space-between;
    margin-bottom: 50px;
    .left-image {
      width: 110px;
      height: 110px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .right-info {
      width: calc(100% - 120px);
      height: 110px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .title-text {
        width: 100%;
        height: 40px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 24px;
        color: #000000;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
      .content-text {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        div {
          width: 50%;
          height: 30px;
          color: rgba(0, 0, 0, 0.6);
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 30px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }
  .position-part {
    width: 100%;
    overflow: hidden;
    margin: 10px 0 30px;
    .title-text {
      width: 100%;
      height: 50px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 600;
      font-size: 20px;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    .content-text {
      width: 100%;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 30px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}

.pic-img {
  width: 100%;
  height: 100%;
}

.wrap-title-top /deep/ .segmented-control {
  height: 80px;
}
.wrap-title-top /deep/.segmented-control__item {
  padding: 0 40px;
}
.wrap-title-top /deep/ .segmented-control__item--text {
  border-bottom-width: 4px;
}
.wrap-title-top /deep/ .segmented-control__text {
  font-size: 24px;
  font-weight: 600;
}
.wrap-title-top /deep/ .segmented-control__item--text {
  padding: 22px 0;
}
</style>
