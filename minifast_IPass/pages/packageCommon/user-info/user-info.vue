<template>
  <view class="user-info h5-page">
    <ComponentPanel title="完善个人信息">
      <div class="panel-content">
        <div class="input-wrapper">
          <label for="" class="label">姓名</label>
          <div class="value">{{ personalInfo.userNameDesc }}</div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">身份证号</label>
          <div class="value">{{ personalInfo.idCardDesc }}</div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">联系电话</label>
          <div class="value btn-wrapper d-f jc-sb ai-c">
            <span class="tel-desc">{{ personalInfo.telDesc }}</span>
            <!-- #ifdef MP-WEIXIN -->
            <ComponentButton
              width="170rpx"
              height="60rpx"
              type="primary"
              name="更新手机号"
              openType="getPhoneNumber"
              size="small"
              :showAnimation="false"
              @getphonenumber="getPhoneNumber"></ComponentButton>
            <!-- #endif -->
          </div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">户籍地址</label>
          <ComponentPicker
            idName="address"
            type="address"
            placeholder="请选择户籍地址"
            v-model="personalInfo.aac021"
            :address="personalInfo.aac021Arr"
            @change="handleChangePicker"></ComponentPicker>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">社会保障卡银行账号</label>
          <div class="value">
            {{ personalInfo.aac203Desc || '省外社保卡，暂未获取到卡信息' }}
          </div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">银行卡类别</label>
          <div class="value">
            {{ personalInfo.aaf002Desc || '省外社保卡，暂未获取到卡信息' }}
          </div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">社保卡卡号</label>
          <div class="value">
            {{ personalInfo.aaz500Desc || '省外社保卡，暂未获取到卡信息' }}
          </div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">社保卡状态</label>
          <div class="value">
            {{ personalInfo.aaz502Desc || '省外社保卡，暂未获取到卡信息' }}
          </div>
        </div>
      </div>
    </ComponentPanel>
  </view>
</template>

<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

import config from '@/config' // 常量
import { showModal, showToast } from '@/utils/uni-api'
import { requestB116, requestFFSavePersonalInfo, requestWXGetRealPhone, requestWXUpdateWxUser } from '@/service/api'
import { USER_INFO, M_UPDATE_USER_INFO } from '@/store/constants' // 常量
import { useTMUserName, useTMBankCard, useTMIDCard, useTMPhone, useTMSocialSecurityCard } from '@/hooks'
import { mapGetters } from 'vuex'

