<template>
  <div>
    <van-sticky :offset-top="40">
      <van-tabs v-model="activeName" :before-change="tabsClick" :swipe-threshold="2">
        <van-tab v-for="item in borrowerTabs" :name="item.name" :key="item.name">
          <template #title>
            <van-icon name="user-o"/>
            {{ item.label }}
          </template>
        </van-tab>
        <van-tab title="+" name="add">
          <template #title>
            <van-icon name="plus"/>
            新增借款人
          </template>
        </van-tab>
      </van-tabs>
    </van-sticky>
    <!-- 选择codeValue -->
    <van-popup v-model="showCodeValueFrame" position="bottom" :close-on-click-overlay="false">
      <van-picker show-toolbar value-key="label" :columns="codeValueList" @confirm="addBorrower"
                  @cancel="showCodeValueFrame = false"/>
    </van-popup>
    <!-- 主借款人信息 -->
    <van-form validate-first ref="inputForm">
      <template v-if="activeName !== 'add'">
        <borrower-info
                       :relShips="activeName"
                       @changedkjchlx="changedkjchlx"
                       :personData="personData"
                     />
        <loanChildPage v-if="personData.isHadChildren === '1' && activeName === 0" :visible="true"/>
        <deposit-info :relShips="activeName" :personData="personData" :activeName="activeName" :dkjchlx="dkjchlx"/>
        <h1 class="title">
          <van-icon name="friends-o"/>
          单位信息
        </h1>
        <van-cell-group inset>
          <van-field label="单位名称" v-model="personData.dwmc" input-align="right" required
                     :rules="[{required: dkjchlx !=='03',}]" placeholder="请填写单位名称"/>
          <van-field label="单位地址" v-model="personData.dwdz" input-align="right" required
                     :rules="[{ required: dkjchlx !=='03',}]" placeholder="请填写单位地址"/>
        </van-cell-group>
      </template>
    </van-form>
    <div class="btn_box">
      <template v-if="personData.glgx==='01'">
        <van-button class="main-borrow-btn" @click="saveLoanPerson">保存</van-button>
<!--        <van-button class="main-borrow-btn" type="primary" @click="nextStep">下一步</van-button>-->
      </template>
      <template v-else>
        <van-button class="borrow-btn" @click="deletePerson">删除</van-button>
        <van-button class="borrow-btn" @click="saveLoanPerson">保存</van-button>
<!--        <van-button class="borrow-btn" type="primary" @click="nextStep">下一步</van-button>-->
      </template>
    </div>
  </div>
