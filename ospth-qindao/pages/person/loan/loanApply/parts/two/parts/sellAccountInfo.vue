<template>
  <div>
    <!-- 选择售房人信息 -->
    <van-popup
        v-model="receiveAccountListModal"
        position="bottom"
        :style="{ height: '70%' }"
    >
      <van-radio-group v-model="selectReceive">
        <div
            class="card-list"
            v-for="(item, index) in receiveAccountList"
            :key="index"
            @click="selectReceiveChg(item)"
        >
          <van-radio :name="item">
            <div class="card-item">
              <div class="l">售房人名称</div>
              <div class="r">
                {{ item.sfrmc || '--' }}
              </div>
            </div>
            <div class="card-item">
              <div class="l">售房人账户号码</div>
              <div class="r">
                {{ item.sfrzhhm|| '--' }}
              </div>
            </div>
            <div class="card-item">
              <div class="l">售房人开户银行名称</div>
              <div class="r">
                {{ item.sfrkhyhmc || '--'}}
              </div>
            </div>
            <div class="card-item">
              <div class="l">售房人开户银行联行号</div>
              <div class="r">{{ item.sfrkhyhlhh || '--' }}</div>
            </div>
<!--            <div class="card-item">-->
<!--              <div class="l">收款账户类型</div>-->
<!--              <div class="r">{{ item.skzhlx === '01'? '普通收款户' : '监管收款户' }}</div>-->
<!--            </div>-->
            <div class="card-item">
              <div class="l">售房人账户种类</div>
              <div class="r">{{ item.sfrzhzl === '01' ? '银行卡' : '数字人名币'}}</div>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
    </van-popup>
      <van-cell-group inset >
        <van-field label="售房人银行账号" v-model="houseData.sfrzhhm" input-align="right"
                   :disabled="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                   :required="true"
                   :rules="[{required:true}]"
                   right-icon="search"
                   @click-right-icon="searchAccountInfo"
                    placeholder="售房人银行账号"/>
        <van-field label="售房人名称" v-model="houseData.sfrmc" input-align="right"
                   :disabled="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                   :required="true"
                   :rules="[{required:true}]"
                   placeholder="请选择售房人名称"/>
        <yhSelect :value="houseData.sfrkhyhdm"
                  :code-values="this.codeValues.YHHBColumns"
                  :disabled ="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                  :required="true"
                  @input="(v)=> {houseData.sfrkhyhdm = v}"
                  label="售房人开户银行"/>
        <yhSelect :value="houseData.sfrzhzl"
                  :code-values="this.codeValues.YHKZLColumns"
                  :required="true"
                  @input="(v)=> {houseData.sfrzhzl = v;}"
                  label="售房人账户种类"/>
        <yhSelect :value="houseData.sfrzjlx"
                  :code-values="this.codeValues.GRZJLXColumns"
                  v-show="showsfrzjhm"
                  :required="showsfrzjhm"
                  @input="(v)=> houseData.sfrzjlx = v"
                  label="售房人证件类型"/>
        <van-field label="售房人证件号码" v-model="houseData.sfrzjhm" input-align="right"
                   v-show="showsfrzjhm"
                   :required="showsfrzjhm"
                   :rules="[{ required: this.showsfrzjhm, }, { validator: this.fnValidateIDCard, message: '请输入正确的证件号码', trigger: 'onChange' }]"
                   placeholder="售房人证件号码"/>
        <van-field label="售房人电话号码" v-model="houseData.sfrdhhm" input-align="right"
                   v-show="showsfrzjhm"
                   :required="showsfrzjhm"
                   :rules="[{ required: showsfrzjhm, }]"
                   placeholder="售房人电话号码"/>

      </van-cell-group>
  </div>
