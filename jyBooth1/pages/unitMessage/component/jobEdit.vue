<template>
  <view class="edit-black" v-show="editJob">
    <view class="edit-box">
      <view class="edit-title">
        <view>编辑职位</view>
        <image src="../../../static/images/close.png" @click="closeEdit"></image>
      </view>
      <form @submit="formSubmit" @reset="formReset">
        <view class="edit-con">
          <view class="uni-form-item">
            <view class="title">岗位名称:</view>
            <view class="item-input">
              <input class="uni-input disabled" name="aca112" v-model="jobInfo.aca112" :disabled="true"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">职位名称</view>
            <view class="item-input">
              <input class="uni-input" name="acb213" v-model="jobInfo.acb213" placeholder="请输入职位名称"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">工作性质:</view>
            <view class="item-input">
              <input class="uni-input disabled" name="acb469_dsc" v-model="jobInfo.acb469_dsc" :disabled="true"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">月薪范围(元):</view>
            <view class="item-input inputs-double">
              <input class="uni-input" name="acb21h" v-model="jobInfo.acb21h" type="number" placeholder="最低月薪"
                     placeholder-class="placeholder_text"/>
              <text class="hline"> -</text>
              <input class="uni-input" name="acb21j" v-model="jobInfo.acb21j" type="number" placeholder="最高月薪"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">最低学历要求:</view>
            <view class="item-input">
              <input class="uni-input disabled" name="aac011_dsc" v-model="jobInfo.aac011_dsc" :disabled="true"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">招聘总人数:</view>
            <view class="item-input">
              <input class="uni-input" name="acb21g" v-model="jobInfo.acb21g" type="number"
                     placeholder="请输入招聘总人数"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">工作经验:</view>
            <view class="item-input">
              <input class="uni-input disabled" name="acc217_dsc" v-model="jobInfo.acc217_dsc" :disabled="true"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">截止日期:</view>
            <view class="item-input input-dateTime">
              <uni-datetime-picker name="aae045" type="date" :value="jobInfo.aae045" @change="changeAAE045"
                                   placeholder="请选择截止日期"
                                   :border="true"></uni-datetime-picker>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">薪酬福利:</view>
            <view class="item-input inputs-checkbox">
              <checkbox-group name="acb214">
                <label :class="[itemC.checked?'checkbox-item disabled':'checkbox-item']"
                       v-for="(itemC,indexC) in jobInfo.acb214_list"
                       :key="indexC">
                  <checkbox :value="itemC.value" :checked="itemC.checked" disabled/>
                  <text>{{ itemC.text }}</text>
                </label>
              </checkbox-group>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">岗位联系人:</view>
            <view class="item-input">
              <input class="uni-input" name="acb224" v-model="jobInfo.acb224" placeholder="请输入岗位联系人"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">工作区域:</view>
            <view class="item-input">
              <input class="uni-input disabled" name="acb217" v-model="jobInfo.acb217" :disabled="true"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">岗位联系电话:</view>
            <view class="item-input">
              <input class="uni-input" name="acb225" v-model="jobInfo.acb225" placeholder="请输入岗位联系电话"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item">
            <view class="title">工作详细地址:</view>
            <view class="item-input">
              <input class="uni-input" name="acb303" v-model="jobInfo.acb303" placeholder="请输入工作详细地址"
                     placeholder-class="placeholder_text"/>
            </view>
          </view>
          <view class="uni-form-item w100">
            <view class="title">岗位描述:</view>
            <view class="item-input input-textarea">
              <textarea class="uni-textarea" name="acb216" v-model="jobInfo.acb216" placeholder="请输入岗位描述"
                        placeholder-class="placeholder_text"/>
            </view>
          </view>
        </view>
        <view class="edit-bottom">
          <button @click="closeEdit">取消</button>
          <button form-type="submit">保存</button>
        </view>
      </form>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    editJob: {
      type: Boolean
    },
    acb210: {
      type: String
    }
  },
  data() {
    return {
      param1: {
        apiCode: 'jy202_hrm102',
        method: 'jy202_hrm102',
      },
      param2: {
        apiCode: 'jy201_hrm115',
        method: 'jy201_hrm115',
      },
      jobInfo: {
        acb213: ''
      }
    }
  },
  watch: {
    editJob(newVal, oldVal) {
      if (newVal) {
        this.getJobInfo()
      }
    }
  },
  methods: {
    closeEdit() {
      this.$emit('closeEdit', false)
    },
    changeAAE045(e) {
      this.jobInfo.aae045 = e;
    },
    getJobInfo() {
      const loginInfo = this.$loginConfig.getLoginInfo()
      this.param1.aab001 = loginInfo.aab001
      this.param1.acb210 = this.acb210
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm102', null, this.param1, true).then((responseData) => {
        let res = responseData ? responseData.data : {};
        if (res.errors && res.errors.length > 0) {
          uni.showToast({
            title: res.errors[0].msg,
            duration: 2000,
            icon: 'none',
          })
        } else {
          this.jobInfo = res.data.data;
          if (this.jobInfo.acb214) {
            this.jobInfo.acb214 = this.jobInfo.acb214.split(',')
            this.jobInfo.acb214_desc = this.jobInfo.acb214_desc.split(',')
            let acb214_list = []
            let acb214_obj = {}
            for (let i in this.jobInfo.acb214) {
              acb214_obj = {}
              acb214_obj.value = this.jobInfo.acb214[i]
              acb214_obj.text = this.jobInfo.acb214_desc[i]
              acb214_obj.checked = true
              acb214_obj.disable = true
              acb214_list.push(acb214_obj)
            }
            this.jobInfo.acb214_list = acb214_list
          }
        }
      })
    },

    formSubmit: function (e) {
      const loginInfo = this.$loginConfig.getLoginInfo()
      let formdata = e.detail.value
      this.param2.aab001 = loginInfo.aab001
      this.param2.acb213 = formdata.acb213
      this.param2.acb21h = formdata.acb21h
      this.param2.acb21j = formdata.acb21j
      this.param2.acb21g = formdata.acb21g
      this.param2.acb224 = formdata.acb224
      this.param2.acb225 = formdata.acb225
      this.param2.acb303 = formdata.acb303
      this.param2.acb216 = formdata.acb216
      this.param2.acb210 = this.jobInfo.acb210
      this.param2.aca111 = this.jobInfo.aca111
      this.param2.aae045 = this.jobInfo.aae045

      console.log(this.param2);
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm115', null, this.param2, true).then((responseData) => {
        let res = responseData ? responseData.data : {};
        if (res.errors && res.errors.length > 0) {
          uni.showToast({
            title: res.errors[0].msg,
            duration: 2000,
            icon: 'none',
          })
        } else {
          uni.showToast({
            title: '编辑成功',
            duration: 2000,
          })
          this.closeEdit()
        }
      })

    },
    formReset: function (e) {

    }
  }
}
</script>