</template>
<script>
import borrowerInfo from './parts/borrowerInfo.vue'
import DepositInfo from './parts/depositInfo.vue'
import loanChildPage from './parts/loanChildPage'
import moment from "moment";
import {mapActions, mapMutations, mapState,} from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import loanApplyMixin from "@osppm/store/person/loan/loanApply/mixin";
export default {
  name: 'perloanApplyPersonInfo',
  components: {DepositInfo, borrowerInfo,loanChildPage},
  mixins:[codeTableMixin,loanApplyMixin],
  data() {
    return {
      commonBizApply: { bizApplyType: 'MP020', bizApplyRegisterNo: '' },
      borrowerTabs: [{name: 0, label: '主借款人'}],
      // tab页激活时的借款人信息
      personData: {},
      dkjchlx: '01,02,03',
      // 选中的tab页
      activeName: undefined,
      updateMark: undefined,
      showCodeValueFrame: false,
      codeValueList: [],
    }
  },
  computed: {
    ...mapState('perloanApply', ['selectedHouseInfoRows','dkywh','loanPerList','codeValues']),
  },
  watch: {
    activeName(val) {
      if (val !== 'add') {
        // loanPerList有值才替换，无值时保留initBorrowerInfo已初始化的personData
        const perData = this.loanPerList[val]
        if (perData) {
          this.personData = perData
        }
      }
    }
  },
  async mounted() {
	await this.initCodeTable(['GLGX', 'CDGX', 'GRZJLX', 'XINGBIE', 'HYZK', 'RYSF', 'ZHIYE'])
	await this.initCodeTable(['ZHICHEN', 'ZHIWU', 'MINZU', 'GUOJI', 'DKJCHLX', 'SHIFOU', 'DKJYLX'])
	await this.initCodeTable(['FWLX', 'FWTS', 'TDXZ', 'FWJG', 'YHHB', 'YHKZL', 'DKLX', 'HKLX'])
	await this.initCodeTable(['DKHKFS', 'DKDBLX', 'DYWLX', 'XUELI', 'YCK', 'GJZHLX', 'GRZHZT', 'LPSSQY'])
	await this.getLoanCodeList()
	await this.refreshLoanSavedInfo()
    // 如果有借款人信息，则初始化借款人信息
    if (Object.keys(this.loanPerList).length) {
      // 循环已经保存了的借款人信息，设置tab页数，激活第一个tab页
      this.borrowerTabs = []
      for (const key in this.loanPerList) {
        this.borrowerTabs.push({ name: parseInt(key), label: this.loanPerList[key].xingming || '借款人' });
        const borrowerInfo = this.loanPerList[key];
        if (key === '0') {
          this.personData = borrowerInfo;
          this.personData.relShips = 0;
          this.setDepositInfoDisable({ dataObj: this.personData });
        }
      }
    }
    this.activeName = 0
  },
  methods: {
    /**
     * 保存
     * roleEnum：保存成功后填写什么信息，不传则为下一步
     */
    saveLoanPerson() {
      return this.$refs.inputForm.validate().then(async () => {
        try {
          const formData = {
            ...this.commonBizApply
          }
          const reg = /Desc$/
          for (const key in this.personData) {
            const value = this.personData[key]
            if (!reg.test(key) && value) {
              formData[key] = value
            }
          }
          if (formData.glgx === '03' && formData.dkjchlx === '03') {
            this.$toast('共同借款人不能是非缴存户')
            return
          }
          formData.khrq = formData.khrq ? moment(formData.khrq).format('YYYYMMDD') : ''
          formData.csrq = formData.csrq ? moment(formData.csrq).format('YYYY-MM-DD') : ''
          formData.jzny = formData.jzny ? moment(formData.jzny).format('YYYY-MM') : ''
          formData.qsny = formData.qsny ? moment(formData.qsny).format('YYYY-MM') : ''
          formData.jcqsny = formData.jcqsny ? moment(formData.jcqsny).format('YYYY-MM') : ''
		  formData.source = '05'
          formData.ywdjh = this.commonBizApply.bizApplyRegisterNo
          formData.dkywh = this.dkywh
          formData.fzxjg = formData.fzxjg ? formData.fzxjg : this.selectedHouseInfoRows?.fzxjg
          formData.txdz = this.personData.txdz
          await  this.deleteDepositInfoDisable({dataObj: formData})
          let response = await this.uriSaveMainPer(formData)
          const {glrywlsh, grkhh} = response?.data
          // 存储贷款流水号信息
          if (glrywlsh) {
            this.personData = {...this.personData, glrywlsh, grkhh}
          }
          this.$toast.success('保存成功')
          this.$emit('refreshLoanSavedInfo')
        } catch (err) {
          this.$toast(err?.message || err || '保存失败')
        }
      }).catch(() => {
        this.$toast('请完善必填信息')
      })
    },
    async deletePerson() {
      this.$dialog.confirm({message: '是否需要关联人',}).then(async () => {
        const {dkywh, glrywlsh, ywdjh,} = this.personData
        // 不为空，说明调用了接口保存关联人，删除关联人信息
        if (glrywlsh) {
          await this.uriDeleteLoanPer({dkywh, glrywlsh, ywdjh, ...this.commonBizApply,})
        }
        delete this.loanPerList[this.activeName]
        for (let i = 0; i < this.borrowerTabs.length; i++) {
          if (this.borrowerTabs[i].name === this.activeName) {
            this.borrowerTabs.splice(i, 1)
            this.activeName = this.borrowerTabs[i - 1].name
          }
        }
      }).catch(() => {
        this.$toast('请完善必填信息')
      })
    },
    changedkjchlx(obj) {
      this.dkjchlx = obj
    },
    // 设置更新标记
    setUpdateMark(value) {
      this.updateMark = value
    },
    async tabsClick(name) {
      if (Object.keys(this.loanPerList).length) {
        if (name === 'add') {
          await this.addBorrower()
          return true
        } else {
          return true
        }
      } else {
        this.$toast('请先保存主借款人信息后再新增借款人。')
        return false
      }
    },
    async addBorrower() {
      const coBorrowerInfo = {}
      coBorrowerInfo.gldx = '01'
      this.loanPerList[Object.keys(this.loanPerList).length]=coBorrowerInfo
      this.borrowerTabs.push({name: parseInt(Object.keys(this.loanPerList).length-1), label: '借(还)款人'})
      // 激活新增tab页
      // this.activeName = Object.keys(this.loanPerList).length-1
      //this.$nextTick(() => this.activeName = Object.keys(this.loanPerList).length-1)
    },
    async formValidate() {
      try {
        await this.$refs.inputForm.validate()
        return true
      } catch {
        return false
      }
    },
    async beforeNext() {
      try {
        await this.saveLoanPerson()
        await this.refreshLoanSavedInfo()
        return true
      } catch (err) {
        if (typeof err === 'string') {
          this.$toast(err)
        }
        return false
      }
    },
  }
}
</script>

<style lang="less" scoped>
// 统一section标题：蓝色左边条 + 图标
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

// 卡片式表单组：统一阴影和圆角
/deep/ .van-cell-group--inset {
  margin: 0 16px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/deep/ .van-field__label {
  min-width: 7rem;
}

.btn_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: calc(100% - 32px);
  margin: 20px 16px;

  .main-borrow-btn {
    border-radius: 8px;
    width: 100%;
    height: 44px;
    font-size: 15px;
    font-weight: 500;
  }

  .borrow-btn {
    border-radius: 8px;
    width: 110px;
    height: 40px;
    font-size: 14px;
  }
}
</style>
