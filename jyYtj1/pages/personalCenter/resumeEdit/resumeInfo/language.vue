<template>
  <div class="form-group-box">
    <div class="form-group-list">
      <uni-forms ref="form" :rules="rules" :modeValue="cc24">
        <div class="form-group">
          <div class="group-index">{{ index + 1 < 10 ? '0' + (index + 1) : index }}</div>
          <uni-row class="uni-row">
            <uni-col :span="12">
              <div class="form-item">
                <uni-forms-item label="语言类别:" required name="acc241" labelWidth="120">
                  <custom-select
                    id="acc241"
                    label="语言类别"
                    collect="acc241"
                    v-model="cc24.acc241"
                    required
                    :disabled="!isEdit"
                    @input="binddata('acc241', cc24.acc241)"
                    placeholder="请选择语言类别"
                    ref="acc241"
                  >
                  </custom-select>
                </uni-forms-item>
              </div>
            </uni-col>
            <uni-col :span="12">
              <div class="form-item">
                <uni-forms-item label="熟练程度:" required name="acc242" labelWidth="120">
                  <custom-select
                    id="acc242"
                    label="熟练程度"
                    collect="acc242"
                    v-model="cc24.acc242"
                    required
                    :disabled="!isEdit"
                    @input="binddata('acc242', cc24.acc242)"
                    placeholder="请选择熟练程度"
                    ref="acc242"
                  >
                  </custom-select>
                </uni-forms-item>
              </div>
            </uni-col>
            <uni-col :span="12">
              <div class="form-item">
                <uni-forms-item label="读写能力:" required name="acc243" labelWidth="120">
                  <custom-select
                    id="acc243"
                    label="读写能力"
                    collect="acc242"
                    v-model="cc24.acc243"
                    required
                    :disabled="!isEdit"
                    @input="binddata('acc243', cc24.acc243)"
                    placeholder="请选择读写能力"
                    ref="acc243"
                  >
                  </custom-select>
                </uni-forms-item>
              </div>
            </uni-col>
            <uni-col :span="12">
              <div class="form-item">
                <uni-forms-item label="听说能力:" required name="acc244" labelWidth="120">
                  <custom-select
                    id="acc244"
                    label="听说能力"
                    collect="acc242"
                    v-model="cc24.acc244"
                    required
                    :disabled="!isEdit"
                    @input="binddata('acc244', cc24.acc244)"
                    placeholder="请选择听说能力"
                    ref="acc244"
                  >
                  </custom-select>
                </uni-forms-item>
              </div>
            </uni-col>
          </uni-row>
          <!-- <div class="group-del" v-if="isEdit">
						<button class="btn btn-del" @click="delGroup()">删除</button>
					</div> -->
        </div>
      </uni-forms>
    </div>
    <div class="form-btn-operation">
      <button class="btn btn-org" v-if="!isEdit" @click="isEdit = true">编辑</button>
      <template v-else>
        <button class="btn btn-org" v-if="cc24.flag" @click="isEdit = false">取消</button>
      </template>

      <button class="btn btn-blue" v-if="isEdit" @click="save">保存</button>
      <button class="btn btn-del" v-if="cc24.flag" @click="delGroup('truth')">删除</button>
      <button class="btn btn-del" v-else @click="delGroup('empty')">删除</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'language',
  props: {
    userInfo: {
      type: Object,
    },
    resumeInfo: {
      type: Object,
    },
    cc24: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      isEdit: false,
      rules: {
        acc241: {
          rules: [
            {
              required: true,
              errorMessage: '请选择语言类别',
            },
          ],
        },
        acc242: {
          rules: [
            {
              required: true,
              errorMessage: '请选择熟练程度',
            },
          ],
        },
        acc243: {
          rules: [
            {
              required: true,
              errorMessage: '请选择读写能力',
            },
          ],
        },
        acc244: {
          rules: [
            {
              required: true,
              errorMessage: '请选择听说能力',
            },
          ],
        },
      },
    }
  },
  watch: {
    cc24: {
      handler(val) {
        if (val.flag) {
          //console.log(val)
          this.isEdit = false
          this.$nextTick(() => {
            let arrayKey = Object.keys(this.rules)
            for (let i = 0; i < arrayKey.length; i++) {
              let name = arrayKey[i]
              let value = val[arrayKey[i]]
              this.$refs[name].PickerValue(name, value)
            }
          })
        } else {
          this.isEdit = true
        }
      },
      immediate: true,
    },
  },
  methods: {
    //删除
    delGroup(type) {
      this.$emit('delCcList', '1', this.index, type)
    },
    save() {
      let param = {
        acc200: this.resumeInfo.baseInfo.acc200,
        aac001: this.userInfo.aac001,
        ...this.cc24,
        method: 'jy202_hrm136',
      }
      this.$refs.form
        .validateField(['acc241', 'acc242', 'acc243', 'acc244'])
        .then((ret) => {
          //console.log(ret)
          this.isEdit = false
          this.$utils
            .request('/api/business/invoke', param, true, false, 'cipher')
            .then((res) => {
              this.$emit('refresh')
              this.$utils.showToast('保存成功')
            })
            .catch((err) => {
              this.isEdit = true
              this.$utils.showToast('保存失败')
            })
        })
        .catch((err) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .uni-forms-item__label {
  height: 42px;
  line-height: 42px;
  .label-text {
    font-size: 18px;
  }
}

/deep/ .uni-input-input {
  font-size: 18px;
  height: 42px;
  line-height: 42px;
}

/deep/ .uni-easyinput__content-input {
  height: 42px;
  line-height: 42px;
}

.form-group-box {
  .form-group-list {
    .form-group {
      border-bottom: 1px dashed #dddddd;
      position: relative;
      margin-top: 20px;

      &:last-child {
        border-bottom: 0;
      }

      .group-index {
        position: absolute;
        left: -50px;
        top: 0;
        height: 34px;
        line-height: 34px;
        background: #f0f7ff;
        color: #2778ff;
        font-size: 18px;
        padding: 0 10px;
      }

      .form-item {
        padding: 0 20px;

        .picker-box {
          height: 40px;
          line-height: 40px;
          display: flex;
          box-sizing: border-box;
          flex-direction: row;
          align-items: center;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding-left: 10px;
          color: #404040;
          font-size: 18px;
          padding-left: 16px;
          padding-right: 50px;
          position: relative;
          box-sizing: border-box;

          &:after {
            content: '';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: url('../../../../static/images/ic_down.png') right center no-repeat;
            background-size: 20px 10px;
            width: 20px;
            height: 10px;
          }

          &.disabled {
            background: #fafafa;
            color: #999999;
          }

          &.text-org {
            color: #ff7e00;
          }

          &.text-blue {
            color: #2778ff;
            font-size: 18px;
          }
        }

        .input-box {
          color: #404040;
          font-size: 18px;
        }
      }

      .group-del {
        position: absolute;
        right: -50px;
        top: 0;

        .btn-del {
          width: 36px;
          background: #fff3f2;
          border-radius: 2px;
          border: solid 1px rgba(255, 21, 0, 0.51);
          color: #ff1500;
          font-size: 18px;
          line-height: 20px;
          text-align: center;
          padding: 12px 0;
        }
      }
    }
  }

  .form-group-add {
    padding: 20px 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 38px;
      left: 0;
      width: 100%;
      height: 1px;
      border-bottom: 1px dashed #dddddd;
    }

    button {
      display: inline-block;
      height: 36px;
      line-height: 34px;
      font-size: 16px;
      color: #2778ff;
    }
  }
}

.form-btn-operation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  .btn {
    display: inline-block;
    margin: 0 10px;
  }
}
</style>
