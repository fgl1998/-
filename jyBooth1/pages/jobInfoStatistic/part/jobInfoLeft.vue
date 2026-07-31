<template>
  <div class="job-info-left">
    <div class="left-item">
      <div class="statistic-title">
        <span>求职招聘总体情况</span>
      </div>
      <div class="overall-box">
        <div v-for="item in overallArray" :key="item.text" class="overall-item">
          <img class="overall-img" :src="item.imgUrl" />
          <div>
            <div class="overall-data">{{ overallData[item.field] || 0 }}</div>
            <div class="overall-text">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="left-item">
      <div class="statistic-title">
        <span>智慧招聘大厅来往人员统计情况</span>
      </div>
      <div class="text-title">累计进场人数（人）：</div>
      <div class="number-class">
        <img class="gender-img" src="../../../static/images/img/jobInfoStatistic/icon-man.png" />
        <div>
          <div class="gender-text text-left">
            <span class="man-text">男性</span><span>{{ personData.man }}人</span><span>{{ personData.manMix }}%</span>
          </div>
          <div class="man-progress-bg">
            <div class="man-progress" :style="{ width: personData.manMix + '%' }" />
          </div>
        </div>
        <div>
          <div class="gender-text text-right">
            <span class="woman-text">女性</span><span>{{ personData.woman }}人</span
            ><span>{{ personData.womanMix }}%</span>
          </div>
          <div class="woman-progress-bg">
            <div class="woman-progress" :style="{ width: personData.womanMix + '%' }" />
          </div>
        </div>
        <img class="gender-img" src="../../../static/images/img/jobInfoStatistic/icon-woman.png" />
      </div>
      <div class="text-title">累计进场人数（人）：</div>
      <div class="digit-box">
        <div
          v-for="(item, index) in formatCountData(personData.man + personData.woman)"
          :key="index"
          class="digit-item"
        >
          <span v-if="item === ','" class="digit-comma">{{ item }}</span>
          <span v-else :class="['digit-num', fillLength - 1 < index ? 'digit-style1' : 'digit-style2']">{{
            item
          }}</span>
        </div>
      </div>
      <div class="text-title">进场人次统计（人）：</div>
      <div class="entry-box">
        <div v-for="(item, index) in entryArray" :key="item.field" class="entry-item">
          <div>
            <img class="entry-img" :src="item.imgUrl" />
          </div>
          <div>
            <div class="entry-title">
              {{ item.title }}
            </div>
            <div class="entry-num">
              {{ entryData[item.field] | formatNum }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jobInfoLeft',
  props: {
    acb330: {
      type: String,
      default: '',
    },
  },
  filters: {
    formatNum(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    },
  },
  data() {
    return {
      overallArray: [
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon1.png'),
          text: '人力资源市场需求总人数(人)',
          field: 'needNum',
        },
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon2.png'),
          text: '举办招聘会场次(次)',
          field: 'recruitNum',
        },
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon3.png'),
          text: '人力资源市场求职总人数(人)',
          field: 'seekerNum',
        },
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon4.png'),
          text: '参加单位(家)',
          field: 'companyNum',
        },
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon5.png'),
          text: '招聘倍率(%)',
          field: 'recruitRate',
        },
        {
          imgUrl: require('../../../static/images/img/jobInfoStatistic/overall-icon6.png'),
          text: '提供岗位(个)',
          field: 'jobNum',
        },
      ],
      overallData: {},
      personData: {
        man: 5892,
        woman: 4218,
        manMix: 60,
        womanMix: 40,
      },
      entryArray: [
        {
          field: 'num1',
          title: '今日进场人次（人）',
          imgUrl: require('../../../static/images/img/jobInfoStatistic/icon-entry1.png'),
        },
        {
          field: 'num2',
          title: '本周进场人次（人）',
          imgUrl: require('../../../static/images/img/jobInfoStatistic/icon-entry2.png'),
        },
        {
          field: 'num3',
          title: '本月进场人次（人）',
          imgUrl: require('../../../static/images/img/jobInfoStatistic/icon-entry3.png'),
        },
        {
          field: 'num4',
          title: '本年进场人次（人）',
          imgUrl: require('../../../static/images/img/jobInfoStatistic/icon-entry4.png'),
        },
      ],
      entryData: {
        num1: 2898,
        num2: 16692,
        num3: 32569,
        num4: 118736,
      },
    }
  },
  computed: {
    fillLength() {
      const count = this.formatCountData(this.personData.man + this.personData.woman)
      let fillStr = ''
      for (let i = 0; i < count.length; i++) {
        if (count.charAt(i) === '0' || count.charAt(i) === ',') {
          fillStr += count.charAt(i)
        } else {
          break
        }
      }
      return fillStr.length
    },
  },
  mounted() {
    this.queryAll()
  },
  methods: {
    // 查询数据
    queryAll() {
      // 获取求职招聘总体情况数据
      const param = {
        acb330: this.acb330,
      }
      this.$http
        .post(this.$requestConstant.businessRequestType, 'queryGeneralSituation', null, param, true)
        .then((res) => {
          this.overallData = res.data.resultData
        })
    },

    // 格式化统计数据
    formatCountData(number) {
      const countArray = number.toString().split('')
      for (let i = countArray.length; i < 8; i++) {
        countArray.unshift('0')
      }
      const count = countArray.join('').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      return count
    },
  },
}
</script>

