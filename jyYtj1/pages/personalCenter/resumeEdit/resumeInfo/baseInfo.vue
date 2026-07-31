<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>基本信息</span>
      </div>
      <div class="title-rt">
        <div>
          <button type="primary" size="mini" @click="save" plain>{{ isEdit ? '保存' : '编辑' }}</button>
        </div>
        <div v-show="isEdit">
          <button type="primary" size="mini" @click="isEdit = false" plain>取消</button>
        </div>
      </div>
    </div>
    <div class="group-con">
      <uni-forms ref="form" :modeValue="baseInfo">
        <uni-row class="uni-row table-horizontal">
          <uni-col :span="20" class="clo-tr">
            <uni-col :span="24" class="clo-td no-top">
              <div class="form-item">
                <div class="form-label">姓名</div>
                <div class="form-value">
                  <uni-easyinput
                    v-model="baseInfo.aac003"
                    type="text"
                    disabled
                    class="form-input"
                    placeholderStyle="color:rgba(0,0,0,.25)"
                  />
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">身份证号</div>
                <div class="form-value">
                  <uni-easyinput
                    v-model="baseInfo.aac002"
                    type="idcard"
                    maxlength="18"
                    disabled
                    class="form-input"
                    placeholderStyle="color:rgba(0,0,0,.25)"
                  />
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">性别</div>
                <div class="form-value">
                  <custom-select
                    id="aac004"
                    label="性别"
                    collect="aac004"
                    ref="customSelect"
                    v-model="baseInfo.aac004"
                    :disabled="true"
                    @input="binddata('aac004', baseInfo.aac004)"
                    height="42px"
                  ></custom-select>
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">出生日期</div>
                <div class="form-value">
                  <uni-easyinput
                    v-model="baseInfo.aac006"
                    type="text"
                    disabled
                    class="form-input"
                    placeholderStyle="color:rgba(0,0,0,.25)"
                  />
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">最高学历</div>
                <div class="form-value">
                  <custom-select
                    id="aac011"
                    label="最高学历"
                    ref="customSelect1"
                    collect="aac011"
                    v-model="baseInfo.aac011"
                    :disabled="!isEdit"
                    @input="binddata('aac011', baseInfo.aac011)"
                    height="42px"
                  >
                  </custom-select>
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">联系方式</div>
                <div class="form-value">
                  <uni-easyinput
                    v-model="baseInfo.aae005"
                    type="text"
                    maxlength="11"
                    :disabled="!isEdit"
                    class="form-input"
                    placeholderStyle="color:rgba(0,0,0,.25)"
                    @blur="mobile(baseInfo.aae005)"
                  />
                </div>
              </div>
            </uni-col>
            <uni-col :span="12" class="clo-td">
              <div class="form-item">
                <div class="form-label">常住地址</div>
                <div class="form-value" @click="clickAddressModal()">
                  <uni-easyinput
                    v-model="baseInfo.aae006"
                    type="text"
                    :disabled="!isEdit"
                    class="form-input"
                    placeholderStyle="color:rgba(0,0,0,.25)"
                  />
                </div>
              </div>
            </uni-col>
          </uni-col>
          <uni-col :span="4" class="clo-td no-top left">
            <div class="form-head">
              <image class="head" :src="baseInfo.imgUrl" mode="scaleToFill" />
            </div>
          </uni-col>
        </uni-row>
      </uni-forms>
    </div>
    <modal-address
      ref="modalAddress"
      areaid="aac303"
      :areaCode="baseInfo.aac303"
      v-model="baseInfo.aae006"
      :disabled="false"
      @setAreaValue="getAreaValue"
      placeholder="选择地区"
    ></modal-address>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'baseInfo',
  props: {
    resumeBase: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      downLoadImgSrc: this.$downLoadImgSrc,
      baseInfo: {},
      isEdit: false,
      inputStyle: {
        color: 'rgba(0,0,0,.9)',
        disableColor: 'transparent',
        borderColor: 'transparent',
      },
      userInfo: {},
      aae006Desc: '',
    }
  },
  watch: {
    resumeBase: {
      handler(newVal, oldVal) {
        this.userInfo = uni.getStorageSync('userInfo').customMap
        let aac002 = ''
        if (this.userInfo) aac002 = this.$utils.idHide(this.userInfo.aac147)
        this.baseInfo = {
          ...this.userInfo,
          ...newVal,
          aac002,
        }
        if (this.baseInfo && this.baseInfo.aac006) {
          this.baseInfo.aac006 = this.formataac006(this.baseInfo.aac006)
        }
        this.init()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    formataac006(val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD')
      }
      return ''
    },
    binddata(name, value) {
      //通过 input 事件设置表单指定 name 的值
      this.baseInfo[name] = value
    },
    init() {
      if (this.baseInfo.aae707) {
        this.baseInfo.imgUrl = this.downLoadImgSrc + this.baseInfo.aae707
      } else {
        if (this.baseInfo.aac004 === '1') {
          this.baseInfo.imgUrl = this.baseImgSrc + '/resume/resume_man.png'
        } else {
          this.baseInfo.imgUrl = this.baseImgSrc + '/resume/resume_woman.png'
        }
      }
      this.$nextTick(() => {
        if (this.baseInfo.aac004) {
          this.$refs.customSelect.PickerValue('aac004', this.baseInfo.aac004)
        }
        if (this.baseInfo.aac011) {
          this.$refs.customSelect1.PickerValue('aac011', this.baseInfo.aac011)
        }
      })
    },
    mobile(value) {
      if (value && value.includes('*')) return
      let flag = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
      if (!flag) this.$utils.showToast('手机号码格式错误')
      return flag
    },
    save() {
      if (this.isEdit) {
        // 开始保存
        let _this = this
        let param = {
          method: 'jy001_Save',
          yae100: '14',
          aac001: this.userInfo.aac001,
          acc200: this.baseInfo.acc200,
          aac004_dsc: this.userInfo.aac004 == '2' ? '女' : '男',
          aac004: this.baseInfo.aac004,
          aac011: this.baseInfo.aac011,
          aae005: this.baseInfo.aae005,
          aac303: this.baseInfo.aac303,
          aae006: this.baseInfo.aae006,
          acb241: this.baseInfo.acb241, // 以下三个参数为了解决接口不传值导致cc20被清空
          acb242: this.baseInfo.acb242,
          acc217: this.baseInfo.acc217,
        }
        // if (acc202 && typeof acc202 == 'string') {
        //   param.acc202 = acc202
        // }
        this.isEdit = false
        // 校验手机号码格式
        if (param.aae005 && !param.aae005.includes('*') && !this.mobile(param.aae005)) {
          return
        }
        console.log(param, ' param')

        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          _this.$utils.showToast('保存成功')
        })
      } else {
        //开始编辑
        this.isEdit = true
      }
    },
    getAreaValue(val) {
      this.baseInfo.aae006 = val.areaname
      // this.aae006Desc = val.areaname
      this.baseInfo.aac303 = val.areaCode
    },
    clickAddressModal() {
      this.$refs.modalAddress.clickAddressModal()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/resume.scss';

.form-head {
  height: 170px;
  box-sizing: border-box;
  padding: 10px 16px;
  @include s-flex(center);

  .head {
    width: 112px;
    height: 144px;
  }
}

.title-rt {
  display: flex;
  align-items: center;

  > div:nth-child(2) {
    margin-left: 5px;
  }
}

/deep/ .uni-select--disabled {
  background-color: rgba(0, 0, 0, 0);
}
/deep/ .uni-select__input-text,
/deep/ .uni-input-input {
  color: #999999;
}
/deep/ .modal-input {
  display: none;
}
</style>
