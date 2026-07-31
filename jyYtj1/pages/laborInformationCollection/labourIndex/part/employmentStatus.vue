<template>
  <view class="form">
    <uni-forms ref="valiForm" :rules="rules" :modeValue="formData" label-position="top" label-width="300">
      <div class="base-info">
        <div class="base-title">
          <text class="text">就业</text>状态
          <span class="span"> / 请您完善您的就业状态</span>
        </div>
        <uni-row class="demo-uni-row" width="1100" :gutter="70">
          <uni-col :span="24">
            <uni-forms-item label="是否就业:" name="ade858" class="card-checkbox" required>
              <uni-data-checkbox
                v-model="formData.ade858"
                :localdata="yesorno"
                placeholder="请选择是否就业"
                @change="changeCheckBox"
              />
            </uni-forms-item>
          </uni-col>
<!--          <uni-col :span="24">
            <uni-forms-item label="个人特长:" name="ade852" labelWidth="120" style="height: 215px" required>
              <div class="input-box">
                <textarea
                  v-model="formData.ade852"
                  placeholder="请填写个人特长"
                  maxlength="500"
                  style="padding: 10px; font-size: 18px; box-sizing: border-box"
                  @input="binddata('ade852', $event.detail.value)"
                />
              </div>
            </uni-forms-item>
          </uni-col> -->
          <view v-show="isAde858">
            <uni-col :span="8">
              <uni-forms-item label="就业形式:" name="ade859" required>
                <custom-select
                  id="ade859"
                  label="就业形式"
                  collect="ADC639"
                  v-model="formData.ade859"
                  placeholder="请选择就业形式"
                  @input="binddata('ade859', formData.ade859)"
                />
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="从事职业:" name="ade85a" required>
                <modal-workType
                  ref="addressAde85a"
                  moduleKey="ade85a"
                  :moduleId="formData.ade85a"
                  v-model="formData.ade85aDesc"
                  @setModalValue="getAde85aValue"
                  placeholder="请选择从事职业"
                ></modal-workType>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="薪资待遇:" name="ade85c" required>
                <custom-select
                  id="ade85c"
                  label="薪资待遇"
                  collect="ade85f"
                  v-model="formData.ade85c"
                  @input="binddata('ade85c', formData.ade85c)"
                  placeholder="请选择薪资待遇"
                >
                </custom-select>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="就业地:" name="ade85b" required>
                <modal-address
                  ref="addressAde85b"
                  areaid="ade85b"
                  :areaCode="formData.ade85b"
                  v-model="formData.ade85bDesc"
                  @setAreaValue="getAde85bValue"
                  placeholder="请选择就业地"
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
    labourStatus: {
      type: Object,
    },
  },
  watch: {
    labourStatus: {
      handler(val) {
        // /this.isEdit = true
        //console.log(val)
        this.formData = val
      },
      //immediate:true,
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
      formData: {},
      isAde858: false,
      rules: {
        // ade852: {
        //   rules: [
        //     {
        //       required: true,
        //       errorMessage: '个人特长不能为空',
        //     },
        //   ],
        // },
        ade858: {
          rules: [
            {
              required: true,
              errorMessage: '是否就业不能为空',
            },
          ],
        },

        ade859: {
          rules: [
            {
              required: true,
              errorMessage: '就业形式不能为空',
            },
          ],
        },
        ade85a: {
          rules: [
            {
              required: true,
              errorMessage: '从事职业不能为空',
            },
          ],
        },
        ade85b: {
          rules: [
            {
              required: true,
              errorMessage: '就业地不能为空',
            },
          ],
        },
        ade85c: {
          rules: [
            {
              required: true,
              errorMessage: '薪资待遇不能为空',
            },
          ],
        },
      },
    }
  },
  methods: {
    changeCheckBox(val) {
      this.isAde858 = val.detail.value
    },
    getAde85aValue(val) {
      //获取地址弹窗
      this.formData.ade85a = val.aca111
      this.formData.ade85aDsc = val.aca112
      this.$refs.valiForm.setValue('ade85a', val.aca111)
    },
    getAde85bValue(val) {
      //获取地址弹窗
      this.formData.ade85b = val.areaCode
      this.formData.ade85bDsc = val.areaname
      this.$refs.valiForm.setValue('ade85b', val.areaCode)
    },
    prev(value) {
      this.isAde858 = value.ade858
      this.$nextTick(() => {
        this.formData = value
        this.$refs.valiForm.setValue('ade85a', value.ade85a)
        this.$refs.valiForm.setValue('ade85b', value.ade85b)
      })
    },
    next() {
      //console.log(this.formData)
      let validateTrue = ['ade858', 'ade859', 'ade85a', 'ade85b', 'ade85c']
      let validateFalse = ['ade858', 'ade852']
      let validate = this.isAde858 ? validateTrue : validateFalse
      this.$refs.valiForm
        .validateField(validate)
        .then((ret) => {
          this.$emit('triggerBtn', '3', this.formData)
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
  width: 100px !important;
}
</style>