</template>
<script>
import {mapActions, mapMutations, mapState,} from 'vuex'
import yhSelect from '../../../parts/common/yhSelect.vue'
export default {
  name: 'sellAccountInfo',
  props: {
  },
  watch:{
     'houseData.dkjylx'(){
         this.changeLoanTraderType()
      },
     'houseData.fwxz'(){
         this.changefwxz()
     },
    'houseData.xmmc'() {
       if(this.houseData.xmmc === '' || this.houseData.xmmc === undefined){
         this.houseData.sfrzhhm = ''
         this.houseData.sfrmc = ''
         this.houseData.sfrkhyhdm = ''
         this.houseData.sfrzhzl = ''
       }
    },
  },

  components:{yhSelect},
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      showDateTimeFrame:false,
      maxDate: new Date(),
      currentDate: new Date(),
      showPopup: false,
      showsfrzjhm: false,
      initHouseData: {}, // 最纯净的房屋信息
      houseFiledArr: [],
      sellFiledArr: [],
      payFiledArr: [],
      fillFiledArr: [],
      showPick: false,
      pickColumns: [],
      selectItem: {},
      showDatePick: false,
      dateValue: new Date(),  // 时间选择器默认值
      sellAccDisabled: true, // 售房人账户号码disabled
      receiveAccountList: [], // 售房人账户信息
      receiveAccountListModal: false, // 是否展示售房人选择弹窗
      selectReceive: null, // 选择的售房人信息
      showNewHouseInfo: true,
      showResaleHouseInfo: '',//展示再交易房字段
      showBuildHouseInfo: '',//展示大建房屋字段
      showCurrrentHouseInfoAndBuildHouseInfo: '',//展示现房选择大建的房屋信息
    }
  },
  computed: {
    ...mapState('perloanApply', ['loanbuscode', 'shareHouseInfo', 'selectedHouseInfoRows','codeValues','houseData']),
    // filed是否是disabled的取自disabledObj对象
    disabledObj() {
      return {
        isDisabled: true,
        defaultDis: true,
        falseDis: false,
        sellAccDisabled: this.sellAccDisabled,
        showNewHouseInfo: this.showNewHouseInfo,
        showResaleHouseInfo: this.showResaleHouseInfo,
        showBuildHouseInfo: this.showBuildHouseInfo,
        showNewHouseInfoAndNotShowCurrrent: this.showNewHouseInfo && !this.showCurrrentHouseInfoAndBuildHouseInfo,
        showCurrrentHouseInfoAndshowResaleHouseInfo: this.showResaleHouseInfo || this.showCurrrentHouseInfoAndBuildHouseInfo,
        showThirdBuildHouseAndResaleHouseInfo: this.showResaleHouseInfo || this.showBuildHouseInfo || this.showCurrrentHouseInfoAndBuildHouseInfo,
      }
    },
    userInfo() {
      return this.$user?.getUser()
    },
  },
  mounted() {
    // 保存最纯净的贷款房屋信息
    this.initHouseData = JSON.parse(JSON.stringify(this.houseData))
    this.changeLoanTraderType()
    this.changefwxz()
    this.selectReceiveChg({
      sfrzhhm: this.houseData.sfrzhhm,
      sfrmc: this.houseData.sfrmc,
      sfrkhyhlhh: this.houseData.sfrkhyhlhh,
      sfrkhyhdm: this.houseData.sfrkhyhdm,
      sfrzhzl: this.houseData.sfrzhzl,
      skzhlx: this.houseData.skzhlx,
      sfrkhyhmc: this.houseData.sfrkhyhmc,
    })
  },
  methods: {
    ...mapActions('perloanApply', ['uriForQueryLoanApplyAuthBuild', 'uriForObtainAcceptLoanProj', 'uriForQueryLoanBankBranch',
      'uriForQueryBuildingInfo', 'uriForObtainAllHouseInfo', 'uriForSaveLoanHouseInfo', 'uriForObtainReceiptAccount', 'uriForObtainAcceptLoanProjCorpInfo']),
    ...mapMutations('perloanApply', ['saveRatelevel']),
    changefwxz(){
      let dkjylx = this.houseData.dkjylx
      let fwxz = this.houseData.fwxz
      this.showsfrzjhm = !(dkjylx === '01' || (dkjylx==='02' && fwxz !=='03'))
      let val = this.houseData.dkjylx
      if (val === '02') {
        if (this.houseData.fwxz === '03') {
          this.showCurrrentHouseInfoAndBuildHouseInfo = true
        } else {
          this.showCurrrentHouseInfoAndBuildHouseInfo = false
        }
      } else {
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      }
    },
    changeLoanTraderType(){
      let dkjylx = this.houseData.dkjylx
      let fwxz = this.houseData.fwxz
      this.showsfrzjhm = !(dkjylx === '01' || (dkjylx==='02' && fwxz !=='03'))
      let val = this.houseData.dkjylx
      if (val === '01') {
        this.fwlx = '01,02,07'
        this.showNewHouseInfo = true
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = false
        this.sellAccDisabled = true
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      } else if (val === '02') {
        this.fwlx = '01,02,07,03'
        this.showNewHouseInfo = true
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = false
        this.sellAccDisabled = true
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        if (this.houseData.fwxz === '03') {
          this.showCurrrentHouseInfoAndBuildHouseInfo = true
          this.sellAccDisabled = false
        } else {
          this.showCurrrentHouseInfoAndBuildHouseInfo = false
        }
      } else if (val === '03') {
        this.fwlx = '01,02,07,03'
        this.showNewHouseInfo = false
        this.showResaleHouseInfo = true
        this.showBuildHouseInfo = false
        this.sellAccDisabled = false
        this.isDisabledHouseTotalPrice = true; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      } else if (val === '06') {
        this.fwlx = '01,02,07,03'
        this.showNewHouseInfo = false
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = true
        this.sellAccDisabled = false
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      } else {
        this.fwlx = '01,02,07'
        this.showNewHouseInfo = true
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = false
        this.sellAccDisabled = true
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      }
    },

    async searchAccountInfo () {
      if (!this.sellAccDisabled) {
        return
      }
      if(this.showResaleHouseInfo || this.showBuildHouseInfo){
        return
      }
      let response
      try {
        response = await this.uriForObtainAcceptLoanProj({
          ...this.commonBizApply,
          type: 'recacc', // 查询收款账户信息
          lpbh: this.houseData.lpbh,
        })
      } catch (error) {
        this.$toast(error)
        return
      }
      this.receiveAccountList = response?.data?.list || []
      if (this.receiveAccountList.length === 0) {
        this.$toast('未获取到售房人账户')
        return
      }
      // 如果只有一条，直接默认选择
      if (this.receiveAccountList.length == 1) {
        await this.selectReceiveChg(this.receiveAccountList[0])
        return
      }
      // 多条则展示弹窗让用户选择
      this.receiveAccountListModal = true
    },

    // 选择售房人信息
    async selectReceiveChg (data) {
      this.selectReceive = data
      this.houseData.sfrzhhm = data.sfrzhhm
      this.houseData.sfrmc = data.sfrmc
      this.houseData.sfrkhyhmc = data.sfrkhyhmc
      this.houseData.sfrkhyhlhh = data.sfrkhyhlhh
      // 售房人开户银行
      const bank = this.codeValues.YHHBColumns.find(ele => ele.value === data.sfrkhyhdm) || { label: '' }
      this.houseData.sfrkhyhdm = data.sfrkhyhdm
      this.houseData.sfrkhyhdmDesc = bank.label
      // 售房人账户种类
      const type = this.codeValues.YHKZLColumns.find(ele => ele.value === data.sfrzhzl) || { label: '' }
      this.houseData.sfrzhzl = data.sfrzhzl
      this.houseData.sfrzhzlDesc = type.label
      // 售房人账户种类
      this.houseData.skzhlx = data.skzhlx
      this.receiveAccountListModal = false
      this.$forceUpdate()
    },

    async fnValidateIDCard(idCard) {
      if (this.houseData?.sfrzjlx === '01' && this.showsfrzjhm) {
        return idCard && await this.$commonJs.verifyIdCard(idCard)
      } else {
        return true
      }
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/deep/ .van-field__label {
  min-width: 7rem;
}
</style>
