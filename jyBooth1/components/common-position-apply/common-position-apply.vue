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
      <image src="../../static/images/work.png" />
      <view>岗位信息情况:{{ data.acb213 }}</view>
    </div>
    <div class="top">
      <div class="top-left">
        <image :src="loginInfo.aae707" />
      </div>
      <div class="top-right">
        <div class="top-right-top">
          <view>{{ loginInfo.aab004 }}</view>
          <view>{{ data.acb21h || '0' }} - {{ data.acb21j || '不限' }} 元/月</view>
        </div>
        <div class="top-right-center">
          <!-- <div class="top-right-center-fl"">
            <view v-if="acb214s.length > 0" v-for="(item, index) in acb214s.slice(0, 5)"
              class="top-right-center-fl-item">
              {{ item }}
            </view>
            <view v-else>暂无</view>
          </div> -->
          <div class="top-right-center-type">
            <view>
              <image src="../../static/images/potion.png" />
              {{ data.acb217 ? data.acb217.split('/')[data.acb217.split('/').length - 1] : '未知' }}
            </view>
            <view>
              <image src="../../static/images/jingyan.png" />
              {{ data.acc217_dsc }}
            </view>
            <view>
              <image src="../../static/images/xueli.png" />
              {{ $codeConfig.getCodeLabel('AAC011', data.aac011) }}
            </view>
          </div>
        </div>
        <div class="top-bottom">
          <view v-for="(item, index) in acb214s">
            {{ item }}
          </view>
          <!-- <view>职位介绍：{{ data.acb216 ? data.acb216 : '暂无' }}</view> -->
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-left">
        <xu-common-title zh="方法一" size="mini">
          <div slot="btn" class="title-desc">
            <view>使用</view>
            <view>身份证/社保卡</view>
            <view>进行录入</view>
          </div>
        </xu-common-title>
        <div class="bottom-person-info">
          <div class="bottom-person-info-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="130px">
              <el-form-item label="姓名" prop="aac003">
                <el-input v-model="form.aac003" placeholder="请输入姓名" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="aac147">
                <el-input v-model="form.aac147" placeholder="请输入身份证号" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="aae005">
                <el-input v-model="form.aae005" placeholder="请输入联系电话" clearable disabled></el-input>
              </el-form-item>
              <el-form-item label="学历" prop="aac011">
                <el-select v-model="form.aac011" placeholder="请选择学历" style="width: 100%" clearable disabled>
                  <el-option
                    v-for="item in aac011List"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="bottom-person-info-button">
            <div class="button-idCard">
              <image src="../../static/images/idCard.png" />
              <view @click="idCardRead">身份证录入</view>
            </div>
            <div class="button-sbCard">
              <image src="../../static/images/shebao.png" />
              <view @click="sbCardRead">社保卡录入</view>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-line"></div>
      <div class="bottom-right">
        <xu-common-title zh="方法二" size="mini">
          <div slot="btn" class="title-desc">
            <view>原圆就业小程序扫描</view>
            <view>二维码</view>
            <view>投递该岗位</view>
          </div>
        </xu-common-title>
        <div class="bottom-right-code">
          <image :src="qrCodeBase64" mode="aspectFit" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :type="buttonDisabled ? 'info' : 'primary'" :disabled="buttonDisabled" @click="positionApply"
        >简历投递</el-button
      >
    </span>
    <common-resume :data="resumeInfo" :visible="commonResumeVisible" @close="closeCommonResume"></common-resume>
  </el-dialog>
</template>

