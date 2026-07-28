<template>
  <div class="company-detail">
    <div class="company-detail-content">
      <div class="item" v-for="(item, index) in renderList" :key="index">
        <!-- 数据有效性 -->
        <block v-if="item.aae100 == '1'">
          <div class="title" v-if="item.chp221" :style="{ color: index == '0' ? '#000' : '#4c80f6' }">
            {{ item.chp221 }}
          </div>
          <div class="word-content" v-if="item.chp222">
            {{ item.chp222 }}
          </div>

          <block v-for="(img, i) in item.hi21List" :key="i">
            <image
              show-menu-by-longpress
              v-if="img.aae100 == '1'"
              :src="getImageUrl(img.chi215)"
              mode="widthFix"
              :style="{ marginTop: index == '0' ? '0' : '20rpx' }"
              @click="navigate(i === item.hi21List.length - 1 ? item.chp223 : '')" />
          </block>
        </block>
      </div>
    </div>
    <div class="company-detail-footer">
      <div class="left">
        阅读： <span>{{ chp21b }}</span>
      </div>
      <button class="btn" open-type="share">
        <img src="./images/u73.svg" alt="" />
        <div class="text">分享</div>
      </button>
    </div>
  </div>
</template>

<script>
  import config from '@/config'
  import { navigateTo, setNavigationBarTitle, getImageInfo } from '@/utils/uni-api'
  import { requestB259, requestB260 } from '@/service/api'
  export default {
    data() {
      return {
        chp210: '',
        chp21c: '',
        chp21b: '',
        title: '',
        renderList: []
      }
    },
    mounted() {
      // setNavigationBarTitle('凉山州农业融资担保有限公司')
    },
    async onLoad(e) {
      const { chp210, chp21c, title } = e
      const res = await this.requestB259Data(chp210)
      this.renderList = res.lists.Hp22List.list
      this.chp21b = res.chp21b
      this.chp21c = chp21c
      this.chp210 = chp210
      console.log(title)
      this.title = title
      setNavigationBarTitle(title)
      this.requestB260AddCount(chp210)
    },
    computed: {},
    methods: {
      // 设置图片大小
      // async imageStyle(type) {
      //     const screenWidth = uni.getSystemInfoSync().screenWidth
      //     const res = await getImageInfo(
      //       'https://inews.gtimg.com/om_bt/OHyQqgC_5oi4Vm0tlH49XvJzqNBHo2Zryxx5F_be5N2cIAA/1000'
      //     )
      //     // 图片原始宽高
      //     const { width: imageWidth, height: imageHeight } = res
      //     //设置最终图片宽度为屏幕80%
      //     const finalWidth = screenWidth * 0.8 // 假设你想要图片宽度为屏幕宽度的一半
      //     const finalHeight = (finalWidth / imageWidth) * imageHeight
      //     return {
      //       width: finalWidth + 'px',
      //       height: finalHeight + 'px'
      //     }
      // },
      // 得到统一存储图片
      getImageUrl(chi215) {
        const { requestUrl } = config
        const finalSrc = requestUrl + '/upload/downloadFile/' + chi215
        return finalSrc
      },
      //获取公司详情页面数据
      requestB259Data(chp210) {
        return new Promise((resolve, reject) => {
          requestB259(chp210)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 触发链接事件
      navigate(href) {
        if (href) {
          const url = decodeURIComponent(escape(atob(href)))
          console.log(url, 999)
          this.requestB260AddCount(this.chp210)
          navigateTo('web-view', 'packageScan', { url })
        }
      },
      // 增加访问次数
      requestB260AddCount(chp210) {
        requestB260(chp210).then((res) => {})
      },
      // 分享给朋友
      onShareAppMessage(e) {
        return {
          title: this.title, // 转发标题
          path: `/pages/packageScan/company-detail/company-detail?chp210=${this.chp210}&chp21c=${this.chp21c}&title=${this.title}` // 转发路径
          // query: `type=share&chp210=${this.chp210}&chp21c=${this.chp21c}&title=${this.tittle}` // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          // imageUrl: imageShare // 自定义图片路径
        }
      },
      // 分享到朋友圈
      onShareTimeline(e) {
        return {
          title: this.title, // 转发标题
          path: `/pages/packageScan/company-detail/company-detail?chp210=${this.chp210}&chp21c=${this.chp21c}&title=${this.title}` // 转发路径
          //query: `type=share&chp210=${this.chp210}&chp21c=${this.chp21c}&title=${this.tittle}` // 自定义页面路径中携带的参数，如 path?a=1&b=2 的 “?” 后面部分
          // imageUrl: imageShare // 自定义图片路径
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  uni-image {
    display: block;
  }
  image {
    width: 100%;
    margin: 20rpx 0;
    // margin-left: 10%;
    display: block;
  }
  .company-detail {
    width: 100%;
    background-color: #f8f8f8;
    .company-detail-content {
      padding: 20rpx;
      padding-top: 10rpx;
      background-color: #fffeeb;
      box-sizing: border-box;
      width: 100%;
      .item {
        .title {
          font-size: 40rpx;
          font-weight: bold;
          text-align: center;
          margin: 10rpx 0;
        }
        .word-content {
          text-indent: 2em;
          font-size: 32rpx;
          word-break: break-all;
          background-color: #fffeeb;
        }
      }
    }
    .company-detail-footer {
      box-sizing: border-box;
      padding: 10rpx 20rpx;
      font-size: 26rpx;
      color: #7f7f7f;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        span {
          margin-left: 5rpx;
        }
      }
      .btn {
        width: 120rpx;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 26rpx;
        color: #7f7f7f;
        img {
          width: 40rpx;
          height: 40rpx;
          margin-bottom: 5rpx;
        }
      }
    }
  }
</style>
