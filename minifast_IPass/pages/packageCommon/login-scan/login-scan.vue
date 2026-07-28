<template>
  <view class="scan-login">
    <block v-if="type === '1'">
      <div class="img-wrapper" :class="[type === '1' ? 'type_' + type : '']">
        <img :src="image01" alt="" />
      </div>
      <h3>公共服务网登录确认</h3>
      <div class="tip">请不要扫描来源不明的二维码</div>
    </block>
    <block v-if="type === '2'">
      <div class="img-wrapper" :class="[type === '2' ? 'type_' + type : '']">
        <img :src="image02" alt="" />
      </div>
      <h3>{{ tipText }}</h3>
      <div class="tip">请不要扫描来源不明的二维码</div>
    </block>
    <block v-if="type === '3' && areaCode == '511600'">
      <div class="img-wrapper" :class="[type === '3' ? 'type_' + type : '']">
        <img :src="image02" alt="" />
      </div>
      <h3>发放监管系统登录确认</h3>
      <div class="tip">请不要扫描来源不明的二维码</div>
    </block>
    <div class="button-wrapper">
      <button class="btn" @click="handleConfirmLogin">确认登录</button>
      <button class="btn cancel" @click="handleCancelLogin">取消登录</button>
    </div>
  </view>
</template>

<script>
  // 图片导入 转为base64 由于打包体积超过2M
  import image01 from './images/01.png'
  import image02 from './images/02.png'

  import { showModal, switchTab, navigateTo } from '@/utils/uni-api'
  import { requestWXAddScanLoginLog } from '@/service/api'
  import { USER_INFO } from '@/store/constants'
  import { mapGetters } from 'vuex'
  import config from '@/config'

  export default {
    name: 'pageScanLogin',
    components: {},
    data() {
      return {
        image01,
        image02,
        type: '0', // 1 公共服务网登录  2 电子社保卡身份登录 3 发放监管系统登录
        id: '',
        openid: '',
        areaCode: config.areaCode
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      // 网厅 https://www.scnjhrss.com/scanLogin?type=1&id=162685702808034&timestamp=1626857028080
      // 网厅阳光审批 https://www.scnjhrss.com/scanLogin?type=2&id=162458601465120&timestamp=1624586014651

      let param = {}
      // 扫码加入
      if (e.q) {
        const url = decodeURIComponent(e.q)
        const queryString = url.substring(url.indexOf('?') + 1)
        const queryStringArray = queryString.split('&')

        for (var i = 0, len = queryStringArray.length; i < len; i++) {
          const item = queryStringArray[i]
          const item_arr = item.split('=')
          const item_key = item_arr[0]
          const item_val = item_arr[1]
          param[item_key] = item_val
        }
      } else {
        // 测试进入
        param = { ...e }
      }

      const { timestamp, id, type, encryptKey } = param

      if (id) {
        this.id = id
      }
      if (type) {
        this.type = type
      }
      if (timestamp) {
        this.timestamp = timestamp
      }
      if (encryptKey) {
        this.encryptKey = encryptKey
      }
    },
    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 确定登录
      handleConfirmLogin() {
        const { user_id, idCard, openid, userName } = this.userInfo
        const type = this.type
        const id = this.id
        const encryptKey = this.encryptKey
        if (!user_id) {
          showModal('请先进行登录验证').then((res) => {
            navigateTo('login', 'packageCommon')
          })
          return
        }
        requestWXAddScanLoginLog(id, idCard, userName, openid, type, encryptKey).then((res) => {
          if (res) {
            showModal('授权成功').then((res) => {
              switchTab('home')
            })
          } else {
            showModal('授权失败')
          }
        })
      },
      // 取消登录
      handleCancelLogin() {
        switchTab('home')
      }
    },
    computed: {
      ...mapGetters([USER_INFO]),
      tipText() {
        let str = '阳光审批平台登录确认'
        const code = this.areaCode
        const type = this.type
        if (type === '2') {
          switch (code) {
            case '510500':
              str = '泸州市惠民惠农一卡通信息系统登录确认'
              break
            default:
              str = '阳光审批平台登录确认'
              break
          }
        }

        return str
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .scan-login {
    padding: 160rpx 24rpx 0;
    text-align: center;
    position: relative;
    background-color: #fff;
    height: 100%;
    height: 100vh;
    .img-wrapper {
      width: 392rpx;
      height: 342rpx;
      margin: 0 auto;
      margin-bottom: 82rpx;
      &.type_2 {
        width: 484rpx;
        height: 252rpx;
        margin-top: 60rpx;
        margin-bottom: 100rpx;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    h3 {
      width: 100%;
      font-size: 30rpx;
      font-weight: 700;
      line-height: 42rpx;
      color: $color;
    }
    .tip {
      font-size: 26rpx;
      font-weight: 400;
      line-height: 36rpx;
      padding-top: 18rpx;
      color: $color-placeholder;
    }

    .button-wrapper {
      padding: 0 86rpx;
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0;
      padding-bottom: 60rpx;
      .btn {
        background-color: $primary;
        border-radius: 12rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #ffffff;
        height: 78rpx;
        line-height: 78rpx;
        margin-bottom: 36rpx;
        transition: all 0.3s ease-in-out;
        &.cancel {
          margin-bottom: 0;
          color: $color-placeholder;
          background-color: #fff;
        }
        &.button-hover {
          opacity: 0.6;
        }
      }
    }
  }
</style>