<script>
import QRCode from 'qrcode'
import commonResume from '../common-resume/common-resume.vue'
import readIDCard from '../../static/public/utils/ReadIDCard'
import readSbCard from '../../static/public/utils/DCCard'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    commonResume,
  },
  data() {
    return {
      resumeInfo: {},
      commonResumeVisible: false,
      buttonDisabled: true,
      resumeList: [],
      qrCodeBase64: '',
      loginInfo: this.$loginConfig.getLoginInfo(),
      acb214s: [],
      aac011List: [],
      form: {
        aac001: '',
        aac003: '',
        aac147: '',
        aae005: '',
        aac011: '',
      },
      rules: {
        aac003: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
        ],
        aac147: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur',
          },
        ],
        aae005: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur',
          },
        ],
        aac011: [
          {
            required: true,
            message: '请选择学历',
            trigger: 'change',
          },
        ],
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        // 处理福利待遇
        this.acb214s = this.data.acb214 ? this.data.acb214.split(',') : []
        this.acb214s = this.acb214s.map((item) => {
          return this.$codeConfig.getCodeLabel('ACB214', item)
        })
        this.createQRCode()
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.aac011List = this.$codeConfig.getCode('aac011')
    })
  },
  methods: {
    idCardRead() {
      const loading = this.$loading({
        lock: true,
        text: '读卡中',
        spinner: 'el-icon-loading-idCard',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let this_ = this
      readIDCard(function (info) {
        try {
          if (info.resultFlag == 0) {
            let param = {
              aac147: info.certNumber,
            }
            this_.queryResume(param)
          } else {
            this_.$message.error(info.errorMsg)
            this_.buttonDisabled = true
            this_.resetForm()
          }
          setTimeout(() => {
            loading.close()
          }, 1500)
        } catch (e) {
          this.$message.error('读卡失败')
          loading.close()
        }
      })
    },
    sbCardRead() {
      const loading = this.$loading({
        lock: true,
        text: '读卡中',
        spinner: 'el-icon-loading-card',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let this_ = this
      readSbCard(function (info) {
        if (info.resultFlag == 0) {
          let param = {
            aac147: info.certNumber,
          }
          this_.queryResume(param)
        } else {
          this_.$message.error(info.errorMsg)
          this_.buttonDisabled = true
          this_.resetForm()
        }
        setTimeout(() => {
          loading.close()
        }, 1500)
      })
    },
    queryResume(param) {
      // 查询简历编号
      this.$http
        .post(this.$requestConstant.commonRequestType, 'jy202_hrm225', null, param, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          if (res.errors && res.errors.length > 0) {
            this.$message.error(res.errors[0].msg || '未查询到简历信息，无法投递!')
            this.buttonDisabled = true
            this.resetForm()
          } else {
            this.resumeInfo = res.data.data
            if (this.resumeInfo) {
              if (this.resumeInfo.aac001 && this.resumeInfo.aac003) {
                this.form.aac001 = this.resumeInfo.aac001
                this.form.aac003 = this.resumeInfo.aac003
                this.form.aac147 = this.resumeInfo.aac147
                this.form.aae005 = this.resumeInfo.aae005
                this.form.aac011 = this.resumeInfo.aac011
                this.buttonDisabled = false
              } else {
                this.$message.error('未查询到简历信息，无法投递!')
                this.buttonDisabled = true
                this.resetForm()
              }
            } else {
              this.$message.error('未查询到简历信息，无法投递!')
              this.buttonDisabled = true
              this.resetForm()
            }
          }
        })
    },
    positionApply() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = {
            aac001: this.resumeInfo.aac001,
            acc200: this.resumeInfo.acc200,
            acb210: this.data.acb210,
            yae100: '19',
            acb330: this.loginInfo.acb330,
            acc04u: '1',
          }
          this.$http.post(this.$requestConstant.commonRequestType, 'jy202_hrm100', null, param, true).then((data) => {
            this.$message.success('投递成功!')
            this.handleClose()
          })
        }
      })
    },
    closeCommonResume() {
      this.commonResumeVisible = false
    },
    async createQRCode() {
      try {
        // 生成二维码
        let text = `a=${this.data.acb210}&b=19&c=UT02&d=2&e=${this.loginInfo.acb330}`
        this.qrCodeBase64 = await QRCode.toDataURL(text)
      } catch (error) {}
    },
    handleClose() {
      this.buttonDisabled = true
      this.resetForm()
      this.$emit('close')
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  border-radius: 8px;
}

/deep/ .el-dialog__header {
  padding: 0;
}

/deep/ .el-dialog__body {
  padding: 30px 20px 0;
}

