<template>
  <div class="page">
    <!-- 岗位列表 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">培训</text> 项目 </span> / 点击下方列表可查看
                </div>
              </div>
              <div class="title-rt">
                <uni-row class="demo-uni-row" width="1700" :gutter="20">
                  <uni-col :span="5">
                    <modal-addressCQ
                      areaid="acb215"
                      :areaCode="acb215"
                      v-model="acb215Desc"
                      @setAreaValue="getAreaValue"
                      placeholder="选择地区"
                    ></modal-addressCQ>
                  </uni-col>
                  <!-- <uni-col :span="3">
                    <div class="salary">
                      <uni-data-select
                        :clear="false"
                        placeholder="最低薪资"
                        :localdata="smallList"
                        @change="getSelectValue"
                        v-model="salaryMin"
                      ></uni-data-select>
                    </div>
                  </uni-col>
                  <uni-col :span="3">
                    <div class="salary">
                      <uni-data-select
                        :clear="false"
                        placeholder="最高薪资"
                        :localdata="bigList"
                        @change="getSelectValue1"
                        v-model="salaryMax"
                      ></uni-data-select>
                    </div>
                  </uni-col> -->

                  <uni-col :span="2">
                    <button class="btn btn-white" @click="resetInputAll">重置</button>
                  </uni-col>
                  <uni-col :span="2">
                    <button class="btn btn-blue" @click="getInputAll">搜索</button>
                  </uni-col>
                </uni-row>
              </div>
            </div>
            <div class="wrap-list">
              <ul v-if="jobList.length > 0">
                <li v-for="it in jobList" :key="it.postInformationId" class="listItem" @click="toPage(it)">
                  <div>
                    <div style="display: flex">
                      <image
                        v-if="it.acb21v && it.acb21v == '1'"
                        src="/static/images/zero/ic_tag_jp.png"
                        style="width: 30px; height: 23px; margin-right: 5px"
                      ></image>
                      <view>{{ it.postName }}</view>
                    </div>
                    <div v-if="it.moneyFlag">
                      <span>薪资面议</span>
                    </div>
                    <div v-else>
                      <span v-if="it.salaryMin && it.salaryMax"
                        >{{
                          it.salaryMin && it.salaryMax && it.salaryMin != it.salaryMax
                            ? it.salaryMin + '~' + it.salaryMax
                            : it.salaryMin
                        }}元/月</span
                      >
                      <span v-if="it.salaryMin && !it.salaryMax">{{
                        it.salaryMin && !it.salaryMax ? it.salaryMin + '以上' : ''
                      }}</span>
                      <span v-if="!it.salaryMin && it.salaryMax">{{
                        !it.salaryMin && it.salaryMax ? it.salaryMax + '以下' : ''
                      }}</span>
                      <span v-if="!it.salaryMin && !it.salaryMax">{{
                        !it.salaryMin && !it.salaryMax ? '薪资面议' : ''
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      <span v-if="it.monthSalary">{{ it.monthSalary }}薪</span>
                      <span v-if="it.headcount">招聘人数:{{ it.headcount }}人</span>
                    </div>

                    <p v-if="it.releaseTime">
                      {{ it.releaseTime.split('-')[1] + '-' + it.releaseTime.split('-')[2] }}发布
                    </p>
                  </div>
                  <div>
                    <div>
                      <image src="../../../static/images/waitPage/icon_unit.png" mode="aspectFit" class="icon_unit">
                      </image>
                      <span>{{ it.enterpriseName }}</span>
                    </div>
                    <div>{{ it.townshipAreaName }}</div>
                  </div>
                </li>
              </ul>
              <div v-else class="nodata" style="height: 400px; margin-top: 130px">
                <div class="nodata-pic">
                  <div class="nodata-img"></div>
                  <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-page" v-if="jobList.length > 0">
            <common-pager
              :totals="pageTotal"
              :currentPage="currentPage"
              :pageSize="pageSize"
              @currentChange="currentChange"
            ></common-pager>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
  </div>
</template>

<script>
export default {
  name: 'engageCQ',
  onLoad: function (option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.getCollect()
    this.init()
  },

  data() {
    return {
      userInfo: {},
      isLogin: false,
      currentPage: 1,
      pageSize: 9,
      pageTotal: 0,
      jobList: [],
      salaryMin: '', //最低薪资
      salaryMax: '', //最高薪资
      acb215: '', //招聘详细地址
      acb215Desc: '', //招聘详细地址
      moneyType: 'ACC034LIMIT',
      collectList: [], // 总数组
      smallList: [], // 日新数组
      bigList: [], // 月薪数组
    }
  },
  methods: {
    getAreaValue(val) {
      this.acb215 = val.areaCode.slice(0, 6)
    },
    getInputAll() {
      this.handleGetData()
    },

    // 获取薪资码表并分配数组 //弱智业务逻辑
    getCollect() {
      let collect = this.moneyType.toUpperCase()
      let codeCacheMap = uni.getStorageSync('codeCacheMap')
      if (codeCacheMap && codeCacheMap[collect]) {
        // 有则直接赋值并切割
        this.collectList = codeCacheMap[collect].map((item) => item)
        this.selectAdjust(1)
      } else {
        // 没有缓存或缓存中没有 重新缓存
        this.$utils.appStorage((res) => {
          // 无则请求赋值并切割
          if (res[collect]) {
            this.collectList = res[collect].map((item) => item)
            this.selectAdjust(1)
          } else {
            this.collectList = []
          }
        })
      }
    },

    // 分配数组方法
    selectAdjust(type) {
      const endObj = this.collectList.slice(-1)[0]
      this.smallList = []
      this.bigList = []
      // 月薪
      this.collectList.forEach((item) => {
        item.text = item.label
        if (+item.value >= 1000 && +item.value < 99999) {
          this.smallList.push(item)
        }
        if (+item.value >= 2000) {
          this.bigList.push(item)
        }
      })
    },

    // 获取薪资数值最小
    getSelectValue(value) {
      this.salaryMin = value
    },
    // 获取薪资数值最大
    getSelectValue1(value) {
      this.salaryMax = value
    },

    changeSalary: function (type, e) {
      let val = parseFloat(e.target.value)
      if (val >= 0) {
        switch (type) {
          case 0: //最低
            if (this.salaryMax != '') {
              if (val < parseFloat(this.salaryMax)) {
                this.salaryMin = val
              } else {
                this.salaryMin = ''
                this.$utils.showToast('最低薪资必须小于最高薪资！')
              }
            } else {
              this.salaryMin = val
            }
            break
          default: //最高
            if (this.salaryMin != '') {
              if (val > parseFloat(this.salaryMin)) {
                this.salaryMax = val
              } else {
                this.salaryMax = ''
                this.$utils.showToast('最高薪资必须大于最低薪资！')
              }
            } else {
              this.salaryMax = val
            }
            break
        }
      } else {
        this.$utils.showToast('薪资必须大于等于0！')
      }
    },

    init() {
      this.currentPage = 1
      this.handleGetData()
    },
    // 查询数据
    handleGetData() {
      let param = {
        apiCode: 'jy291_service01',
        method: 'jy291_service01',
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        paginationModel: 'mostCount',
        salaryMin: this.salaryMin,
        salaryMax: this.salaryMax,
        townshipArea: this.acb215,
      }
      this.$utils.request(null, param, true).then((res) => {
        if (res.serviceSuccess) {
          let pageBean = res.data.pageBean
          if (pageBean.total > 0) {
            this.jobList = pageBean.list.map((item) => {
              if (item.salaryMax === '0') {
                item.moneyFlag = true
              } else {
                item.moneyFlag = false
              }
              return item
            })
            this.pageTotal = pageBean.total
          } else {
            this.jobList = []
            // this.$utils.showModal("提示", "尚未查询到相关的岗位信息", false, succ => {}, fail => {
            // })
          }
        } else {
          this.$utils.showModal(res.errors[0].msg)
        }
      })
    },
    //分页返回页码
    currentChange(val) {
      //console.log("翻到第" + val + "页了");
      this.currentPage = val
      this.handleGetData()
    },

    toPage(item) {
      this.$utils.navigateTo('/pages/jobRecruitment/engageCQ/detailCQ?item=' + encodeURIComponent(JSON.stringify(item)))
    },

    resetInputAll: function () {
      this.salaryMin = ''
      this.salaryMax = ''
      this.acb215 = ''
      this.acb215Desc = ''
      this.handleGetData()
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-blue {
  margin-left: 14px;
}

.wrap-list {
  > ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 165px);
    gap: 25px;
    list-style-type: none;
    padding-inline-start: 0px;
  }
}

.listItem {
  width: 526px;
  box-sizing: border-box;
  height: 157px;
  background: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 15px;
  list-style-type: none;
  padding: 17px 22px;

  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;

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
    margin-bottom: 3px;
    justify-content: space-between;

    > div {
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

    > p {
      display: inline-block;
      padding: 4px 12px;
      max-width: 200px;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin-right: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      > span {
        display: inline-block;
        max-width: 315px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .icon_unit {
      width: 36px;
      height: 36px;
      margin-right: 8px;
    }
  }
}

.pic-img {
  width: 100%;
  height: 137px;
}

.sitem-box {
  .salary-item {
    .uni-input {
      width: 100% !important;
    }
  }

  .tags-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 320px;

    .tag-item {
      color: #999999;
      border: 1px solid #cccccc;
      min-width: 120px;
      text-align: center;
      height: 48px;
      line-height: 48px;
      padding: 0 10px;
      box-sizing: border-box;
      margin-right: 16px;
      margin-bottom: 16px;
      border-radius: 4px;

      &.active {
        border: 1px solid #4baafe;
        color: #4dabfd;
      }
    }
  }

  .uni-input {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border: 1px solid #dcdfe6;
    background: #ffffff;
    padding: 0 16px;
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 4px;
  }

  .salary-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .uni-input {
      width: 140px;
    }

    span {
      margin: 0 16px;
      color: #999999;
    }
  }
}
</style>
