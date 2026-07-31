<template>
  <div class="pageWait">
    <!-- 首页 -->
    <common-header></common-header>

    <div class="pageContent">
      <div class="robot-img">
        <image src="../../static/images/index/robot2.gif" mode="aspectFit" class="robot-logo" />
      </div>
      <div class="robot-text">
        <div>HI，我是<span>智能客服</span>小圆</div>
        <div>欢迎您体验太原就业自助服务，您可以</div>
        <div class="typeText">
          <div>
            <image src="../../static/images/waitPage/dian.png" mode="aspectFit" class="logoDIan"></image>
            <span>找工作</span>
          </div>
          <div>
            <image src="../../static/images/waitPage/dian.png" mode="aspectFit" class="logoDIan"></image>
            <span>办业务</span>
          </div>
          <div>
            <image src="../../static/images/waitPage/dian.png" mode="aspectFit" class="logoDIan"></image>
            <span>培训班</span>
          </div>
        </div>
        <div class="xiushi">
          <image src="../../static/images/waitPage/xiushi.png" mode="aspectFit" class="xiushi-logo"></image>
        </div>
        <div class="textArea">
          在这里您可以找工作、报名培训班、办理业务、查看零工市场、招聘会、就业服务网点、创业项目等等，并建立自己的简历，马上去体验吧～
        </div>
        <div class="xiushi">
          <image src="../../static/images/waitPage/xiushi.png" mode="aspectFit" class="xiushi-logo"></image>
        </div>
        <div class="robot-btn">
          <span>
            <image src="../../static/images/waitPage/icon_click.png" mode="aspectFit" class="logoDIan"></image>
          </span>
          <span @click="goJob('', true)">点击进入</span>
        </div>
      </div>
      <div class="workBox">
        <div class="frameTop">
          <div>
            <image src="../../static/images/waitPage/icon_hot.png" mode="aspectFit" class="icon_hot"></image>
            <image src="../../static/images/waitPage/bg_Frame.png" mode="aspectFit" class="bg_Frame"></image>
          </div>
          <div @click="goJob('/pages/jobRecruitment/findWork/findWork')">查看更多</div>
        </div>
        <div>
          <div v-if="jobList.length > 0" class="jobBox">
            <div class="jobList">
              <ul
                v-for="(item, index) in lenthNum"
                :key="index"
                :style="`left:${numIndex === item ? '0px' : '526px'};z-index:${numIndex === item ? '1' : '-1'};`"
              >
                <li v-for="it in slicedJobList(index)" :key="it.acb210" class="listItem">
                  <div>
                    <div>{{ it.acb213 }}</div>
                    <div>
                      <span>{{ it.acb21h && it.acb21j ? it.acb21h + '~' + it.acb21j + '元/月' : '' }}</span>
                      <span>{{ it.acb21h && !it.acb21j ? it.acb21h + '以上' : '' }}</span>
                      <span>{{ !it.acb21h && it.acb21j ? it.acb21j + '以下' : '' }}</span>
                      <span>{{ !it.acb21h && !it.acb21j ? '薪资面议' : '' }}</span>
                    </div>
                  </div>
                  <div>
                    <span v-if="it.aac011">{{ it.aac011 ? $utils.queryCodeDesc('aac011', it.aac011) : '' }}</span>
                    <span v-if="it.acb00r">{{ it.acb00r }}</span>
                    <span v-if="it.acb469">{{ it.acb469 ? $utils.queryCodeDesc('acb469', it.acb469) : '' }}</span>
                    <span v-if="it.aab056">{{ it.aab056 ? $utils.queryCodeDesc('aab056', it.aab056) : '' }}</span>
                  </div>
                  <div>
                    <div>
                      <image src="../../static/images/waitPage/icon_unit.png" mode="aspectFit" class="icon_unit">
                      </image>
                      <span>{{ it.aab004 }}</span>
                    </div>
                    <div>{{ it.acb215PathDesc }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="botItem">
              <div
                :class="numIndex === item ? 'numActive' : ''"
                @click="changeNum(item)"
                v-for="(item, index) in lenthNum"
                :key="index"
              ></div>
            </div>
          </div>
          <div v-else class="nodata" style="height: 400px; margin-top: 130px">
            <div class="nodata-pic">
              <div class="nodata-img"></div>
              <div class="nodata-text">暂时检索不到你要的数据哦~</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pageBottom">主办单位：太原市人力资源和社会保障局</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobList: [],
      numIndex: 1,
      timer: null,
      lenthNum: 1, // 数组能分为几段
    }
  },
  mounted() {
    // 可以在这里执行数据刷新、更新页面状态等操作
    this.loadData()
  },
  methods: {
    goJob(url, type) {
      this.stopAutoPlay()
      if (type) {
        uni.reLaunch({
          url: '/pages/index/index', // 跳转到指定页面的路径
        })
        return
      }
      this.$utils.navigateTo(url)
    },
    slicedJobList(index) {
      const startIndex = index * 3 // 计算截取起始索引
      const endIndex = startIndex + 3 // 计算截取结束索引
      const slicedArray = this.jobList.slice(startIndex, endIndex) // 使用slice方法进行截取
      return slicedArray
    },
    // 手动切换
    changeNum(index) {
      this.stopAutoPlay() // 先清除定时器
      this.numIndex = index
      this.startAutoPlay() // 恢复定时器
    },
    nextSlide() {
      if (this.numIndex < this.lenthNum) {
        this.numIndex++
      } else {
        this.numIndex = 1
      }
    },
    // 开始自动播放
    startAutoPlay() {
      if (this.lenthNum > 1) {
        this.timer = setInterval(() => {
          this.nextSlide()
        }, 10000) // 设置自动切换的时间间隔，单位为毫秒
      }
    },
    // 停止自动播放
    stopAutoPlay() {
      clearInterval(this.timer)
    },
    loadData() {
      let param = {
        method: 'jy202_hrm101',
        ycb211: '0',
        pageNumber: 1,
        pageSize: 9,
        audit_status: '0', //职位审核通过
        paginationModel: 'mostCount',
      }
      this.$utils.request(null, param, false).then((res) => {
        let pageBean = res.pageBean
        if (pageBean.total > 0) {
          const lenth = pageBean.list.length
          this.lenthNum = Math.ceil(lenth / 3)
          this.jobList = pageBean.list
          this.startAutoPlay() // 在组件挂载后启动自动播放
        } else {
          this.jobList = []
        }
      })
    },
  },
  beforeDestroy() {
    this.stopAutoPlay() // 在组件销毁前停止自动播放
  },
}
</script>

