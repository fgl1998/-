<template>
  <view class="form">
    <uni-forms ref="valiForm" :rules="rules" :modeValue="formData" label-position="top" label-width="300">
      <div class="base-info">
        <div class="base-title">
          <text class="text">基础</text>信息
          <span class="span"> / 请您完善您的基本信息</span>
        </div>
        <uni-row class="demo-uni-row" width="1100" :gutter="70">
          <uni-col :span="8">
            <uni-forms-item label="您的身份证号:" name="aac002" required>
              <uni-easyinput type="text" v-model="formData.aac002" placeholder="请输入身份证号" disabled />
            </uni-forms-item>
          </uni-col>

          <uni-col :span="8">
            <uni-forms-item label="您的姓名:" name="aac003" required>
              <uni-easyinput type="text" v-model="formData.aac003" placeholder="请输入姓名" disabled />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="您的电话:" name="aae005" required>
              <uni-easyinput type="text" v-model="formData.aae005" placeholder="请输入电话" :disabled="!isEdit" />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="您的民族:" name="aac005" required>
              <custom-select
                id="aac005"
                label="民族类型"
                collect="aac005"
                v-model="formData.aac005"
                @input="binddata('aac005', formData.aac005)"
                placeholder="请选择民族"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="您的学历:" name="aac011" required>
              <custom-select
                id="aac011"
                label="学历"
                required
                collect="aac011"
                v-model="formData.aac011"
                @input="binddata('aac011', formData.aac011)"
                placeholder="请选择学历"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="您的政治面貌:" name="aac024" required>
              <custom-select
                id="aac024"
                label="政治面貌"
                collect="aac024"
                v-model="formData.aac024"
                @input="binddata('aac024', formData.aac024)"
                placeholder="请选择政治面貌"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>

          <uni-col :span="8">
            <uni-forms-item label="您的户口性质:" name="aac009" required>
              <custom-select
                id="aac009"
                label="户口性质"
                collect="aac009"
                v-model="formData.aac009"
                @input="binddata('aac009', formData.aac009)"
                placeholder="请选择户口性质"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="你的身份类型:" name="aac012" required>
              <custom-select
                id="aac012"
                label="身份类型"
                collect="aac012"
                v-model="formData.aac012"
                @input="binddata('aac012', formData.aac012)"
                placeholder="请选择身份类型"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="人力资源分类:" name="aac316" required>
              <custom-select
                id="aac316"
                label="人力资源分类"
                collect="aac316"
                v-model="formData.aac316"
                @input="binddata('aac316', formData.aac316)"
                placeholder="请选择人力资源分类"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
          <uni-col :span="8">
            <uni-forms-item label="您的常住地:" name="aab299" required>
              <modal-address
                ref="addressAab299"
                areaid="aab299"
                placeholder="请输入常住地"
                :areaCode="formData.aab299"
                v-model="formData.aab299Desc"
                @setAreaValue="getAab299Value"
                :disabled="!isEdit"
              ></modal-address>
            </uni-forms-item>
          </uni-col>

          <uni-col :span="16">
            <uni-forms-item label="常住详细地址:" name="aae006" required>
              <text class="uni-subtitle" v-show="false">输入内容：{{ aae006Text }}</text>
              <uni-easyinput
                type="text"
                v-model="formData.aae006"
                placeholder="请输入常住详细地址"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>

          <uni-col :span="8">
            <uni-forms-item label="您的户口所在地:" name="aab301" required>
              <modal-address
                ref="addressAab301"
                areaid="aab301"
                placeholder="请输入户口所在地"
                :areaCode="formData.aab301"
                v-model="formData.aab301Desc"
                @setAreaValue="getAab301Value"
                :disabled="!isEdit"
              ></modal-address>
            </uni-forms-item>
          </uni-col>
          <uni-col :span="16">
            <uni-forms-item label="户籍详细地址:" name="aac010" required>
              <text class="uni-subtitle" v-show="false">输入内容：{{ aac010Text }}</text>
              <uni-easyinput
                type="text"
                v-model="formData.aac010"
                placeholder="请输入户籍详细地址"
                :disabled="!isEdit"
              />
            </uni-forms-item>
          </uni-col>
        </uni-row>
      </div>
    </uni-forms>
  </view>
</template>

