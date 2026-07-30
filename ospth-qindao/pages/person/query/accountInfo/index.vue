<!--个人账户查询-->
<template>
  <query-layout>
    <view class="con_layout">
      <view class="header-card">
        <view class="one-line">
          <text>公积金账号：{{'123***456'}}</text>
        </view>
        <van-divider />
        <view class="two-line">
          <text>账户余额</text>
          <van-icon size="20" name="eye-o" color="#fff"/>
          <!--<van-icon size="24" name="closed-eye" />-->
        </view>
        <view class="three-line">
          ￥{{'122,321.01'}}
        </view>
        <view class="four-line">
          <text>账户状态：{{'正常'}}</text>
          <text>开户日期：{{'2020-01-01'}}</text>
        </view>
      </view>

      <van-form ref="form" class="form" :scroll-to-error="true">
        <van-form-item-map
            v-for="(item, index) in formConfig.fields"
            :key="index"
            v-if="!item.if || item.if(formData)"
            :formItemConfig.sync="item"
            :formData="formData"
        />
      </van-form>

      <van-cell-group title="借记卡信息">
        <van-cell title="借记卡号" value="********3234"/>
        <van-cell title="所属银行" value="工商银行"/>
      </van-cell-group>

      <van-cell-group title="联名卡信息">
        <van-cell title="联名卡号" value="********1234"/>
        <van-cell title="发卡银行" value="工商银行"/>
      </van-cell-group>

<!--      <view class="van-cell-group">-->
<!--        <van-cell title="个人明细账" is-link />-->
<!--        <van-cell title="公积金缴存证明" is-link />-->
<!--      </view>-->
    </view>
  </query-layout>
</template>

<script>
import {mapActions, mapMutations,} from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'
import commonMixin from '@osppm/mixin/common.js'
import accountInfoMixin from '@osppm/store/person/query/accountInfo/accountInfoMixin'

export default {
  name: 'accountInfo',
  mixins: [codeTableMixin, commonMixin, accountInfoMixin],
  components: {},
  props: {},
  data () {
    return {
      srcImg: '',
      visible: false,
      accInfo: {},
      codeList: [],
      showAccountPicker: false,
      finalColumns: [
          {value: '1', label: '123***456（正常）'},
      ]
    }
  },
  async mounted () {
    // await this.initCodeTable(['GRZHZT'])
  },
  onLoad(options) {
    // uni-app 中使用 onLoad 获取路由参数
    const projectNo = options?.projectNo
    if (projectNo) {
      this.setYwdjh(projectNo)
    }
  },
  async created () {
    // 获取账户信息
    // this.accInfo = await this.queryRemittance({})
    this.srcImg = this.getUserAvatar(this.accInfo)
  },
  methods: {
    ...mapActions('accountInfo', ['queryRemittance']),
    ...mapMutations('accountInfo', ['setYwdjh']),
    sureToAssign () {
      this.visible = false
      uni.navigateTo({
        url: '/pages/home/assign'
      })
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  background-color: #f5f5f5;
  margin-bottom: 24rpx;

  .header-card{
    background: url("@/pages/person/query/accountInfo/image/bg_01.png");
    background-size: 100% 100%;
    font-size: 28rpx;
    padding: 32rpx 24rpx;
    color: #F5F5F5;

    .one-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .two-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .three-line {
      font-size: 64rpx;
      font-weight: bold;
      text-align: left;
      margin: 20rpx 0;
      letter-spacing: 2rpx;
    }

    .four-line{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .form {
    margin-top: 24rpx;
    border-radius: 12rpx !important;
    overflow: hidden !important;
  }

  .van-cell-group {
    margin-top: 24rpx;
    border-radius: 12rpx !important;
    overflow: hidden !important;
  }
}
</style>
