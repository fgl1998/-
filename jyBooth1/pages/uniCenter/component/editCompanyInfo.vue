<!-- 编辑公司基本信息 -->
<template>
  <el-dialog
    title="编辑企业基本信息"
    :visible="visible"
    width="70%"
    :append-to-body="true"
    :modal-append-to-body="false"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="editCompanyInfo">
      <el-form ref="form" size="medium" :model="form" :rules="formRules" label-position="left" label-width="80px">
        <el-form-item label="公司名称" prop="aab004">
          <el-input v-model="form.aab004" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="所属行业" prop="aab022">
          <el-cascader
            v-model="form.aab022"
            :options="aab022List"
            @change="handleAAB022"
            :props="aab022Props"
            ref="cascader"
            class="cascader"
            clearable
            placeholder="请选择所属行业"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="公司规模" prop="aab056">
          <el-select
            v-model="form.aab056"
            placeholder="请选择公司规模"
            style="width: 100%"
            clearable
            @change="handleAAB056"
          >
            <el-option v-for="item in aab056List" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公司性质" prop="aab019">
          <el-select v-model="form.aab019" placeholder="请选择公司性质" style="width: 100%" clearable>
            <el-option v-for="item in aab019List" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司地址" prop="aab060">
          <el-input v-model="form.aab060"></el-input>
        </el-form-item>
        <el-form-item label="公司简介" prop="aab092">
          <rich-editor
            :placeholder="'请输入公司简介…'"
            @input="handleInput"
            :bind-value="form.aab092"
          ></rich-editor>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="handleSubmit" :disbaled="submitDisabled">提交 </el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import sCommonCascaderArea from '../../../components/s-common-cascader-area/s-common-cascader-area.vue'
import richEditor from './richEditor.vue'
export default {
  components: { sCommonCascaderArea, richEditor },
  name: 'editCompanyInfo',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    companyInfo: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    visible: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.getIndustryListTree().then((res) => {
              this.aab022List = res
            })
            this.$codeConfig.getDictText('aab056').then((res) => {
              this.aab056List = res
            })
            this.$codeConfig.getDictText('aab019').then((res) => {
              this.aab019List = res
            })
            this.form.aab004 = this.companyInfo.aab004
            this.form.aab022 = this.companyInfo.aab022
            this.form.aab056 = this.companyInfo.aab056
            this.form.aab019 = this.companyInfo.aab019
            this.form.aab060 = this.companyInfo.aab060
            this.form.aab092 = this.companyInfo.aab092
            if (this.form.aab092) {
              this.$nextTick(() => {
                this.$refs.form.validateField('aab092')
              })
            }
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      submitDisabled: false,
      aab022List: [], // 行业
      aab056List: [], // 人员规模
      aab019List: [], // 公司性质
      aab022Props: {
        value: 'aab022',
        label: 'aab022Desc',
      },
      form: {
        aab004: '',
        aab022: '',
        aab056: '',
        aab019: '',
        aab060: '',
        aab092: '',
      },
      formRules: {
        aab004: [{ required: true, message: '请输入公司名称', trigger: ['change', 'blur'] }],
        aab022: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
        aab056: [{ required: true, message: '请选择公司规模', trigger: 'change' }],
        aab019: [{ required: true, message: '请选择公司性质', trigger: 'change' }],
        aab060: [{ required: true, message: '请填写公司地址', trigger: 'blur' }],
        aab092: [{ required: true, message: '请填写公司简介', trigger: ['change'] }],
      },
    }
  },
  methods: {
    // 获取行业树 并缓存
    getIndustryListTree() {
      return new Promise((resolve, reject) => {
        let industryList = JSON.parse(window.localStorage.getItem('industryList'))
        if (industryList) {
          resolve(industryList)
        } else {
          this.$http.post(this.$requestConstant.commonRequestType, 'jy048_com01', null, null, true).then((data) => {
            let result = data.data.result
            window.localStorage.setItem('industryList', JSON.stringify(result))
          })
        }
      })
    },
    handleAAB056(info) {},
    // 获取选中aab022
    handleAAB022(info) {
      if (info && info.length) {
        this.form.aab022 = info[info.length - 1]
      }
    },
    // // 获取公司地址aab301
    // getAreaInfo(info) {
    //   //console.log("info", info);
    //   if (info && info.length) {
    //     this.form.aab301 = info[info.length - 1];
    //   }
    // },
    // 提交
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        console.log(this.form, 'form')

        if (!valid) return
        if (this.form.aab301 && this.form.aab301.length > 0) {
          this.form.aab301 = this.form.aab301[this.form.aab301.length - 1]
        }
        let param = {
          ...this.form,
          // aab092: this.form.aab092,
        }
        this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm512', null, param, true).then((res) => {
          this.submitDisabled = true
          this.$message.success('更新公司信息成功', 'success')
          // this.handleClose()
        })
      })
    },
    // 关闭模态框
    handleClose() {
      this.submitDisabled = false
      this.$emit('onClose')
    },
    handleInput(val) {
      // this.aab092 = val
      if (val === '<p><br></p>') {
        val = ''
      }
      this.form.aab092 = val
      this.$nextTick(() => {
        this.$refs.form.validateField('aab092')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
