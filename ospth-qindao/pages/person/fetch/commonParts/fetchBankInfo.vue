<template>
  <van-popup v-model="show" position="bottom" closeable class="bank-info-content"
             @closed = 'cancel'
             :style="{ height: '45%' }">
    <van-form ref="form">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
    <van-button color='#1677ff' style="width: 100%;margin-top: auto" class='btnStyle' @click="add" type="info">新增</van-button>
  </van-popup>
</template>
<script>
import VanInputWrap from '@/components/providentFund/formWrap/vanInputWrap.vue'

export default {
  name: 'bankInfo',
  components: {VanInputWrap},
  data() {
    return {
      show: true,
      formConfig: {
        fields: [
          {
            name: 'skzhmc',
            label: '收款账户名称',
            type: 'input',
            required: true,
            disabled: true,
          },
          {
            name: 'yhkzl',
            label: '账户种类',
            type: 'select',
            required: true,
            options: [
              {label: '银行卡', value: '1'},
              {label: '数字人民币', value: '2'}
            ]
          },
          {
            name: 'yhhb',
            label: '收款银行行别',
            type: 'select',
            required: true,
            options: [
              {label: '工商银行', value: '1'},
              {label: '建设银行', value: '2'}
            ]
          },
          {
            name: 'skzh',
            label: '收款银行账号',
            type: 'input',
            required: true,
          },
        ]
      },
      formData: {},
    }
  },
  methods: {
    add() {
      this.$emit('add', this.formData)
    },
    cancel() {
      this.$emit('cancel')
    }
  },
}
</script>
<style scoped lang="scss">
.bank-info-content{
  padding-top: 84rpx;
  display: flex;
  flex-direction: column;
}
</style>
