<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    width="60%"
    :close-on-click-modal="false"
    custom-class="dialog"
    :before-close="handleClose"
  >
    <div slot="title" class="title">
      <image src="../../../static/images/work.png" />
      <view>面试排号</view>
    </div>
    <!-- <div class="top">
      <image src="../../../static/images/img/publicImg/male.png" />
      <div class="base-info">
        <view>{{ data.aac003 }}</view>
        <view>
          <view>{{ data.aac147 }}</view>
          <view>{{ $codeConfig.getCodeLabel('aac004', data.aac004) }}</view>
          <view>{{ $codeConfig.getCodeLabel('aac011', data.aac011) }}</view>
          <view>{{ data.acb202 }}</view>
        </view>
        <view>
          <view>电子邮箱：{{ data.aae159 }}</view>
          <view>联系电话：{{ data.aae005 }}</view>
        </view>
      </div>
    </div> -->
    <div class="form">
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        :disabled="formDisabled"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="姓名" prop="aac003">
          <el-input v-model="form.aac003" placeholder="请输入姓名" style="width: 350px" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="aae005">
          <el-input v-model="form.aae005" placeholder="请输入电话" style="width: 350px" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="fnSubmit" :disabled="submitDisabled">确认邀请</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    boothsInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submitDisabled: false,
      userInfo: this.$loginConfig.getLoginInfo(),
      cb21s: [],
      acc315s: [],
      form: {
        aac003: '',
        aae005: '',
      },
      formDisabled: false,
      rules: {
        aac003: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'change',
          },
        ],
        aae005: [
          {
            required: true,
            message: '请输入电话',
            trigger: 'change',
          },
        ],
      },
      disabledDate: (current) => {
        return current < this.moment().startOf('day')
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          // this.form.acb224 = this.userInfo.name
          // this.form.acb225 = this.userInfo.mobile
          // this.form.acb210 = this.data.acb210
          // this.searchEvent()
        })
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.acc315s = this.$codeConfig.getCode('acc315')
    })
  },
  methods: {
    moment,
    searchEvent() {
      let params = {}
      params.acb330 = this.userInfo.acb330
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm258', null, params, true).then((data) => {
        let resultData = data.data
        this.cb21s = resultData.cb36s
        if (resultData.jobfair) {
          this.form.acb223 = resultData.jobfair.acb303
        }
      })
    },
    fnSubmit() {
      this.formDisabled = true
      this.submitDisabled = true
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            ...this.form,
            acz473: '2',
            acb340: this.boothsInfo.acb340,
            aab001: this.boothsInfo.aab001,
          }

          this.$http
            .post(this.$requestConstant.businessRequestType, 'jy225_hrm105', null, params, true)
            .then((res) => {
              this.$message.success('排号成功')
              this.formDisabled = true
              this.submitDisabled = true
            })
            .catch((e) => {
              this.formDisabled = false
              this.submitDisabled = false
            })
        } else {
          this.formDisabled = false
          this.submitDisabled = false
        }
      })
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.formDisabled = false
      this.submitDisabled = false
      this.$emit('close')
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  border-radius: 8px;
}

/deep/ .el-dialog__header {
  padding: 0px;
}

/deep/ .el-icon-close {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

/deep/ .el-icon-close:hover {
  color: #ffffff;
}

/deep/ .el-form-item__label {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 18px;
  color: #333333;
  text-align: left;
  font-style: normal;
}

/deep/ .el-form-item {
  margin-right: 36px;
}

.title {
  width: calc(100% - 24px);
  height: 48px;
  background: linear-gradient(180deg, #35aeff 0%, #0375f2 100%);
  border-radius: 8px 8px 0 0;
  padding: 22px 0 0 24px;
  display: flex;

  > image {
    height: 24px;
    width: 24px;
    margin-right: 12px;
  }

  > view {
    width: 296px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 500;
    font-size: 24px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }
}

.top {
  width: 100%;
  display: flex;

  > image {
    width: 98px;
    height: 98px;
    margin-right: 28px;
  }

  .base-info {
    > view:first-child {
      height: 30px;
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
      text-align: left;
      font-style: normal;
    }

    > view:nth-child(2) {
      // width: 100%;
      margin-top: 8px;
      display: flex;

      > view {
        // height: 30px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(1) {
        width: 200px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }

      > view:nth-child(2) {
        width: 55px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }

      > view:nth-child(3) {
        width: 100px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }
    }

    > view:last-child {
      display: flex;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 18px;
      color: #666666;
      text-align: left;
      font-style: normal;
      margin-top: 8px;

      > view:first-child {
        // width: 350px;
        padding-right: 20px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }
    }
  }
}

.form {
  margin: 57px 0 0 0;
  border-top: 1px solid #eeeeee;
  padding: 42px 0 0 70px;
}

/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
