<template>
  <div class="emp-entre-flexible-emp-subsidy-apply">
    <div class="modal-btn">
      <ta-button type="primary" @click="handleRead">阅读承诺书</ta-button>
      <ta-button type="primary" @click="handleConfirm" :disabled="isDisabled">申请</ta-button>
      <ta-button @click="handleReset">重置</ta-button>
      <ta-button @click="$router.go(-1)">返回</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
        layout="inline">
        <div class="tips">
          注：请将户口所在地选择到市县(区)，所选户口所在地即为审核地<br />
          注：申请就业困难人员灵活就业人员社保补贴，须认定就业困难人员+就业登记<br />
          注：高校毕业生申请就业困难人员灵活就业人员社保补贴，毕业时间须不超过两年<br />
          注：补贴金额按养老所缴纳金额的2/3补贴;女性年龄小于40岁，男性年龄小于50只能申请3次，女性年龄大于等于40岁，男性年龄大于等于50岁可申请5次<br />
        </div>
        <div class="sub-title">人员信息</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="hyy001" label="就业困难人员灵活就业补贴明细流水号" v-show="false" />
          <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false" />
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac002" label="身份证号码">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac004" label="性别">
            <ta-select disabled collection-type="AAC004" style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac005" label="民族">
            <ta-select disabled collection-type="AAC005" style="width: 178px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac006" label="出生日期">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac011" label="文化程度">
            <ta-select disabled collection-type="AAC011" style="width: 178px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择户口所在地!' }" fieldDecoratorId="hyy002" label="户口所在地">
            <hyy002-select-tree ref="hyy002SelectTree" v-model="hyy002Value" :data="hyy002Data" :disabled="isDisabled"
              :showSearch="true" placeholder="请选择就业登记地" @change="handleHyy002Change" style="width: 178px;" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入灵活就业地!' }" fieldDecoratorId="hyy003" label="灵活就业地">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择开户银行!' }" fieldDecoratorId="hyy007" label="开户银行">
            <ta-input @click="visibleBank = true" :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入银行卡户名!' }" fieldDecoratorId="hyy006" label="银行卡户名">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择开户支行银行!' }" fieldDecoratorId="hyy008" label="开户支行银行">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入银行账号!' }" fieldDecoratorId="hyy009" label="银行联行号" v-show="false" />
          <ta-form-item :require="{ message: '请输入银行账号!' }" fieldDecoratorId="hyy010" label="银行账号">
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择就业困难人员类型!' }" fieldDecoratorId="hyy012" label="就业困难人员类型">
            <ta-select :disabled="isDisabled" collection-type="YCC131_RD" style="width: 178px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入灵活就业内容!' }" fieldDecoratorId="hyy004" label="灵活就业内容">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
        </div>
        <div class="sub-title">补贴信息</div>
        <div class="form-box">
          <ta-form-item :require="{ message: '请选择补贴开始年月!' }" fieldDecoratorId="hyy102" label="补贴开始年月">
            <ta-month-picker :disabled="isDisabled" @change="fnChangsbStart" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择补贴结束年月!' }" fieldDecoratorId="hyy103" label="补贴结束年月">
            <ta-month-picker :disabled="isDisabled" @change="fnChangsbEnd" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy104" label="养老缴费金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy104_bt" label="养老补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy114" label="医疗缴费金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy114_bt" label="医疗补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy124" label="失业缴费金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy124_bt" label="失业补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy134" label="工伤缴费金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy134_bt" label="工伤补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy144" label="生育缴费金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy144_bt" label="生育补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy200" label="总补贴金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="hyy200_bt" label="补贴总金额" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="enjoymonth" label="预计可享受月数" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="months" label="申请总月数" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="sjmonths" label="实际缴费月数" require>
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="leavemonth" label="剩余享受月数" require>
            <ta-input disabled />
          </ta-form-item>
        </div>
        <div class="sub-title">上传材料</div>
        <materialUploadTable ref="materialUploadTable" yda020="478" />
      </ta-form>
    </div>

    <ta-modal v-model="visibleCommit" :destroy-on-close="true" :draggable="true" :footer="null" height="350px"
      maskClosable title="个人申请灵活就业社会保险补贴承诺书" width="700px">
      <div class="tips" style="text-align: center; line-height: 1.8; padding: 20px 0;">
        本人灵活就业，以灵活就业人员身份缴纳社会保险，未与任何单位签订《劳动合同》或形成事实劳动关系，以上表格所填社会保险待遇信息准确，现申请社会保险补贴。本人承诺以上内容真实有效，如与实际情况不一致，愿承担相应法律责任
      </div>
      <ta-radio-group v-model="radioValue" name="radioGroup"
        style="display: flex; justify-content: center; margin: 20px 0;">
        <ta-radio :value="1">我已阅读并接受</ta-radio>
        <ta-radio :value="2">我不接受</ta-radio>
      </ta-radio-group>
      <div class="modal-btn" style="text-align: center;">
        <ta-button type="primary" @click="handleCommit">确定</ta-button>
        <ta-button @click="visibleCommit = false">取消</ta-button>
      </div>
    </ta-modal>
    <bankCard :allow-add="true" :params="paramsBankCard" :visible="visibleBank" @onClose="closeBank"></bankCard>

  </div>
