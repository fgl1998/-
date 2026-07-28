<template>
  <div class="registration-info">
    <ComponentPanel title="登记信息">
      <div class="panel-content">
        <div class="cell-items">
          <div class="cell-item required disabled">
            <div class="key">姓名</div>
            <div class="value">
              {{ formData.aac003_TM }}
            </div>
          </div>
          <div class="cell-item required disabled">
            <div class="key">身份证号</div>
            <div class="value">
              {{ formData.aac002_TM }}
            </div>
          </div>
          <div class="cell-item required disabled">
            <div class="key">联系方式</div>
            <div class="value">
              {{ formData.tel_TM }}
            </div>
          </div>
          <ComponentDeclarePicker
            label="人员类别"
            idName="aka131"
            :range="codeTableData.visitors"
            placeholder="请选择人员类别"
            v-model="formData.aka131"
          >
          </ComponentDeclarePicker>
          <div class="cell-item required">
            <div class="key">来访单位名称</div>
            <div class="value">
              <input
                type="text"
                maxlength="20"
                v-model="formData.visitplace"
                placeholder="请输入您的来访单位名称"
              />
            </div>
          </div>
          <!-- <div class="cell-item required address">
            <div class="key">来自省市区</div>
            <div class="value" @click="handleSelectAddress">
              <div class="value-val" v-if="formData.place">
                {{ formData.place }}
              </div>
              <div class="value-placeholder" v-else>请点击选择您来自省市区</div>
              <i class="iconimg-address"></i>
            </div>
          </div> -->
          <ComponentSelectCurrentAddress
            label="来自省市区"
            placeholder="请点击选择您来自省市区"
            :level="3"
            v-model="formData.place"
          ></ComponentSelectCurrentAddress>
          <div class="cell-item required">
            <div class="key">来访内容</div>
            <div class="value">
              <input
                type="text"
                maxlength="20"
                v-model="formData.content"
                placeholder="请输入您的来访内容"
              />
            </div>
          </div>
          <!-- <div class="cell-item required">
            <div class="key">体温</div>
            <div class="value">
              <input
                type="digit"
                maxlength="5"
                v-model="formData.temperature"
                placeholder="请输入您当前的体温"
              />
            </div>
          </div>
          <ComponentDeclarePicker
            label="是否出示健康码"
            idName="showcode"
            :range="codeTableData.yesorno"
            placeholder="请选择是否出示健康码"
            v-model="formData.showcode"
            @change="handleChangePicker"
          >
          </ComponentDeclarePicker> -->
          <div class="cell-item last">
            <div class="key">出入证编号</div>
            <div class="value">
              <input
                type="text"
                maxlength="20"
                v-model="formData.visitnumber"
                placeholder="请输入您的出入证编号"
              />
            </div>
          </div>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>

<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'

