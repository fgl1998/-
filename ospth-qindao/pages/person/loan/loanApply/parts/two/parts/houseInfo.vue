<template>
  <div>
    <!-- 选择时间 -->
    <van-popup v-model="showDateTimeFrame" position="bottom">
      <van-datetime-picker v-if="codeValueParam === 'fwjyrq' || codeValueParam === 'jgrq' " v-model="currentDate" :max-date="maxDate"
                           type="date" title="选择年月日"
                           @cancel="showDateTimeFrame = false" @confirm="datePickConfirm"/>
      <van-datetime-picker v-else v-model="currentDate" type="year-month" title="选择日期" :max-date="maxDate"
                           :min-date="minDate"
                           @cancel="showDateTimeFrame = false" @confirm="datePickConfirm"/>
    </van-popup>
    <!-- 弹出层显示搜索结果 -->
    <van-popup v-model="showPopup" position="bottom" :style="{ height: '50%' }">
      <van-list>
        <van-cell
            v-for="(item, index) in lpmcDataSource"
            :key="index"
            :title="item.xmmc"
            @click="selectLpItem(item)"
        />
      </van-list>
    </van-popup>
    <van-cell-group inset>
      <yhSelect :value="houseData.dkjylx"
                :code-values="codeValues.DKJYLXColumns.filter(ele => '01,02,03'.includes(ele.value)) || []"
                :required="true"
                @input="(v)=> {houseData.dkjylx = v;changefwxz()}"
                label="购房类型"/>
      <yhSelect :value="houseData.fwxz"
                :code-values="codeValues.FWLXColumns.filter(ele =>fwlx.includes(ele.value))"
                :required="true"
                @input="(v)=> {houseData.fwxz = v;changeHouseProperty()}"
                label="房屋类型"/>
      <yhSelect :value="houseData.dyghbz"
                :code-values="codeValues.SHIFOUColumns"
                v-show="disabledObj.showResaleHouseInfo"
                :required="disabledObj.showResaleHouseInfo"
                :disabled='true'
                @input="(v)=> houseData.dyghbz = v"
                label="是否带押过户"/>
      <van-field label="带押过户公证机构"
                 v-model="houseData.dyghgzjg"
                 input-align="right"
                 v-show="disabledObj.showResaleHouseInfo && houseData.dyghbz === '1'"
                 :required="disabledObj.showResaleHouseInfo && houseData.dyghbz === '1'"
                 :rules="[{required: disabledObj.showResaleHouseInfo && houseData.dyghbz === '1'}]"
                 placeholder="请填写带押过户公证机构"/>
      <van-field label="小区名称" v-model="houseData.xqmc" input-align="right"
                 v-show="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 :required="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 :rules="[{required:disabledObj.showThirdBuildHouseAndResaleHouseInfo}]"
                 placeholder="请填写小区名称"/>
      <van-field label="楼盘名称" v-model="houseData.xmmc" input-align="right"
                 v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :rules="[{required:disabledObj.showNewHouseInfoAndNotShowCurrrent}]"
                 placeholder="请填写楼盘名称"
                 right-icon="search"
                 @click-right-icon="handleSearchYslpmc"/>
      <van-field label="楼盘地址" v-model="houseData.xmdz" input-align="right"
                 v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :rules="[{required:disabledObj.showNewHouseInfoAndNotShowCurrrent}]"
                 placeholder="请填写楼盘地址"
                 :disabled='true'/>

      <van-field label="开发商名称" v-model="houseData.kfdwmc" input-align="right"
                 v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                 :rules="[{required:disabledObj.showNewHouseInfoAndNotShowCurrrent}]"
                 placeholder="请填写开发商名称"
                 :disabled='true'/>
      <yhSelect :value="houseData.yscqzh"
                :code-values="yscqzhList"
                v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                @input="(v)=> {houseData.yscqzh = v;onSelectYsxkz(v)}"
                label="预(现)售许可证"/>
      <van-field label="产权年限" v-model="houseData.cqnx" input-align="right"
                 :required="true"
                 :rules="[{required:true}]"
                 placeholder="请填写产权年限"/>
      <yhSelect :value="houseData.fwts"
                :code-values="codeValues.FWTSColumns.filter(obj=>'01,02'.includes(obj.value))"
                :required="true"
                @input="(v)=> {houseData.fwts = v;ifEnableLoanByfwts(v)}"
                label="房屋套数"/>
      <van-field label="合同备案号" v-model="houseData.wqhtbh" input-align="right"
                 v-show="disabledObj.showNewHouseInfo"
                 :required="disabledObj.showNewHouseInfo"
                 :rules="[{required:disabledObj.showNewHouseInfo}]"
                 placeholder="请填写合同备案号"/>
      <van-field label="合同备案日期"
                 v-model="houseData.wqbarq"
                 v-show="disabledObj.showNewHouseInfo"
                 input-align="right"
                 :required="disabledObj.showNewHouseInfo"
                 :rules="[{required:disabledObj.showNewHouseInfo}]"
                 @click="choosefwjyrq('wqbarq')"
                 placeholder="请选择合同备案日期"/>
      <yhSelect :value="houseData.swtyhdm"
                :code-values="codeValues.YHHBColumns.filter(item => filterBankType.includes(item.value))"
                :required="true"
                @input="(v)=> {houseData.swtyhdm = v;queryyhbh()}"
                label="贷款银行"/>
      <yhSelect :value="houseData.yhbh"
                :code-values="yhbhList"
                :required="true"
                @input="(v)=> {houseData.yhbh = v;}"
                label="受委托银行"/>
      <yhSelect :value="houseData.tdxz"
                v-show="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                :code-values="codeValues.TDXZColumns"
                :required="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                @input="(v)=> {houseData.tdxz = v;}"
                label="土地性质"/>
      <van-field label="房屋评估价" v-model="houseData.pgjz" input-align="right"
                 type="number"
                 @blur=this.calculateHouseTotalPrice
                 v-show="disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo"
                 :required="disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo"
                 :rules="[{required:disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo}]"
                 placeholder="请填写房屋评估价"/>
      <van-field label="完税价格" v-model="houseData.fwjyjg" input-align="right"
                 type="number"
                 @blur=calculateHouseTotalPrice
                 v-show="disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo"
                 :required="disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo"
                 :rules="[{required:disabledObj.showCurrrentHouseInfoAndshowResaleHouseInfo}]"
                 placeholder="请填写房屋完税价格"/>
      <yhSelect :value="houseData.fwldh"
                :code-values="fwldhList"
                v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                @input="(v)=> {houseData.fwldh = v;queryUnitInfo()}"
                label="房屋楼栋号"/>
      <yhSelect :value="houseData.dymh"
                :code-values="unitList"
                v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                @input="(v)=> {houseData.dymh = v;queryHouseNo()}"
                label="房屋单元号"/>
      <yhSelect :value="houseData.louceng"
                :code-values="floorArrColumns"
                v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                @input="(v)=> {houseData.louceng = v;queryHoldNo(v)}"
                label="房屋楼层号"/>
      <yhSelect :value="houseData.hsh"
                :code-values="roomcolumns"
                v-show="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                :required="disabledObj.showNewHouseInfoAndNotShowCurrrent"
                @input="(v)=> {houseData.hsh = v;fwtsberSelect()}"
                label="房间号"/>
      <van-field label="房屋总价" v-model="houseData.gffwzj" input-align="right"
                 type="number"
                 @blur=this.calHouseUnitPrice
                 :readonly="isDisabledHouseTotalPrice"
                 :required="true"
                 :rules="[{required:true}]"
                 placeholder="请填写房屋总价"/>
      <van-field label="房屋建筑面积" v-model="houseData.fwjzmj" input-align="right"
                 type="number"
                 @blur=this.calHouseUnitPrice
                 :required="true"
                 :rules="[{required:true}]"
                 placeholder="请填写房屋建筑面积"/>

      <van-field label="房屋套内面积" v-model="houseData.fwtnmj" input-align="right"
                 type="number"
                 :required="true"
                 :rules="[{required:true}]"
                 placeholder="请填写房屋套内面积"/>

      <van-field label="房屋单价" v-model="houseData.fwdj" input-align="right"
                 type="number"
                 :required="true"
                 :rules="[{required:true}]"
                 :disabled="true"
                 placeholder="请填写房屋单价"/>

      <van-field label="房屋交易日期"
                 v-model="houseData.fwjyrq"
                 v-show="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 input-align="right"
                 :required="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 :rules="[{required:disabledObj.showThirdBuildHouseAndResaleHouseInfo}]"
                 @click="choosefwjyrq('fwjyrq')"
                 placeholder="请选择房屋交易日期"/>

      <van-field label="不动产权证号" v-model="houseData.gf_yscqzh"
                 input-align="right"
                 v-show="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 :required="disabledObj.showThirdBuildHouseAndResaleHouseInfo"
                 :rules="[{required:disabledObj.showThirdBuildHouseAndResaleHouseInfo}]"
                 placeholder="请填写不动产权证号"/>

      <van-field label="竣工日期"
                 v-model="houseData.jgrq"
                 v-show="disabledObj.showResaleHouseInfo"
                 input-align="right"
                 @click="choosefwjyrq('jgrq')"
                 @blur="jgrqBlur"
                 :required="disabledObj.showResaleHouseInfo"
                 :rules="[{required:disabledObj.showResaleHouseInfo}]"
                 placeholder="请选择竣工日期"/>
      <van-field label="房龄" v-model="houseData.fangling" input-align="right"
                 type="number"
                 v-show="disabledObj.showResaleHouseInfo"
                 :required="disabledObj.showResaleHouseInfo"
                 :disabled="true"
                 :rules="[{required:disabledObj.showResaleHouseInfo}]"
                 placeholder="请填写房屋房龄"/>
      <van-cell title="房屋坐落" :required="disabledObj.showNewHouseInfoAndNotShowCurrrent" :rules="[{required:disabledObj.showNewHouseInfoAndNotShowCurrrent}]">
      <textarea
          v-model="houseData.fwzl"
          :disabled="disabledObj.showNewHouseInfoAndNotShowCurrrent"
          placeholder="请填写房屋坐落"
          rows="3"
          style="width: 100%; border: none; outline: none; resize: none;"
      />
      </van-cell>

    </van-cell-group>
  </div>
