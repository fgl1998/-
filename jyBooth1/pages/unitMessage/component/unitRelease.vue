<template>
  <view class="unitRelease" v-show="releaseShow">
    <xu-common-shell :title="companyInfo.aab004">
      <view class="contentBox">
        <view class="screen-box">
          <view class="screen-center">
            <!-- <unit-preview :preview="true" :releaseShow="releaseShow" :brief="brief" :releaseSuc="false"></unit-preview> -->
            <big-screen :previewDeviceId="deviceId" :visible="releaseShow"></big-screen>
          </view>
          <view class="screen-bottom">
            <view class="btn-close" @click="closeRelease">取消预览</view>
            <view class="btn-release" @click="saveRelease">确认发布</view>
          </view>
        </view>
      </view>
    </xu-common-shell>
  </view>
</template>

<script>
import unitPreview from './unitPreview.vue'
import bigScreen from '../../bigScreen/previewBigScreen.vue'

export default {
  name: 'unitRelease',
  components: {
    unitPreview,
    bigScreen,
  },
  props: {
    releaseShow: {
      type: Boolean,
    },
    brief: {
      type: String,
    },
  },
  data() {
    return {
      deviceId: uni.getStorageSync(this.$requestConstant.deviceCacheKey),
      companyInfo: {},
      param1: {
        apiCode: 'jy201_hrm218',
        method: 'jy201_hrm218',
        aab001: '',
      },
    }
  },
  methods: {
    closeRelease(value) {
      this.$emit('closeRelease', {
        type: false,
        values: value,
      })
    },
    saveRelease() {
      ///////////////////通过websocket方式///////////////////
      // let loginInfo = this.$loginConfig.getLoginInfo()
      // let data = {
      //   aab001: loginInfo.aab001,
      //   acb330: loginInfo.acb330,
      //   // aab001:'9345950',
      //   // acb330:'1431111'
      // }

      // let binding = uni.getStorageSync('binding')
      // let endVo = binding.endVo
      // if (!endVo) {
      //   this.$utils.showToast("未获取到小屏绑定信息，请联系管理员")
      //   return
      // }
      // let param = {
      //   "fromUserId": binding.beginVo.ace711,
      //   "toUserId": binding.endVo.ace711,
      //   "data": data,
      //   "messageSourceType": "TW",
      //   "messageType": "INITSMALLSCREEN"
      // }
      // this.$ws.send(JSON.stringify(param))

      ///////////////////通过分屏方式///////////////////
      const loginInfo = this.$loginConfig.getLoginInfo()
      this.param1.aab001 = loginInfo.aab001
      this.param1.aab092 = this.brief
      this.fullScreen()

      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm218', null, this.param1, false)
        .then((res) => {
          if (res.errors.length > 0) {
            uni.showToast({
              title: res.errors[0].msg,
              duration: 2000,
              icon: 'none',
            })
          } else {
            uni.showToast({
              title: '发布成功！',
              duration: 2000,
              icon: 'none',
            })
            this.closeRelease()
            this.fullScreen()
          }
        })
    },

    //设置打开网页到分屏
    fullScreen() {
      let fulls = 'screenX=0,screenY=0,scrollbars=0,location=0' // 定义弹出窗口的参数
      if (Math.abs(screen.availLeft) >= screen.availWidth) {
        // 说明屏幕是副屏，直接设置0，到主屏
        fulls += `,left=0`
      } else if (screen.availLeft == 0) {
        // 主屏幕
        // 左侧主屏幕，右侧副屏幕直接left到右侧
        fulls += `,left=${screen.availWidth}`
      }
      // 获取屏幕 宽高复制
      if (window.screen) {
        let ah = screen.availHeight
        let aw = screen.availWidth
        fulls += `,height=${ah}`
        fulls += `,width=${aw}`
      } else {
        fulls += ',manually' // 对于不支持screen属性的浏览器，可以手工进行最大化。 manually
      }

      let openWindow = window.open('/template/jybooth/#/pages/releaseSuccess/releaseSuccess', name, fulls)
      if (openWindow.screen.availLeft == 0) {
        // 右侧主屏幕，左侧侧副屏幕直接moveTo到左侧
        if (Math.abs(screen.availLeft) < screen.availWidth) {
          openWindow.moveTo(-screen.availWidth, 0)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.unitRelease {
  width: 1920px;
  height: 1080px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.5);

  * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  .contentBox {
    width: 100%;
    height: 100%;
    border-radius: 12px;

    .screen-box {
      position: absolute;
      left: 40px;
      right: 40px;
      top: 20px;
      bottom: 40px;

      .screen-center {
        width: 100%;
        height: calc(100% - 50px);
        border-radius: 12px;
        border: 8px solid #ffffff;
        box-sizing: border-box;
        overflow: auto;
      }

      .screen-bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -30px;
        padding-top: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .btn-close {
          width: 300px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #eaeff8;
          border-radius: 4px;
          font-size: 18px;
          color: #666666;
          margin-right: 36px;
        }

        .btn-release {
          width: 300px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #1f8cff;
          border-radius: 4px;
          font-size: 18px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
