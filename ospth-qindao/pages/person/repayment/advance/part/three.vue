<template>
  <!-- 还款计算主容器 -->
  <div class="content">
    <!-- 表单组件，设置validate-first表示第一个验证失败就停止验证 -->
    <van-form validate-first ref="infoForm">
      <!-- 表单字段分组，设置内边距 -->
      <van-cell-group inset style="padding: 24px 0">
        <!-- 顶部图片展示 -->
        <div class="img">
          <img :src="require('@/assets/images/common/digitalCurrency.svg')">
        </div>

        <!-- 还款提示组件 -->
        <repayment-tip :repayment-pay-type="repaymentPayType"
                       :repaymentAccount="bankInfo?.repaymentAccount"
                       :estimatedTime="estimatedTime"/>

        <!-- 还款金额输入框 -->
        <van-field v-model="repaymentMoneyInfo.repaymentAmount"
                   placeholder="请输入还款金额"
                   type="digit"
                   @blur="calculate"
                   :rules="[{ required: true}]"
                   input-align="right"
                   required
                   label="提前还款本金(元)"/>

        <!-- 提前偿还利息展示字段（只读） -->
        <van-field :value="repaymentMoneyInfo.advancePaymentRateMny"
                   label="提前偿还利息(元)"
                   input-align="right"
                   :disabled="true"/>

        <!-- 按月还款金额展示字段（只读） -->
        <van-field :value="repaymentMoneyInfo.monthlyRepaymentAmount"
                   label="按月还款金额(元)"
                   input-align="right"
                   :disabled="true"/>

        <!-- 本次还款合计展示字段（只读） -->
        <van-field :value="repaymentMoneyInfo.loanRepaymentAmount"
                   label="本次还款合计(元)"
                   input-align="right"
                   :disabled="true"/>
      </van-cell-group>

      <!-- 还款后信息分组 -->
      <van-cell-group inset title="还款后信息">
        <!-- 还款后还款期数展示 -->
        <van-field :value="repaymentMoneyInfo.repaymentAftLoanMonth"
                   label="还款后还款期数"
                   input-align="right"
                   :disabled="true"/>

        <!-- 下月应还本金展示 -->
        <van-field :value="repaymentMoneyInfo.nextMonthRepaymentPrincipal"
                   label="下月应还本金(元)"
                   input-align="right"
                   :disabled="true"/>

        <!-- 下月应还利息展示 -->
        <van-field :value="repaymentMoneyInfo.nextMonthRateMny"
                   label="下月应还利息(元)"
                   input-align="right"
                   :disabled="true"/>

        <!-- 下月应还总额展示 -->
        <van-field :value="repaymentMoneyInfo.nextMonthRepaymentTotal"
                   label="下月应还总额(元)"
                   input-align="right"
                   :disabled="true"/>
      </van-cell-group>
    </van-form>

    <!-- 电子签名组件 -->
    <yunXinQian
        ref="yunXinQian"
        :key="updateIndex"
        :value="signFlag"
        :reportParams="reportParams"
        :loanFlag="true"
        :reportTitle="reportTitle"
        @input="setSignFlag"
        @signSuccess="signSuccess"
    />

    <!-- 下一步按钮组件 -->
    <hf-next-btn @nextStep="goNextStep"/>
  </div>
</template>

<script>
// 引入Vuex辅助函数
import {mapActions, mapMutations, mapState} from 'vuex'
// 引入子组件
import RepaymentTip from '@/views/repayment/part/repaymentTip.vue'
import YunXinQian from '@/components/yunXinQian/index.vue'

export default {
  name: 'three',  // 组件名称
  components: {YunXinQian, RepaymentTip},  // 注册子组件

  // 组件数据
  data() {
    return {
      tmpRepaymentAmount: undefined,  // 临时存储还款金额用于比较
      updateIndex: 0  // 用于强制更新签名组件的索引
    }
  },

  // 计算属性
  computed: {
    // 从Vuex的advanceRepayment模块映射状态
    ...mapState('advanceRepayment', [
      'loanInfo',           // 贷款信息
      'repaymentMoneyInfo', // 还款金额信息
      'stepNum',            // 步骤编号
      'repaymentPayType',   // 还款支付类型
      'bankInfo',           // 银行卡信息
      'reportTitle',        // 报表标题
      'estimatedTime',      //代扣时间
      'signFlag'            // 签名标志
    ])
  },

  // 生命周期钩子
  async mounted() {
    // 初始化时清空还款金额信息
    this.setRepaymentMoneyInfo({})
  },

  // 组件方法
  methods: {
    // 从Vuex映射actions
    ...mapActions('advanceRepayment', [
      'loanRepaymentCalculate',      // 计算还款金额
      'downloadReportParam',         // 下载报表参数
      'computeTheNextPaymentDue',     // 计算下一还款周期金额
      'submitRepaymentBusiness'
    ]),

    // 从Vuex映射mutations
    ...mapMutations('advanceRepayment', [
      'setStepNum',           // 设置步骤编号
      'setSignFlag',          // 设置签名标志
      'setRepaymentMoneyInfo', // 设置还款金额信息
      'setSignReportData',
    ]),

    // 处理下一步操作
    goNextStep() {
      // 验证表单
      this.$refs.infoForm.validate().then(async () => {
        // 检查是否已签名
        if (!this.signFlag) {
          this.$toast.fail(`请先阅读并勾选《${this.reportTitle}》`)
          return
        }
        this.$dialog.confirm({
          title:'温馨提示',
          message:'业务提交后将自动办结生效，是否办理该业务。'
        }).then(()=>{
          this.submit()
        })
      })
    },

    // 计算还款金额方法
    async calculate() {
      try {
        // 检查是否有输入还款金额
        if (!this.repaymentMoneyInfo.repaymentAmount) {
          return
        }

        // 判断还款金额是否变化，决定是否需要重新签名
        this.setSignFlag(this.tmpRepaymentAmount === this.repaymentMoneyInfo.repaymentAmount)

        // 保存当前还款金额用于下次比较
        this.tmpRepaymentAmount = this.repaymentMoneyInfo.repaymentAmount

        // 调用计算还款金额的action
        await this.loanRepaymentCalculate()

        // 调用计算下一还款周期金额的action
        await this.computeTheNextPaymentDue()
      } catch (e) {
        // 出错时清空还款金额信息并显示错误提示
        this.setRepaymentMoneyInfo({})
        this.$dialog.alert({
          title: '温馨提示',
          message: e,
        })
      } finally {
        // 无论成功失败都更新组件索引，强制刷新签名组件
        this.updateIndex++
      }
    },

    // 获取报表参数
    reportParams() {
      // 检查是否有还款后下月应还总额
      if (!this.repaymentMoneyInfo.nextMonthRepaymentTotal) {
        this.$toast.fail('请先输入还款金额，进行还款计算')
        this.$refs.infoForm.validate().then(async () => {
        })
        return null
      }
      // 返回报表参数
      return this.downloadReportParam()
    },

    signSuccess(value) {
      this.setSignReportData(value)
    },

    async submit() {
      try {
        await this.submitRepaymentBusiness()
        this.setStepNum(this.stepNum + 1)
      } catch (e) {
        this.$dialog.alert({
          title: '温馨提示',
          message: e
        })
      }
    }
  },
}
</script>

<style scoped lang="less">
/* 主内容区域样式 */
.content {
  padding-top: 1rem;
}

/* 图片容器样式 */
.img {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;

  /* 图片样式 */

  img {
    width: 60%;
  }
}

/* 深度选择器修改字段标签宽度 */
/deep/ .van-field__label {
  width: 8rem;
}
</style>
