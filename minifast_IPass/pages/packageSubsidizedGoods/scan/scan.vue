<template>
  <view class="scan h5-page">
    <div class="avatar-wrapper">
      <img :src="shopAvatar" alt="" class="avatar" />
      <div class="name">{{ shopInfo.cht131 }}</div>
    </div>
    <div class="main">
      <div class="tip-top d-f ai-c jc-c">
        <div>请</div>
        <div class="primary">商户端</div>
        <div>打开“微信”扫一扫完成交易</div>
      </div>
      <div class="qr-wrapper">
        <canvas class="canvas" id="qr" canvas-id="qr"></canvas>
      </div>
      <div class="cells">
        <div class="cell d-f ai-c jc-sb">
          <div class="key">商品名称：</div>
          <div class="value">{{ orderInfo.chi621 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">商品编码：</div>
          <div class="value">{{ orderInfo.cht130 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">支付金额：</div>
          <div class="value">{{ orderInfo.cht141 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb tag">
          <div class="key">虚拟账户抵扣：</div>
          <div class="value">{{ orderInfo.cht195 }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb tag">
          <div class="key">虚拟账户余额：</div>
          <div class="value">{{ orderInfo.cht161 || '0' }}</div>
        </div>
        <div class="cell d-f ai-c jc-sb">
          <div class="key">下单时间：</div>
          <div class="value">{{ orderInfo.aae036.substr(0, 19) }}</div>
        </div>
      </div>
      <div class="tip-bottom d-f ai-c jc-c">
        <div class="iconimg"></div>
        <div>温馨提示: 您需要线下支付</div>
        <div class="red">{{ orderInfo.cht194 || '0' }}元</div>
      </div>
    </div>
  </view>
</template>

<script>
import config from '@/config'
import QR from '@/utils/weapp-qrcode.min.js'

import { showLoading, hideLoading, downloadFile } from '@/utils/uni-api'
import { requestB063 } from '@/service/api'
import { USER_INFO, SHOP_INFO, USER_LIST } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageScan',
  components: {},
  data() {
    return {
      shopAvatar: '',
      orderInfo: {
        aae036: '',
      },
    }
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.orderInfo = { ...e }
    this.getQR(e.cht190, e.chi031, e.aac002)
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取二维码
    getQR(orderId, chi031, aac002) {
      var query = uni.createSelectorQuery().in(this)
      query
        .select('#qr')
        .boundingClientRect((data) => {
          const qrcode = new QR('qr', {
            width: data.width,
            height: data.width,
          })
          qrcode.makeCode(
            config.requestUrl +
              '/orderPay?orderId=' +
              orderId +
              '&chi031=' +
              chi031 +
              '&aac002=' +
              aac002
          )
        })
        .exec()
    },
    // 根据商铺id返回申报的材料列表
    _requestB063(cht130) {
      requestB063(cht130)
        .then((res) => {
          const { list } = res.lists.hi21List
          const len = list.length
          const newList = []
          for (let i = 0; i < len; i++) {
            const item = list[i]
            if (item.che110 === '10000000021') {
              newList.push(item)
              break
            }
          }
          this.getUploadImageAvatar(newList)
        })
        .catch((err) => {})
    },
    // 请求文件下载
    requestDownloadFile(fileid) {
      return new Promise((resolve, reject) => {
        downloadFile('/upload/downloadFile/' + fileid)
          .then((res) => {
            const { tempFilePath } = res
            resolve(tempFilePath)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 获取已上传的店铺头像
    async getUploadImageAvatar(data) {
      showLoading()
      if (!data || data.length < 1) {
        hideLoading()
        return
      }
      const res = await this.requestDownloadFile(data[0].chi215)
      this.shopAvatar = res
      hideLoading()
    },
  },
  computed: {
    ...mapGetters([USER_INFO, SHOP_INFO, USER_LIST]),
  },
  watch: {
    'shopInfo.cht130': {
      handler(val) {
        if (val) {
          this._requestB063(val)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.scan {
  padding: $spacing;
  padding-top: 88rpx;
  position: relative;
  .avatar-wrapper {
    position: absolute;
    left: 50%;
    top: 24rpx;
    transform: translateX(-50%);
    font-size: 30rpx;
    font-weight: 700;
    color: $color;
    .avatar {
      width: 138rpx;
      height: 138rpx;
      border: 10rpx solid #d8e7ff;
      border-radius: 50%;
      margin: auto;
    }
    .name {
      padding-top: 6rpx;
    }
  }
  .main {
    border-radius: 20rpx;
    background-color: #fff;
    padding: 176rpx 80rpx 102rpx;
    .tip-top {
      font-size: 32rpx;
      font-weight: 700;
      line-height: 44rpx;
      color: $color;
      .primary {
        color: $primary;
      }
    }
    .qr-wrapper {
      width: 324rpx;
      height: 324rpx;
      margin: 16rpx auto;
      width: 424rpx;
      height: 424rpx;
      background: url(data:image/png;base64,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)
        no-repeat center center;
      background-size: 100%;
      padding: 60rpx 56rpx 56rpx 60rpx;
      .canvas {
        width: 100%;
        height: 100%;
      }
    }
    .cells {
      font-size: 26rpx;
      line-height: 38rpx;
      color: $color;
      padding-top: 20rpx;
      padding-bottom: 36rpx;
      .cell {
        margin-bottom: 26rpx;
        .value {
          color: #333;
          font-weight: 700;
        }
      }
    }
    .tip-bottom {
      font-size: 28rpx;
      line-height: 42rpx;
      font-weight: 700;
      color: #333333;
      .iconimg {
        width: 36rpx;
        height: 36rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABUUExURUdwTP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP/////r6/+Dg/+9vf9DQ/9gYP+ysv/AwP/a2vRcaYYAAAASdFJOUwDr+MIB3NJbFasH8EeU0EkshutMafoAAAHNSURBVFjDvZjrkoMgDIUB0UBbbxS1tu//ntt2q+N2JQndzJ6/Mt+EQzAJSiVlO+h9U2pjdNn4HjqrsuXA6/Am7cHlMGzrTdiV8S03JgtVQFQBC3QqA6HyREbifGDIEx7BMbB0BARyqANb9SF5yEXIUOEStlQhS9Uux5UhU+UOJzeW/XgORfhAxbvPdfhI9Vu+JBdOc4zzlPwMPw4pmXXD+akhmYdbe5I3YDq/lIzHb25jMuZ5wczJJes9temMiQsmprPHkv5yMIvLFkm8ccGMSBJ+h9MieUFbfFeLHxPnwNfDcgbN02mMcZzQJcbhBnMF1J54uu/K6r9jtFVdEFBHWnO5xni9kOb0+IKRzL6HesLhYUm/gfC4Qb/fFswNXdYovB6cV+E1QmkJjFZGAmOkMEKbErK4kcA0RPoxMZ64DExMT1xNJgaIHwUT0xG/LR7m/tvCPeZhPPVL52GAKjAszLPAoLtiYTxZfFmYlmwFOJhXK4CZzMEA3SYxMGubhDRtDMyJ0ULSGL/t9I+fFphtQ2uTLpPlDnjN/hUvvjV39EBbgV+jh9AgJDWWSQ2JQiOr2AAtNc4/NibyuGAt76nD/tfDi9QzkNijVP4T2RfqNw80K6w6DAAAAABJRU5ErkJggg==);
        margin-right: 10rpx;
      }
      .red {
        color: #f00;
      }
    }
  }
}
</style>
