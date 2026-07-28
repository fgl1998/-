<template>
  <div class="create-card-container" :style="imageStyle">
    <div class="create-card-title">
      <div class="title-inner">
        <img src="./image/u15.png" />
      </div>
      <div class="title-msg">
        <p>自贡市社银一体化</p>
        <p>服务网点电子地图</p>
      </div>
    </div>
    <div class="create-card-content" @click="onJumpRoute('1')">
      <div class="icon">
        <img
        src="./image/u11.svg"
        />
      </div>
      <div class="item-info">
        <p>合作银行网点</p>
        <p class="desc">在地图上查找网点</p>
      </div>
    </div>
    <div class="create-card-content" @click="onJumpRoute('2')">
      <div class="icon">
        <img
        class="position"
        src="./image/u5.svg"/>
      </div>
      <div class="item-info">
        <p>社银服务事项</p>
        <p class="desc">授权银行办理的社银合作业务</p>
      </div>
    </div>
  </div>
</template>
<script>
import bgImage from './image/u1.png'
import { navigateTo } from '@/utils/uni-api'
export default {
  name: 'pageCreateCard',
  data() {
    return {}
  },
  components: {},
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
  },
  methods: {
    onJumpRoute(index) {
      index == '1' ? navigateTo('service-network', 'packageCommon') : navigateTo('business-list', 'packageScan')
    },
  },
  computed:{
    imageStyle(){
      return `background-image:url(${bgImage})`
    }
  }
}
</script>

<style lang="scss" scoped>
// uni-page-body,html,body{
//   height:100%;
// }
// .page{
//   height:100%;
// }
.create-card-container {
  width: 100%;
  height: 100vh;
  padding: $spacing 0;
  background-size:100% 103%;
  background-position: 0 1%;
  background-color:#00469c;
  color: #fff;
  .create-card-title {
    width: 100%;
    .title-inner {
      img {
        width: 350rpx;
        height: 384rpx;
        margin: 0 auto;
      }
    }
    .title-msg {
      text-align: center;
      margin-top: 40rpx;
      //font-size: 40rpx;
      font-size:64rpx;
      font-weight:700;
      p {
        margin: 0;
      }
    }
  }
  .create-card-content {
    margin: 0 auto;
    margin-top: 40rpx;
    margin-bottom: 20rpx;
    width: 600rpx;
    height:200rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    background-color: rgba(48,118,191,0.5);
    border-radius: 40rpx;
    font-size: 32rpx;
    line-height: 1;
    white-space: nowrap;
    padding: 20rpx 0;
    font-weight: 500;
    .icon {
      width: 120rpx;
      height: 120rpx;
      margin-right: 50rpx;
      margin-left:30rpx;
      border:1px solid rgba(121,121,121,1);
      background-color:#fff;
      border-radius:50%;
      position:relative;
      img{
        width:50rpx;
        height:50rpx;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
      }
      .position{
        height:70rpx !important;
      }
    }
    p{
      font-size:44rpx;
    }
    .desc {
      padding-top: 12rpx;
      opacity: 0.8;
      line-height: 1;
      font-size: 24rpx;
      font-weight: 400;
      //text-align: center;
      margin-top:20rpx;
    }
  }
  .create-card-footer {
    text-align: center;
    margin: 0 auto;
    margin-top: 40rpx;
    .footer-title {
      text-align: center;
      font-size: 32rpx;
      line-height: 1;
    }
    .footer-content {
      width: 300rpx;
      text-align: left;
      font-size: 28rpx;
      margin: 20rpx auto;
      opacity: 0.8;
    }
  }
}
</style>
