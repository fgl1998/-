<template>
  <view class="form">
    <uni-forms ref="valiForm" :rules="rules" :modeValue="formData" label-position="top" label-width="300">
      <div class="base-info">
        <div class="base-title">
          <text class="text">培训</text>意愿
          <span class="span"> / 请您完善您的培训意愿</span>
        </div>
        <uni-row class="demo-uni-row" width="1100" :gutter="70">
          <uni-col :span="24">
            <uni-forms-item label="是否有就业培训意愿:" name="ade853" class="card-checkbox" required>
              <uni-data-checkbox
                v-model="formData.ade853"
                :localdata="yesorno"
                placeholder="请选择是否有就业培训意愿"
                @change="changeCheckBox"
              />
            </uni-forms-item>
          </uni-col>

          <view v-show="isAde853">
            <uni-col :span="8">
              <uni-forms-item label="意向培训工种:" name="ade854" required>
                <!-- <custom-select
                  id="ade854"
                  label="意向培训工种"
                  :range="trainTypeTree"
                  v-model="formData.ade854"
                  @input="binddata('ade854', formData.ade854)"
                  placeholder="请选择意向培训工种"
                  :trainType="true"
                /> -->
				<modal-workType
				  ref="addressAde854"
				  moduleKey="ade854"
				  :moduleId="formData.ade854"
				  v-model="formData.ade85a4Desc"
				  @setModalValue="getAde854Value"
				  placeholder="请选择从事职业"
				></modal-workType>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="意向培训地:" name="ade85h" required>
                <modal-address
                  ref="addressAde85h"
                  areaid="ade85h"
                  :areaCode="formData.ade85h"
                  v-model="formData.ade85k"
                  @setAreaValue="getAde85hValue"
                  placeholder="请选择意向培训地"
                ></modal-address>
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
    labourTrain: {
      type: Object,
    },
    trainTypeTree: {
      type: Array,
    },
  },
  watch: {
    labourTrain: {
      handler(val) {
        //this.isEdit = true
        //console.log(val)
        this.formData = val
      },
      //immediate:true,
    },
    trainTypeTree: {
      handler(val) {
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
      isAde853: false,
      formData: {},
      rules: {
        ade854: {
          rules: [
            {
              required: true,
              errorMessage: '意向培训工种不能为空',
            },
          ],
        },
        ade853: {
          rules: [
            {
              required: true,
              errorMessage: '是否有就业培训意愿不能为空',
            },
          ],
        },

        ade85h: {
          rules: [
            {
              required: true,
              errorMessage: '意向培训地不能为空',
            },
          ],
        },
      },
    }
  },
  methods: {
    changeCheckBox(val) {
      this.isAde853 = val.detail.value
    },
	getAde854Value(val) {
	  //获取地址弹窗
	  this.formData.ade854 = val.aca111
	  this.formData.ade854Dsc = val.aca112
	  this.$refs.valiForm.setValue('ade854', val.aca111)
	},
    getAde85hValue(val) {
      //获取地址弹窗
      this.formData.ade85h = val.areaCode
      this.formData.ade85k = val.areaname
      this.$refs.valiForm.setValue('ade85h', val.areaCode)
    },
    prev(value) {
      this.isAde853 = value.ade853
      this.$nextTick(() => {
        this.formData = value
        this.$refs.valiForm.setValue('ade85h', value.ade85h)
      })
    },
    next() {
      let validateTrue = ['ade854', 'ade853', 'ade85h']
      let validateFalse = ['ade853']
      let validate = this.isAde853 ? validateTrue : validateFalse
      this.$refs.valiForm
        .validateField(validate)
        .then((ret) => {
          this.$emit('triggerBtn', '5', this.formData)
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
