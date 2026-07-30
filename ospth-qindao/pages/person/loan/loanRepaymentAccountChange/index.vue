<!-- 还款账户变更 -->
<template>
  <common-layout :step-map="stepMap"/>
</template>

<script>
import one from './parts/one.vue'
import ENUMS from '@osppm/common/enum'

const stepMap = [
  {
    title: '逝者信息', component: one, previous: ENUMS.STEP.GO_BACK, next: ENUMS.STEP.FINISH,
    authType: ENUMS.AUTH_TYPE.FACE_OR_SMS,
  },
]
export default {
  name: 'loanRepaymentAccountChange',
  data() {
    return {
      stepMap,
      formData: {
        accountBank: '',
        accountType: '1',
        isMainDeductCard: '',
        relationType: '',
        repayAccountName: '',
        repayAccountNo: '',
        repayAccountNoConfirm: '',
      },
      formConfig: {
        fields: [
          {
            type: 'select',
            name: 'accountBank',
            label: '账户开户行',
            labelWidth: '280rpx',
            required: true,
            options: [
              {label: '工商银行', value: '1'},
              {label: '建设银行', value: '2'},
            ],
          },
          {
            type: 'select',
            name: 'accountType',
            label: '账户种类',
            labelWidth: '280rpx',
            required: true,
            options: [
              {label: '银行卡', value: '1'},
              {label: '数字人民币', value: '2'},
            ],
          },
          {
            type: 'select',
            name: 'isMainDeductCard',
            label: '是否主扣款卡',
            labelWidth: '280rpx',
            required: true,
            options: [
              {label: '是', value: '1'},
              {label: '否', value: '0'},
            ],
          },
          {
            type: 'select',
            name: 'relationType',
            label: '关联关系',
            labelWidth: '280rpx',
            required: true,
            options: [
              {label: '本人', value: '1'},
              {label: '配偶', value: '2'},
              {label: '父母', value: '3'},
              {label: '子女', value: '4'},
            ],
          },
          {
            type: 'input',
            name: 'repayAccountName',
            label: '还款账户名称',
            labelWidth: '280rpx',
            required: true,
          },
          {
            type: 'input',
            name: 'repayAccountNo',
            label: '还款账号',
            labelWidth: '280rpx',
            required: true,
            placeholder: '请输入银行卡号',
          },
          {
            type: 'input',
            name: 'repayAccountNoConfirm',
            label: '还款账号确认',
            labelWidth: '280rpx',
            required: true,
            placeholder: '请输入银行卡号',
          },
        ],
      },
    }
  },
  methods: {
    handleAdd() {
      uni.showToast({
        title: '已添加',
        icon: 'none',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  padding: 24rpx;
  padding-top: calc(24rpx + env(safe-area-inset-top));
  background: #f5f5f5;
  box-sizing: border-box;
}

.page_title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.form {
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
}

.btn_wrap {
  padding: 0 24rpx 24rpx;
}

.add_btn {
  width: 260rpx;
  height: 72rpx;
}
</style>