<style lang="scss" scoped>
.edit-black {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background: rgba($color: #000000, $alpha: 0.5);


  > .edit-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #FFFFFF;
    width: 1200px;
    border-radius: 8px;

    .edit-title {
      width: 1200px;
      height: 68px;
      background: #0682FE;
      border-radius: 8px 8px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 24px 0px 24px;
      box-sizing: border-box;

      > image {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      > view {
        font-size: 24px;
        font-weight: 500;
        max-width: 780px;
        display: inline-block;
        color: #FFFFFF;
        margin: 0px 251px 0px 12px;
        white-space: nowrap;
      }
    }

    .edit-con {
      min-height: 400px;
      border-bottom: 1px dashed #dddddd;
      padding: 26px 30px;
      display: flex;
      flex-direction: 2;
      align-items: center;
      flex-wrap: wrap;

      .uni-form-item {
        width: 50%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        margin-bottom: 12px;
        padding: 0 30px;
        box-sizing: border-box;

        &.w100 {
          width: 100%;
        }

        .title {
          width: 160px;
          height: 54px;
          line-height: 54px;
          font-size: 18px;
          font-weight: 400;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 15px;
          box-sizing: border-box;
        }

        .item-input {
          width: calc(100% - 180px);
          min-height: 54px;
          line-height: 54px;
          font-size: 18px;

          .disabled {
            background: #F8F8F8;
            color: #bbbbbb;
          }

          &.inputs-double {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .uni-input {
              width: 40%;
              text-align: center;
            }

            .hline {
              width: 10%;
              text-align: center;
            }
          }

          &.inputs-checkbox {
            .checkbox-item {
              margin-right: 15px;

              /deep/ .uni-checkbox-input {
                background: #EEEEEE;
              }

              &.disabled {
                background: none;
              }
            }
          }

          &.input-dateTime {
            /deep/ .uni-input-placeholder {
              font-size: 18px;
            }

            /deep/ .uni-date-x--border {
              border: 1px solid #EEEEEE;
              // height: 54px;
              // line-height: 54px;
              // font-size: 18px;
              // box-sizing: border-box;
            }

            /deep/ .uni-date__x-input {
              height: 52px;
              line-height: 54px;
              font-size: 18px;
              box-sizing: border-box;
              color: #333333;
              padding: 0;
            }
          }

          &.input-textarea {
            padding: 0 10px;
            border-radius: 4px;
            border: 1px solid #EEEEEE;

            .uni-textarea {
              width: 100%;
              line-height: 54px;
              font-size: 18px;
            }
          }

          .uni-input {
            height: 54px;
            line-height: 54px;
            font-size: 18px;
            padding: 0 10px;
            border-radius: 4px;
            border: 1px solid #EEEEEE;
          }

        }
      }
    }

    .edit-bottom {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;

      button {
        width: 200px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-size: 18px;
        color: #FFFFFF;
        margin: 0 20px;
        background: -webkit-linear-gradient(top, #098FFF 0%, #0064FF 100%);
        background: linear-gradient(180deg, #098FFF 0%, #0064FF 100%);

        &:first-child {
          background: #EBEEF5;
          color: #666666;
        }

        &:after {
          border: 0;
        }
      }
    }
  }
}


</style>
