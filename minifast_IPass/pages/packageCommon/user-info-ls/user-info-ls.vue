<template>
  <view class="user-info h5-page">
    <ComponentPanel title="个人信息">
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
            <ComponentButton
              width="170rpx"
              height="60rpx"
              type="primary"
              name="更新手机号"
              openType="getPhoneNumber"
              size="small"
              :showAnimation="false"
              @getphonenumber="getPhoneNumber"></ComponentButton>
          </div>
        </div>
        <div class="input-wrapper">
          <label for="" class="label">户籍地址</label>
          <div class="value" v-if="userInfo.aac021">
            {{ personalInfo.aac021 || '暂无' }}
          </div>
          <ComponentPicker
            v-else
            idName="address"
            type="address"
            placeholder="请选择户籍地址"
            v-model="personalInfo.aac021"
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

    <div class="tip" v-if="userInfo.aac021">注：每个月只能提交一次修改申请</div>

    <div class="button-wrapper">
      <ComponentButton
        :name="userInfo.aac021 ? '修改' : '保存'"
        type="primary"
        @click="handleEdit"></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

import { USER_INFO, M_UPDATE_USER_INFO } from '@/store/constants' // 常量
import { useTMUserName, useTMBankCard, useTMIDCard, useTMPhone } from '@/hooks'
import { mapGetters } from 'vuex'
import { navigateTo, showToast, showModal, navigateBack } from '@/utils/uni-api'
import {
  requestB116,
  requestB164,
  requestWXGetRealPhone,
  requestWXUpdateWxUser,
} from '@/service/api'
export default {
  name: 'pageUserInfoLS',
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
        aac021Arr: [],
      },
    }
  },
  components: {
    ComponentPanel,
    ComponentButton,
    ComponentPicker,
  },
  methods: {
    // 获取数据
    getData() {
      const {
        idCard,
        userName,
        tel,
        aac203,
        aac021,
        aac021Arr,
        aaf002,
        aaf002Desc,
        aaz500,
        aaz502,
        aaz502Desc,
      } = this.userInfo
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
        aaz500Desc: aaz500,
        aaz502, // 社保卡状态
        aaz502Desc,
        aac203, // 社保卡银行卡卡号
        aac203Desc: useTMBankCard(aac203),
        aac021, // 户籍地址
        aac021Arr,
      }

      requestB164(idCard, userName).then((res) => {
        // console.log(res, 987)
        if (res && res.che474) {
          const { che474, msg } = res
          if (che474 == '0') {
            showModal('您上次提交的申请正在审核中，请稍后重试！').then(() => {
              navigateBack(1)
            })
          }
          if (che474 == '2') {
            showModal(`您上次提交的申请${msg}。请重新提交！`)
          }
        }
      })
    },
    // 保存
    handleSave() {
      const { aac021, chb015, chb017, chb018, tel, idCard, userName } = this.personalInfo

      if (!aac021) {
        showModal('请选择户籍地址')
        return
      }

      const param = {
        aac003: userName,
        aac002: idCard,
        aae005: tel,
        chb015: chb015,
        chb017: chb017,
        chb018: chb018,
        aac021: aac021,
      }
      requestB116(param).then(() => {
        showToast('保存成功', 'success').then(() => {
          this.$store.commit(M_UPDATE_USER_INFO, {
            aac021,
            chb018,
            chb015,
            chb017,
          })
        })
      })
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
          }
          if (v2 && v2.orgid) {
            chb018 = v2.orgid
          }
        }
        this.personalInfo = {
          ...this.personalInfo,
          chb015,
          chb017,
          chb018,
        }
      }
    },
    // 修改
    handleEdit() {
      const { aac021 } = this.userInfo
      if (aac021) {
        navigateTo('user-info-ls-edit', 'packageCommon')
      } else {
        this.handleSave()
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
            tel,
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
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          this.getData()
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  padding: $spacing;

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
  .tip {
    color: #f00;
    font-size: 26rpx;
    text-align: right;
    padding-top: $spacing;
    line-height: 1;
  }
  .button-wrapper {
    padding-top: $spacing;
  }
}
</style>
