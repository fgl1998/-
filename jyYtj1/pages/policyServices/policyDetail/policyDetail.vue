<template>
  <view class="page">
    <!-- 政策详情 -->
    <common-header></common-header>

    <view class="pageAll">
      <view class="pageLeft">
        <view class="leftTitle">政策资讯</view>
        <view class="leftText">聚焦政策，把握机遇，原圆就业</view>
        <view :class="{ leftItem: true, leftItemActive: itemIndex === 1 }" @click="changeType(1)">
          <image src="../../../static/images/policyServices/icon_policy1.png" mode="aspectFill" class="icon_policy">
          </image>
          <span>就业资讯</span>
        </view>
        <view :class="{ leftItem: true, leftItemActive: itemIndex === 2 }" @click="changeType(2)">
          <image src="../../../static/images/policyServices/icon_policy2.png" mode="aspectFill" class="icon_policy">
          </image>
          <span>政策解读</span>
        </view>
      </view>
      <view class="wrap-box">
        <view class="detail-wrap">
          <view class="detail-title">{{ detailInfo.acz02q }}</view>
          <view class="detail-time">{{ $utils.dateFormat(detailInfo.acc645) }}</view>
          <view class="detail-decr">
            <common-scroll>
              <!-- <div class="decr-box" v-dompurify-html="detailInfo.contentTxtBo ? detailInfo.contentTxtBo.txt : ''"></div> -->
              <div class="decr-box" v-dompurify-html="detailInfo.acz02s ? detailInfo.acz02s : ''"></div>
            </common-scroll>
          </view>
        </view>
      </view>
    </view>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </view>
</template>

<script>
export default {
  onLoad: function (option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.detailInfo = JSON.parse(option.detailInfo)
    this.itemIndex = +option.type
    // this.init();
  },
  data() {
    return {
      userInfo: {},
      isLogin: false,
      article_id: '',
      detailInfo: {},
      itemIndex: 1,
    }
  },
  methods: {
    init() {
      let param = {}
      param.method = 'getArticleById'
      param.article_id = this.article_id
      this.$utils.request(param, (res) => {
        if (res.code === '-1') {
          this.$utils.showToast('调用服务异常')
          return
        } else {
          this.detailInfo = JSON.parse(res.data.articleMap)[0]
        }
      })
    },
    changeType(type) {
      this.$utils.navigateTo('../policyServices/policyServices?' + 'type=' + type)
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

.detail-wrap {
  height: 100%;
  width: 100%;
  background: #fdfdfd;
  border-radius: 0 20px 20px 0;

  .detail-title {
    height: 94px;
    line-height: 94px;

    text-align: center;
    font-size: 28px;
    color: #333333;
    padding: 0 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-time {
    height: 24px;
    line-height: 10px;

    text-align: center;
    font-size: 18px;
    color: #999999;
    padding: 0 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail-decr {
    height: calc(100% - 94px);
    box-sizing: border-box;
    overflow: hidden;
    padding: 28px 80px;
    color: #666666;
    font-size: 18px;
    line-height: 32px;

    .decr-box /deep/ div,
    .decr-box /deep/ p {
      color: #333 !important;
    }

    .decr-con {
      view {
        text-indent: 36px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
