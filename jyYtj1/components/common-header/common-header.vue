<template>
  <div class="header">
    <div class="header-lt">
      <image src="../../static/images/index/logo.png" class="logo" mode="aspectFit"></image>
      <image src="../../static/images/index/logo-title.png" class="title" mode="aspectFit"></image>
    </div>
    <div class="header-rt">
      <span class="seconds">{{ date.time }}</span>
      <div class="timeBox">
        <span>{{ date.week }}</span>
        <span>{{ date.date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'common-header',
  created() {
    this.getDate()
  },
  // async mounted() {
  // 	let citys = uni.getStorageSync("cityList")
  // 	if(citys){
  // 		this.cityList = citys.children
  // 	} else {
  // 		citys = await this.getCityList()
  // 		this.cityList = citys.children
  // 		uni.setStorageSync("cityList",citys)
  // 	}
  // 	this.cityList.unshift({...citys,children:null})
  // 	let city = uni.getStorageSync("city")
  // 	if (city && city.channelName && city.aab301) {
  // 		this.city = city;
  // 	} else {
  // 		let { aab301,channelName } = citys
  // 		uni.setStorageSync("city", {channelName,aab301})
  // 		this.city = {aab301,channelName}
  // 	}
  // 	setInterval(this.getDate, 1000)
  // },
  data() {
    return {
      title: '银海自助招聘平台',
      city: {
        aab301: '510000',
        channelName: '四川省',
      },
      // date: "2020/02/25",
      week: '星期二',
      time: '',
      isShow: false,
      defaultCity: {},
      cityList: [],
      timer: '',
      date: {},
      sysdateTimer: null,
    }
  },
  mounted() {
    // this.getSysdate()
    // if (!this.sysdateTimer) {
    //   console.log('timmer不存在')
    //   this.sysdateTimer = setInterval(() => {
    //     this.getSysdate()
    //   }, 30000)
    // }
    this.startLocalClock()
  },
  methods: {
    // 前端本地时间兜底/更新
    startLocalClock() {
      // 先立即更新一次
      this.updateLocalDate()
      if (this.localTimer) {
        clearInterval(this.localTimer)
      }
      this.localTimer = setInterval(() => {
        this.updateLocalDate()
      }, 1000)
    },
    updateLocalDate() {
      const now = new Date()
      const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
      const yyyy = now.getFullYear()
      const mm = pad(now.getMonth() + 1)
      const dd = pad(now.getDate())
      const hh = pad(now.getHours())
      const mi = pad(now.getMinutes())
      const ss = pad(now.getSeconds())
      this.date = {
        ...this.date,
        time: `${hh}:${mi}:${ss}`,
        week: weekMap[now.getDay()],
        date: `${yyyy}-${mm}-${dd}`,
      }
    },
    getSysdate() {
      let param = {
        method: 'getSysdate',
      }
      this.$utils.request(null, param).then((res) => {
        this.date = res.data.data
      })
    },
    clickShow() {
      this.isShow = true
      this.defaultCity = this.city
    },
    //点选
    clickCity(item) {
      this.defaultCity = item
    },
    //确定
    clickYes() {
      let item = this.defaultCity
      this.city = item
      uni.setStorageSync('city', {
        channelName: item.channelName,
        aab301: item.aab301,
      })
      this.$emit('cityChange')
      this.isShow = false
    },
    //取消
    clickCancel() {
      this.isShow = false
      this.defaultCity = {}
    },
    getDate() {
      this.timer = setInterval(() => {
        // var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        // var year = date.getFullYear(),
        // 	month = ("0" + (date.getMonth() + 1)).slice(-2),
        // 	sdate = ("0" + date.getDate()).slice(-2),
        // 	hour = ("0" + date.getHours()).slice(-2),
        // 	minute = ("0" + date.getMinutes()).slice(-2),
        // 	second = ("0" + date.getSeconds()).slice(-2);
        // this.time = year + "-" + month + "-" + sdate + " " + hour + ":" + minute + ":" + second;
        // },1000);
        // console.log(this.$moment().format('YYYY'))
        this.time = this.$moment().format('HH:mm')
      }, 1000)
    },
    getCityList() {
      return new Promise((resolve, reject) => {
        let param = {
          method: 'Y0010000023',
          channelCode: 'yns',
        }
        this.$utils.request(null, param).then((res) => {
          resolve(res[0])
        })
      })
    },
  },
  beforeDestroy() {
    clearInterval(this.timer) // 清除旧的时间定时器
    if (this.localTimer) {
      clearInterval(this.localTimer)
    }
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 80px;
  //background: url(../../static/images/header_bg.png) left center no-repeat;
  //background-size: 100% 100%;

  .header-lt {
    display: flex;
    width: 740px;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 90px;
      height: 90px;
    }

    .title {
      width: 630px;
      height: 70px;
    }
  }

  .header-rt {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 350px;
    .seconds {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 56px;
      height: 78px;
      color: #213254;
      font-style: normal;
    }
    .timeBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-flow: column;
      height: 56px;
      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 23px;
        text-align: left;
        font-style: normal;
        align-self: start;
      }
    }
  }
}
</style>
