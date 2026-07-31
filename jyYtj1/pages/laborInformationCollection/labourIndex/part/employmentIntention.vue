<template>
  <view class="form">
    <uni-forms ref="valiForm" :rules="rules" :modeValue="formData" label-position="top" label-width="300">
      <div class="base-info">
        <div class="base-title">
          <text class="text">就业</text>意愿
          <span class="span"> / 请您完善您的就业意愿</span>
        </div>
        <uni-row class="demo-uni-row" width="1100" :gutter="70">
          <uni-col :span="24">
            <uni-forms-item label="是否有就业意愿:" name="ade851" class="card-checkbox" required>
              <uni-data-checkbox
                v-model="formData.ade851"
                :localdata="yesorno"
                placeholder="请选择是否有就业意愿"
                @change="changeCheckBox"
              />
            </uni-forms-item>
          </uni-col>
          <view v-show="isAde851&&isShowAde851">
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
              <uni-forms-item label="意向职位:" name="aca111" required>
                <modal-workType
                  ref="addressAca111"
                  moduleKey="aca111"
                  :moduleId="formData.aca111"
                  v-model="formData.aca112"
                  @setModalValue="getAca111Value"
                  placeholder="请选择意向职位"
                ></modal-workType>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="工作方式:" name="ade85g" required>
                <custom-select
                  id="ade85g"
                  label="工作方式"
                  collect="ADE85G"
                  v-model="formData.ade85g"
                  placeholder="请选择工作方式"
                  @input="binddata('ade85g', formData.ade85g)"
                />
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="期望薪资:" name="ade85f" required>
                <custom-select
                  id="ade85f"
                  label="期望薪资"
                  collect="ade85f"
                  v-model="formData.ade85f"
                  @input="binddata('ade85f', formData.ade85f)"
                  placeholder="请选择薪资待遇"
                >
                </custom-select>
              </uni-forms-item>
            </uni-col>
            <uni-col :span="8">
              <uni-forms-item label="期望工作地:" name="acb215" required>
                <modal-address
                  ref="addressAcb215"
                  areaid="acb215"
                  :areaCode="formData.acb215"
                  v-model="formData.acb217"
                  @setAreaValue="getAcb215Value"
                  placeholder="请选择期望工作地"
                ></modal-address>
              </uni-forms-item>
            </uni-col>
          </view>
          <view v-show="!isAde851&&isShowAde851">
            <uni-col :span="16">
              <uni-forms-item label="不想就业原因:" name="ade85d" required>
                <custom-select
                  id="ade85d"
                  label="不想就业原因"
                  collect="ade85b"
                  v-model="formData.ade85d"
                  placeholder="请选择不想就业原因"
                  @input="binddata('ade85d', formData.ade85d)"
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
    labourEmpoyInter: {
      type: Object,
    },
  },
  watch: {
    labourEmpoyInter: {
      handler(val) {
        //this.isEdit = true
        //console.log(val)
        this.formData = val
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
      isAde851: false,
	  isShowAde851: false,
      isShow: true,
      formData: {},
      rules: {
        ade851: {
          rules: [
            {
              required: true,
              errorMessage: '是否有就业意愿不能为空',
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
        aca111: {
          rules: [
            {
              required: true,
              errorMessage: '意向职位不能为空',
            },
          ],
        },
        ade85g: {
          rules: [
            {
              required: true,
              errorMessage: '工作方式不能为空',
            },
          ],
        },
        ade85f: {
          rules: [
            {
              required: true,
              errorMessage: '期望薪资不能为空',
            },
          ],
        },
        acb215: {
          rules: [
            {
              required: true,
              errorMessage: '期望工作地不能为空',
            },
          ],
        },
        ade85d: {
          rules: [
            {
              required: true,
              errorMessage: '不想就业原因不能为空',
            },
          ],
        },
      },
    }
  },
  methods: {
    changeCheckBox(val) {
      this.isAde851 = val.detail.value
	  this.isShowAde851 = true
    },
    getAca111Value(val) {
      //获取地址弹窗
      this.formData.aca111 = val.aca111
      this.formData.aca112 = val.aca112
      this.$refs.valiForm.setValue('aca111', val.aca111)
    },
    getAcb215Value(val) {
      //获取地址弹窗
      this.formData.acb215 = val.areaCode
      this.formData.acb217 = val.areaname
      this.$refs.valiForm.setValue('acb215', val.areaCode)
    },
    prev(value) {
      this.isAde851 = value.ade851
      this.$nextTick(() => {
        this.formData = value
        this.$refs.valiForm.setValue('aca111', value.aca111)
        this.$refs.valiForm.setValue('acb215', value.acb215)
      })
    },
    next() {
      let validateTrue = ['ade851', 'ade859', 'aca111', 'ade85g', 'ade85f', 'acb215']
      let validateFalse = ['ade851', 'ade85d']
      let validate = this.isAde851 ? validateTrue : validateFalse
      this.$refs.valiForm
        .validateField(validate)
        .then((ret) => {
          this.$emit('triggerBtn', '4', this.formData)
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
  width: 150px !important;
}
</style>