const { areaCode } = config
export default {
  name: 'pageUserInfo',
  data() {
    return {
      personalInfo: {
        userName: '', // 姓名
        userNameDesc: '',
        idCard: '', // 身份证号
        idCardDesc: '',
        tel: '', // 联系方式
        telDesc: '',
        aaf002: '', // 社保卡银行类别
        aaf002Desc: '',
        aaz500: '', // 社保卡号
        aaz500Desc: '',
        aaz502: '', // 社保卡状态
        aaz502Desc: '',
        aac203: '', // 社保卡银行卡卡号
        aac203Desc: '',
        aac021: '', // 户籍地址
        chb015: '',
        chb017: '',
        chb018: '',
        aac021Arr: []
      },
      areaCode
    }
  },
  components: {
    ComponentPanel,
    ComponentButton,
    ComponentPicker
  },
  methods: {
    // 获取数据
    getData() {
      const { idCard, userName, tel, aac203, aac021, aac021Arr, aaf002, aaf002Desc, aaz500, aaz502, aaz502Desc } =
        this.userInfo
      this.personalInfo = {
        userName, // 姓名
        userNameDesc: useTMUserName(userName),
        idCard, // 身份证号
        idCardDesc: useTMIDCard(idCard),
        tel, // 联系方式
        telDesc: useTMPhone(tel),
        aaf002, // 社保卡银行类别
        aaf002Desc,
        aaz500: aaz500, // 社保卡号
        aaz500Desc: this.areaCode === '511500' || this.areaCode === '511300' ? useTMSocialSecurityCard(aaz500) : aaz500,
        aaz502, // 社保卡状态
        aaz502Desc,
        aac203, // 社保卡银行卡卡号
        aac203Desc: useTMBankCard(aac203),
        aac021, // 户籍地址
        aac021Arr
      }
    },
    // 保存
    handleSave() {
      const { isOpenYGFF } = config
      const { aac021, chb015, chb017, chb018, tel, idCard, userName } = this.personalInfo

      const param = {
        aac003: userName,
        aac002: idCard,
        aae005: tel,
        chb015: chb015,
        chb017: chb017,
        chb018: chb018,
        aac021: aac021
      }
      if (isOpenYGFF) {
        requestFFSavePersonalInfo(param).then(() => {
          showToast('保存成功', 'success').then(() => {
            this.$store.commit(M_UPDATE_USER_INFO, {
              aac021,
              chb018,
              chb015,
              chb017,
              tel
            })
          })
        })
      } else {
        requestB116(param).then(() => {
          showToast('保存成功', 'success').then(() => {
            this.$store.commit(M_UPDATE_USER_INFO, {
              aac021,
              chb018,
              chb015,
              chb017,
              tel
            })
          })
        })
      }
    },
    // 户籍地址改变
    handleChangePicker(id, value) {
      if (id === 'address') {
        let chb015 = ''
        let chb017 = ''
        let chb018 = ''

        if (value && value.length > 0) {
          const v0 = value[0]
          const v1 = value[1]
          const v2 = value[2]
          if (v0 && v0.orgid) {
            chb015 = v0.orgid
          }
          if (v1 && v1.orgid) {
            chb017 = v1.orgid
            if (this.areaCode === '510400') {
              chb017 = value[2].orgid
            }
          }
          if (v2 && v2.orgid) {
            chb018 = v2.orgid
            if (this.areaCode === '510400') {
              chb018 = value[3].orgid
            }
          }
        }
        this.personalInfo = {
          ...this.personalInfo,
          chb015,
          chb017,
          chb018
        }
        if (chb015 && chb017 && chb018) {
          this.handleSave()
        }
      }
    },
    // 更新用户信息
    handelSaveUserInfo() {
      const { tel } = this.personalInfo
      const { tel: telUserInfo } = this.userInfo
      if (tel === telUserInfo) {
        showModal('当前手机号和获取手机号一致，无需更新！')
        return
      }
      requestWXUpdateWxUser(tel).then(() => {
        showToast('保存成功', 'success').then(() => {
          this.personalInfo.telDesc = useTMPhone(tel)
          this.$store.commit(M_UPDATE_USER_INFO, {
            tel
          })
        })
      })
    },
    // 获取手机号
    getPhoneNumber(e) {
      const { code, errMsg } = e.target
      if (errMsg === 'getPhoneNumber:ok') {
        requestWXGetRealPhone(code).then((res) => {
          const { data } = res
          if (data && data.phoneNum) {
            this.personalInfo.tel = data.phoneNum
            this.handelSaveUserInfo()
          } else {
            this.personalInfo.tel = ''
          }
        })
      } else {
        showModal('请点击允许按钮，才能获取您的电话号码！')
      }
    }
  },
  computed: {
    ...mapGetters([USER_INFO])
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          this.getData()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  padding: $spacing;
  .button-wrapper {
    padding: $spacing;
  }
  .value {
    width: 100%;
    padding: 0 16rpx;
    font-size: 28rpx;
    line-height: 72rpx;
    height: 72rpx;
    background-color: #f0f2f5;
    border-radius: 8rpx;
    color: #3d424d;
    font-weight: 500;
    opacity: 0.6;

    &.btn-wrapper {
      opacity: 1;
    }

    .tel-desc {
      opacity: 0.6;
    }
  }
}
</style>
