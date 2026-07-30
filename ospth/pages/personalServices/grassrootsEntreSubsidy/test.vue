<!-- 新增 -->
<template>
  <div class="grassrootsentresubsidyadd">
    <div class="modal-btn">
      <ta-button type="primary" @click="handleConfirm()" :disabled="saveBtnDisabled">保存申报信息</ta-button>
      <ta-button type="primary" @click="$router.go(-1)">返回</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="autoFormCreate" :formLayout="true" label-width="150px" layout="inline">
        <div class="sub-title">创业者信息</div>
        <div class="form-box">
          <ta-form-item
            :require="{ message: '请选择创业者身份类型!' }"
            fieldDecoratorId="adc635"
            label="创业者身份类型"
          >
            <ta-select
              placeholder=""
              style="width: 212px"
              collection-type="ADC635"
              @change="handleSelectChange('adc635', $event)"
              :disabled="adc635Disabled"
            />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入姓名!' }" fieldDecoratorId="aac003" label="姓名">
            <ta-input placeholder="" :disabled="true" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入身份证号码!' }" fieldDecoratorId="yac002" label="身份证号码">
            <ta-input placeholder="" :disabled="true" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择性别!' }" fieldDecoratorId="aac004" label="性别">
            <ta-select collection-type="AAC004" style="width: 212px" :disabled="true" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择民族!' }" fieldDecoratorId="aac005" label="民族">
            <ta-select collection-type="AAC005" style="width: 212px" :disabled="true" />
          </ta-form-item>

          <ta-form-item :require="{ message: '请输入毕业院校!' }" fieldDecoratorId="yau002" label="毕业院校">
            <ta-input placeholder="" :disabled="yau002Disabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择专业!' }" fieldDecoratorId="aac183" label="专业">
            <ta-select :disabled="isDisabled" collection-type="AAC183" style="width: 212px" />
          </ta-form-item>

          <ta-form-item :require="{ message: '请选择毕业时间!' }" fieldDecoratorId="aac181" label="毕业时间">
            <ta-date-picker placeholder="" :disabled="aac181Disabled" valueFormat="YYYY-MM-DD" />
          </ta-form-item>
          <ta-form-item
            :fieldDecoratorOptions="{
              rules: [{ phone: 'mobile', message: '输入的联系电话不合法' }],
            }"
            :require="{ message: '请输入联系电话!' }"
            fieldDecoratorId="aae005"
            label="联系电话"
            :disabled="isDisabled"
          >
            <ta-input placeholder="" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择银行行别代码!' }" fieldDecoratorId="aaf200" label="银行行别代码">
            <ta-select :disabled="isDisabled" collection-type="AAF200" style="width: 212px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择开户行!' }" fieldDecoratorId="aae044" label="开户行">
            <!-- <ta-select :disabled="isDisabled" collection-type="AAC044" style="width: 212px" /> -->
            <ta-input @click="visibleBank = true" :disabled="isDisabled" />
          </ta-form-item>

          <ta-form-item :require="{ message: '请输入银行账户名!' }" fieldDecoratorId="aae009" label="银行账户名">
            <ta-input placeholder="" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入银行账号!' }" fieldDecoratorId="aae010" label="银行账号">
            <ta-input placeholder="" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选择 (高考前)户籍所在区县!' }"
            fieldDecoratorId="ady019"
            label=" (高考前)户籍所在区县"
            label-width="180px"
          >
            <ta-select
              :disabled="ady019Disabled"
              :options="ady019List"
              :optionsKey="{ value: 'id', label: 'name' }"
              style="width: 212px"
            />
          </ta-form-item>
        </div>
        <div class="sub-title">创办企业信息</div>
        <div class="form-box">
          <ta-form-item :require="{ message: '请选输入创办企业名称!' }" fieldDecoratorId="aab004" label="创办企业名称">
            <ta-input placeholder="" style="width: 212px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选输入统一社会信用代码!' }"
            fieldDecoratorId="aab998"
            label="统一社会信用代码"
          >
            <ta-input placeholder="" style="width: 212px" @blur="aab998Blur" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择企业领域!' }" fieldDecoratorId="adc631" label="企业领域">
            <ta-select collection-type="ADC631" style="width: 212px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选择企业注册时间!' }"
            fieldDecoratorId="aab008"
            label="企业注册时间"
            :fieldDecoratorOptions="{ rules: [{ validator: aab008fnValidate }] }"
          >
            <ta-date-picker placeholder="" valueFormat="YYYY-MM-DD" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选择营业执照注册地!' }"
            fieldDecoratorId="adc636"
            label="营业执照注册地"
          >
            <ta-select collection-type="AAB301_LS" style="width: 212px" :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title">年度信息</div>
        <div class="form-box">
          <ta-form-item :require="{ message: '请选输入申请年度!' }" fieldDecoratorId="adc632" label="申请年度">
            <ta-select placeholder="" style="width: 212px" :disabled="true" collection-type="ADC632" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选择本年度经营开始时间!' }"
            fieldDecoratorId="adc633"
            label="本年度经营开始时间"
            extra="年度经营起止时间需满一年"
            :fieldDecoratorOptions="{ rules: [{ validator: adc633fnValidate }] }"
          >
            <ta-date-picker placeholder="" valueFormat="YYYY-MM-DD" style="width: 212px" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请选择本年度经营结束时间!' }"
            fieldDecoratorId="adc634"
            label="本年度经营结束时间"
            extra="年度经营起止时间需满一年"
            :fieldDecoratorOptions="{ rules: [{ validator: adc634fnValidate }] }"
          >
            <ta-date-picker placeholder="" valueFormat="YYYY-MM-DD" style="width: 212px" :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title" v-if="fileShow2">吸纳人员信息(拉萨籍)</div>
        <div class="form-box" v-if="fileShow2">
          <ta-form-item :require="{ message: '请输入姓名!' }" fieldDecoratorId="x_aac003" label="姓名">
            <ta-input placeholder="" :disabled="true" key="input6" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入身份证号码!' }" fieldDecoratorId="x_yac002" label="身份证号码">
            <ta-input placeholder="" @blur="x_yac002Blur" key="input5" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入毕业时间!' }" fieldDecoratorId="x_aac181" label="毕业时间">
            <ta-input placeholder="" :disabled="true" key="input4" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入入职日期!' }" fieldDecoratorId="x_adc641" label="入职日期">
            <ta-date-picker
              placeholder=""
              valueFormat="YYYY-MM-DD"
              style="width: 212px"
              key="input3"
              :disabled="isDisabled"
            />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请输入此年度截止日期!' }"
            fieldDecoratorId="x_adc642"
            label="此年度截止日期"
          >
            <ta-date-picker
              placeholder=""
              valueFormat="YYYY-MM-DD"
              style="width: 212px"
              key="input1"
              :disabled="isDisabled"
            />
          </ta-form-item>
          <ta-form-item
            :require="{ message: '请输入高考时户籍所在区县!' }"
            fieldDecoratorId="x_ady019"
            label="高考时户籍所在区县"
          >
            <ta-input placeholder="" :disabled="true" key="input2" />
          </ta-form-item>
        </div>
      </ta-form>
    </div>
    <div class="content-box" v-if="fileShow1">
      <div class="sub-title">补助申报材料</div>
      <materialUploadTable
        ref="materialUploadTable1"
        :yda020="yda020_1"
        :yda031="yda031_1"
        :visit="type == 'view' ? true : false"
      />
    </div>
    <div class="content-box" v-if="fileShow2">
      <div class="sub-title">被吸纳人员材料</div>
      <materialUploadTable
        ref="materialUploadTable2"
        :yda020="yda020_2"
        :yda031="yda031_2"
        :visit="type == 'view' ? true : false"
      />
    </div>
    <bankCard :allow-add="true" :params="paramsBankCard" :visible="visibleBank" @onClose="closeBank"></bankCard>
  </div>
