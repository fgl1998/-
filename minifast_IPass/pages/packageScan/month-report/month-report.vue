<template>
  <div class="month-report">
    <Header @month="getMonth" @date="getDate"></Header>
    <div class="con">
      <Total :month="month" :renderData="moneyData" />
      <PersonalSubsidy :renderData="detailPersonList" />
      <FamilySubsidy :renderData="detailFamilyList" />
      <DeclareList :renderData="declareProjectList" />
      <IssueList :renderData="amountDetailList" />
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import Total from './Total.vue'
import DeclareList from './DeclareList.vue'
import PersonalSubsidy from './PersonalSubsidy.vue'
import FamilySubsidy from './FamilySubsidy.vue'
import IssueList from './IssueList.vue'
import {
  requestFFGetPaymentDetail,
  requestWXGetMyFamilyInfo,
  requestWXGetMyFamilyUser,
  requestB015,
  requestFFGetAmountInfo,
  requestFFGetAmountDetail,
} from '@/service/api'

import { USER_INFO, FAMILY_MEMBERS, USER_LIST, IS_MERCHANT, SHOP_INFO, UPDATE_SHOP_INFO } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import { showModal, navigateTo } from '@/utils/uni-api'

export default {
  name: 'pageMonthReport',
  components: {
    Header,
    Total,
    DeclareList,
    PersonalSubsidy,
    IssueList,
    FamilySubsidy,
  },

  data() {
    return {
      month: new Date().getMonth() + 1,
      moneyData: {},

      detailPersonList: [],
      detailFamilyList: [],
      declareProjectList: [],
      amountDetailList: [], //发放中信息
      family_members: '',
    }
  },

  onLoad(e) {},

  methods: {
    getMonth(val) {
      this.month = val
    },
    getDate(val) {
      this.getPaymentDetailPerson(val)
      this.getDeclareProject(val)
      this.getAmountInfo(val)
      this.getAmountDetail(val)
      this.getPaymentDetailFamily(val)
    },
    // 获取个人发放信息
    getPaymentDetailPerson(month) {
      const { idCard } = this.userInfo
      const newMonth = month ? month : this.getNowDate()
      requestFFGetPaymentDetail(newMonth, idCard).then((res) => {
        const { list } = res
        this.detailPersonList = list
      })
    },
    // 获取家庭发放信息
    getPaymentDetailFamily(month) {
      const newMonth = month ? month : this.getNowDate()
      requestFFGetPaymentDetail(newMonth, this.family_members).then((res) => {
        const { list } = res
        this.detailFamilyList = list
      })
    },
    getNowDate() {
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const newMonth = month.toString().padStart(2, '0')
      const currentYearMonth = `${year}${newMonth}`
      return currentYearMonth
    },
    // 获取申报中项目
    getDeclareProject(month) {
      const { idCard, userName } = this.userInfo
      const newMonth = month ? month : this.getNowDate()
      requestB015('', '', '', '', '', '', idCard, userName, '1', '999', 'cpb100s', newMonth).then((res) => {
        const { lists } = res
        this.declareProjectList = [...lists.hb00List.list]
      })
    },
    // 获取发放中金额
    getAmountInfo(month) {
      const newMonth = month ? month : this.getNowDate()
      const { idCard } = this.userInfo
      requestFFGetAmountInfo(newMonth, idCard).then((res) => {
        const { fieldData } = res
        this.moneyData = { ...fieldData }
      })
    },

    //查询发放中信息
    getAmountDetail(month) {
      const newMonth = month ? month : this.getNowDate()
      const { idCard } = this.userInfo
      requestFFGetAmountDetail(newMonth, '511522199702181916').then((res) => {
        const { list } = res
        this.amountDetailList = [...list]
      })
    },
  },
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {
    userInfo: {
      handler(val) {
        const { idCard, userName, familyInfo } = val
        if (!idCard) {
          showModal('请登录后再访问').then((res) => {
            navigateTo('login', 'packageCommon')
          })
          return
        }
        if (idCard) {
          this.getPaymentDetailPerson('')
          this.getDeclareProject('')
          this.getAmountInfo('')
          this.getAmountDetail('')
        }
        if (familyInfo && familyInfo.members.length > 0) {
          const arr = familyInfo.members.filter((item) => item.idCard !== idCard)
          const str = arr.map((item) => item.idCard).join(',')
          this.family_members = str
          this.getPaymentDetailFamily('', str)
        }
      },
      // immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.month-report {
  .con {
    padding: 0 32rpx 30rpx 32rpx;
    margin-top: -74rpx;
    z-index: 9999;
  }
}
</style>
