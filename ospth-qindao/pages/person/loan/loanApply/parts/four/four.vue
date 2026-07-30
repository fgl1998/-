<template>
  <div class="step_container">
    <!-- ===== 已登记记录区域 ===== -->
    <div class="section" v-if="transferList.length">
      <h1 class="title">
        <van-icon name="gold-coin-o" />
        首付款转账清单
        <span class="tag tag--server">已登记</span>
      </h1>
      <div class="record-card" v-for="(item, index) in transferList" :key="'srv' + index">
        <div class="card-row"><span class="card-label">姓名</span><span class="card-value">{{ item.name || '--' }}</span></div>
        <div class="card-row"><span class="card-label">证件类型</span><span class="card-value">{{ getCodeLabel(codeValues.GRZJLXColumns, item.cardType) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">证件号码</span><span class="card-value">{{ item.cardNo || '--' }}</span></div>
        <div class="card-row"><span class="card-label">关联对象</span><span class="card-value">{{ getCodeLabel(gldxOptions, item.relationObj) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">家庭关系</span><span class="card-value">{{ getCodeLabel(jtgxOptions, item.familyRelation) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">已提取金额</span><span class="card-value">{{ item.extractedAmount || '0' }}元</span></div>
        <div class="card-row card-row--editable">
          <span class="card-label">拟提取金额</span>
          <span class="card-value card-value--input">
            <input v-model="item.extractAmount" type="number" class="amount-input" placeholder="请输入" />&nbsp;元
          </span>
        </div>
        <div class="card-hint">
          <van-icon name="info-o" size="12" />
          已登记记录不可删除，仅可修改拟提取金额
        </div>
      </div>
    </div>

    <!-- ===== 本地新增未保存记录 ===== -->
    <div class="section" v-if="newTransferList.length">
      <h1 class="title">
        <van-icon name="clock-o" />
        待保存记录
        <span class="tag tag--local">未保存</span>
      </h1>
      <div class="record-card record-card--new" v-for="(item, index) in newTransferList" :key="'new' + index">
        <div class="card-row"><span class="card-label">姓名</span><span class="card-value">{{ item.name || '--' }}</span></div>
        <div class="card-row"><span class="card-label">证件类型</span><span class="card-value">{{ getCodeLabel(codeValues.GRZJLXColumns, item.cardType) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">证件号码</span><span class="card-value">{{ item.cardNo || '--' }}</span></div>
        <div class="card-row"><span class="card-label">关联对象</span><span class="card-value">{{ getCodeLabel(gldxOptions, item.relationObj) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">家庭关系</span><span class="card-value">{{ getCodeLabel(jtgxOptions, item.familyRelation) || '--' }}</span></div>
        <div class="card-row"><span class="card-label">拟提取金额</span><span class="card-value">{{ item.extractAmount || '0' }}元</span></div>
        <van-button size="small" type="danger" plain hairline class="card-del-btn" @click="deleteNewRecord(index)">
          删除此条
        </van-button>
      </div>
    </div>

    <!-- ===== 空状态 ===== -->
    <van-empty v-if="!transferList.length && !newTransferList.length" description="暂无转账记录，请在下方添加" />

    <!-- ===== 新增家庭成员表单 ===== -->
    <div class="section form-section">
      <h1 class="title">
        <van-icon name="add-o" />
        添加家庭成员
      </h1>
      <van-form validate-first ref="inputForm">
        <van-cell-group inset>
          <van-field label="姓名" v-model="formData.name" input-align="right"
            :rules="[{required: true, message: '请填写姓名'}]" required placeholder="请填写姓名" />
          <yhSelect :value="formData.cardType" :code-values="codeValues.GRZJLXColumns" :required="true"
            @input="(v) => formData.cardType = v" label="证件类型" />
          <van-field label="证件号码" v-model="formData.cardNo" input-align="right"
            :rules="[{required: true, message: '请填写证件号码'}]" required placeholder="请填写证件号码" />
          <yhSelect :value="formData.relationObj" :code-values="gldxOptions" :required="true"
            @input="(v) => formData.relationObj = v" label="关联对象" />
          <yhSelect :value="formData.familyRelation" :code-values="jtgxOptions" :required="true"
            @input="(v) => formData.familyRelation = v" label="家庭关系" />
          <van-field label="拟提取金额" v-model="formData.extractAmount" input-align="right"
            type="number" :rules="[{required: true, message: '请填写提取金额'}]" required placeholder="请填写金额" >
            <template #extra>元</template>
          </van-field>
        </van-cell-group>
        <div class="form-submit">
          <van-button round block type="info" @click="addNewRecord">确认添加</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import yhSelect from '../../parts/common/yhSelect.vue'

export default {
  name: 'LoanDownPayment',
  components: { yhSelect },
  data() {
    return {
      newTransferList: [],
      formData: {
        name: '',
        cardType: '',
        cardNo: '',
        relationObj: '',
        familyRelation: '',
        extractAmount: '',
      },
      gldxOptions: [
        { value: '01', label: '本人' },
        { value: '02', label: '配偶' },
        { value: '03', label: '父母' },
        { value: '04', label: '子女' },
        { value: '05', label: '其他' },
      ],
      jtgxOptions: [
        { value: '01', label: '本人' },
        { value: '02', label: '配偶' },
        { value: '03', label: '父母' },
        { value: '04', label: '子女' },
        { value: '05', label: '兄弟姐妹' },
        { value: '06', label: '祖父母/外祖父母' },
        { value: '07', label: '孙子女/外孙子女' },
        { value: '99', label: '其他' },
      ],
    }
  },
  computed: {
    ...mapState('perloanApply', ['transferList', 'dkywh', 'codeValues']),
  },
  mounted() {
    this.queryTransferRecords()
  },
  methods: {
    ...mapActions('perloanApply', ['saveDownPaymentTransfer', 'queryDownPaymentTransfer']),

    getCodeLabel(list, value) {
      return (list || []).find(item => item.value === value)?.label || value
    },

    async queryTransferRecords() {
      if (!this.dkywh) return
      await this.queryDownPaymentTransfer({ dkywh: this.dkywh })
    },

    addNewRecord() {
      this.$refs.inputForm.validate().then(() => {
        const record = { ...this.formData, extractedAmount: '0' }
        this.newTransferList.push(record)
        this.formData = { name: '', cardType: '', cardNo: '', relationObj: '', familyRelation: '', extractAmount: '' }
        this.$toast.success('记录已添加')
      })
    },

    deleteNewRecord(index) {
      this.newTransferList.splice(index, 1)
      this.$toast.success('已删除')
    },

    async formValidate() {
      const { name, cardNo, extractAmount } = this.formData
      if (!name && !cardNo && !extractAmount) return true
      try {
        await this.$refs.inputForm.validate()
        return true
      } catch {
        return false
      }
    },

    async beforeNext() {
      try {
        const allRecords = [...this.transferList, ...this.newTransferList]
        if (allRecords.length > 0) {
          await this.saveDownPaymentTransfer({
            dkywh: this.dkywh,
            transferList: allRecords,
          })
        }
        return true
      } catch (err) {
        this.$toast(err)
        return false
      }
    },
  },
}
</script>

<style scoped lang="less">
.step_container {
  padding: 0 0 20px;
}

/* 区块 */
.section {
  margin-bottom: 20px;
}

/* 标题 */
.title {
  font-size: 15px;
  font-weight: 600;
  color: #323233;
  margin: 16px 16px 12px;
  padding-left: 10px;
  border-left: 4px solid #1677ff;
  line-height: 22px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 标签 */
.tag {
  font-size: 11px;
  font-weight: 500;
  padding: 1px 8px;
  border-radius: 10px;
  margin-left: 6px;
  line-height: 18px;
}
.tag--server {
  color: #1677ff;
  background: #e6f4ff;
}
.tag--local {
  color: #ff7d00;
  background: #fff7e6;
}

/* 记录卡片 */
.record-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.record-card--new {
  border-left: 3px solid #ff7d00;
}

/* 卡片行 */
.card-row {
  display: flex;
  align-items: center;
  line-height: 28px;
  font-size: 14px;
}
.card-label {
  width: 80px;
  flex-shrink: 0;
  color: #969799;
}
.card-value {
  flex: 1;
  text-align: right;
  color: #323233;
  min-width: 0;
}
.card-row--editable {
  align-items: center;
}
.card-value--input {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 拟提取金额输入框 */
.amount-input {
  width: 80px;
  max-width: 40%;
  text-align: right;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 14px;
  color: #1677ff;
  background: #fafafa;
  outline: none;
  &:focus {
    border-color: #1677ff;
    background: #fff;
  }
}

/* 卡片提示 */
.card-hint {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ebedf0;
  font-size: 12px;
  color: #969799;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 删除按钮 */
.card-del-btn {
  margin-top: 8px;
}

/* 表单区域 */
.form-section {
  margin-top: 4px;
  /deep/ .van-field__label {
    min-width: 7rem;
  }
}

/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.form-submit {
  padding: 12px 16px 0;
}
</style>
