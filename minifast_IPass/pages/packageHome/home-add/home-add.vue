<template>
  <div class="my-home-face h5-page">
    <div class="face">
      <img :src="imagePeople" alt="" />
      <div class="scan"></div>
    </div>
    <div class="basic-info">
      <div class="cell d-f ai-c">
        <label for="" class="label">姓名：</label>
        <input
          placeholder="请输入您的姓名"
          type="text"
          maxlength="20"
          v-model="userName"
        />
      </div>
      <div class="cell d-f ai-c">
        <label for="" class="label">身份证号：</label>
        <input
          placeholder="请输入您的身份证号码"
          type="idcard"
          maxlength="18"
          v-model="idCard"
        />
      </div>
      <div class="button-wrapper">
        <ComponentButton
          name="开始人脸识别验证"
          type="primary"
          borderRadius="12rpx"
          height="72rpx"
          @click="handleFaceByMini"
        ></ComponentButton>
      </div>
    </div>
  </div>
</template>
<script>
import imagePeople from './images/people@2x.png'

import ComponentButton from '@/components/common/ez-button/ez-button.vue'

import { getIsDev } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import {
  showModal,
  startFacialRecognitionVerify,
  navigateBack,
  switchTab,
} from '@/utils/uni-api' // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
import {
  requestWXInsertFamilyNumber,
  requestWXGetMyFamilyUser,
  requestWXGetFaceInfo
} from '@/service/api'
import { FAMILY_MEMBERS, UPDATE_FAMILY_MEMBERS } from '@/store/constants'
import { mapGetters } from 'vuex'
export default {
  name: 'pageMyHomeAdd',
  data() {
    return {
      imagePeople,
      userName: '',
      idCard: '',
      familyId: '',
      type: '', // scan 扫码加入
    }
  },
  components: { ComponentButton },
  onLoad(e) {
    let { familyId, q } = e
    const param = {}
    // 手机扫码
    if (q) {
      const url = decodeURIComponent(q)
      const queryString = url.substring(url.indexOf('?') + 1)
      const queryStringArray = queryString.split('&')

      for (var i = 0, len = queryStringArray.length; i < len; i++) {
        const item = queryStringArray[i]
        const item_arr = item.split('=')
        const item_key = item_arr[0]
        const item_val = item_arr[1]
        param[item_key] = item_val
      }

      this.type = q
      familyId = param.familyId
    }

    if (familyId) {
      this.familyId = familyId
      this._requestGetMyFamilyUser(familyId)
    }
  },
  methods: {
    // 获取家庭成员
    _requestGetMyFamilyUser(familyId) {
      requestWXGetMyFamilyUser(familyId, true).then((res) => {
        const data = res.data
        if (data) {
          let newList = []
          for (let i = 0, len = data.length; i < len; i++) {
            const item = data[i]
            newList.push({
              id: item.id,
              idCard: item.idCard,
              userName: item.userName,
              familyId: item.familyId,
              handleTime: item.handleTime,
              joinTime: item.joinTime,
            })
          }
          this.$store.commit(UPDATE_FAMILY_MEMBERS, newList)
        }
      })
    },
    // 请求加入我的家
    _requestInsertFamilyNumber(userName, idCard, familyId) {
      const type = this.type

      requestWXInsertFamilyNumber(userName, idCard, familyId, true).then(
        (res) => {
          showModal('添加成功').then(() => {
            setTimeout(() => {
              if (type) {
                switchTab('home')
              } else {
                navigateBack(1)
              }
            }, 500)
          })
        }
      )
    },
    // 人脸核身验证开始
    handleFaceByMini() {
      const isDev = getIsDev()
      const userName = this.userName
      const familyMembers = this.familyMembers
      const idCard = this.idCard
      const familyId = this.familyId
      if (!userName) {
        showModal('请输入姓名')
        return false
      }
      if (!idCard) {
        showModal('请输入身份证号')
        return false
      } else {
        const checkIDCardResult = checkIDCard(idCard, '身份证号')
        if (checkIDCardResult.status === '0') {
          showModal(checkIDCardResult.msg)
          return false
        }
      }

      let isExistTag = false
      for (let i = 0, len = familyMembers.length; i < len; i++) {
        var item = familyMembers[i]
        if (idCard === item.idCard) {
          isExistTag = true
          showModal('该人员已存在于您的家中，不能重复添加！')
          return
        }
      }
      if (isExistTag) {
        return
      }
      // 开发环境下 关闭人脸认证
      if (isDev) {
        this._requestInsertFamilyNumber(userName, idCard, familyId)
        return
      }
      // #ifdef MP-WEIXIN
      startFacialRecognitionVerify(userName, idCard).then((res) => {
        this.reconfirm(res)
      })
      // #endif
      // #ifdef H5
      this._requestInsertFamilyNumber(userName, idCard, familyId)
      // #endif
    },
    // 再次通过后台接口确认人脸识别信息
    reconfirm(code) {
      const userName = this.userName
      const idCard = this.idCard
      const familyId = this.familyId
      requestWXGetFaceInfo(code).then((res) => {
        const { data } = res
        const { errcode, identify_ret } = data
        if (errcode == 0 && identify_ret == 0) {
          this._requestInsertFamilyNumber(userName, idCard, familyId)
        } else {
          showModal('人脸识别信息认证出错，请重新认证！')
        }
      })
    },
  },
  computed: {
    ...mapGetters([FAMILY_MEMBERS]),
  },
  watch: {},
  onShow() {},
  onUnload() {},
}
</script>
<style lang="scss" scoped>
@keyframes scan1 {
  0% {
    height: 120rpx;
  }
  50% {
    height: 230rpx;
  }
  100% {
    height: 120rpx;
  }
}
.my-home-face {
  background-color: #f5f5f5;
  padding: $spacing $spacing;
  .face {
    height: 356rpx;
    background-color: #fff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.15);
    border-radius: 12rpx;
    padding: 40rpx 20rpx 20rpx;
    text-align: center;
    width: 100%;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABWQAAALIBAMAAAAK2uSZAAAAG1BMVEUAAAA5gv84g/85g/85gv86g/87if84g/84gv+DL9mmAAAACHRSTlMA89DggUINf4t0MwUAAATISURBVHja7NrNSUNBFIbh2cQaUoALG9ACXLkU0oCQJtzeIHjKVvfmhMC9yXzwPDW8zJm/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ4eF1X2csjx8DZnOoxvOAyeyq9T5grml+rNbLgLmm+Vu1vgbMNc2fqnUa0LjDNN9XaxnQWGuaS5bJXJrmNgZMZsWl8dPxi3/kJuuSi7CNgacEbnH8+r5qwfZgy/aO6yVbv3yLYWu7ap2uT3bApg7VWSTLbP6+xTQkSwrJEkayhJEsYSRLGMkSRrKEkSxhJEsYyRJGsoSRLGEkSxjJEkayhJEsYSRLGMkSRrKEkSxhJEsYyRJGsoSRLGEk+8NeHZsgEERRFJ1EczMLMLABLcDIULABwUoUg1+2TAcrzMA+OaeGC5cwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAkjWcJIljC/B7iv7tVgiRUke6zu3WCJFSR7re7TYJypm39Wd24wztTNb6q7NRhn7ubvVXVqMNDczW8vu8OjwUA2zx+zecLYPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8GUPDgQAAAAAgPxfG0FVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdiDAwEAAAAAIP/XRlBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFfbgQAAAAAAAyP+1EVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVhT04EAAAAAAA8n9tBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVYZeOTRAKoiiIvkRzMwswsAEtwMhQsAHBShSDLVtcGxAW9nvhnHyyAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWNb6tNndCn7zBwNeW2uHgjnGB1y1j0vBFOMD3ntxLJhifMBzL14FU4wPuO/Fs2CK8QG3vXgUTDE+YPsqWET7siwpLEsYyxLGsoSxLGEsSxjLEsayhLEsYSxLGMsSxrKEsSxh3uzawWkDMRCGUV3sGraAHNxAUoBPPgbcQMBN5LohYJXtDsaLVwj/8F4NH0LSjGQJI1nCSJYwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAkjWcJIljCSJYxkCSNZwkiWMJIljGQJI1nCSJYwkiWMZAnzQrKF9eOnwRDH89ILbbulVz4bDHHtlbVtd+ql7wYDHHrpr23320tfDQa49dJ9XLL/DQa4jEv29OzAhsr8zpZeWhsURnUmWd7Ms85cDHgzAzu7eH6xx/zObj652GN+ZwejBHaZ39nVwJY95nd2PC/WYniFzgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHi0B4cEAAAAAIL+v/aEEQAAADgFbItYp0xLbCUAAAAASUVORK5CYII=)
      no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    img {
      width: 276rpx;
      height: 276rpx;
      border-radius: 50%;
      margin: auto;
    }
    .scan {
      position: absolute;
      left: 40rpx;
      top: 40rpx;
      width: 610rpx;
      height: 220rpx;
      background-image: linear-gradient(
        180deg,
        rgba(0, 85, 255, 0.02) 0%,
        rgba(0, 85, 255, 0.03) 40%,
        rgba(#3882ff, 0.2) 100%
      );
      margin: auto;
      animation: scan1 4s infinite;
      &::after {
        content: '';
        left: 0;
        bottom: 0;
        position: absolute;
        width: 100%;
        height: 6rpx;
        background-image: linear-gradient(
          90deg,
          rgba(69, 149, 241, 0) 0%,
          #3882ff 51%,
          rgba(69, 149, 241, 0) 100%
        );
      }
    }
  }
  .cell {
    height: 92rpx;
    background-color: #fff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.07);
    border-radius: 12rpx;
    margin-top: $spacing;
    padding: 0 $spacing;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 42rpx;
    color: $color;
    input {
      flex: 1;
      overflow: hidden;
      height: 100%;
      font-weight: 500;
      line-height: 42rpx;
      font-size: 30rpx;
      padding-left: 12rpx;
      color: rgba($color: $color, $alpha: 0.8);
    }
  }
  .button-wrapper {
    padding: $spacing * 2 0 0;
  }
}
</style>
