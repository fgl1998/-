<!-- 提取人身份 -->
<template>
  <div>
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
            <view>姓名：{{item.tqrxm}}
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
        <image style="width: 50vw;height: 50vw;margin-top: 48rpx" src="https://bj.bcebos.com/qr-code/2604231537fca90b4023.jpg"/>
      </view>
    </van-popup>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/paymentTransferEsf/three/mixin'

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