import { mapGetters } from 'vuex'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { useTMPhone, useTMUserName, useTMIDCard } from '@/hooks'
import { USER_INFO } from '@/store/constants'
import { requestWXLastRegister } from '@/service/api'
import {
  showLoading,
  hideLoading,
  navigateTo,
  showModal
} from '@/utils/uni-api'
export default {
  data() {
    return {
      // 码表
      codeTableData: {
        visitors: [],
        yesorno: [],
        visitplace: []
      },
      formData: {
        aac002: '',
        aac002_TM: '暂无',
        aac003: '',
        aac003_TM: '暂无',
        tel: '',
        tel_TM: '暂无',
        aka131: '', // 人员类别
        visitplace: '', // 来访单位
        place: '', // 来访人员来源地
        visitnumber: '', // 出入证编号
        content: '' // 来访内容
      }
    }
  },
  components: {
    ComponentPanel,
    ComponentDeclarePicker,
    ComponentSelectCurrentAddress
  },
  created() {},
  mounted() {},
  methods: {
    // 获取上一次登记记录
    getLastRegister() {
      const { idCard } = this.userInfo
      requestWXLastRegister(idCard).then((res) => {
        const { data } = res
        if (data) {
          const {
            aka131,
            visitplace,
            place,
            visitnumber,
            content,
            isUpdate = '',
            id = ''
          } = data
          this.formData = {
            ...this.formData,
            aka131,
            visitplace,
            place,
            visitnumber,
            content,
            isUpdate,
            id
          }
        }
        this.initData()
      })
    },
    // 初始化数据同时判断用户是否登录
    initData() {
      const { userName, idCard, tel } = this.userInfo
      this.formData = {
        ...this.formData,
        aac002: idCard,
        aac002_TM: useTMIDCard(idCard),
        aac003: userName,
        aac003_TM: useTMUserName(userName),
        tel: tel,
        tel_TM: useTMPhone(tel)
      }
      this.getData()
    },
    // 获取数据
    getData() {
      showLoading()
      Promise.allSettled([
        getCodeListByCodeName('visitors'),
        getCodeListByCodeName('yesorno')
      ]).then((res) => {
        const res0 = res[0]
        const res1 = res[1]

        const { status: statusRes0, value: valueRes0 } = res0
        const { status: statusRes1, value: valueRes1 } = res1

        // 人员类别码表
        if (statusRes0 === 'fulfilled' && valueRes0) {
          this.codeTableData = {
            ...this.codeTableData,
            visitors: valueRes0
          }
        }
        // yesorno 码表
        if (statusRes1 === 'fulfilled' && valueRes1) {
          this.codeTableData = {
            ...this.codeTableData,
            yesorno: valueRes1
          }
        }
        hideLoading()
      })
    },
    returnFormData() {
      return this.formData
    }
    // 选择地点
    // handleSelectAddress() {
    //   getLocation().then((res) => {
    //     const { latitude, longitude } = res
    //     chooseLocation(latitude, longitude).then((res) => {
    //       const { address, name } = res
    //       this.formData = {
    //         ...this.formData,
    //         place: address
    //       }
    //     })
    //   })
    // },
  },
  computed: {
    ...mapGetters([USER_INFO])
  },
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          this.getLastRegister()
        }
      },
      immediate: true
    },
    'userInfo.isCancelLogin': {
      handler(val) {
        if (val) {
          if (!this.userInfo.user_id) {
            showModal('请登录后再访问').then((res) => {
              navigateTo('login', 'packageCommon')
            })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell-items {
  padding: 0 16rpx;
  .cell-item {
    display: flex;
    align-items: center;
    min-height: $cell-height;
    border-bottom: solid 1px $border-color;
    .key {
      font-size: 30rpx;
      font-weight: 700;
      letter-spacing: 0rpx;
      color: $color;
      padding-left: 14rpx;
      margin-right: 32rpx;
      line-height: 1.5;
    }
    .value {
      flex: 1;
      height: 100%;
      overflow: hidden;
      font-size: 30rpx;
      font-weight: 700;
      color: shade($color-placeholder, 20%);
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      white-space: nowrap;
    }
    input {
      display: block;
      width: 100%;
      line-height: 1.5;
      font-size: 30rpx;
      font-weight: 700;
      color: shade($color-placeholder, 20%);
    }

    &.required {
      .key {
        position: relative;
        &::before {
          content: '*';
          position: absolute;
          color: #f00;
          top: 50%;
          transform: translateY(-50%);
          margin-top: -4rpx;
          left: 0;
        }
      }
    }
    &.address {
      flex-wrap: wrap;
      padding: 28rpx 0;

      .key {
        width: 100%;
      }
      .value {
        width: 100%;
        text-align: left;
        margin-top: 20rpx;
        line-height: 1.4;
        padding-right: 50rpx;
        position: relative;
        font-size: 30rpx;
        justify-content: flex-start;
        padding-left: 14rpx;
        word-break: break-all;
        white-space: normal;
      }
      .iconimg-address {
        width: 36rpx;
        height: 36rpx;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background: url(data:image/png;base64,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)
          no-repeat center center;
        background-size: 100% 100%;
      }
    }
    &.disabled {
      .value,
      input {
        opacity: 0.4;
      }
    }

    &.last {
      border-bottom: 0;
    }
    &.wrap {
      flex-wrap: wrap;
      .key {
        width: 100%;
      }
      .value {
        width: 100%;
        padding: 20rpx 0;
      }
    }
  }
}
</style>