</template>

<script>
import materialUploadTable from 'common/components/materialUploadTable.vue'
import bankCard from 'common/components/bankCard.vue'

import moment from 'moment'
export default {
  name: 'grassrootsEntreSubsidyAdd',
  components: { materialUploadTable, bankCard },
  data() {
    return {
      view: false,
      yda020_1: '496',
      yda020_2: '497',
      yda031_1: '',
      yda031_2: '',
      ady019List: [],
      fileShow1: false,
      fileShow2: false,

      paramsBankCard: {},
      visibleBank: false,

      yau002Disabled: false,
      aac181Disabled: false,
      ady019Disabled: false,
      saveBtnDisabled: false,
      adc635Disabled: false,

      isDisabled: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.userInfo = this.$route.params || {}
    this.userInfo.userType = 'UT01'
    this.paramsBankCard = this.userInfo
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { type, adc630, adc640, adc635 } = this.$route.params
      // console.log(type, '-', adc630, '-', adc640)

      this.yda031_1 = adc630
      this.yda031_2 = adc640
      if (adc635 === '02') {
        this.fileShow1 = true
        this.fileShow2 = true
      }
      if (adc635 === '03' || adc635 === '01') {
        this.fileShow1 = true
      }

      this.type = type
      if (type == 'view') {
        this.isDisabled = true
        this.yau002Disabled = true
        this.aac181Disabled = true
        this.ady019Disabled = true
        this.saveBtnDisabled = true
        this.adc635Disabled = true
        this.initView(adc630, adc640)
      } else if (type == 'edit') {
        this.adc635Disabled = true
        this.initEdit(adc630, adc640)
      } else {
        this.initAdd()
      }
    },
    initAdd() {
      const param = {
        no: '325-0006',
        data: JSON.stringify({
          yac002: this.$route.params.certNo,
          aac001: this.$route.params.ext03,
          type: '1',
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { ady019List, map } = res.data
            this.$nextTick(() => {
              this.form.setFieldsValue({
                ...map,
              })
              this.ady019List = ady019List
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    initEdit(adc630, adc640) {
      const param = {
        no: '325-0006',
        data: JSON.stringify({
          yac002: this.$route.params.certNo,
          aac001: this.$route.params.ext03,
          type: '3',
          adc630,
          adc640,
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { ady019List, data } = res.data
            this.$nextTick(() => {
              this.form.setFieldsValue({
                ...data,
              })
              this.ady019List = ady019List
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    initView(adc630, adc640) {
      const param = {
        no: '325-0006',
        data: JSON.stringify({
          yac002: this.$route.params.certNo,
          aac001: this.$route.params.ext03,
          type: '2',
          adc630,
          adc640,
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { ady019List, data } = res.data
            this.$nextTick(() => {
              this.form.setFieldsValue({
                ...data,
              })
              this.ady019List = ady019List
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    autoFormCreate(form) {
      this.form = form
    },
    adc633fnValidate(rule, value, callback) {
      const adc634 = this.form.getFieldValue('adc634')
      const aab008 = this.form.getFieldValue('aab008')

      if (adc634 && value && moment(value).isAfter(moment(adc634))) {
        callback('开始时间不能晚于结束时间')
      } else if (adc634 && value && moment(adc634).diff(moment(value), 'years') < 1) {
        callback('年度经营起止时间需满一年')
      } else if (aab008 && value && moment(value).isBefore(moment(aab008))) {
        callback('开始经营时间不能早于企业注册时间')
      } else {
        // this.form.validateFields(['adc634'], { force: true })
        // this.form.validateFields(['aab008'], { force: true })
        callback()
      }
    },

    adc634fnValidate(rule, value, callback) {
      const adc633 = this.form.getFieldValue('adc633')
      if (adc633 && value && moment(value).isBefore(moment(adc633))) {
        callback('结束时间不能早于开始时间')
      } else if (adc633 && value && moment(value).diff(moment(adc633), 'years') < 1) {
        callback('年度经营起止时间需满一年')
      } else {
        // this.form.validateFields(['adc633'], { force: true })
        callback()
      }
    },

    aab008fnValidate(rule, value, callback) {
      const adc633 = this.form.getFieldValue('adc633')
      if (adc633 && value && moment(value).isAfter(moment(adc633))) {
        callback('企业注册时间不能晚于开始经营时间')
      } else {
        // this.form.validateFields(['adc633'], { force: true })
        callback()
      }
    },

    handleSelectChange(filed, value) {
      if (filed === 'adc635') {
        if (value === '01') {
          this.fileShow1 = true
          this.fileShow2 = false
          this.getStudentInfo(value)
        }
        if (value === '02') {
          this.fileShow2 = true
          this.fileShow1 = true
          this.getStudentInfo(value)
        }
        if (value === '03') {
          this.fileShow1 = true
          this.fileShow2 = false
          this.getStudentInfo(value)
        }
      }
    },
    //获取毕业生信息
    getStudentInfo(adc635) {
      const param = {
        no: '325-0007',
        data: JSON.stringify({
          yac002: this.$route.params.certNo,
          aac001: this.$route.params.ext03,
          // yac002: '542328199901022022',
          // aac001: '100000886009',
          adc635,
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { dy41Info } = res.data

            this.$nextTick(() => {
              if (adc635 === '01') {
                this.ady019Disabled = true
                this.yau002Disabled = true
                this.aac181Disabled = true
                this.form.setFieldsValue({
                  ...dy41Info,
                })
                if (dy41Info.aac181 && moment(dy41Info.aac181).isBefore(moment('2020-01-01'))) {
                  this.$message.warning('创业者毕业时间需在2020-01-01之后（包括2020-01-01）')
                }
              }
              if (adc635 === '02') {
                this.ady019Disabled = true
                this.yau002Disabled = true
                this.aac181Disabled = true
                this.form.setFieldsValue({
                  ...dy41Info,
                  ady019: dy41Info.ady019_s,
                })
                if (dy41Info.aac181 && moment(dy41Info.aac181).isBefore(moment('2020-01-01'))) {
                  this.$message.warning('创业者毕业时间需在2020-01-01之后（包括2020-01-01）')
                }
              }
              if (adc635 === '03') {
                this.ady019Disabled = false
                this.yau002Disabled = false
                this.aac181Disabled = false
                this.form.setFieldsValue({
                  aac181: '',
                  ady019: '',
                  yau002: '',
                })
              }
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    closeBank(data) {
      this.visibleBank = false
      const allData = this.CollectionData('BANKID')
      if (data !== null) {
        const selectedItem = allData.find((item) => item.value === data.aaf200)
        let values = {
          // hyy007: selectedItem.label, //银行类别
          aae010: data.aae010, //银行卡号
          aae009: data.aae009, //开户名称
          // hyy009: data.aae008, //银联号
          aae044: data.aae044, //开户支行银行
          aaf200: data.aaf200, //行别代码
        }
        this.form.setFieldsValue(values)
      }
    },
    aab998Blur(e) {
      const aab998 = e.target.value
      if (!aab998) return
      const param = {
        no: '325-0008',
        data: JSON.stringify({
          aac001: this.$route.params.ext03,
          aab998,
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { adc632 } = res.data
            this.$nextTick(() => {
              this.form.setFieldsValue({
                adc632,
              })
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    x_yac002Blur(e) {
      const x_yac002 = e.target.value
      if (!x_yac002) return
      const param = {
        no: '325-0010',
        data: JSON.stringify({
          x_yac002,
        }),
      }
      this.Base.sendRequest('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { x_aac003, x_aac001, x_yac002, x_ady019, x_aac181 } = res.data.x_yac002[0]
            this.$nextTick(() => {
              this.form.setFieldsValue({
                x_aac003,
                x_aac001,
                x_ady019,
                x_aac181,
              })
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      })
    },
    handleConfirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let fileList = []
          let fileList1 = []
          if (this.fileShow1) {
            fileList = this.$refs.materialUploadTable1.check() || []
          }
          if (this.fileShow2) {
            fileList1 = this.$refs.materialUploadTable2.check() || []
          }
          if (this.fileShow1 && fileList[0].files.length === 0) {
            this.$message.error('请上传必要的材料')
            return
          }
          if (this.fileShow2 && fileList1[0].files.length === 0) {
            this.$message.error('请上传必要的材料')
            return
          }
          // console.log(values, 'values')
          // console.log(fileList, 'fileList')
          // console.log(fileList1, 'fileList1')

          const param = {
            no: '325-0009',
            data: JSON.stringify({
              aac001: this.$route.params.ext03,
              fileList: JSON.stringify(fileList),
              fileList1: JSON.stringify(fileList1),
              ...values,
              aab301: values.adc636,
              adc630: this.yda031_1,
              adc640: this.yda031_2,
            }),
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess) {
              if (res.data.code === '0') {
                this.$message.warning(res.data.msg)
              } else {
                this.$message.success('申报成功')
                this.$router.push({
                  name: 'grassrootsEntreSubsidy',
                })
              }
            } else {
              this.$message.error(res.msg || '申报失败')
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.grassrootsentresubsidyadd {
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
  width: 212px;
}

// /* 针对特定长标签的输入框，保持一致的宽度 */
// .ta-form-item[label-width='230px'] .ta-input {
//   width: 212px;
// }
</style>