<style lang="less" scoped>
.pageWait {
  height: 1080px;
  background: url('../../static/images/waitPage/bg@2x.png') center no-repeat;
  background-size: cover;
  font-family: MicrosoftYaHei;

  .pageContent {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 90px 160px 60px 160px;
  }

  .robot-img {
    width: 370px;
    height: 464px;
    display: inline-block;
    float: left;
    animation-name: iconRotate;
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-delay: 1s;
    transform: scale(1.5);

    .robot-logo {
      width: 100%;
      height: 100%;
    }
  }

  .robot-text {
    width: 450px;

    > div:first-child {
      font-weight: 600;
      font-size: 44px;
      color: #143b9c;
      line-height: 52px;
      margin-bottom: 28px;

      span {
        color: #0c6af7;
      }
    }

    > div:nth-child(2) {
      font-weight: 400;
      font-size: 26px;
      color: #143b9c;
      line-height: 30px;
      margin-bottom: 23px;
    }

    .textArea {
      font-weight: 400;
      font-size: 20px;
      color: #1f4093;
      line-height: 28px;
    }

    .typeText {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > div {
        .logoDIan {
          width: 20px;
          height: 20px;
        }

        > span {
          font-weight: 600;
          font-size: 28px;
          color: #1f4093;
          line-height: 33px;
          margin-left: 8px;
        }
      }
    }
  }

  .xiushi {
    width: 440px;
    height: 22px;
    margin: 20px auto;

    .xiushi-logo {
      width: 100%;
      height: 100%;
    }
  }

  .robot-btn {
    margin: 25px auto 0 auto;
    width: 260px;
    height: 80px;
    background: url('../../static/images/waitPage/bg_btn.png') center no-repeat;
    background-size: cover;
    font-size: 28px;
    color: #ffffff;
    line-height: 60px;
    text-align: center;

    > span:first-child {
      display: inline-block;
      width: 36px;
      height: 36px;
      vertical-align: middle;
      margin-right: 10px;

      .logoDIan {
        width: 100%;
        height: 100%;
      }
    }
  }

  .workBox {
    width: 646px;
    height: 699px;
    background: url(../../static/images/waitPage/bg_work.png) center no-repeat;
    background-size: cover;
    box-sizing: border-box;
    padding: 50px 60px;
  }

  .frameTop {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div:first-child {
      .icon_hot {
        width: 36px;
        height: 36px;
        margin-right: 3px;
      }

      .bg_Frame {
        width: 126px;
        height: 30px;
      }
    }

    > div:last-child {
      width: 90px;
      height: 38px;
      border-radius: 5px;
      border: 1px solid #0c6af7;
      color: #0c6af7;
      text-align: center;
      line-height: 38px;
      font-size: 18px;
    }
  }

  .pageBottom {
    font-weight: 400;
    font-size: 24px;
    color: rgba(0, 33, 82, 0.56);
    line-height: 28px;
    letter-spacing: 9px;
    text-align: center;
  }

  .jobBox {
    width: 100%;
    height: 580px;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 20px;

    .jobList {
      width: 100%;
      height: 530px;
      position: relative;
      > ul {
        position: absolute;
        left: 526px;
        top: 0;
        width: 526px;
        height: 530px;
        box-sizing: border-box;
        list-style-type: none;
        padding-inline-start: 0px;
        z-index: -1;
        scrollbar-width: none;
        /* firefox */
        -ms-overflow-style: none;
        /* IE 10+ */
        overflow: hidden;
        transition: all 0.3s ease-in-out;
      }
    }

    .jobList::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }

    .listItem {
      width: 526px;
      box-sizing: border-box;
      height: 157px;
      background: #ffffff;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 15px;
      list-style-type: none;
      padding: 15px 20px;

      > div:first-child {
        display: flex;
        align-items: center;
        justify-content: space-between;

        > div:first-child {
          font-weight: 600;
          font-size: 20px;
          color: #333333;
        }

        > div:last-child {
          font-weight: bold;
          font-size: 18px;
          color: #eb3527;
        }
      }

      > div:nth-child(2) {
        display: flex;
        align-items: center;

        > span {
          display: inline-block;
          padding: 4px 12px;
          max-width: 120px;
          box-sizing: border-box;
          font-weight: 400;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          margin-right: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: #e4e8eb;
          border-radius: 2px;
          margin-top: 10px;
        }
      }

      > div:nth-child(3) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        margin-top: 20px;

        > div:first-child {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.9);
          font-size: 18px;
        }

        .icon_unit {
          width: 36px;
          height: 36px;
          margin-right: 8px;
        }
      }
    }

    .botItem {
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-image: url('../../static/images/waitPage/Rectangle9.png');
        transition: all 0.3s ease-in-out;
        margin-right: 8px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }

      > div:last-child {
        margin-right: 0px;
      }

      > div.numActive {
        width: 18px;
        border-radius: 3px;
        background-image: url('../../static/images/waitPage/Rectangle8.png');
      }
    }
  }
}

@keyframes iconRotate {
  0% {
    rotate: 0deg;
  }

  15% {
    rotate: 10deg;
  }

  30% {
    rotate: -10deg;
  }

  45% {
    rotate: 10deg;
  }

  60% {
    rotate: -10deg;
  }

  75% {
    rotate: 0deg;
  }

  100% {
    rotate: 0deg;
  }

  // 0% {transform:rotateY(360deg)}
  // 50% {transform:rotateY(0deg)}
  // 100% {transform:rotateY(360deg)}
}
</style>
