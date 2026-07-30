<template>
  <div class="emp-difficulties-iden-add">
    <div class="modal-btn">
      <ta-button type="primary" @click="handleDownload">业困难人员申请认定表</ta-button>
      <ta-button type="primary" @click="handleConfirm">保存 </ta-button>
      <ta-button @click="$router.go(-1)">返回</ta-button>
      <ta-button @click="handleReset">重置</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
        layout="inline">
        <div class="sub-title">个人基本信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="yac002" label="证件号码" :require="{ message: '请输入证件号码!' }">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac003" label="姓名" :require="{ message: '请输入姓名!' }">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false" :require="{ message: '请输入个人编号!' }" />
          <ta-form-item fieldDecoratorId="aac058" label="证件类型" :require="{ message: '请选择证件类型!' }">
            <ta-select collection-type="AAC058" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac004" label="性别" :require="{ message: '请选择性别!' }">
            <ta-select collection-type="AAC004" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac005" label="民族" :require="{ message: '请选择民族!' }">
            <ta-select collection-type="AAC005" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac006" label="出生日期" :require="{ message: '请选择出生日期!' }">
            <ta-date-picker disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac011" label="文化程度" :require="{ message: '请选择文化程度!' }">
            <ta-select collection-type="AAC011" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac010" label="户籍详细地址" :require="{ message: '请输入户籍详细地址!' }">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae006" label="家庭地址" :require="{ message: '请输入家庭地址!' }">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae005" label="联系电话" :require="{ message: '请输入联系电话!' }"
            :fieldDecoratorOptions="{
                rules: [{ phone: 'mobile', message: '输入的联系电话不合法' }],
              }">
            <ta-input disabled />
          </ta-form-item>
        </div>
        <div class="sub-title">就业困难人员信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="ycc130" label="就业困难人员申请编号" v-show="false"
            :require="{ message: '请输入就业困难人员申请编号!' }" />
          <ta-form-item fieldDecoratorId="ycc131" label="就业困难人员类别" :require="{ message: '请选择就业困难人员类别!' }">
            <ta-select collection-type="YCC131_RD" style="width: 178px" :disabled="isDisabled" @change="fnSelect" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae013" label="领取失业保险金情况" :require="{ message: '请选择领取失业保险金情况!' }">
            <ta-select style="width: 178px" :disabled="isDisabled">
              <ta-select-option value="1">领取失业保险金期间</ta-select-option>
              <ta-select-option value="2">领取失业保险金期满</ta-select-option>
              <ta-select-option value="3">本次失业不享受失业保险待遇</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc13g" label="是否援助对象" :require="{ message: '请选择是否援助对象!' }">
            <ta-select collection-type="YESORNO" style="width: 178px" :disabled="isDisabled" @change="fnYzSelect" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc136" label="就业援助起始日期" :require="ycc13gYes">
            <ta-date-picker :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc137" label="就业援助结束日期" :require="ycc13gYes">
            <ta-date-picker :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc025" label="援助项" :require="{ message: '请选择援助项!' }">
            <ta-select collection-type="YCC025_YZX" style="width: 178px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc026" label="援助完成情况" :require="{ message: '请选择援助完成情况!' }">
            <ta-select collection-type="YCC026_YZWC" style="width: 178px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac021" label="就业创业证编号" :require="{ message: '请输入就业创业证编号!' }">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc024" label="失业时间" :require="{ message: '请选择失业时间!' }">
            <ta-date-picker disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc13d" label="就业困难人员认定时间" :require="{ message: '请选择就业困难人员认定时间!' }">
            <ta-date-picker disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae017" label="审核地" :require="{ message: '请选择审核地!' }">
            <aae017-select-tree ref="aae017SelectTree" v-model="aae017Value" :data="aae017Data" :disabled="isDisabled"
              :showSearch="true" placeholder="请选择就业登记地" @change="handleAae017Change" />
          </ta-form-item>
        </div>
        <div class="sub-title">上传材料</div>
        <materialUploadTable ref="materialUploadTable" :yda020="showUploadFile" />
      </ta-form>
      <ta-modal title="提示" v-model="visibleModal" height="150px" @ok="handleOkModal" @cancel="handleCancelModal">
        <p>{{ modalTextTip }}</p>
      </ta-modal>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  import aae017SelectTree from '@/common/components/aae017SelectTree.vue'
  export default {
    name: 'empDifficultiesIdenAdd',
    props: {},
    components: {
      materialUploadTable,
      aae017SelectTree
    },
    data() {
      return {
        ycc13dDate: '',
        aae017Value: '',
        modalTextTip: '本人目前处理失业状态，申请认定就业困难人员，并愿意接受人力资源社会保障部门提供的各项就业服务。本人所提供的申请资料真是有效，如有虚假，愿承担相应的法律责任。',
        showUploadFile: '',
        aae017Data: [],
        queryForm: {},
        isDisabled: false,
        ycc13gYes: false,
        visibleModal: false,
      }
    },
    created() {
      this.userInfo = this.$route.params || {}
      // 初始化当前日期为就业困难人员认定时间，存储在data中
      this.ycc13dDate = moment()

    },
    mounted() {
      this.$nextTick(() => {
        this.init();
        if (this.queryForm.setFieldsValue) {
          // 将moment对象格式化为日期字符串，避免Invalid prop错误
          this.queryForm.setFieldsValue({
            ycc13d: this.ycc13dDate.format('YYYY-MM-DD')
          })
        }
        // 组件挂载后，检查是否有初始的就业困难人员类别值，如果有则更新材料列表
        setTimeout(() => {
          if (this.queryForm.getFieldValue && this.queryForm.getFieldValue('ycc131')) {
            this.fnSelect(this.queryForm.getFieldValue('ycc131'));
          }
          // 初始化就业地数据
          this.initAae017Data();
        }, 100);
      });
    },
    methods: {
      init() {
        const param = {
          no: '409-0005',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
          }),
        };
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '1') {
              let forms = res.data.info || {}
              this.aac006 = moment(forms.aac006).format('YYYY-MM-DD')
              // 格式化日期字段，避免Invalid prop错误
              this.formatDateFields(forms)
              this.queryForm.setFieldsValue(forms)
            }
            if (res.data.code === '0') {
              this.$message.error(res.data.msg || '查询失败')
              if (res.data.formReadOnly === 'true') {
                this.isDisabled = true
              } else {
                this.isDisabled = false
              }
              let forms = res.data.ac01Info || {}
              // 格式化日期字段，避免Invalid prop错误
              this.formatDateFields(forms)
              this.queryForm.setFieldsValue(forms)
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 格式化日期字段，确保以字符串格式传递给日期选择器
      formatDateFields(formData) {
        // 需要格式化的日期字段列表
        const dateFields = ['aac006', 'ycc136', 'ycc137', 'ycc024', 'ycc13d']
        dateFields.forEach(field => {
          if (formData[field]) {
            // 如果是moment对象或Date对象，转换为YYYY-MM-DD格式的字符串
            if (formData[field].format || formData[field] instanceof Date) {
              formData[field] = moment(formData[field]).format('YYYY-MM-DD')
            }
          }
        })
      },
      // 处理就业登记地选择变化
      handleAae017Change(selected) {
        if (selected && selected.value && selected.label) {
          // 更新表单中的就业单位区域字段
          if (this.queryForm && this.queryForm.setFieldsValue) {
            this.queryForm.setFieldsValue({
              aae017: selected.label,
            });
          }
          this.aae017DESC = selected.label
        }
      },
      // 初始化就业地数据
      async initAae017Data() {
        const selectTree = this.$refs.aae017SelectTree;
        if (selectTree && selectTree.queryAae017Data) {
          try {
            // 调用组件内置的查询方法，传入证件号码
            this.aae017Data = await selectTree.queryAae017Data(this.userInfo.certNo);
          } catch (error) {
            console.error('初始化就业地数据失败:', error);
            this.$message.error('获取就业地数据失败，请重试');
          }
        }
      },
      // 下载就业困难人员申请认定表
      handleDownload() {
        // 调用通用下载方法，使用POST请求下载认定表
        this.Base.commonDownload({
          method: 'get',
          url: '/api/file/downLoadWord',
          options: {
            fileName: 'RD001.docx',
          },
          fileName: '就业困难人员申请认定表.docx'
        }).then(() => {
          console.log('下载就业困难人员申请认定表成功')
        }).catch((error) => {
          console.error('下载就业困难人员申请认定表失败', error)
          this.$message.error('下载失败，请重试')
        })
      },
      // 重置表单
      handleReset() {
        // 重置查询表单
        if (this.queryForm && this.queryForm.resetFields) {
          this.queryForm.resetFields();
        }

        // 重置认定时间为当前日期
        this.ycc13dDate = moment();
        if (this.queryForm && this.queryForm.setFieldsValue) {
          this.queryForm.setFieldsValue({
            ycc13d: this.ycc13dDate.format('YYYY-MM-DD')
          });
        }

        // 重置材料上传组件
        this.showUploadFile = '';

        // 重置就业登记地相关字段
        this.aae017Value = '';
        this.aae017DESC = '';

        // 重置显示文件列表
        if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.reset) {
          this.$refs.materialUploadTable.reset();
        }
      },
      // 选择就业困难人员类别时的处理
      fnSelect(value) {
        if (value == '010' || value == '020' || value == '050' || value == '070') {
          this.showUploadFile = '409_6'
        } else if (value == '030') {
          this.showUploadFile = '409_1'
        } else if (value == '040') {
          this.showUploadFile = '409_2'
        } else if (value == '060') {
          this.showUploadFile = '409_3'
        } else if (value == '080') {
          this.showUploadFile = '409_4'
        } else if (value == '990') {
          this.showUploadFile = '409_5'
        } else {
          this.showUploadFile = ''
        }
        // 手动更新材料列表，确保材料编号即时生效
        this.$nextTick(() => {
          if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.getMaterailList) {
            this.$refs.materialUploadTable.getMaterailList();
          }
        });
      },
      // 选择是否援助对象时的处理
      fnYzSelect(value) {
        if (value == '1') {
          this.ycc13gYes = true
        } else {
          this.ycc13gYes = false
        }
      },
      handleOkModal() {
        this.visibleModal = false
        this.queryForm.validateFields((errors, values) => {
          if (errors) {
            return
          }
          // 获取表单数据
          const formData = this.queryForm.getFieldsValue()
          if (!formData) {
            this.$message.error('表单数据获取失败')
            return
          }
          formData.aae017 = formData.aae017.value
          if (formData.aae017 == "5400000000") {
            return this.$message.error('请选择西藏自治区服务中心进行审核!')
          }
          formData.aac001 = this.userInfo.ext03 || ''
          formData.aae017DESC = this.aae017DESC || ''
          // 安全地获取上传的文件列表
          let fileList = []
          if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
            fileList = this.$refs.materialUploadTable.check() || []
          }
          // 安全地检查文件列表
          if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files.length ===
            0) {
            this.$message.error('请上传必要的材料');
            return;
          }
          const param = {
            no: '409-0006',
            data: JSON.stringify({
              ...formData,
              fileList: JSON.stringify(fileList)
            })
          }
          this.Base.sendRequest('', param, (res) => {
            console.log('接口调用返回结果:', res)

            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success(res.data.msg || '保存成功')
              if (res.data.saveBtn === 'disabled') {
                this.isDisabled = true
              } else {
                this.isDisabled = false
              }
              setTimeout(() => {
                this.$router.go(-1)
              }, 8000)
            } else {
              this.$message.error(res.data.msg || '保存失败')
            }
          }, (error) => {
            // 添加失败回调，处理网络错误等情况
            console.error('接口调用失败:', error)
            this.$message.error('网络异常，请稍后重试')
          })

        });
      },
      // 取消
      handleCancelModal() {
        this.visibleModal = false
      },
      // 保存
      handleConfirm() {
        this.visibleModal = true
      },

    },
  }
</script>

<style scoped>
  .emp-difficulties-iden-add {
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