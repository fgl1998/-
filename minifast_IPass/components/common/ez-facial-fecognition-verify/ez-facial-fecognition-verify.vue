<template>
  <div class="ez-facial-fecognition-verify-wrapper">
    <div class="ez-facial-fecognition-verify-content">
      <div class="tip-btn">请确认是本人操作</div>
      <div class="tip-text">为了方便识别，请确保正脸出现在取景框中</div>
      <div class="img-box">
        <img :src="imageScan" alt="" />
      </div>
      <div class="tip-img d-f ai-c jc-sb">
        <div class="item">
          <img :src="imageS01" alt="" />
          <div class="iconimg-ok"></div>
          <p>正对手机</p>
        </div>
        <div class="item">
          <img :src="imageS02" alt="" />
          <div class="iconimg-ok"></div>
          <p>光线充足</p>
        </div>
        <div class="item">
          <img :src="imageS03" alt="" />
          <div class="iconimg-ok"></div>
          <p>放慢动作</p>
        </div>
      </div>
      <div class="input-wrapper d-f ai-c">
        <div class="label">姓名：</div>
        <input class="input" v-model="idCardName" disabled placeholder="姓名" />
      </div>
      <div class="input-wrapper d-f ai-c">
        <div class="label">身份证号：</div>
        <input
          class="input"
          v-model="idCardNumber"
          disabled
          maxlength="18"
          type="idcard"
          placeholder="身份证号"
        />
      </div>
      <div class="btn-wrapper">
        <button class="btn" @click="handleAuthentication">开始生存认证</button>
      </div>
    </div>
  </div>
</template>
<script>
import { startFacialRecognitionVerify } from '@/utils/uni-api'
import { requestWXGetFaceInfo } from '@/service/api'

import imageScan from './images/scan.png'
import imageS01 from './images/s-01.png'
import imageS02 from './images/s-02.png'
import imageS03 from './images/s-03.png'

export default {
  name: 'survivalCertification',
  props: {
    // 姓名
    idCardName: {
      type: [String],
      default: '',
    },
    // 身份证号
    idCardNumber: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      imageScan,
      imageS01,
      imageS02,
      imageS03,
    }
  },
  components: {
    // MiniButton,
  },
  onLoad(options) {},
  created() {},
  mounted() {},
  methods: {
    handleAuthentication() {
      const idCardNumber = this.idCardNumber
      const idCardName = this.idCardName
      // 姓名或者身份证号为空 返回 阻断执行
      // 此处可以做更多的校验
      if (!idCardName || !idCardNumber) {
        return false
      }
      startFacialRecognitionVerify(idCardName, idCardNumber)
        .then((res) => {
          this.reconfirm(res)
        })
        .catch((err) => {
          this.$emit('error', err)
        })
    },
    // 再次通过后台接口确认人脸识别信息
    reconfirm(code) {
      requestWXGetFaceInfo(code).then((res) => {
        const { data } = res
        const { errcode, identify_ret } = data
        if (errcode == 0 && identify_ret == 0) {
          this.$emit('success', code)
        } else {
          showModal('人脸识别信息认证出错，请重新认证！')
        }
      })
    }
  },
  computed: {},
  watch: {},
  onShow() {},
}
</script>
<style lang="scss" scoped>
.ez-facial-fecognition-verify-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24rpx 32rpx;
  color: $primary;
}
.ez-facial-fecognition-verify-content {
  width: 100%;
  flex: 1;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 32rpx;
  position: relative;
  padding-top: 36rpx;
  img {
    display: block;
    width: 112rpx;
    height: 110rpx;
  }
  .tip-btn {
    height: 72rpx;
    line-height: 72rpx;
    background-color: #deeaff;
    border-radius: 36rpx;
    font-size: 30rpx;
    font-weight: 700;
    text-align: center;
    color: #044fcf;
  }
  .tip-text {
    font-size: 26rpx;
    font-weight: 400;
    color: #044fcf;
    line-height: 36rpx;
    padding-top: 18rpx;
    text-align: center;
  }
  .img-box {
    img {
      width: 252rpx;
      height: 242rpx;
      margin: auto;
    }
  }
  .tip-img {
    padding: 0 28rpx;
    padding-bottom: 90rpx;
    .item {
      position: relative;
      font-size: 26rpx;
      line-height: 1;
      color: #333;
      text-align: center;
    }
  }
  .input-wrapper {
    font-size: 30rpx;
    color: #4e5767;
    height: 112rpx;
    border-bottom: 1px solid rgba($color: #979797, $alpha: 0.3);
    .label {
      font-weight: 700;
      width: 162rpx;
    }
    .input {
      flex: 1;
      color: rgba(78, 87, 103, 0.8);
    }
  }
  .btn-wrapper {
    padding: 80rpx 0 56rpx;
    // position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btn {
      width: 100%;
      height: 72rpx;
      background-color: $primary;
      border-radius: 12rpx;
      font-size: 26rpx;
      font-weight: 700;
      line-height: 72rpx;
      color: #ffffff;
      text-align: center;
    }
  }
  .iconimg-ok {
    position: absolute;
    right: 0;
    bottom: 40rpx;
    width: 24rpx;
    height: 24rpx;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAb1BMVEUAAAA4g/8+i/84gv85gv85gv85g/85g/85g/86g/85hP84hv84gv9CiP87g//P4f/E2v9sov/g7P9Tk/++1f+Mt/+Csf91qP9bmP/U5P+ty//Z5/+10P+kxv+dwf+Vvf9gnP9Mj/9Jjf/x9v/o8P9vxflNAAAADHRSTlMAvhDY+/PFopBcUTsMBfcCAAABQklEQVRIx+2V15KDMAxF19QAcqX3tv//jcvAxCzBxpnwmvOEZ66MriXLP18+wwp8ZLuujfzAekMeIgckDgoN8siDF7zoSv8ABQ998giUIEujt0GDrY5AoAWZ8zf7iOCS81l51wHeqV46JeZ0hoXwTcc4Tlmt8G05aj0psrnq1y45Hm2g2z9hjI/rd3AI8NX7x7wu23hb+GYLZKoorTBRFe/ZFVk+EhlQpIym+XNtHwJc2KANx9JAxko2yqWrDKgSkcdk0/eJyIr9f64ypbQVfb5mPRUNY3wCia00TYpEiGGRkaybqwFrO9aXiRcNTbox5rTuOCaw42sKR/qmTgaeisUM/Cc4t4asLi3Fb5vu+8vWUFaO4KwrS5oP5PLShceOZi2GI+HNC2S+oveGgHnM3Bxk5lF5axibx/2tB8X8ZH35iD+SNzPtgDOvpQAAAABJRU5ErkJggg==)
      no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>
