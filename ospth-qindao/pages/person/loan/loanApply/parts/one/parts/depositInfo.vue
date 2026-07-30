<template>
  <div class="content">
    <!-- 选择codeValue -->
    <!-- 选择时间 -->
    <van-popup v-model="showDateTimeFrame" position="bottom">
      <van-datetime-picker v-if="this.codeValueParam==='khrq'" v-model="currentDate" :max-date="maxDate" type="date" title="选择年月日"
                           @cancel="showDateTimeFrame = false" @confirm="datePickConfirm"/>
      <van-datetime-picker v-else v-model="currentDate" type="year-month" title="选择年月" :max-date="maxDate"
                           @cancel="showDateTimeFrame = false" @confirm="datePickConfirm"/>
    </van-popup>
    <h1 class="title">
      <van-icon name="balance-o"/>
      缴存信息
    </h1>
    <van-cell-group inset :key="dataUpdate">
      <yhSelect :value="personData.dkjchlx"
                :code-values="codeValues.DKJCHLXColumns"
                :required="true"
                @input="(v)=> {personData.dkjchlx = v;keyIndex++}"
                :disabled="this.relShips === 0"
                label="缴存类型"/>
      <!-- 非缴存户不展示这些内容 -->
      <div v-if="personData.dkjchlx !== '03'" :key="keyIndex">
        <van-field label="个人缴存账号(元)" v-model="personData.grzh" input-align="right" :rules="[{required: true,}]"
                   :disabled="personData.dkjchlx === '01'" required placeholder="请填写个人缴存账号"/>
        <van-field label="个人缴存基数(元)" v-model="personData.grjcjs" input-align="right" :rules="[{required: true,}]"
                   :disabled="personData.dkjchlx === '01'" required placeholder="请填写个人缴存基数"/>

        <van-field label="个人缴存比例(%)" v-model="personData.grjcbl" input-align="right" type="digit" :max="12"
                   :rules="[{validator:verifyDepositRatio,message: '个人缴存比例不能大于12%'},{required: true}]"
                   :disabled="personData.dkjchlx === '01'"
                   required placeholder="请填写个人缴存比例"/>

        <van-field label="单位缴存比例(%)" v-model="personData.dwjcbl" input-align="right" type="digit" :max="12"
                   :rules="[{validator:verifyDepositRatio,message: '单位缴存比例不能大于12%'},{required: true}]"
                   :disabled="personData.dkjchlx === '01'"
                   required placeholder="请填写单位缴存比例"/>
        <van-field label="个人月缴存额(元)" v-model="personData.gryjce" input-align="right" :rules="[{required: true,}]"
                   :disabled="personData.dkjchlx === '01'" required placeholder="请填写个人月缴存额"/>
        <van-field label="单位月缴存额(元)"
                   v-model="personData.dwyjce"
                   input-align="right"
                   :rules="[{required: true,}]"
                   :disabled="personData.dkjchlx === '01'"
                   required placeholder="请填写单位月缴存额"/>

        <van-field label="个人账户余额(元)" v-model="personData.grzhye" input-align="right" :rules="[{required: true,}]"
                   :disabled="personData.dkjchlx === '01'" required placeholder="请填写个人账户余额"/>
        <van-field label="近24个月平均缴存基数(元)"
                   v-model="personData.pjjcjs"
                   v-if="personData.glgx !== '71'"
                   :required="personData.glgx !== '71'"
                   input-align="right" :rules="[{required: true,}]"
                   placeholder="请填写近24个月平均缴存基数"/>
      </div>
      <van-field label="个人月收入(元)" v-model="personData.ysr" input-align="right" required :rules="[{ required: true,}]" placeholder="请填写个人月收入"/>
      <!-- 负债月还款额不在网厅展示 -->
      <!-- <van-field label="负债月还款额(元)" v-model="personData.qtjtyjfz" ... /> -->
      <!-- 非缴存户不展示这些内容 -->
      <div v-if="personData.dkjchlx !== '03'">
        <van-field label="开户日期" v-model="personData.khrq" input-align="right"
                   @click="choosekhrq"
                   :disabled="personData.dkjchlx === '01'" :readonly="personData.dkjchlx === '01'" :rules="[{required: true,}]" required placeholder="请选择开户日期"/>
        <van-field label="缴存起始年月" v-model="personData.qsny" input-align="right" @click="choosejzny('qsny')"
                   :disabled="personData.dkjchlx === '01'" :readonly="personData.dkjchlx === '01'"  :rules="[{required: true,}]" required placeholder="请选择缴存起始年月"/>
        <van-field label="连续缴存月数" v-model="personData.lxjcys" input-align="right"
                   :disabled="personData.dkjchlx === '01'"
                   :readonly="personData.dkjchlx === '01'"
                   :rules="[{required: true,}]" required placeholder="请填写连续缴存月数"/>
        <van-field label="最近连续缴存起始年月"
                   v-model="personData.zjlxjcqsny"
                   input-align="right"
                   :disabled="personData.dkjchlx === '01'"
                   :readonly="personData.dkjchlx === '01'"
                   @click="choosejzny('zjlxjcqsny')"
                   :rules="[{required: true,}]" required placeholder="请选择缴存起始年月"/>

        <van-field label="缴至年月" v-model="personData.jzny" input-align="right" @click="choosejzny('jzny')"
                   :readonly="personData.dkjchlx === '01'"
                   :disabled="personData.dkjchlx === '01'" :rules="[{required: true,}]" required placeholder="请选择缴至年月"/>
      </div>
    </van-cell-group>
  </div>
