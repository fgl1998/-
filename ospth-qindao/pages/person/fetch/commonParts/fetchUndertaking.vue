<template>
  <view>
    <view style="background-color: #fff; padding: 24rpx; border-radius: 16rpx; box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);">
      <view style="font-size: 36rpx">温馨提示：</view>
      <view class="indent">
        <text style="color: red;font-weight: bold">提取公积金不收费！</text>
        <text style="color: #4788FE;">请通过 <text style="font-weight: bold">联系电话</text> 或官方网站了解政策，符合条件可自行办理，切勿相信中介代提公积金。对骗提套提等违规行为，将记入公积金诚信档案。情节严重的向所在单位通报。涉嫌刑事犯罪的，将依法移送公安机关。</text>
      </view>
    </view>

    <view style="background-color: #fff; padding: 24rpx; border-radius: 16rpx; box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1); margin-top: 24rpx">
      <view style="text-align: center;font-size: 36rpx">青岛市住房公积金提取承诺书</view>
      <view class="indent">本人作为住房公积金提取业务的申请人，承诺将根据有关规定，如实向市住房公积金管理中心提供所需申请材料，并保证提供的提取申请材料均真实、合法、有效，因提供虚假材料所产生的一切后果均由本人承担。如本人提供的申请材料为虚假的或存在其他失信行为，同意纳入市住房公积金管理中心失信名单，并与有关部门信息共享，纳入社会信用体系，向社会公开失信信息。</view>
      <view class="indent" style="font-weight: bold">本人同意授权：（1）市住房公积金管理中心可以通过银行计算机系统查询本人贷款的相关信息，同时许可贷款银行向市住房公积金管理中心提供本人贷款的相关信息，直至本人贷款结清为止；（2）市住房公积金管理中心可以通过共享政务数据，查询本人在税务、住建、公安、民政、社保、医保、不动产、法院等部门的信息，核验本人提交的申请材料和信息的真实性。市住房公积金管理中心对获得的本人上述信息负有保密责任（国家法律、法规规定的除外），且上述信息只能用于本人住房公积金提取审核，包括事后稽核审计。</view>
      <view class="indent">本人已仔细阅读上述所有内容，并已特别注意字体加黑部分。市住房公积金管理中心已应本人要求对相关内容予以准确说明。本人对所有条款的含义及相应的法律后果已全部通晓并充分理解，自愿作出上述授权、承诺和声明。</view>
      <view class="indent" style="font-weight: bold;color: red"> 本人已知晓此次提取后，所剩公积金余额将影响公积金贷款额度，由此产生的一切后果由本人承担。</view>
    </view>

  </view>
</template>
<script>
export default {
  name: 'fetchUndertaking',
  data() {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
.indent {
  text-align: justify;
  text-indent: 2em;
  margin-top: 24rpx;
  line-height: 1.5;
}
</style>
