<template>
  <div class="employment-record-delete">
    <div class="modal-btn">
      <ta-button type="primary" @click="$router.go(-1)">返回</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
        layout="inline">
        <div class="sub-title">个人基本信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="ycc030" label="主键" v-show="false">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac002" label="身份证号">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac004" label="性别">
            <ta-select disabled collection-type="sex" style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac005" label="民族">
            <ta-select disabled collection-type="AAC005" style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac006" label="出生年月">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae005" label="联系电话">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac026" label="现住地址">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae017" label="就业登记地" v-show="false">
            <ta-input />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae017desc" label="就业登记地">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择注销原因!' }" fieldDecoratorId="reason" label="注销原因">
            <ta-select collection-type="ADC112" style="width: 178px" @change="fnReasonSelect" />
          </ta-form-item>
          <ta-form-item :require="requiredFields.ycc040 ? { message: '请选择' + dynamicLabels.ycc040 + '!' } : false"
            fieldDecoratorId="ycc040" :label="dynamicLabels.ycc040">
            <ta-date-picker placeholder="" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc03m" label="备注">
            <ta-input placeholder="请输入" />
          </ta-form-item>
        </div>
        <div class="tips">
          材料上传提示(必须严格按照提示上传材料，否则会因为材料有误审核不通过)：<br />
          1、当注销原因选择'从企业、机关、事业单位等各类用人单位失业'或'退出公益性岗位'时，'解除\终止劳动合同证明材料'必须上传；<br />
          2、当注销原因选择'退出个体经营'时，'退出个体经营佐证资料'必须上传；<br />
          3、当注销原因选择'丧失劳动能力'时，'佐证资料'必须上传。<br />
        </div>
        <div class="modal-btn">
          <ta-button type="primary" id="saveDeleteBtn" @click="fnDeleteSave">注销保存</ta-button>
        </div>
        <div class="sub-title">材料上传</div>
        <materialUploadTable ref="materialUploadTable" yda020="403wtzx" :yda031="formData.ycc030" />
      </ta-form>
    </div>


  </div>
</template>

<script>
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  import moment from 'moment'
  export default {
    name: 'employmentRecordDelete',
    props: {},
    components: {
      materialUploadTable,
    },
    data() {
      return {
        queryForm: {},
        formData: {},
        // 用于动态控制表单字段的状态
        dynamicLabels: {
          ycc040: '注销原因时间' // 默认标签
        },
        // 用于控制字段是否必填
        requiredFields: {
          ycc040: true // 默认必填
        }
      }
    },
    created() {
      this.userInfo = this.$route.params || {}
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        const param = {
          no: '403-0017',
          data: JSON.stringify({
            ycc030: this.userInfo.ycc030,
          }),
        };
        Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '1') {
              const infoData = res.data.info || {}
              this.queryForm.setFieldsValue(infoData)

            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      fnReasonSelect(value) {
        // 获取reason字段的值作为注销原因

        // 根据不同的注销原因动态设置字段标签和必填状态
        if (value == '10' || value == '30') {
          this.dynamicLabels.ycc040 = "终止劳动合同时间";
          this.requiredFields.ycc040 = true;
        } else if (value == '21') {
          this.dynamicLabels.ycc040 = "个体经营注销时间";
          this.requiredFields.ycc040 = true;
        } else if (value == '22') {
          this.dynamicLabels.ycc040 = "退出灵活就业时间";
          this.requiredFields.ycc040 = true;
        } else if (value == '50') {
          this.dynamicLabels.ycc040 = "丧失劳动能力时间";
          this.requiredFields.ycc040 = true;
        } else {
          // 其他情况恢复默认值
          this.dynamicLabels.ycc040 = "注销原因时间";
          this.requiredFields.ycc040 = true;
        }
      },
      fnDeleteSave() {
        this.queryForm.validateFields((err, values) => {

          if (err) {
            return; // 表单验证失败时直接返回
          }
          const fileList = this.$refs.materialUploadTable.check() || []
          console.log(fileList, 'fileList');
          if (fileList[0].files.length === 0) {
            this.$message.error('请上传必要的材料');
            return;
          }
          values.ycc040 = moment(values.ycc040).format('YYYY-MM-DD')
          const param = {
            no: '403-0018',
            data: JSON.stringify({
              ...values,
              fileList: JSON.stringify(fileList),
            })
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success('注销成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 5000)
            }
            if (res.data.code === '0') {
              this.$message.success('请求失败!')
            }
          }, (error) => {
            // 添加失败回调，处理网络错误等情况
            this.$message.error('网络异常，请稍后重试')
            console.error('请求失败:', error)
          })
        })

      },

    },
  }
</script>

<style scoped>
  .employment-record-delete {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .content-box {
    margin-top: 20px;
  }

  .sub-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    background-color: #afd2f0;
    border-bottom: 2px solid #e8e8e8;
    margin-bottom: 20px;
  }

  .form-box {
    margin-bottom: 30px;
  }

  .modal-btn {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .modal-btn .ta-button {
    margin-left: 10px;
  }

  .btn-box {
    display: flex;
    justify-content: space-around;

    .btn {
      cursor: pointer;
    }
  }

  .tips {
    color: red;
    font-size: 16px;
    font-weight: bold;
    margin-top: -33px;
  }

  /* 统一输入框和下拉框宽度，确保对齐 */
  .ta-form-item .ta-input,
  .ta-form-item .ta-select {
    width: 180px;
  }

  /* 针对特定长标签的输入框，保持一致的宽度 */
  .ta-form-item[label-width="220px"] .ta-input {
    width: 180px;
  }
</style>