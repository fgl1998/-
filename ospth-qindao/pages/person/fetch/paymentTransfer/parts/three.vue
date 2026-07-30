<!-- 提取人身份 -->
<template>
  <div>
    <box-title title="收款账户信息"/>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
    <box-title title="提取人信息"/>
    <view style="background-color: #fff;text-align: right;padding-right: 24rpx;color: #005fe2">
      提取总额：0 元
    </view>
    <!-- 第二步：提取人信息列表（共用一套档案） -->
    <div class="extract-page">
      <view class="user-info-card" v-for="item in personList">
        <view class="user-info-left">
          <van-icon name="contact" class="icon" />
          <view class="info-text">
            <view>
              姓名：{{item.tqrxm}}
              <van-tag v-if="item.tqje" plain style="margin-left: 24rpx" type="primary" color="#07c160" text-color="#07c160">已授权</van-tag>
              <van-tag v-else plain style="margin-left: 24rpx" type="primary">未授权</van-tag>
            </view>
            <view>证件号码：{{item.zjhm}}</view>
            <view>提取金额：{{item.tqje || '待对方录入'}}</view>
          </view>
        </view>
        <view class="right-text">
          <van-button type="info" size="small" @click="showEventPopup = true">操作</van-button>
        </view>
      </view>
      <!-- 新增提取人按钮 -->
      <van-contact-card style="padding: 48rpx 24rpx" type="add" add-text="添加提取人" @click="openPopup"/>
    </div>

    <van-popup v-if="showPopup" v-model="showPopup" position="bottom" round
               :style="{ height: '60%',display: 'flex', flexDirection: 'column' }">
      <van-form>
        <van-form ref="form" :scroll-to-error="true">
          <van-form-item-map
              v-for="(item, index) in formConfig.fields2"
              :key="index"
              v-if="!item.if || item.if(personFormData)"
              :formItemConfig.sync="item"
              :formData="personFormData"
          />
        </van-form>
      </van-form>
      <van-button style="margin-top: auto" type="info" block @click="addPersonInfo">确定</van-button>
    </van-popup>

    <van-popup v-model="showEventPopup" position="bottom">
      <van-picker title="操作" show-toolbar
          :columns="[{label: '授权', value: '授权'}, {label: '删除', value: '删除'},{label: '修改', value: '修改'}]"
          value-key="label"
          @confirm="onConfirm"
          @cancel="showEventPopup = false"
      />
    </van-popup>


    <!-- 授权确认弹窗 -->
    <van-popup v-model="showAuthPopup" position="bottom" :style="{ height: '50%' }" round closeable>
      <view style="margin-top: 80rpx;padding: 0 24rpx;text-align: center">
        <view>请将此授权二维码发送给<text style="font-weight: bold">**名</text>，对方扫码完成身份验证后，即可完成授权操作。</view>
        <image style="width: 50vw;height: 50vw;margin-top: 48rpx" src="data:image/png;base64,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"/>
      </view>
    </van-popup>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/paymentTransfer/three/mixin'

import {
  Toast,
} from 'vant'

export default {
  name: 'two',
  mixins: [mixin],
  data() {
    return {
      selectedAccount: {
        accountName: '', // 账户名称（楼盘监管账户名称）
        bankName: '', // 开户银行
        accountNo: '' // 银行账号
      },
      extractorList: [], //新增数组
      currentIdx: 0, //当前选中的input

      finalPickerTitle: '', //title展示
      finalColumns: '', //数组列表
      formDataIndex: {}, //哪一个对象
      fieldValue: '', //哪一个表单数据value

      // 授权弹窗
      showAuthPopup: false,
      currentAuthIdx: null,
      currentAuthExtractor: null,
      authExtractAmount: '',

      showEventPopup: false
    }
  },
  mounted() {
  },
  methods: {
    confirm(selected) {
      const value = selected.value ?? selected
      const label = selected.label ?? selected
      if (this.formDataIndex == 'extractorList') {
        const idx = this.currentIdx
        this.extractorList[idx][this.fieldValue] = value

        if (label === '本人') {
          this.extractorList[idx].idType = '居民身份证'
          this.extractorList[idx].name = this.oneformData.gfrxm || ''
          this.extractorList[idx].idNo = this.oneformData.gfrzjhm || ''
          this.extractorList[idx].maxExtractAmount = '256000'
          this.extractorList[idx].extractAmount = ''
        } else {
          this.extractorList[idx].maxExtractAmount = '256000'
          this.extractorList[idx].extractAmount = ''
        }
      } else {
        this[this.formDataIndex][this.fieldValue] = value
      }

      this.showPopup = false
    },
    // 确认授权
    confirmAuth() {
      const idx = this.currentAuthIdx
      if (!this.authExtractAmount) {
        Toast('请输入授权提取金额')
        return
      }
      // 保存授权金额与状态
      this.$set(this.extractorList[idx], 'extractAmount', this.authExtractAmount)
      this.$set(this.extractorList[idx], 'authorized', true)
      this.showAuthPopup = false
      Toast.success('授权成功')
    },

    async beforeNext() {
      return true
    },
    onConfirm(val) {
      if (val.value === '授权') {
        this.showAuthPopup = true
      }
      this.showEventPopup = false
    }
  }
}
</script>
<style scoped lang="less">
.extract-page {
  background-color: #FFFFFF;

  .user-info-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx;
    margin-bottom: 24rpx;

    position: relative;
  }

  .user-info-card::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-size: 80px;
    content: '';
    z-index: 1; /* 保证显示在最上层 */
  }

  /* 左侧整体布局 */
  .user-info-left {
    display: flex;
    align-items: center;
  }

  /* 图标 */
  .icon {
    margin-right: 24rpx;
  }

  /* 文字区域 */
  .info-text {
    font-size: 28rpx;
    line-height: 1.5;
  }

  /* 右侧文字 */
  .right-text {
  }
}

/* 授权弹窗样式 */
.auth-popup {
  padding: 20px 15px;
  height: 100%;
  box-sizing: border-box;
}

.auth-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.auth-relation {
  font-size: 14px;
  color: #1677ff;
  text-align: center;
  margin-bottom: 15px;
  line-height: 1.5;
}

.auth-group {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 15px;
}

.auth-tip {
  font-size: 14px;
  color: #666;
  margin: 20px 0;
  line-height: 1.6;
  text-align: center;
}

.auth-btn-wrapper {
  margin-top: 20px;
}
</style>
