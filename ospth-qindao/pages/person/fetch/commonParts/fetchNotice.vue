<template>
  <van-notice-bar style="text-align: justify;" color="#1677ff" background="#cce1ff" wrapable :scrollable="false">
    关于提取金额的提示：默认提取金额为符合提取规定的最高可提取额度，最终提取金额以中心审核为准。
    <view style="color: red;">
      提取后，账户余额将影响公积金贷款额度，具体可通过柜面或网上营业厅进行可贷额度试算。提取的住房公积金入账后，不再允许交回本人住房公积金账户。
    </view>
  </van-notice-bar>
</template>
<script>
export default {
  name: 'index'
}
</script>
<style scoped lang="scss">
</style>
