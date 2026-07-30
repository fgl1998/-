<template>
  <div class="unemployment-registration-add">
    <div class="modal-btn">
      <ta-button @click="$router.go(-1)">返回</ta-button>
      <ta-button @click="handleReset">重置</ta-button>
      <ta-button type="primary" @click="handleConfirm">确认</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
        layout="inline">
        <div class="sub-title">个人基本信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="yac002" label="证件号码">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac004" label="性别">
            <ta-select collection-type="AAC004" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac005" label="民族">
            <ta-select collection-type="AAC005" disabled style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac006" label="出生年月">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择户口性质!' }" fieldDecoratorId="aac009" label="户口性质">
            <ta-select collection-type="AAC009" style="width: 178px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aab301" label="户籍行政区划代码" v-show="false" />
          <ta-form-item :require="{ message: '请选择户籍行政区划!' }" fieldDecoratorId="aab299" label="户籍行政区划">
            <ta-input style="width: 420px" placeholder="请选择户籍地址" @click="openAreaSelector('aab299')"
              :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入户籍详细地址!' }" fieldDecoratorId="ycc004" label="户籍详细地址">
            <ta-input :disabled="isDisabled" style="width: 280px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc005" label="现住地址行政区划代码" v-show="false" />
          <ta-form-item :require="{ message: '请选择现住地址行政区划!' }" fieldDecoratorId="ycc299" label="现住地址行政区划">
            <ta-input style="width: 420px" placeholder="请选择现住地址" @click="openAreaSelector('ycc299')"
              :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入现住地址!' }" fieldDecoratorId="aac026" label="现住地址">
            <ta-input :disabled="isDisabled" style="width: 280px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc022" label="个人身份">
            <ta-select :disabled="isDisabled" collection-type="AAC012" style="width: 178px" />
          </ta-form-item>
          <ta-form-item required fieldDecoratorId="aac011" label="文化程度">
            <ta-select :disabled="isDisabled" collection-type="AAC011" style="width: 178px" @change="fnselect" />
          </ta-form-item>
          <ta-form-item :fieldDecoratorOptions="{ rules: [{ phone: 'mobile', message: '输入的联系电话不合法' }] }"
            :require="{ message: '请输入联系电话!' }" fieldDecoratorId="aae005" label="联系电话">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title">学历信息</div>
        <div class="form-box" v-if="showRequiredFields">
          <ta-form-item :require="{ message: '请选择教育类别!' }" fieldDecoratorId="ycc03q" label="教育类别">
            <ta-select style="width: 178px" :disabled="isDisabled">
              <ta-select-option value="1">全日制</ta-select-option>
              <ta-select-option value="2">非全日制</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入毕业院校!' }" fieldDecoratorId="yau002" label="毕业院校">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入所学专业!' }" fieldDecoratorId="yac01f" label="所学专业">
            <ta-input :disabled="isDisabled" style="width: 220px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择毕业日期!' }" fieldDecoratorId="yac01g" label="毕业日期">
            <ta-date-picker :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="form-box" v-else>
          <ta-form-item fieldDecoratorId="ycc03q" label="教育类别">
            <ta-select style="width: 178px">
              <ta-select-option value="1">全日制</ta-select-option>
              <ta-select-option value="2">非全日制</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yau002" label="毕业院校">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac01f" label="所学专业">
            <ta-input :disabled="isDisabled" style="width: 220px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac01g" label="毕业日期" :require="{ message: '请选择毕业日期!' }">
            <ta-date-picker :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title">失业登记信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="aab007" label="工商登记证号" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc020" label="主键流水号" v-show="false" />
          <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false" />
          <ta-form-item fieldDecoratorId="aac021" label="就失业证号码" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc02e" label="人员隶属" v-show="false" />
          <ta-form-item fieldDecoratorId="aca111" label="技术职称等级" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc131" label="就业援助对象类型" v-show="false" />
          <ta-form-item fieldDecoratorId="aab022" label="失业前所在单位属于什么行业" v-show="false" />
          <ta-form-item fieldDecoratorId="aab020" label="失业前所在单位类型" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc029" label="失业期间是否从事灵活就业" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc02j" label="主要生活来源家庭人均可支配收入" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc02k" label="办理就失业证原因" v-show="false" />
          <ta-form-item fieldDecoratorId="aab009" label="工商执照有效期" v-show="false" />
          <ta-form-item fieldDecoratorId="aab003" label="组织机构代码" v-show="false" />
          <ta-form-item fieldDecoratorId="aab001" label="原工作单位编号" v-show="false" />
          <ta-form-item fieldDecoratorId="ycc019" label="人员范围" v-show="false" />
          <ta-form-item :require="{ message: '请选择是否申领失业保险!' }" fieldDecoratorId="ajc174" label="是否申领失业保险">
            <ta-select collection-type="YESORNO" style="width: 178px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入失业原因!' }" fieldDecoratorId="ycc028" label="失业原因">
            <ta-select collection-type="AJC093" style="width: 178px" @change="fnSelects" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择失业类型!' }" fieldDecoratorId="ycc027" label="失业类型">
            <ta-select collection-type="YCC020_1" style="width: 178px" disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择失业时间!' }" fieldDecoratorId="ycc024" label="失业时间">
            <ta-date-picker @change="fnCheckTime" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择失业前月收入情况!' }" fieldDecoratorId="ycc025" label="失业前月收入情况">
            <ta-select style="width: 178px" :disabled="isDisabled">
              <ta-select-option value="1">2000以下</ta-select-option>
              <ta-select-option value="2">2000-3000</ta-select-option>
              <ta-select-option value="3">3000-5000</ta-select-option>
              <ta-select-option value="4">5000以上</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aab004" label="原工作单位">
            <ta-input placeholder="没有则填无" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入求职意向!' }" fieldDecoratorId="ycc02h" label="求职意向">
            <ta-input placeholder="没有则填无" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择失业登记地类型!' }" fieldDecoratorId="acc412" label="失业登记地类型">
            <ta-select collection-type="ACC412" style="width: 178px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择失业登记日期!' }" fieldDecoratorId="aae043" label="失业登记日期">
            <ta-date-picker disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择就业登记地!' }" fieldDecoratorId="aae017" label="就业登记地">
            <aae017-select-tree ref="aae017SelectTree" v-model="aae017Value" :data="aae017Data" :disabled="isDisabled"
              :showSearch="true" placeholder="请选择就业登记地" @change="handleAae017Change" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ycc02m" label="备注" :required="ycc02mShow">
            <ta-input placeholder="请输入" :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title">上传材料</div>
        <materialUploadTable ref="materialUploadTable" yda020="404" />
      </ta-form>
    </div>
    <ta-modal title="提示" v-model="visibleModal" height="150px" @ok="handleOkModal" @cancel="handleOkModal">
      <p>{{ modalTextTip }}</p>
    </ta-modal>
    <!-- 地址选择弹窗 - 支持多个实例 -->
    <area-selector-modal :visible="showAreaModal" :level="4" :field-name="currentAreaField" @confirm="handleAreaConfirm"
      @close="showAreaModal = false" />
  </div>