<script>
export default {
  props: {
    labourInfo: {
      type: Object,
    },
    userInfo: {
      type: Object,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    labourInfo: {
      handler(val) {
        this.formData = val
        this.formData.aac001 = this.userInfo.aac001
        this.formData.aac002 = this.userInfo.aac147
        this.formData.aac147 = this.userInfo.aac147
        this.formData.aac003 = this.userInfo.aac003
		this.formData.aae005 = this.userInfo.aac067 || this.userInfo.aae005 || ''
      },
      immediate: true,
    },
  },

  data() {
    return {
      formData: {},
      aae006Text: '',
      aac010Text: '',
      rules: {
        aac003: {
          rules: [
            {
              required: true,
              errorMessage: '姓名不能为空',
            },
            {
              validateFunction: (rule, value, data, callback) => {
                let flag = /^[\u4e00-\u9fa5·]+$/.test(value)
                if (!flag) {
                  callback('姓名只能输入汉字')
                }
                return true
              },
            },
          ],
        },
        aac002: {
          rules: [
            {
              required: true,
              errorMessage: '身份证号不能为空',
            },
            {
              validateFunction: (rule, value, data, callback) => {
                let idCardMsg = this.$check.getIdCardMsg(value)
                if (!idCardMsg.pass) {
                  callback('身份证号码不合法')
                }
                return true
              },
            },
          ],
        },
        aae005: {
          rules: [
            {
              required: true,
              errorMessage: '电话不能为空',
            },
            {
              validateFunction: (rule, value, data, callback) => {
                let flag = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
                if (!flag) {
                  callback('号码格式错误')
                }
                return true
              },
            },
          ],
        },
        aac005: {
          rules: [
            {
              required: true,
              errorMessage: '民族不能为空',
            },
          ],
        },
        aac011: {
          rules: [
            {
              required: true,
              errorMessage: '学历不能为空',
            },
          ],
        },
        aac024: {
          rules: [
            {
              required: true,
              errorMessage: '政治面貌不能为空',
            },
          ],
        },
        aac009: {
          rules: [
            {
              required: true,
              errorMessage: '户口性质不能为空',
            },
          ],
        },
        aac012: {
          rules: [
            {
              required: true,
              errorMessage: '身份类型不能为空',
            },
          ],
        },
        aac316: {
          rules: [
            {
              required: true,
              errorMessage: '人力资源分类不能为空',
            },
          ],
        },
        aab299: {
          rules: [
            {
              required: true,
              errorMessage: '常住地不能为空',
            },
          ],
        },
        aae006: {
          rules: [
            {
              required: true,
              errorMessage: '常住详细地址不能为空',
            },
          ],
        },
        aab301: {
          rules: [
            {
              required: true,
              errorMessage: '户口所在地不能为空',
            },
          ],
        },
        aac010: {
          rules: [
            {
              required: true,
              errorMessage: '户籍详细地址不能为空',
            },
          ],
        },
      },
    }
  },
  methods: {
    getAab299Value(val) {
      //获取地址弹窗
      this.formData.aab299 = val.areaCode
      this.formData.aab299Desc = val.areaname
      this.aae006Text = val.areaname
      this.formData.aae006 = val.areaname ? val.areaname.split('/').join('') : val.areaname
      this.$refs.valiForm.setValue('aab299', val.areaCode)
    },
    getAab301Value(val) {
      //获取地址弹窗
      this.formData.aab301 = val.areaCode
      this.formData.aab301Desc = val.areaname
      this.aac010Text = val.areaname
      this.formData.aac010 = val.areaname ? val.areaname.split('/').join('') : val.areaname
      this.$refs.valiForm.setValue('aab301', val.areaCode)
    },
    prev(value) {
      this.formData = value
      this.$refs.valiForm.setValue('aab299', value.aab299)
      this.$refs.valiForm.setValue('aab301', value.aab301)
    },
    next() {
      this.$refs.valiForm
        .validateField([
          'aac003',
          'aac002',
          'aae005',
          'aac005',
          'aac011',
          'aac024',
          'aac009',
          'aac012',
          'aac316',
          'aab299',
          'aae006',
          'aab301',
          'aac010',
        ])
        .then((ret) => {
          this.formData.aac147 = this.formData.aac002
          this.$emit('triggerBtn', '2', this.formData)
        })
        .catch((err) => {})
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
</style>