/deep/ .el-icon-close {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

/deep/ .el-icon-close:hover {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.title {
  height: 22px;
  background: linear-gradient(180deg, #35aeff 0%, #0375f2 100%);
  padding: 24px 23px;
  display: flex;

  > image {
    width: 24px;
    height: 21px;
  }

  > view {
    margin-left: 10px;
    height: 24px;
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
  display: flex;

  .top-left {
    width: 113px;
    height: 103px;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .top-right {
    width: calc(100% - 138px);
    margin-left: 25px;

    .top-right-top {
      display: flex;

      > view:nth-child(1) {
        width: 100%;
        /* height: 32px; */
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 32px;
        color: #172e61;
        line-height: 48px;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(2) {
        width: 100%;
        /* height: 32px; */
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 32px;
        color: #fe2d17;
        line-height: 50px;
        text-align: center;
        font-style: normal;
      }
    }
  }

  .top-right-center {
    display: flex;
    margin: 16px 0;
    flex-wrap: wrap;

    .top-right-center-fl {
      width: calc(100% - 400px);
      display: flex;

      > view:first-child {
        height: 20px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #666666;
        line-height: 24px;
        text-align: left;
        font-style: normal;
      }

      .top-right-center-fl-item {
        /* width: 64px; */
        height: 16px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 16px;
        color: #666666;
        line-height: 24px;
        text-align: left;
        font-style: normal;
        margin-right: 10px;
        background: #f8f8f8;
        border-radius: 4px;
      }
    }

    .top-right-center-type {
      /* width: 400px; */
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;

      > view {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #666666;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        > image {
          width: 17px;
          height: 19px;
          margin-right: 5px;
          top: 2px;
        }
      }

      > view:first-child {
        /* width: 200px; */
      }
    }
  }

  .top-bottom {
    width: 100%;
    height: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    > view {
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.bottom {
  width: 100%;
  height: 392px;
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
  margin-top: 20px;
  display: flex;

  .bottom-left {
    width: 100%;
    height: 100%;
    padding: 24px 0;

    .title-desc {
      width: 400px;
      display: flex;
      text-align: right;

      > view:first-child {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(2) {
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 20px;
        color: #0682fe;
        line-height: 30px;
        text-align: left;
        font-style: normal;
        margin: 0 5px;
      }

      > view:last-child {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 30px;
        text-align: left;
        font-style: normal;
      }
    }

    .bottom-person-info {
      width: 98%;
      height: calc(75% - 12px);
      margin-top: 12px;
      padding: 12px 0;

      .bottom-person-info-form {
        width: 100%;
        height: calc(100% - 68px);
      }

      .bottom-person-info-button {
        cursor: pointer;
        width: 100%;
        height: 38px;
        display: flex;
        text-align: center;
        justify-content: flex-end;
        margin-top: 35px;

        > div:first-child {
          width: 185px;
          height: 38px;
          background: linear-gradient(180deg, #feb838 0%, #ff7a00 100%);
          border-radius: 4px;
          display: flex;
          margin-right: 43px;

          > image {
            width: 19px;
            height: 15px;
            margin: 11px 4px 0 31px;
          }

          > view {
            width: 90px;
            height: 18px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            line-height: 35px;
            text-align: left;
            font-style: normal;
          }
        }

        > div:last-child {
          width: 185px;
          height: 38px;
          background: linear-gradient(180deg, #09dff1 0%, #00a5bd 100%);
          border-radius: 4px;
          display: flex;
          cursor: pointer;

          > image {
            width: 14px;
            height: 18px;
            margin: 10px 4px 0 31px;
          }

          > view {
            width: 90px;
            height: 18px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 18px;
            color: #ffffff;
            line-height: 35px;
            text-align: left;
            font-style: normal;
          }
        }
      }
    }
  }

  .bottom-line {
    width: 1px;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #eeeeee;
  }

  .bottom-right {
    width: calc(100% - 31px);
    height: calc(100% - 48px);
    padding: 24px 0 24px 31px;

    .title-desc {
      width: 400px;
      display: flex;
      text-align: right;

      > view:first-child {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(2) {
        height: 20px;
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 20px;
        color: #0682fe;
        line-height: 30px;
        text-align: left;
        font-style: normal;
        margin: 0 8px;
      }

      > view:last-child {
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 30px;
        text-align: left;
        font-style: normal;
      }
    }

    .bottom-right-code {
      width: 320px;
      height: 320px;
      margin-left: 105px;

      > image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

/deep/ .el-dialog__footer {
  text-align: center;

  .el-button {
    width: 200px;
    // background: #0682FE;
    border-radius: 4px;

    > span {
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 18px;
      color: #ffffff;
      line-height: 18px;
      text-align: left;
      font-style: normal;
    }
  }
}
</style>
