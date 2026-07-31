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
      <view>面试邀请</view>
    </div>
    <div class="top">
      <image src="../../static/images/img/publicImg/male.png" />
      <div class="base-info">
        <view>{{ resumeInfo.aac003 }}</view>
        <view>
          <view>{{ resumeInfo.aac147?resumeInfo.aac147:resumeInfo.aac002?resumeInfo.aac002:resumeInfo.age?`年龄：${resumeInfo.age}岁`:'' }}</view>
          <view>{{ $codeConfig.getCodeLabel('aac004', resumeInfo.aac004) }}</view>
          <view>{{ $codeConfig.getCodeLabel('aac011', resumeInfo.aac011) }}</view>
          <view>{{ resumeInfo.acb202 }}</view>
        </view>
        <view>
          <view>电子邮箱：{{ resumeInfo.aae159?resumeInfo.aae159:'暂无邮箱' }}</view>
          <view>联系电话：{{ resumeInfo.aae005?resumeInfo.aae005:resumeInfo.aac067?resumeInfo.aac067:'暂无联系方式' }}</view>
        </view>
      </div>
    </div>
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
        <el-form-item label="面试方式" prop="acc315">
          <el-select v-model="form.acc315" placeholder="请选择面试方式" style="width: 350px" clearable>
            <el-option v-for="item in acc315s" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位选择" prop="acb210">
          <el-select v-model="form.acb210" placeholder="请选择职位选择" style="width: 350px" clearable>
            <el-option v-for="(item, index) in cb21s" :key="index" :value="item.acb210" :label="item.acb213">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试时间" prop="acb222">
          <el-date-picker
            v-model="form.acb222"
            type="datetime"
            style="width: 350px"
            placeholder="选择日期时间"
            :picker-options="{ disabledDate: disabledDate }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面试联系人" prop="acb224">
          <el-input v-model="form.acb224" placeholder="请输入面试联系人" style="width: 350px" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="acb225">
          <el-input v-model="form.acb225" placeholder="请输入联系电话" style="width: 350px" clearable></el-input>
        </el-form-item>
        <el-form-item label="面试地址" prop="acb223">
          <el-input v-model="form.acb223" placeholder="请输入面试地址" style="width: 853px" clearable></el-input>
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
  },
  data() {
    return {
      submitDisabled: false,
      userInfo: this.$loginConfig.getLoginInfo(),
	  resumeInfo: {},
      cb21s: [],
      acc315s: [],
      form: {
        acc315: '1',
        acb210: '',
        acb222: new Date(),
        acb224: '',
        acb225: '',
        acb223: '',
      },
      formDisabled: false,
      rules: {
        acb210: [
          {
            required: true,
            message: '请选择面试职位',
            trigger: 'change',
          },
        ],
        acc315: [
          {
            required: true,
            message: '请选择面试方式',
            trigger: 'change',
          },
        ],
        acb222: [
          {
            required: true,
            message: '请选择面试时间',
            trigger: 'change',
          },
        ],
        acb223: [
          {
            required: true,
            message: '请输入面试地址',
            trigger: 'change',
          },
        ],
        acb224: [
          {
            required: true,
            message: '请输入联系人',
            trigger: 'change',
          },
        ],
        acb225: [
          {
            required: true,
            message: '请输入联系电话',
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
          this.form.acb224 = this.userInfo.name
          this.form.acb225 = this.userInfo.mobile
          this.form.acb210 = this.data.acb210
		  this.resumeInfo = {...this.data}
          this.searchEvent()
		  if(this.data.acc300) return
		  this.getResumeDetail(this.data)
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
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm256', null, params, true).then((data) => {
        let resultData = data.data
        this.cb21s = resultData.cb36s
        if (resultData.jobfair) {
          this.form.acb223 = resultData.jobfair.acb303
        }
      })
    },
	// 获取简历详情
	getResumeDetail(params) {
		// 获取简历详情
		let param = {};
		//查询简历信息
		param.method = "";
		// 个人编号
		param.aac001 = params.aac001
		param.aab001 = this.userInfo.aab001
		this.$http.post(this.$requestConstant.businessRequestType,'jy202_hrm1191',null,param,false).then(res => {
			try {
				if (res.code == -1) {
					this.$utils.showToast(res.message ? res.message : '查询出错，请联系管理员！')
					return
				}
				// 1、基本信息
				let resumeMap = res.data.resumeMap || {}
				if (!resumeMap.baseInfo) {
					this.$utils.showToast('简历信息不完整');
					return;
				}
				this.resumeInfo = {...resumeMap.baseInfo,...this.resumeInfo}
			} catch (e) {
				//TODO handle the exception
				this.$utils.commonTipsModel('查询出错，请联系管理员！')
			}
		})
	},
    fnSubmit() {
      this.formDisabled = true
      this.submitDisabled = true
      this.$refs.form.validate((valid) => {
        if (valid) {
			let Url = 'jy201_hrm100'
          this.form.acb222 = moment(this.form.acb222).format('YYYY-MM-DD HH:mm')
          let params = {
            ...this.form,
          }
          params.aab095 = '0'
          params.aab001 = this.userInfo.aab001
          params.aab004 = this.userInfo.aab004
		  if(this.data.acc300){
			  params.acc300 = this.data.acc300
		  } else {
			  Url = 'jy201_hrm101'
		  }
          
          params.hrAac001 = this.userInfo.userId
          params.personAac001 = this.data.aac001
          params.personAac003 = this.data.aac003
          params.aac001 = this.data.aac001
          params.acc200 = this.data.acc200
          params.acc04v = '0'
          params.yae100 = '19'
          params.acb330 = this.userInfo.acb330
          this.$http
            .post(this.$requestConstant.businessRequestType, Url, null, params, true)
            .then((res) => {
              this.$message.success('邀请成功')
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
        width: 120px;
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