</template>
<script>
import moment from 'moment'
import {mapActions, mapMutations, mapState,} from 'vuex'
import yhSelect from '../../../parts/common/yhSelect.vue'

const LOAN_TRADE_TYPE = {
  PRE_SALE: '01',
  CURRENT_SALE: '02',
};

const PRESALE_NO_CARD_TYPE = {
  PRE_SALE_PERMIT: '03',
  CURRENT_SALE_PERMIT: '09',
};

export default {
  name: 'houseInfo',
  props: {},
  components: {yhSelect},
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      filterBankType: '102,103,104,105,999,a80,a81,a09',
      codeValueParam: '',
      yhbhList: [],
      unitList: [],
      floorArrColumns: [],
      showDateTimeFrame: false,
      maxDate: new Date(2100, 0, 1),
      minDate: new Date(1900, 0, 1),
      currentDate: new Date(),
      showPopup: false,
      lpmcDataSource: [],
      yscqzhList: [],
      showHouseSellerCodeNo: false,
      yhbhColumns: [],
      fwldhColumns: [],
      roomcolumns: [],
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
      houseDisArr: [], // 所有的门牌号信息
      alldymh: [], // 所有的单元号信息
      isFirstLoading: true, // 是否是第一次加载
      showNewHouseInfo: true,
      showResaleHouseInfo: '',//展示再交易房字段
      showBuildHouseInfo: '',//展示大建房屋字段
      showCurrrentHouseInfoAndBuildHouseInfo: '',//展示现房选择大建的房屋信息
      fwlx: '01,02,07,03',
      isDisabledHouseTotalPrice: false,
      fwldhList: [],
    }
  },
  computed: {
    ...mapState('perloanApply', ['loanbuscode', 'shareHouseInfo', 'selectedHouseInfoRows', 'codeValues', 'houseData']),
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
  async mounted() {
    const hasSavedHouseInfo = Object.keys(this.shareHouseInfo).length > 0
    if (hasSavedHouseInfo) {
      // 已保存过房屋信息 → 反显并初始化级联下拉选项
      this.setHouseData({...this.houseData, ...this.shareHouseInfo})
      await this.changefwxz()
      await this.initCascadingDropdowns()
    } else {
      // 未保存过 → 仅设默认值，不初始化预(现)售许可证/楼栋/单元/楼层/房间号下拉
      this.houseData.dkjylx = '01'
      this.houseData.fwxz = '01'
      await this.changefwxz()
    }
    this.isFirstLoading = false
  },
  watch: {
    'houseData.jgrq'() {
      this.jgrqBlur()
    },
    'houseData.xmmc'() {
      if(this.houseData.xmmc === ''){
        this.houseData.yscqzhList = []
        this.houseData.yscqzh = ''
        this.filterBankType = '102,103,104,105,999,a80,a81,a09'
        this.houseData.kfdwmc = ''
        this.houseData.xmdz = ''
        this.houseData.fwldhList = []
        this.houseData.fwldh = ''
        this.houseData.unitList = []
        this.houseData.dymh = ''
        this.houseData.louceng = ''
        this.houseData.floorArrColumns = []
        this.houseData.roomcolumns = []
        this.houseData.hsh = ''
        if(this.disabledObj.showNewHouseInfoAndNotShowCurrrent){
          this.houseData.fwjzmj = ''
          this.houseData.fwtnmj = ''
          this.houseData.gffwzj = ''
          this.houseData.houseUnitPrice = ''
        }
        this.houseData.sfzp = ''
        this.houseData.sflsjz = ''
      }
    }
  },
  methods: {
    ...mapActions('perloanApply', ['uriForQueryLoanApplyAuthBuild', 'uriForSearchLoanProject',
      'uriForQueryPresalePermit', 'uriForQueryProjectBankType', 'uriForQueryLoanBankBranch',
      'uriForQueryBuildingInfo', 'uriForObtainAllHouseInfo', 'uriForSaveLoanHouseInfo', 'uriForObtainReceiptAccount', 'uriForObtainAcceptLoanProjCorpInfo']),
    ...mapMutations('perloanApply', ['saveRatelevel', 'setHouseData']),


    async choosefwjyrq(val) {
      this.showDateTimeFrame = true;
      this.codeValueParam = val
    },
    async onSelectYsxkz(value) {
      const ywlsh = this.yscqzhList.find(obj => obj.value === value).ywlsh
      const lpzjlx = this.yscqzhList.find(obj => obj.value === value).lpzjlx
      const yszsfdq = this.yscqzhList.find(obj => obj.value === value).yszsfdq

      if (yszsfdq === '1') {
        this.$toast.fail('许可证已过期,请重新选择')
        this.houseData.yscqzh = ''
        return
      }

      if (this.houseData.dkjylx === LOAN_TRADE_TYPE.PRE_SALE) {
        if (lpzjlx === PRESALE_NO_CARD_TYPE.CURRENT_SALE_PERMIT) {
          this.$toast.fail('期房应选择预售许可证，不能选择现售许可证');
          this.houseData.yscqzh = ''
          return;
        }
      }
      if (this.houseData.dkjylx === LOAN_TRADE_TYPE.CURRENT_SALE) {
        if (lpzjlx === PRESALE_NO_CARD_TYPE.PRE_SALE_PERMIT) {
          this.$toast.fail('现房应选择现售许可证，不能选择预售许可证');
          this.houseData.yscqzh = ''
          return;
        }
      }
      let response
      try {
        response = await this.uriForQueryBuildingInfo({
          ...this.commonBizApply,
          ywlsh: ywlsh,
          yscqzh: value,
        })
      } catch (error) {
        this.$toast.fail(error)
        return
      }
      this.fwldhList = response?.data?.list || []
      this.fwldhList.forEach(item => {
        item.value = item.ldlsh
        item.label = item.fwldh
      })
      // 预售许可证变更后，清空下游级联字段
      this.houseData.fwldh = ''
      this.houseData.dymh = ''
      this.houseData.louceng = ''
      this.houseData.hsh = ''
      this.unitList = []
      this.floorArrColumns = []
      this.roomcolumns = []
    },

    async selectLpItem(item) {
      if (item?.isdq === '1') {
        this.$toast.fail('该楼盘合作年限已到期')
        this.houseData.xmmc = ''
        this.showPopup = false
        return
      }

      this.houseData.yscqzhList = []
      this.houseData.yscqzh = ''
      this.filterBankType = '102,103,104,105,999,a80,a81,a09'
      this.houseData.kfdwmc = ''
      this.houseData.xmdz = ''
      this.houseData.fwldhList = []
      this.houseData.fwldh = ''
      this.houseData.unitList = []
      this.houseData.dymh = ''
      this.houseData.louceng = ''
      this.houseData.floorArrColumns = []
      this.houseData.roomcolumns = []
      this.houseData.hsh = ''
      this.houseData.fwjzmj = ''
      this.houseData.gffwzj = ''
      this.houseData.fwtnmj = ''
      this.houseData.houseUnitPrice = ''
      this.houseData.sfzp = ''
      this.houseData.sflsjz = ''

      this.houseData.xmmc = item.xmmc; // 选择后反显到输入框
      this.houseData.xmdz = item.xmdz;
      this.houseData.lpbh = item.lpbh;
      //根据选择的楼盘详情，去查询预售证信息
      await this.queryyscqzh(item.lpbh)
      //查询开发商名称
      await this.querykfdwmc(item.lpbh)
      //去查询楼盘的委托贷款银行
      await this.getyhbhType(item.lpbh)
      //刷新受委托银行列表
      await this.queryyhbh()
      //关闭弹出层
      this.showPopup = false;
    },

    async getyhbhType(item) {
      const response2 = await this.uriForQueryProjectBankType({
        lpbh: item,
        ...this.commonBizApply,
      })
      this.filterBankType = response2?.data?.list?.[0]?.entrustedswtyhdm ?? '102,103,104,105,999,a80,a81,a09';
    },

    async querykfdwmc(val) {
      const response = await this.uriForObtainAcceptLoanProjCorpInfo({
        lpbh: val,
        ...this.commonBizApply,
      })
      this.houseData.kfdwmc = response?.data?.kfdwmc
    },
    async queryyscqzh(val) {
      let response
      let that = this
      try {
        response = await this.uriForQueryPresalePermit({
          ...this.commonBizApply,
          lpbh: val,
        })
        that.yscqzhList = []
        if (response?.data?.list) {
          response?.data?.list.forEach(item => that.yscqzhList.push({
            value: item.yscqzh,
            label: item.yscqzh,
            ywlsh: item.ywlsh,
            lpzjlx: item.lpzjlx,
            yszsfdq: item.yszsfdq,
          }))
        } else {
          this.$toast.fail('未查询到房屋的预售许可证号信息')
        }
      } catch (e) {
        this.$toast.fail(e)
      }
    },
    async handleSearchYslpmc() {
      const {xmmc} = this.houseData
      if (!xmmc) {
        this.$toast.fail("请输入楼盘名称")
        return
      }
      try {
        const response = await this.uriForSearchLoanProject({
          ...this.commonBizApply,
          xmmc: xmmc,
          lpssqy: this.selectedHouseInfoRows.fzxjg,
        })
        const list = response?.data?.list || []
        if (list.length === 1) {
          await this.selectLpItem(list[0])
        } else if (list.length > 1) {
          this.lpmcDataSource = list
          this.showPopup = true
        } else {
          this.$toast.fail('未查询到楼盘信息')
        }
      } catch (error) {
        this.$toast.fail(error)
      }
    },

    async changeHouseReceiveAccountType() {
      // 个人账户
      const val = this.houseData.houseReceiveAccountType ? this.houseData.houseReceiveAccountType : '01'
      if (val === '01') {
        this.showHouseSellerCodeNo = true
      } else {
        // 单位账户
        this.showHouseSellerCodeNo = false
      }
    },

    async fnValidateIDCard(idCard) {
      if (this.houseData?.houseSellerCodeType === '01') {
        return idCard && await this.$commonJs.verifyIdCard(idCard)
      } else {
        return !idCard
      }
    },
    calculateHouseTotalPrice() {
      // 正确调用 getFieldValue 方法获取字段值
      const pgjz = this.houseData.pgjz
      const fwjyjg = this.houseData.fwjyjg
      // 检查值是否存在且为有效数字
      if (pgjz != null && fwjyjg != null && !isNaN(pgjz) && !isNaN(fwjyjg)) {
        // 取较小值作为房屋总价
        const gffwzj = Math.min(pgjz, fwjyjg)

        // 设置房屋总价，并确保精度为两位小数
        this.houseData.gffwzj = gffwzj.toFixed(2)
      } else {
        // 如果值无效，清空房屋总价
        this.houseData.gffwzj = ''
      }
    },

    async changeHouseProperty() {
      let val = this.houseData.dkjylx
      if (val === '02') {
        if (this.houseData.fwxz === '03') {
          this.showCurrrentHouseInfoAndBuildHouseInfo = true
          this.yscqzhList = []
          this.filterBankType = '102,103,104,105,999,a80,a81,a09'
          this.houseData.xmmc = ''
          this.houseData.yscqzh = ''
        } else {
          this.showCurrrentHouseInfoAndBuildHouseInfo = false
        }
      } else {
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
      }
    },

    async changefwxz() {
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
          this.yscqzhList = []
          this.filterBankType = '102,103,104,105,999,a80,a81,a09'
          this.houseData.xmmc = ''
          this.houseData.yscqzh = ''
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
        this.yscqzhList = []
        this.filterBankType = '102,103,104,105,999,a80,a81,a09'
        this.houseData.xmmc = ''
        this.houseData.yscqzh = ''
      } else if (val === '06') {
        this.fwlx = '01,02,07,03'
        this.showNewHouseInfo = false
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = true
        this.sellAccDisabled = false
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
        this.yscqzhList = []
        this.filterBankType = '102,103,104,105,999,a80,a81,a09'
        this.houseData.xmmc = ''
        this.houseData.yscqzh = ''
      } else {
        this.fwlx = '01,02,07'
        this.showNewHouseInfo = true
        this.showResaleHouseInfo = false
        this.showBuildHouseInfo = false
        this.sellAccDisabled = true
        this.isDisabledHouseTotalPrice = false; // 如果购房类型是 03，则禁用输入框
        this.showCurrrentHouseInfoAndBuildHouseInfo = false
        this.yscqzhList = []
        this.filterBankType = '102,103,104,105,999,a80,a81,a09'
        this.houseData.xmmc = ''
        this.houseData.yscqzh = ''
      }
    },
    // 初始化级联下拉选项(仅期房/现房+非自建房+已保存楼盘编号时调用)
    async initCascadingDropdowns() {
      const { dkjylx, fwxz, lpbh } = this.houseData
      const isNewOrCurrent = (dkjylx === '01' || dkjylx === '02') && fwxz !== '03'
      if (!isNewOrCurrent || !lpbh) {
        if (this.houseData.swtyhdm) await this.queryyhbh()
        return
      }
      // 1. 查询预(现)售许可证列表
      await this.queryyscqzh(lpbh)
      // 2. 查询开发商名称
      await this.querykfdwmc(lpbh)
      // 3. 查询楼盘委托银行类型
      await this.getyhbhType(lpbh)
      // 4. 查询银行支行列表
      await this.queryyhbh()
      // 5. 如果保存过预售许可证 → 查询楼栋列表
      if (this.houseData.yscqzh) {
        await this.initBuildingList(this.houseData.yscqzh)
      }
      // 6. 如果保存过楼栋号 → 查询单元列表
      if (this.houseData.fwldh) {
        await this.queryUnitInfo()
      }
      // 7. 如果保存过单元号 → 查询楼层列表
      if (this.houseData.dymh) {
        await this.queryHouseNo()
      }
      // 8. 如果保存过楼层号 → 查询房间号列表
      if (this.houseData.louceng) {
        await this.queryHoldNo(this.houseData.louceng)
      }
      // 9. 如果保存过房间号 → 自动填写面积和房屋坐落
      if (this.houseData.hsh) {
        await this.fwtsberSelect()
      }
    },
    // 根据已保存的预售许可证号初始化楼栋下拉列表
    async initBuildingList(yscqzh) {
      const selected = this.yscqzhList.find(obj => obj.value === yscqzh)
      if (!selected) return
      this.houseData.ywlsh = selected.ywlsh
      try {
        const response = await this.uriForQueryBuildingInfo({
          ...this.commonBizApply,
          ywlsh: selected.ywlsh,
          yscqzh: yscqzh,
        })
        this.fwldhList = (response?.data?.list || []).map(item => ({
          ...item,
          value: item.ldlsh,
          label: item.fwldh,
        }))
      } catch (error) {
        this.$toast.fail(error)
      }
    },
    async ifEnableLoanByfwts(val) {
      if (val === '03') {
        this.$toast('超过三套房屋不允许公积金贷款')
        this.houseData.fwts = ''
      }
    },
    // 贷款银行行别Change事件
    async queryyhbh() {
      let response
      if (this.houseData.swtyhdm) {
        try {
          response = await this.uriForQueryLoanBankBranch({
            swtyhdm: this.houseData.swtyhdm,
            lpssqy: this.selectedHouseInfoRows.fzxjg,
            ...this.commonBizApply,
          })
          // 受委托银行columns赋值
          this.yhbhList = response?.data?.list || []
          // 联行号编号
          this.houseData.hkzhyhlhh = response?.data?.lhhbh || ''
          // 账户开户银行为委托银行
          this.houseData.zhkhyhdm = this.houseData.swtyhdm
        } catch (error) {
          this.$toast(error)
          return
        }
      }
    },
    // 计算房价
    async calHouseUnitPrice() {
      const {gffwzj, fwjzmj,} = this.houseData
      if (gffwzj && fwjzmj) {
        this.houseData.houseUnitPrice = (gffwzj / fwjzmj).toFixed(2)
      }
    },

    async jgrqBlur() {
      // 获取当前年份
      const currentYear = new Date().getFullYear();
      // 从val中提取年份
      const inputYear = parseInt(this.houseData.jgrq)
      // 计算年份差
      const yearDifference = currentYear - inputYear;
      this.houseData.fangling = yearDifference
    },
    // 房屋楼栋号 确认
    async queryUnitInfo() {
      let response
      try {
        response = await this.uriForObtainAllHouseInfo({
          ...this.commonBizApply,
          ldlsh: this.houseData.fwldh,
          type: 'room' // 查询楼栋房屋信息
        })
      } catch (error) {
        this.$toast(error)
        return
      }
      response = response?.data?.dymh || {}
      this.unitList = []
      let keys = Object.keys(response)
      keys.forEach(key => {
        this.unitList.push({value: key, label: key})
      })
      if (this.unitList.length === 0) {
        this.$toast.fail('该楼栋下无单元信息')
      }
      this.alldymh = response
    },
    // 房屋单元号确认
    async queryHouseNo() {
      // 查找单元对应的楼层
      let allFloorArr = this.alldymh[this.houseData.dymh]
      this.floorArrColumns = []
      allFloorArr.forEach(ele => {
        if (!this.floorArrColumns.some(item => item.value === ele.louceng)) {
          this.floorArrColumns.push({value: ele.louceng, label: ele.louceng})
        }
      })
    },
    // 房屋楼层号确认
    async queryHoldNo(val) {
      // 获取单元号对应的所有的门牌号
      let allFloorArr = this.alldymh[this.houseData.dymh]
      this.roomcolumns = []
      this.houseDisArr = []
      allFloorArr.forEach(ele => {
        if (val === ele.louceng) {
          this.roomcolumns.push({
            value: ele.hsh,
            label: ele.hsh,
            fwjzmj: ele.fwjzmj,
            fwtnmj: ele.fwtnmj
          })
          this.houseDisArr.push({value: ele.hsh, dkzt: ele.dkzt})
        }
      })
    },
    // 房屋编号
    async fwtsberSelect() {
      // 使用解构赋值简化代码
      const {hsh} = this.houseData;
      // 使用可选链操作符和空对象默认值
      const fwjzmj = this.roomcolumns.find(ele => ele.value === hsh) || {};
      const house = this.houseDisArr.find(ele => ele.value === hsh) || {};
      // 更新 houseData 的属性
      if(fwjzmj.fwjzmj){
        this.houseData.fwjzmj = fwjzmj.fwjzmj
      }
      if(fwjzmj.fwtnmj){
        this.houseData.fwtnmj = fwjzmj.fwtnmj
      }
      // 检查贷款状态
      if (!this.isFirstLoading && house?.dkzt === '1') {
        this.$toast('该房屋已贷款');
        this.houseData.hsh = '';
        this.houseData.hshDesc = '';
        return;
      }
      // 使用解构赋值简化代码
      const {xmmc, xmdz, fwldh, dymh} = this.houseData;
      // 组装房屋地址
      const newdymh = dymh === '无' ? '' : dymh;
      const fwldhName = this.fwldhList.find(obj => obj.ldlsh === fwldh)?.label || '';
      // 判断 fwldhName 是否包含 "栋" 字
      const shouldAddDong = !fwldhName.includes('栋');
      // 拼接地址
      this.houseData.fwzl = `${xmdz}${xmmc}${fwldhName}${shouldAddDong ? '栋' : ''}${newdymh}${hsh}`;
    },
    datePickConfirm(val) {
      let dateFormat = 'YYYY-MM-DD'
      if (this.codeValueParam === 'depmnh' || this.codeValueParam === 'depstart') {
        dateFormat = 'YYYYMM'
      }
      if (this.codeValueParam === 'jgrq') {
        dateFormat = 'YYYY'
      }
      this.houseData[this.codeValueParam] = moment(val).format(dateFormat)
      this.showDateTimeFrame = false
    },
    // 查询楼栋(供外部调用)
    async queryBuildingInfo(value) {
      // 从预售证列表中匹配获取业务流水号
      this.yscqzhList.forEach(item => {
        if (item.value === (value || this.houseData.yscqzh)) {
          this.houseData.ywlsh = item.ywlsh
        }
      })
      await this.initBuildingList(value || this.houseData.yscqzh)
    }
  }
}
</script>
<style lang="less" scoped>
// 卡片式表单组
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