<style scoped lang="scss">
@import '../../../static/scss/gsCommon.scss';
.job-info-left {
  width: 468px;
}
.statistic-title {
  width: 468px;
}
.overall-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .overall-item {
    width: calc(50% - 10px);
    display: flex;
    align-items: center;
    margin: 25px 10px 30px 0;
    .overall-img {
      width: 40px;
      height: 45px;
      margin-right: 12px;
    }
    .overall-data {
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      font-size: 20px;
      color: #d8e2ff;
      line-height: 24px;
      background: linear-gradient(
        180deg,
        rgba(49, 190, 255, 0.9) 0%,
        rgba(20, 158, 255, 0.9) 0%,
        rgba(239, 252, 254, 0.9) 58%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .overall-text {
      font-family: Alibaba PuHuiTi;
      font-size: 13px;
      color: #b5e0ff;
      line-height: 24px;
    }
  }
}
.text-title {
  font-family: Alibaba PuHuiTi;
  font-weight: 400;
  font-size: 14px;
  color: #b5e0ff;
  padding: 20px 0;
}
.number-class {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .gender-img {
    width: 43px;
    height: 43px;
  }
  .gender-text {
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
    margin-bottom: 10px;
    .man-text {
      color: #b5e0ff;
    }
    .woman-text {
      color: #ffb5b5;
    }
  }
  .man-progress-bg {
    width: 175px;
    height: 12px;
    background: rgba(0, 143, 255, 0.28);
    border-radius: 6px;
    border: 1px solid #008fff80;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .man-progress {
      height: 8px;
      background: linear-gradient(90deg, #137fff, #ffffff);
      box-shadow: 0px 1px 1px 0px rgba(208, 240, 254, 0.34);
      border-radius: 4px;
    }
  }
  .woman-progress-bg {
    width: 175px;
    height: 12px;
    background: rgba(0, 143, 255, 0.28);
    border-radius: 6px;
    border: 1px solid #008fff80;
    display: flex;
    align-items: center;
    .woman-progress {
      height: 8px;
      background: linear-gradient(90deg, #ec4a69, #ffffff);
      box-shadow: 0px 1px 1px 0px rgba(208, 240, 254, 0.34);
      border-radius: 4px;
    }
  }
}
.text-left {
  text-align: left;
  span {
    margin-right: 10px;
  }
}
.text-right {
  text-align: right;
  span {
    margin-left: 10px;
  }
}
.digit-box {
  display: flex;
  align-items: center;
  .digit-item {
    margin-right: 4px;
    font-size: 18px;
    color: #729bc3;
    height: 53px;
  }
  .digit-comma {
    line-height: 90px;
  }
  .digit-num {
    display: inline-block;
    width: 38px;
    height: 53px;
    box-shadow: 0px 8px 8px 0px rgba(113, 168, 234, 0.3);
    border-radius: 2px;
    border: 2px solid;
    border-image: linear-gradient(0deg, #9bcdfc, #9bcdfc, #6197dd, #9bcdfc, #9bcdfc) 2 2;
    text-align: center;

    font-family: Alibaba PuHuiTi;
    font-weight: bold;
    font-size: 30px;
    line-height: 50px;
  }
  .digit-style1 {
    color: #ffffff;
    text-shadow: 0px 2px 8px rgba(5, 28, 55, 0.42);
    background: linear-gradient(
      180deg,
      rgba(49, 190, 255, 1) 0%,
      rgba(20, 158, 255, 1) 0%,
      rgba(239, 252, 254, 1) 58.7646484375%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .digit-style2 {
    color: #6d95bb;
    text-shadow: 0px 8px 6px rgba(159, 194, 240, 0.45);
  }
}
.entry-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .entry-item {
    display: flex;
    align-items: center;
    width: 50%;
    margin-bottom: 25px;
    .entry-img {
      width: 59px;
      height: 66px;
      margin-right: 14px;
    }
    .entry-title {
      font-family: Alibaba PuHuiTi;
      font-size: 14px;
      color: #ffffff;
    }
    .entry-num {
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      font-size: 32px;
      line-height: 42px;
      color: #ffffff;
      background: linear-gradient(
        180deg,
        rgba(49, 190, 255, 1) 0%,
        rgba(20, 158, 255, 1) 0%,
        rgba(239, 252, 254, 1) 58.7646484375%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
