<template>
  <div class="survival-certification h5-page">
    <div class="content">
      <div class="tip">
        <div class="tag">请确认是本人操作</div>
        <div class="text">为了方便识别，请确保正脸出现在取景框中</div>
      </div>
      <div class="image-container">
        <ComponentImg
          :path="images.scan"
          width="252rpx"
          height="242rpx"
        ></ComponentImg>
        <div class="items d-f ai-c jc-sb">
          <div class="item">
            <ComponentImg
              :path="images.S01"
              width="100rpx"
              height="100rpx"
            ></ComponentImg>
            <div class="iconimg"></div>
            <p>正对手机</p>
          </div>
          <div class="item">
            <ComponentImg
              :path="images.S02"
              width="100rpx"
              height="100rpx"
            ></ComponentImg>
            <div class="iconimg"></div>
            <p>光线充足</p>
          </div>
          <div class="item">
            <ComponentImg
              :path="images.S03"
              width="100rpx"
              height="100rpx"
            ></ComponentImg>
            <div class="iconimg"></div>
            <p>放慢动作</p>
          </div>
        </div>
      </div>
      <div class="form">
        <div class="form-input-wrapper d-f ai-c">
          <div class="label">姓名：</div>
          <input
            class="input"
            v-model="userName"
            placeholder="请输入您的姓名"
          />
        </div>
        <div class="form-input-wrapper d-f ai-c">
          <div class="label">身份证号：</div>
          <input
            class="input"
            type="idcard"
            v-model="idCard"
            maxlength="18"
            placeholder="请输入您的身份证号"
          />
        </div>
      </div>
      <div class="button-wrapper">
        <ComponentButton
          type="primary"
          :name="areaCode === '510400' ? '开始资格认证' : '开始生存认证'"
          :disabled="buttonDisabled"
          fontWeight="500"
          @click="handleFacialRecognitionVerify"
        ></ComponentButton>
      </div>
    </div>
  </div>
