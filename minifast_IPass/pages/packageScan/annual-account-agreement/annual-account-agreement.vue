<template>
  <div class="annual-account-agreement">
    <div class="main">
      <div class="agree">
        <div class="agree-title">
          <div class="text">{{ year }}年惠民惠农“一卡通”小程序年度盘点</div>
          <div class="text">用户服务协议</div>
        </div>
        <div class="agree-items">
          <div class="agree-item">
            一、
            {{ year }}年惠民惠农“一卡通”小程序年度盘点（以下简称“{{
              year
            }}年度盘点”）是根据您的惠民惠农“一卡通”账号信息加工整理形成的，您通过点击确认本协议，即视为您已授权并同意惠民惠农“一卡通”小程序向您展示个人年度盘点。
          </div>
          <div class="agree-item">
            二、
            {{
              year
            }}年度盘点需要您本人通过惠民惠农“一卡通”小程序的身份认证并登录小程序后方可查看，如不是本人请立即关闭并退出。
          </div>
          <div class="agree-item">
            三、 为了生成您的{{
              year
            }}年度盘点，我们将根据该协议查询您的惠民惠农“一卡通”账号，以及在统计时间范围内您在惠民惠农“一卡通”小程序平台的相关用户信息，其中关于您的用户注册时间、打开年度盘点的顺序信息会以您访问当天的最新数据进行调取并展示。
          </div>
          <div class="agree-item">
            四、 所需使用的用户信息主要包括：补贴领取、补贴申报、补贴查询、关注政策、关注村社、小程序功能使用情况等信息，并根据前述信息进行汇总统计分析，以用于本活动页面向您进行信息展示。
          </div>
          <div class="agree-item">
            五、 年度盘点中数据统计的时间范围是{{year}}年1月1日到{{year}}年12月31日，其中补贴领取信息的统计范围是补贴发放期号的{{year}}01期到{{year}}12期。
          </div>
          <div class="agree-item">
            六、
            您可通过分享功能向其他人分享自己的年度盘点截图，被分享人可通过扫描截图上的二维码进入小程序，在活动页面查看自己的年度盘点数据。
          </div>
          <div class="agree-item">
            七、
            我们非常重视对您的信息保护，除用于本活动页面向您进行信息展示外，不会对本次查询的信息作其他处理。
          </div>
          <div class="agree-item">
            八、
            本协议用户勾选“本人阅读并同意”，即表示您已准确理解且同意接受本协议，协议自用户勾选确认后生效。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      year: 2023,
    }
  },
  components: {},
  methods: {},
  onLoad(e) {},
}
</script>
<style lang="scss" scoped>
$base-color: #000;
$base-color-placeholder: #888;
.annual-account-agreement {
  background-color: #fff;
  padding: $spacing;
  .agree-title {
    text-align: center;
    margin-bottom: $spacing;
    font-size: 32rpx;
    font-weight: 700;
    color: $base-color;
    .text {
      text-align: center;
    }
  }
  .agree-item {
    color: $base-color-placeholder;
    font-size: 28rpx;
    line-height: 1.4;
    margin-bottom: 12px;
  }
}
</style>
