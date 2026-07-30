<template>
  <van-cell-group inset>
    <div class="title">
      <span class="title-rectangle"></span>
      <span>选择还款资金账户</span>
    </div>
    <div v-if="bankList.length !== 0">
      <p class="bank-name">
        <span class="icon"/>银行卡
      </p>
      <van-radio-group v-model="selBankCard" @change="val => change(val)">
        <van-cell v-for="item in bankList" :key="item.repaymentAccount.value" clickable @click="selBankCard = item">
          <template #right-icon>
            <van-radio :name="item"/>
          </template>
          <template #title>
            <img :src="`${require(`@/assets/images/bankIcon/${item.IconBg.icon}.png`)}`" alt=""/>
            <span>
              {{ item.repayAccountType | descEmptyToLine }}（{{ item.repaymentAccount.value | middleFormat }}）
            </span>
          </template>
        </van-cell>
      </van-radio-group>
    </div>

    <div v-show="digitalList.length !== 0">
      <p class="digital-name">
        <span class="icon"/>数字人民币
      </p>
      <van-radio-group v-model="selBankCard" @change="val => change(val)">
        <van-cell v-for="item in digitalList" :key="item.repaymentAccount.value" clickable @click="selBankCard = item">
          <template #title>
            <img :src="`${require(`@/assets/images/bankIcon/${item.IconBg.icon}.png`)}`" alt=""/>
            <span>
              {{ item.repayAccountType | descEmptyToLine }}（{{ item.repaymentAccount.value | middleFormat }}）
            </span>
          </template>
          <template #right-icon>
            <van-radio :name="item"/>
          </template>
        </van-cell>
      </van-radio-group>
    </div>

    <van-cell v-if="repaymentMethod==='05'" title="代扣时间" :value="estimatedDate" @click="showPicker = true" />

    <van-calendar v-model="showPicker" color="#4888FE" title="代扣时间"
                  :min-date="minDate"
                  :max-date="maxDate"
                  @confirm="estimatedConfirm"
                  :show-confirm="false"/>
  </van-cell-group>
</template>

<script>

// 银行码值：银行图标，图标大小，背景图标
import {mapActions, mapMutations} from 'vuex'
import moment from 'moment/moment'

const bankIconBgObj = {
  102: {icon: 'gs'}, // 工商银行
  103: {icon: 'nh'}, // 农业银行
  104: {icon: 'zg'}, // 中国银行
  105: {icon: 'js'}, // 建设银行
  301: {icon: 'jt'}, // 交通银行
  303: {icon: 'gd'}, // 光大银行
  306: {icon: 'gf'}, // 广发行
  313: {icon: 'ny'}, // 南粤银行
  402: {icon: 'nxs'}, // 农信社
  999: {icon: 'other'}, // 其他银行
}
export default {
  name: 'bankInfo',
  props: ['bankCardList', 'repaymentMethod', 'nextPayTime'],
  data() {
    return {
      // 选中的银行卡信息
      selBankCard: null,
      // 银行卡信息
      bankList: [],
      // 数字银行卡信息
      digitalList: [],
      showPicker: false,
      // 日期组件最小时间
      minDate: moment().startOf('day').toDate(),
      maxDate: moment(this.nextPayTime).subtract(1, 'days').toDate(),
      estimatedDate: '请选择代扣时间'
    }
  },
  watch: {
    bankCardList(value) {
      this.bankList.length = 0
      this.digitalList.length = 0
      value.forEach(ele => {
        ele.IconBg = bankIconBgObj[ele.openingBankCode?.code] || bankIconBgObj[999]
        if (ele.repayAccountType?.code === '01') {
          // 银行卡信息
          this.bankList.push(ele)
        } else {
          // 数字银行卡信息
          this.digitalList.push(ele)
        }
      })
    }
  },
  methods: {
    change() {
      this.$emit('bankInfoChange', this.selBankCard)
    },
    async estimatedConfirm(value) {
      this.estimatedDate = moment(value).format('YYYY-MM-DD')
      this.$emit('estimatedTimeChange', this.estimatedDate)
      this.showPicker = false
    },
  },
}
</script>

<style lang="less" scoped>

.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 16px;
  font-size: 18px;

  .title-rectangle {
    display: inline-block;
    width: 5px;
    height: 25px;
    margin-right: 5px;
    background: #409EFF;
  }
}

.bank-name {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  color: #999;

  .icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    background: url(~@/assets/images/bankIcon/yhk.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}

.digital-name {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  color: #999;

  .icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    background-size: 100% 100%;
    background: url(~@/assets/images/bankIcon/szrnb.png) no-repeat;
  }
}

.van-cell {
  line-height: 30px;

  .van-cell__title {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      margin-right: 10px;
    }
  }
}
</style>