</template>

<script>
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  import bankCard from 'common/components/bankCard.vue'
  import hyy002SelectTree from '@/common/components/hyy002SelectTree.vue'
  import moment from 'moment'
  export default {
    name: 'empEntreFlexibleEmpSubsidyApply',
    props: {},
    components: {
      materialUploadTable,
      bankCard,
      hyy002SelectTree
    },
    data() {
      return {
        hyy102Date: '', //补贴开始年月
        hyy103Date: '', //补贴结束年月
        hyy002Data: [],
        hyy002Value: '', // 选中的就业登记地值
        hyy002DESC: '',
        queryForm: {},
        paramsBankCard: {},
        visibleBank: false,
        isDisabled: false,
        visibleCommit: false,
        hasReadCommitment: false, // 标记用户是否已阅读承诺书
        commitmentSelection: '', // 承诺书选择结果
        radioValue: '', // 单选按钮组的值
      }
    },
    created() {
      this.userInfo = this.$route.params || {}
      this.userInfo.userType = 'UT01'
      this.paramsBankCard = this.userInfo
    },
    mounted() {
      this.$nextTick(() => {
        this.init();
        this.initHyy002Data();
      })
    },
    methods: {
      init() {
        const param = {
          no: '478-0008',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
            aac001: this.userInfo.ext03
          }),
        }
        Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '1') {
              let forms = res.data.info
              this.queryForm.setFieldsValue(forms)
            }
            if (res.data.code === '0') {
              this.$message.error(res.data.msg)
              this.isDisabled = res.data.form1 == 'disabled' ? true : false
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 初始化就业地数据
      async initHyy002Data() {
        const selectTree = this.$refs.hyy002SelectTree;
        if (selectTree && selectTree.queryHyy002Data) {
          try {
            // 调用组件内置的查询方法，传入证件号码
            this.hyy002Data = await selectTree.queryHyy002Data(this.userInfo.certNo);

            // 检查数据是否成功获取
            if (!this.hyy002Data || this.hyy002Data.length === 0) {
              console.warn('未获取到就业地数据，使用备用数据');
              this.$message.error('获取就业地数据失败');
            }
          } catch (error) {
            console.error('初始化就业地数据失败:', error);
            this.$message.error('获取就业地数据失败，使用默认数据');
          }
        } else {
          console.warn('未找到hyy002SelectTree组件或queryHyy002Data方法');
        }
      },
      // 处理就业登记地选择变化
      handleHyy002Change(selected) {
        if (selected && selected.value && selected.label) {
          // 更新表单中的就业单位区域字段
          if (this.queryForm && this.queryForm.setFieldsValue) {
            this.queryForm.setFieldsValue({
              hyy002: selected.label,
            });
          }
          this.hyy002DESC = selected.label
        }
      },
      handleReset() {},
      handleRead() {
        this.visibleCommit = true
        this.hasReadCommitment = true // 用户点击阅读承诺书，标记为已阅读
      },
      closeBank(data) {
        this.visibleBank = false
        const allData = this.CollectionData('BANKID')
        if (data !== null) {
          const selectedItem = allData.find(item => item.value === data.aaf200)
          let values = {
            'hyy007': selectedItem.label, //银行类别
            'hyy010': data.aae010, //银行卡号
            'hyy006': data.aae009, //开户名称
            'hyy009': data.aae008, //银联号
            'hyy008': data.aae044 //开户支行银行
          }
          this.queryForm.setFieldsValue(values);
        }
      },
      fnChangsbStart(date, dateStr) {
        this.hyy102Date = dateStr
      },
      fnChangsbEnd(date, dateStr) {
        this.hyy103Date = dateStr
        this.fnChangsb()
      },
      // 社保时间校验
      fnChangsb() {
        // 获取补贴开始和结束年月
        const hyy102 = this.hyy102Date
        const hyy103 = this.hyy103Date

        // 检查日期是否都已选择
        if (hyy102 && hyy103) {
          // 转换日期字符串为Date对象进行准确比较
          // 假设日期格式为'YYYYMM'，转换为YYYY年MM月01日进行比较
          const startDate = new Date(
            parseInt(hyy102.substring(0, 4)),
            parseInt(hyy102.substring(4, 6)) - 1,
            1
          );
          const endDate = new Date(
            parseInt(hyy103.substring(0, 4)),
            parseInt(hyy103.substring(4, 6)) - 1,
            1
          );

          // 校验结束日期不能早于开始日期
          if (endDate < startDate) {
            this.$message.error('补贴申请结束日期不能早于申请开始日期!')
            this.hyy103Date = ''
            this.queryForm.setFieldsValue({
              'hyy103': ''
            })
            return
          }

          // 计算申请总月数
          const hyy103year = parseInt(hyy103.substring(0, 4))
          const hyy103mon = parseInt(hyy103.substring(4, 6))
          const hyy103month = hyy103year * 12 + hyy103mon

          const hyy102year = parseInt(hyy102.substring(0, 4))
          const hyy102mon = parseInt(hyy102.substring(4, 6))
          const hyy102month = hyy102year * 12 + hyy102mon

          const months = hyy103month - hyy102month + 1
          this.queryForm.setFieldsValue({
            'months': months
          })

          // 获取申请人信息
          const yac002 = this.queryForm.getFieldValue('yac002')
          const aac003 = this.queryForm.getFieldValue('aac003')
          const aac006 = this.queryForm.getFieldValue('aac006')

          // 检查申请人信息是否完整
          if (yac002 && aac003) {
            // 准备参数调用社保数据接口
            const param = {
              no: '478-0010',
              data: JSON.stringify({
                hyy102: hyy102,
                hyy103: hyy103,
                yac002: yac002,
                aac003: aac003,
                aac006: aac006
              }),
            }
            Base.sendRequest('', param, (res) => {
              if (res.serviceSuccess) {
                // 处理接口返回的社保数据
                if (res.data.code === '1' && res.data.maplh) {
                  this.queryForm.setFieldsValue(res.data.maplh)
                }
                if (res.data.code === '0') {
                  this.$message.error(res.data.msg)
                  this.queryForm.setFieldsValue({
                    'hyy104': '10.00',
                    'hyy104_bt': '12',
                    'hyy114': '11',
                    'hyy114_bt': '21',
                    'hyy124': '23',
                    'hyy124_bt': '44',
                    'hyy134': '55',
                    'hyy134_bt': '66',
                    'hyy144': '222',
                    'hyy144_bt': '111',
                    'hyy200': '11123',
                    'hyy200_bt': '5545',
                    'enjoymonth': '2',
                    'months': '3',
                    'sjmonths': '1',
                    'leavemonth': '1',
                  })
                }
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else {
            this.$message.error('申请人信息不能为空!')
            this.hyy102Date = ''
            this.hyy103Date = ''
            this.queryForm.setFieldsValue({
              'hyy102': '',
              'hyy103': '',
              'months': ''
            })
          }
        }
      },
      handleConfirm() {
        // 只有用户已阅读并接受承诺书才能申请
        if (!this.hasReadCommitment || this.commitmentSelection !== 'accepted') {
          this.$message.warning('请先阅读并接受承诺书');
          this.visibleCommit = true; // 打开承诺书弹窗
          return;
        }
        this.queryForm.validateFields((err, values) => {
          if (err) {
            return; // 表单验证失败时直接返回
          }
          values.hyy002 = values.hyy002.value
          values.hyy102 = moment(values.hyy102).format('YYYYMMDD')
          values.hyy103 = moment(values.hyy103).format('YYYYMMDD')
          values.aac001 = this.userInfo.ext03
          values.aae017 = values.hyy002
          const fileList = this.$refs.materialUploadTable.check() || []
          if (fileList[0].files.length === 0) {
            this.$message.error('请上传必要的材料');
            return;
          }
          const param = {
            no: '478-0011',
            data: JSON.stringify({
              ...values,
              fileList: JSON.stringify(fileList),
            })
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success(res.data.msg || '保存成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 5000)
            }
          }, (error) => {
            // 添加失败回调，处理网络错误等情况
            this.$message.error(res.message ||'网络异常，请稍后重试')
            console.error('请求失败:', error)
          })
        })

      },
      handleCommit() {
        // 使用Vue绑定的radioValue获取用户选择
        const selection = this.radioValue;
        console.log(selection, 'selection');

        if (selection === 1) {
          // 用户选择了"我已阅读并接受"
          this.hasReadCommitment = true;
          this.commitmentSelection = 'accepted';
          this.isDisabled = false
          this.visibleCommit = false;
          this.handleConfirm()
        } else if (selection === 2) {
          // 用户选择了"我不接受"
          this.hasReadCommitment = true;
          this.commitmentSelection = 'rejected';
          this.isDisabled = true
          this.$message.warning('您已拒绝承诺书，无法继续申请');
        } else {
          this.$message.warning('请选择是否接受承诺书');
          return;
        }
        this.visibleCommit = false;
      }

    },
  }
</script>

<style scoped>
  .emp-entre-flexible-emp-subsidy-apply {
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