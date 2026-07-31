<template>
  <view class="form">
    <uni-forms ref="valiForm" :rules="rules" :modeValue="formData" label-position="top" label-width="300">
      <div class="base-info">
        <div class="base-title">
          <text class="text">创业</text>意愿
          <span class="span"> / 请您完善您的创业意愿</span>
        </div>
        <uni-row class="demo-uni-row" width="1100" :gutter="70">
          <uni-col :span="24">
            <uni-forms-item label="是否有创业意愿:" name="ade857" class="card-checkbox" required>
              <uni-data-checkbox
                v-model="formData.ade857"
                :localdata="yesorno"
                placeholder="请选择是否有创业意愿"
                @change="changeCheckBox"
              />
            </uni-forms-item>
          </uni-col>

          <view v-show="isAde857">
            <uni-col :span="16">
              <uni-forms-item label="意向创业地:" name="ade85i" required>
                <modal-address
                  ref="addressAde85i"
                  areaid="ade85i"
                  :areaCode="formData.ade85i"
                  v-model="formData.ade85l"
                  @setAreaValue="getAde85iValue"
                  placeholder="请选择意向创业培训地"
                ></modal-address>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="是否有创业培训需求:" name="adf088" required>
                <uni-data-select
                  id="adf088"
                  v-model="formData.adf088"
                  placeholder="请选择是否有创业培训需求"
                  :localdata="yesorno"
                  @change="changeAdf088"
                  @input="binddata('adf088', formData.adf088)"
                ></uni-data-select>
              </uni-forms-item>
            </uni-col>
          </view>
          <view v-show="isAdf088">
            <uni-col :span="16">
              <uni-forms-item label="意向创业培训地:" name="ade85j" required>
                <modal-address
                  ref="addressAde85j"
                  areaid="ade85j"
                  :areaCode="formData.ade85j"
                  v-model="formData.ade85m"
                  @setAreaValue="getAde85jValue"
                  placeholder="请选择意向创业培训地"
                ></modal-address>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="意向创业培训内容:" name="ade856" required>
                <custom-select
                  id="ade856"
                  label="意向创业培训内容"
                  collect="adf104"
                  v-model="formData.ade856"
                  placeholder="请选择意向创业培训内容"
                  @input="binddata('ade856', formData.ade856)"
                />
              </uni-forms-item>
            </uni-col>
          </view>
        </uni-row>
      </div>
    </uni-forms>
  </view>
</template>

<script>
export default {
  props: {
    labourEntrepreneurial: {
      type: Object,
    },
  },
  watch: {
    labourEntrepreneurial: {
      handler(val) {
        this.isEdit = true
        //console.log(val)
      },
      immediate: true,
    },
  },

  data() {
    return {
      yesorno: [
        {
          text: '是',
          value: 1,
        },
        {
          text: '否',
          value: 0,
        },
      ],
      isAde857: false,
      isAdf088: false,
      formData: {},
      rules: {
        ade857: {
          rules: [
            {
              required: true,
              errorMessage: '是否有创业意愿不能为空',
            },
          ],
        },
        ade85i: {
          rules: [
            {
              required: true,
              errorMessage: '意向创业地不能为空',
            },
          ],
        },

        adf088: {
          rules: [
            {
              required: true,
              errorMessage: '是否有创业培训需求不能为空',
            },
          ],
        },
        ade856: {
          rules: [
            {
              required: true,
              errorMessage: '意向创业培训内容不能为空',
            },
          ],
        },
        ade85j: {
          rules: [
            {
              required: true,
              errorMessage: '意向创业培训地不能为空',
            },
          ],
        },
      },
    }
  },
  methods: {
    changeCheckBox(val) {
      this.isAde857 = val.detail.value
    },
    changeAdf088(val) {
      this.isAdf088 = val
    },

    getAde85iValue(val) {
      //获取地址弹窗
      this.formData.ade85i = val.areaCode
      this.formData.ade85l = val.areaname
      this.$refs.valiForm.setValue('ade85i', val.areaCode)
    },
    getAde85jValue(val) {
      //获取地址弹窗
      this.formData.ade85j = val.areaCode
      this.formData.ade85m = val.areaname
      this.$refs.valiForm.setValue('ade85j', val.areaCode)
    },
    prev(value) {
      this.isAde857 = value.ade857
      this.isAdf088 = value.adf088
      this.$nextTick(() => {
        this.formData = value
        this.$refs.valiForm.setValue('ade85i', value.ade85i)
        this.$refs.valiForm.setValue('ade85j', value.ade85j)
      })
    },
    endBtn() {
      let validateTrue = ['ade857', 'ade85i', 'adf088']
      let validateDoubleTrue = ['ade857', 'ade85i', 'adf088', 'ade856', 'ade85j']
      let validateFalse = ['ade857']
      let validate = []
      if (this.isAde857) {
        if (this.isAdf088) {
          validate = validateDoubleTrue
        } else {
          validate = validateTrue
        }
      } else {
        validate = validateFalse
        this.formData.adf088 = 0
      }
      this.$refs.valiForm
        .validateField(validate)
        .then((ret) => {
          this.$emit('triggerBtn', '6', this.formData)
        })
        .catch((err) => {
          //console.log('err', err);
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.base-info {
  box-sizing: border-box;
  width: 100%;
  height: 95px;
  .base-title {
    width: 100%;
    height: 95px;
    line-height: 95px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.9);
    text-align: left;
    font-style: normal;
    text-transform: none;
    position: relative;
    padding-left: 15px;
    :before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 8px;
      height: 23px;
      background: #0c6af7;
      border-radius: 2px;
    }
    .text {
      color: #0c6af7;
    }
    .span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 21px;
      text-align: left;
      font-style: normal;
      text-transform: none;
      margin-left: 5px;
    }
  }
}

.input-box {
  color: #404040;
  font-size: 18px;
  height: 42px;
  line-height: 42px;

  textarea {
    border: 1px solid #eeeeee;
    width: 100%;

    &.disabled {
      background: #fafafa;
      color: #999999;
    }
  }
}

.card-checkbox /deep/ .is-direction-top {
  flex-direction: row !important;
}
.card-checkbox /deep/ .is-direction-top .uni-forms-item__label {
  width: 200px !important;
}
</style>