</template>
<script>
import moment from 'moment/moment'
import {mapState} from "vuex";
import yhSelect from '../../../parts/common/yhSelect.vue'
export default {
  name: 'depositInfo',
  props: {
	  relShips: {
	    type: Number
	  },
	  activeName:{
		  type:String
	  },
	  personData:{

	  }
  },
  components:{yhSelect},
  data() {
    return {
      codeValueParam: '',
      // 为了可以重新渲染页面
      dataUpdate:1,
      // 属性的禁用状态
      disabledMap:{},
      showDateTimeFrame: false,
      maxDate: new Date(),
      currentDate: new Date(),
      keyIndex:0
    }
  },
  computed:{
    ...mapState('perloanApply',['codeValues']),
  },
  watch:{
    updateMark() {
      this.initDepositInfo()
    },
    // 切换tabs，更新disabledMap，保证属性的禁用状态正确
    activeName:{
      handler() {
        this.disabledMap = this.personData.disabledMap
      },
    },
  },
  methods: {
    // 初始化缴存信息
    async initDepositInfo() {
      for (const key in this.personData) {
        if ('jzny'.indexOf(key) !== -1 && this.personData[key]) {
          this.personData[key] = moment(this.personData[key].toString()).format('YYYYMM')
        }
      }
      if (!this.personData?.ysr) {
        this.personData.ysr = this.personData.grjcjs
      }
      this.dataUpdate = 2
    },
    datePickConfirm(val) {
      let dateFormat = 'YYYY-MM-DD'
      if (this.codeValueParam === 'jzny') {
        dateFormat = 'YYYYMM'
      }
      if (this.codeValueParam === 'zjlxjcqsny') {
        dateFormat = 'YYYYMM'
      }

      this.personData[this.codeValueParam] = moment(val).format(dateFormat)
      this.showDateTimeFrame = false
    },
    // 校验缴存比例
    verifyDepositRatio(value) {
      // return value <= 12;
    },
    choosekhrq(){
        if(this.personData.dkjchlx !== '01'){
            this.showDateTimeFrame=true;
            this.codeValueParam='khrq'
        }

      },
    choosejzny(val) {
      const validValues = ['qsny', 'jzny','zjlxjcqsny'];
      if (validValues.includes(val) && this.personData.dkjchlx !== '01') {
        this.showDateTimeFrame = true;
        this.codeValueParam = val;
      }
    }
  },
}
</script>
<style scoped lang="less">
.content {
  .title {
    font-size: 15px;
    font-weight: 600;
    color: #323233;
    margin: 16px 16px 12px;
    padding-left: 10px;
    border-left: 4px solid #1677ff;
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 22px;
  }
}

/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