</template>

<script>
  import moment from 'moment'
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  import areaSelectorModal from 'common/components/areaSelectorModal.vue'
  import aae017SelectTree from '@/common/components/aae017SelectTree.vue'
  export default {
    name: 'UnemploymentRegistrationAdd',
    props: {},
    components: {
      materialUploadTable,
      areaSelectorModal,
      aae017SelectTree
    },
    data() {
      return {
        aae017Value: '',
        aab301Value: '',
        ycc005Value: '',
        aae017DESC: '',
        modalTextTip: '',
        showUploadFile: '',
        currentAreaField: 'ycc299',
        userInfo: {},
        queryForm: {},
        aae017Data: [],
        aae043Date: null,
        ycc02mShow: false,
        isDisabled: false,
        visibleModal: false,
        showAreaModal: false,
        showRequiredFields: false,
        modalScene: '' // 用于标识弹窗场景：'timeValidation'表示时间验证，'saveConfirmation'表示保存确认
      }
    },
    created() {
      this.userInfo = this.$route.params || {}
      // 初始化当前日期为失业登记日期，存储在data中
      this.aae043Date = moment()
      this.initAae017Data()
    },
    mounted() {
      // 页面加载完成后初始化
      this.init()
      // 设置当前日期为失业登记日期
      this.queryForm && this.queryForm.setFieldsValue({
        aae043: moment().format('YYYY-MM-DD')
      })
      // 初始化时调用fnInitEduction方法设置学历字段的必填性
      setTimeout(() => {
        this.fnInitEduction();
      }, 100);
    },
    methods: {

      init() {
        const param = {
          no: '404-0011',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
          }),
        };
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '1') {
              let forms = res.data.info || {}
              // 处理所有日期字段，确保它们是字符串格式
              const dateFields = ['aae043', 'yac01g']
              if (forms) {
                dateFields.forEach(field => {
                  if (forms[field]) {
                    forms[field] = String(forms[field])
                  }
                })
              }
              this.queryForm.setFieldsValue(forms)
              // 初始化文化程度相关字段
              this.fnInitEduction()
            }
            if (res.data.code === '0') {
              this.$message.error(res.data.msg || '查询失败')
              if (res.data.formReadOnly === 'true') {
                this.isDisabled = true
              } else {
                this.isDisabled = false
              }
              let forms = res.data.info || {}
              this.queryForm.setFieldsValue(forms)
              // 初始化文化程度相关字段
              this.fnInitEduction()
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 重置表单
      handleReset() {
        this.init()
        this.queryForm.resetFields()
        // 重新设置当前日期为失业登记日期
        this.queryForm.setFieldsValue({
          aae043: moment().format('YYYY-MM-DD')
        })
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
      // 打开地址选择弹窗并指定字段名
      openAreaSelector(fieldName = 'ycc299') {
        this.currentAreaField = fieldName
        this.showAreaModal = true
      },
      handleAreaConfirm(data) {
        // 获取字段名，默认为ycc299
        const fieldName = data.fieldName || 'ycc299'
        // 保存选中的地址信息
        this.selectedAreaCodes = data.codes
        this.selectedAreaText = data.names.join('')

        // 构建表单数据对象
        const formData = {}
        // 根据字段名设置对应的表单值
        formData[fieldName] = this.selectedAreaText

        // 设置代码字段
        if (fieldName === 'ycc299') {
          // 现住地址行政区划，设置对应的代码字段ycc005
          this.ycc005Value = this.selectedAreaCodes[this.selectedAreaCodes.length - 1] // 最后一级的代码
        } else if (fieldName === 'aab299') {
          // 户籍行政区划，设置对应的代码字段aab301
          this.aab301Value = this.selectedAreaCodes[this.selectedAreaCodes.length - 1] // 最后一级的代码
        }
        // 统一更新表单数据
        this.queryForm.setFieldsValue(formData)
        // 关闭弹窗
        this.showAreaModal = false
      },
      handleOkModal() {
        this.visibleModal = false
        this.modalTextTip = ''

        // 根据不同场景执行不同逻辑
        if (this.modalScene === 'timeValidation') {
          // 失业时间验证场景：清空失业时间字段
          this.queryForm && this.queryForm.setFieldsValue({
            ycc024: ''
          })
        } else if (this.modalScene === 'saveConfirmation') {
          // 保存确认场景：执行表单校验和提交
          this.confirmSave()
        }

        // 重置场景类型
        this.modalScene = ''
      },
      //失业时间
      fnCheckTime(date, dateString) {
        // 使用传入的dateString直接进行日期比较，不需要再次设置到表单
        let endTime = this.queryForm.getFieldValue('aae043')
        // 使用moment库进行日期比较
        if (moment(dateString).isAfter(moment(endTime))) {
          this.visibleModal = true
          this.modalTextTip = '失业日期不能大于失业登记日期'
          this.modalScene = 'timeValidation' // 设置为时间验证场景
          return
        }
      },
      fnInitEduction() {
        let aac011 = this.queryForm.getFieldValue('aac011');
        if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' || aac011 ==
          '41') {
          // 设置为必填
          this.showRequiredFields = true;
        } else {
          // 设置为非必填
          this.showRequiredFields = false;
        }
      },
      // 选择文化程度时的校验
      fnselect(value) {
        if (value == '11' || value == '14' || value == '20' || value == '30' || value == '40' || value ==
          '41') {
          // 设置为必填
          this.showRequiredFields = true;
        } else {
          // 设置为非必填
          this.showRequiredFields = false;
        }
        var yhc407 = this.queryForm.getFieldValue('yhc407');
        this.fnSelects('', yhc407);
      },
      //失业原因
      fnSelects(value) {
        console.log(value, '失业原因');
        if (value == '24' || value == '21' || value == '23' || value == '22' || value == '31') {
          this.queryForm.setFieldsValue({
            ycc027: "10"
          })
        } else if (value == '60' || value == '70' || value == '52' || value == '51' || value == '33' || value == '40' ||
          value == '32' || value == '90') {
          this.queryForm.setFieldsValue({
            ycc027: "30"
          })
        } else if (value == '10') {
          this.queryForm.setFieldsValue({
            ycc027: "20"
          })
        }
        if (value == '90') {
          this.ycc02mShow = true
        } else {
          this.ycc02mShow = false
        }
      },
      // 提交
      handleConfirm() {
        // 先进行表单验证
        this.queryForm.validateFields((errors, values) => {
          if (errors) {
            return
          }
          // 验证通过后显示确认弹窗
          this.visibleModal = true
          this.modalTextTip = '本人承诺填报的以上内容均真实、准确、有效，如有实际情况不一致，本人愿意承担相应责任，同时纳入人社信用记录。'
          this.modalScene = 'saveConfirmation' // 设置为保存确认场景
          // 获取表单数据
          const formData = this.queryForm.getFieldsValue()
          if (!formData) {
            this.$message.error('表单数据获取失败')
            return
          }
          // 获取当前日期作为经办日期
          const currentDate = moment()

          // 失业登记日期不能晚于经办日期
          if (formData.aae043) {
            const registerDate = moment(formData.aae043)
            // 添加isValid检查确保日期格式正确
            if (!registerDate.isValid()) {
              this.$message.error('就业登记日期格式不正确')
              return
            }
            if (registerDate.isAfter(currentDate, 'day')) {
              this.$message.error('就业登记日期不能晚于经办日期')
              return
            }
          }
          // 失业日期不能晚于失业登记日期
          if (formData.ycc024 && formData.aae043) {
            const employmentDate = moment(formData.ycc024)
            const registerDate = moment(formData.aae043)

            // 添加isValid检查确保日期格式正确
            if (!employmentDate.isValid()) {
              this.$message.error('就业日期格式不正确')
              return
            }
            if (employmentDate.isAfter(registerDate, 'day')) {
              this.$message.error('就业日期不能晚于就业登记日期')
              return
            }
          }

        })
      },
      // 确认保存
      confirmSave() {
        try {
          // 获取表单数据
          const formData = this.queryForm.getFieldsValue()
          // 处理日期字段格式
          if (formData.yac01g) formData.yac01g = moment(formData.yac01g).format('YYYY-MM-DD')
          if (formData.ycc024) formData.ycc024 = moment(formData.ycc024).format('YYYY-MM-DD')
          // 安全地处理aae017字段
          if (formData.aae017 && formData.aae017.value) {
            formData.aae017 = formData.aae017.value
          }
          formData.ycc005 = this.ycc005Value
          formData.aab301 = this.aab301Value
          formData.aac001 = this.userInfo.ext03 || ''
          formData.aae017DESC = this.aae017DESC || ''
          // 安全地获取上传的文件列表
          let fileList = []
          if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
            fileList = this.$refs.materialUploadTable.check() || []
          }
          // 安全地检查文件列表
          if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files.length === 0) {
            this.$message.error('请上传必要的材料');
            return;
          }
          const param = {
            no: '404-0012',
            data: JSON.stringify({
              ...formData,
              fileList: JSON.stringify(fileList)
            })
          }
          console.log('参数准备完毕，即将调用this.Base.sendRequest')
          this.Base.sendRequest('', param, (res) => {
            console.log('接口调用返回结果:', res)
            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success(res.data.msg || '保存成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 5000)
            } else {
              this.$message.error(res.data.msg || '保存失败')
            }
          }, (error) => {
            // 添加失败回调，处理网络错误等情况
            console.error('接口调用失败:', error)
            this.$message.error('网络异常，请稍后重试')
          })
        } catch (error) {
          console.error('confirmSave方法执行出错:', error)
          this.$message.error('处理数据时发生错误，请检查表单数据')
        }

      }

    },
  }
</script>

<style scoped>
  .unemployment-registration-add {
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