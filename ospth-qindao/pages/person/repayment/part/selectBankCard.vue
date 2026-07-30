<template>
  <div class="bank-box" v-if="needChooseBankCard">
    <div class="title">
      <span class="title-rectangle"></span>
      <span>选择还款资金账户</span>
    </div>
    <p class="bank-name" v-show="!bankCardList || bankCardList.length !== 0">
      <span class="icon"/>银行卡
    </p>
    <van-radio-group v-model="selBankCard" @change="val => setCardInfo(val)">
      <van-cell-group>
        <van-cell v-for="item in bankCardList" :key="item.repaymentAccount.value" clickable @click="selBankCard = item">
          <template #title>
            <img :src="`${require(`@/assets/images/bankIcon/${item.IconBg.icon}.png`)}`" alt="" />
            <span>
              {{ item.repayAccountType | descEmptyToLine }}（{{ item.repaymentAccount.value | middleFormat }}）
            </span>
          </template>
          <template #right-icon>
            <van-radio :name="item" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <p class="digital-name" v-show="!digitalCardList || digitalCardList.length !== 0">
      <span class="icon"/>数字人民币
    </p>
    <van-radio-group v-model="selBankCard" @change="val => setCardInfo(val)">
      <van-cell-group>
        <van-cell v-for="item in digitalCardList" :key="item.repaymentAccount.value" clickable
          @click="selBankCard = item">
          <template #title>
            <img :src="`${require(`@/assets/images/bankIcon/${item.IconBg.icon}.png`)}`" alt="" />
            <span>
              {{ item.repayAccountType | descEmptyToLine }}（{{ item.repaymentAccount.value | middleFormat }}）
            </span>
          </template>
          <template #right-icon>
            <van-radio :name="item" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>

// 银行码值：银行图标，图标大小，背景图标
import {mapActions, mapMutations} from 'vuex'

const bankIconBgObj = {
  102: { icon: 'gs' }, // 工商银行
  103: { icon: 'nh' }, // 农业银行
  104: { icon: 'zg' }, // 中国银行
  105: { icon: 'js' }, // 建设银行
  301: { icon: 'jt' }, // 交通银行
  303: { icon: 'gd' }, // 光大银行
  306: { icon: 'gf' }, // 广发行
  313: { icon: 'ny' }, // 南粤银行
  402: { icon: 'nxs' }, // 农信社
  999: { icon: 'other' }, // 其他银行
}
export default {
  name: 'selectBankCard',
  props: {
    startInit: {
      default: false,
    },
    needChooseBankCard: {
      default: true,
    }
  },
  data () {
    return {
      // 选中的银行卡信息
      selBankCard: null,
      // 银行卡信息
      bankCardList: null,
      // 数字银行卡信息
      digitalCardList: null,
    }
  },
  watch: {
   /* startInit () {
      if (this.startInit && this.needChooseBankCard) {
        this.init()
      }
    },*/
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('loanRepayment', ['queryRepaymentBankInfo']),
    ...mapMutations('loanRepayment', ['setCardInfo']),
    async init() {
      if (this.bankCardList || this.digitalCardList) {
        return
      }
      try {
        let response = await this.queryRepaymentBankInfo({...this.commonBizApply})
        const bankCardList = response?.bankCardInfo || []
        this.bankCardList = []
        this.digitalCardList = []
        bankCardList.forEach(ele => {
          ele.IconBg = bankIconBgObj[ele.openingBankCode?.code] || bankIconBgObj[999]
          if (ele.repayAccountType?.code === '01') {
            // 银行卡信息
            this.bankCardList.push(ele)
          } else {
            // 数字银行卡信息
            this.digitalCardList.push(ele)
          }
        })
      } catch (error) {
        this.$dialog.alert({
          confirmButtonText: '确定',
          messageAlign: 'left',
          message: error
        }).then(() => {
          this.$router.push('/businessHall')
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.bank-box {
  width: calc(100% - 20px);
  margin: 10px auto 0;
  border-radius: 8px;
  box-shadow: 0px 4px 11px 1px #EFEFEF;
  background: #fff;
  overflow: hidden;

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
      background: url(~@/assets/images/bankIcon/szrnb.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
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
}
</style>