</template>
<script>
import ComponentImg from '@/components/common/ez-img/ez-img.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import {
  startFacialRecognitionVerify,
  showModal,
  navigateBack,
  showToast
} from '@/utils/uni-api'
import { IMAGE_COMMON } from '@/config/constants'
import { useCheckIDCard, useGetIsDev } from '@/hooks/common'
import { requestB148, requestWXGetFaceInfo } from '@/service/api'
import { USER_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import config from '@/config'
import { setNavigationBarTitle } from '@/utils/uni-api'

const imageS01 = IMAGE_COMMON + 'icon-004.png'
const imageS02 = IMAGE_COMMON + 'icon-005.png'
const imageS03 = IMAGE_COMMON + 'icon-006.png'
const imageScan = IMAGE_COMMON + 'icon-007.png'

export default {
  name: 'pageCommonSurvivalCertification',
  data() {
    return {
      images: {
        scan: {
          src: '', // 本地图片
          httpSrc: imageScan // 网络图片
        },
        S01: {
          src: '', // 本地图片
          httpSrc: imageS01 // 网络图片
        },
        S02: {
          src: '', // 本地图片
          httpSrc: imageS02 // 网络图片
        },
        S03: {
          src: '', // 本地图片
          httpSrc: imageS03 // 网络图片
        }
      },
      userName: '', // 姓名
      idCard: '', // 身份证号
      areaCode: config.areaCode
    }
  },
  components: {
    ComponentButton,
    ComponentImg
  },
  onLoad() {
    const { idCard, userName } = this.userInfo
    if (idCard) {
      this.idCard = idCard
    }
    if (userName) {
      this.userName = userName
    }
    if (this.areaCode === '510400') {
      setNavigationBarTitle('资格认证')
    }
  },
  onShow() {},
  methods: {
    // 保存数据
    saveData(idCard, userName) {
      requestB148(userName, idCard).then(() => {
        showToast('认证成功', 'success').then(() => {
          setTimeout(() => {
            navigateBack(1)
          }, 1500)
        })
      })
    },
    // 开始生存认证 按钮 回调函数
    handleFacialRecognitionVerify() {
      const userName = this.userName
      const idCard = this.idCard
      if (!userName) {
        showModal('请输入姓名')
        return
      }
      if (!idCard) {
        showModal('请输入姓名身份证号')
        return
      } else {
        const checkRes = useCheckIDCard(idCard, '身份证号')
        if (checkRes.status == '0') {
          showModal(checkRes.msg)
          return
        }
      }

      const isDev = useGetIsDev()

      if (isDev) {
        startFacialRecognitionVerify(userName, idCard, 2, true).finally(() => {
          this.saveData(idCard, userName)
        })
      } else {
        startFacialRecognitionVerify(userName, idCard, 2, true).then((res) => {
          this.reconfirm(res)
        })
      }
    },
    // 再次通过后台接口确认人脸识别信息
    reconfirm(code) {
      const userName = this.userName
      const idCard = this.idCard
      requestWXGetFaceInfo(code).then((res) => {
        const { data } = res
        const { errcode, identify_ret } = data
        if (errcode == 0 && identify_ret == 0) {
          this.saveData(idCard, userName)
        } else {
          showModal('人脸识别信息认证出错，请重新认证！')
        }
      })
    }
  },
  computed: {
    ...mapGetters([USER_INFO]),
    // 生存认证按钮是否可用
    buttonDisabled() {
      let result = true
      const userName = this.userName
      const idCard = this.idCard
      if (userName && idCard) {
        result = false
      }
      return result
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.survival-certification {
  width: 100%;
  height: 100vh;
  padding: 32rpx;

  .content {
    height: 100%;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 36rpx 32rpx 216rpx;
    position: relative;
  }

  .tip {
    color: shade($primary, 10%);
    font-weight: 700;
    text-align: center;
    font-size: 30rpx;
    line-height: 72rpx;

    .tag {
      height: 72rpx;
      background-color: rgba($primary, 0.1);
      border-radius: 36px;
    }

    .text {
      font-size: 26rpx;
      font-weight: 400;
      line-height: 36rpx;
      padding: 24rpx 0;
    }
  }

  .image-container {
    padding-top: 12rpx;
  }

  .items {
    padding: 12rpx 28rpx;

    .item {
      position: relative;
      font-size: 26rpx;
      line-height: 1;
      color: #333;
      text-align: center;

      .iconimg {
        position: absolute;
        right: 0;
        bottom: 40rpx;
        width: 24rpx;
        height: 24rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAb1BMVEUAAAA4g/8+i/84gv85gv85gv85g/85g/85g/86g/85hP84hv84gv9CiP87g//P4f/E2v9sov/g7P9Tk/++1f+Mt/+Csf91qP9bmP/U5P+ty//Z5/+10P+kxv+dwf+Vvf9gnP9Mj/9Jjf/x9v/o8P9vxflNAAAADHRSTlMAvhDY+/PFopBcUTsMBfcCAAABQklEQVRIx+2V15KDMAxF19QAcqX3tv//jcvAxCzBxpnwmvOEZ66MriXLP18+wwp8ZLuujfzAekMeIgckDgoN8siDF7zoSv8ABQ998giUIEujt0GDrY5AoAWZ8zf7iOCS81l51wHeqV46JeZ0hoXwTcc4Tlmt8G05aj0psrnq1y45Hm2g2z9hjI/rd3AI8NX7x7wu23hb+GYLZKoorTBRFe/ZFVk+EhlQpIym+XNtHwJc2KANx9JAxko2yqWrDKgSkcdk0/eJyIr9f64ypbQVfb5mPRUNY3wCia00TYpEiGGRkaybqwFrO9aXiRcNTbox5rTuOCaw42sKR/qmTgaeisUM/Cc4t4asLi3Fb5vu+8vWUFaO4KwrS5oP5PLShceOZi2GI+HNC2S+oveGgHnM3Bxk5lF5axibx/2tB8X8ZH35iD+SNzPtgDOvpQAAAABJRU5ErkJggg==);
      }
    }
  }

  .form {
    padding-top: 90rpx;
    position: relative;

    .form-input-wrapper {
      font-size: 30rpx;
      color: $color;
      height: 112rpx;
      border-bottom: 1px solid $border-color;
      background-color: transparent;

      .label {
        font-weight: 700;
        width: 162rpx;
      }

      .input {
        flex: 1;
        color: $color-placeholder;
      }
    }

    .iconfont {
      position: absolute;
      top: 90rpx;
      right: 0;
      font-size: 48rpx;
      padding: 32rpx 0;
      color: $color;
      z-index: 99;
    }
  }

  .button-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 80rpx $spacing 56rpx;
  }
}
</style>
