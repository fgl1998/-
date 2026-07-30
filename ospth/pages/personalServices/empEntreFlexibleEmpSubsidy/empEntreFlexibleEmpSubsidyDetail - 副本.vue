<template>
  <div class="living-allowance-add">
    <div class="modal-btn">
      <ta-button type="primary" @click="$router.go(-1)">返回</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryDetailForm = form}" :formLayout="true" label-width="150px"
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
            <ta-input disabled />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入灵活就业地!' }" fieldDecoratorId="hyy003" label="灵活就业地">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择开户银行!' }" fieldDecoratorId="hyy007" label="开户银行">
            <ta-input :disabled="isDisabled" />
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
            <ta-month-picker :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择补贴结束年月!' }" fieldDecoratorId="hyy103" label="补贴结束年月">
            <ta-month-picker :disabled="isDisabled" />
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
        <materialUploadTable ref="materialUploadTable" yda020="478" :yda031="yda031Value" :visit="true" />
      </ta-form>
    </div>
  </div>
</template>

<script>
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  export default {
    name: 'livingAllowanceAdd',
    props: {},
    components: {
      materialUploadTable
    },
    data() {
      return {
        yda031Value: '',
        isDisabled: true,
        queryDetailForm: {},

      }
    },
    created() {
      this.userInfo = this.$route.params || {}
      this.yda031Value = this.userInfo.hyy001
    },
    mounted() {
      this.$nextTick(() => {
        this.init();
      })
    },
    methods: {
      init() {
        if (!this.userInfo.hyy001) {
          this.$message.error('缺少必要参数，无法获取详情！')
          return
        }
        this.loading = true
        const param = {
          no: '478-0012',
          data: JSON.stringify({
            hyy001: this.userInfo.hyy001,
            yae421: this.userInfo.yae421,

          }),
        }
        this.Base.sendRequest('', param, (res) => {
          this.loading = false
          if (res && res.serviceSuccess) {
            let arr = res.data.detailInfo || {}

            // 将日期字符串转换为日期格式
            if (arr.aac006) {
              const date = new Date(arr.aac006);
              // 格式化为YYYY-MM-DD格式
              const formattedDate =
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              arr.aac006 = formattedDate
            }
            if (arr.hyy002) {
              this.getHyy002Data(arr.hyy002)
            }
            this.queryDetailForm.setFieldsValue(arr)
          } else {
            this.$message.error(res.data.msg || '接口查询失败！')
          }
        }, (error) => {
          // 处理请求错误
          this.loading = false
          this.$message.error('网络错误，请稍后重试！')
          console.error('请求详情失败:', error)
        })
      },
      //查找户口所在地
      getHyy002Data(hyy002) {
        const param = {
          no: '478-0009',
          data: JSON.stringify({
            yac002: this.userInfo.yac002 || '',
          }),
        };

        this.Base.sendRequest('', param, (res) => {
          if (res && res.serviceSuccess && res.data.code === '1' && res.data.listtree) {
            this.hyy002Data = res.data.listtree;
            // 根据hyy002值查找对应的name
            if (hyy002) {
              const targetItem = this.hyy002Data.find(item => item.id === hyy002);
              if (targetItem) {
                // 找到对应的数据后，更新表单显示
                this.$nextTick(() => {
                  const currentValue = this.queryDetailForm.getFieldsValue();
                  currentValue.hyy002 = targetItem.name;
                  this.queryDetailForm.setFieldsValue(currentValue);
                });
              }
            }
          }
        });
      },


    },
  }
</script>

<style scoped>
  .living-allowance-add {
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