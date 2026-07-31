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
                  <span><text style="color: #0c6af7 !important">职位</text> 列表 </span>
                </div>
              </div>
              <div class="kind-list">
                <span
                  :class="{ active: activeIndex === index }"
                  v-for="(item, index) in kindList"
                  :key="index"
                  @click="handleKind(index)"
                  >{{ item }}</span
                >
              </div>
              <div class="title-rt">
                <uni-row class="demo-uni-row" width="1700" :gutter="20">
                  <!-- <uni-col :span="1">
					          <a style="color: #0C6AF7;border-bottom: 1px solid #0C6AF7;line-height: 10px;" @click="sortSearch('1')">最新</a>
					          <a style="color: #0C6AF7;border-bottom: 1px solid #0C6AF7;line-height: 10px;" @click="sortSearch('3')">最热</a>
					        </uni-col> -->
                  <uni-col :span="5">
                    <modal-address
                      areaid="acb215"
                      :areaCode="acb215"
                      v-model="acb215Desc"
                      @setAreaValue="getAreaValue"
                      placeholder="选择地区"
                    ></modal-address>
                  </uni-col>
                  <uni-col :span="4">
                    <custom-select
                      collect="acb469"
                      placeholder="选择工作形式"
                      @change="getSelectType"
                      v-model="acb469"
                    />
                  </uni-col>
                  <uni-col :span="4">
                    <custom-select
                      collect="acc034"
                      placeholder="选择薪资范围"
                      @change="getSelectValue"
                      v-model="acc034"
                    />
                    <!-- <div class="salary">
                      <uni-data-select
                        :clear="false"
                        placeholder="最低薪资"
                        :localdata="smallList2"
                        @change="getSelectValue"
                        v-model="acb21h"
                      ></uni-data-select>
                    </div> -->
                  </uni-col>
                  <uni-col :span="4">
                    <modal-workType
                      moduleKey="aca111"
                      :moduleId="aca111"
                      v-model="aca112"
                      @setModalValue="getAca111Value"
                      placeholder="选择工种"
                    ></modal-workType>
                  </uni-col>

                  <uni-col :span="2">
                    <button class="btn btn-white" @click="resetInputAll">重置</button>
                  </uni-col>
                  <uni-col :span="2">
                    <button class="btn btn-blue" @click="getInputAll">搜索</button>
                  </uni-col>
                </uni-row>
              </div>
            </div>
            <div class="tips" v-if="activeIndex == 0 && !isLogin" @click="toLogin">
              <image src="../../../static/images/findWork/icon_vector.png" mode="scaleToFill" />
              <span>登录</span>获得更精准的职位推荐
            </div>
            <div class="wrap-list">
              <ul v-if="jobList.length > 0">
                <li v-for="it in jobList" :key="it.acb210" class="listItem" @click="toPage(it, 1)">
                  <div>
                    <div style="display: flex">
                      <image
                        v-if="it.acb21v && it.acb21v == '1'"
                        src="/static/images/zero/ic_tag_jp.png"
                        style="width: 30px; height: 23px; margin-right: 5px"
                      ></image>
                      <view>{{ it.acb213 }}</view>
                    </div>
                    <div>
                      <span v-if="it.acb21h && it.acb21j"
                        >{{
                          it.acb21h && it.acb21j && it.acb21h != it.acb21j ? it.acb21h + '~' + it.acb21j : it.acb21h
                        }}元/月</span
                      >
                      <span v-if="it.acb21h && !it.acb21j">{{
                        it.acb21h && !it.acb21j ? it.acb21h + '以上' : ''
                      }}</span>
                      <span v-if="!it.acb21h && it.acb21j">{{
                        !it.acb21h && it.acb21j ? it.acb21j + '以下' : ''
                      }}</span>
                      <span v-if="!it.acb21h && !it.acb21j">{{ !it.acb21h && !it.acb21j ? '薪资面议' : '' }}</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      <!-- <span v-if="it.aac011_dsc">{{ it.aac011_dsc }}</span>
                      <span v-if="it.acb00r">{{ it.acb00r }}</span>
                      <span v-if="it.acb469_dsc">{{ it.acb469_dsc }}</span>
                      <span v-if="it.aab056_desc">{{ it.aab056_desc }}</span> -->
                      <span v-if="it.aac011">{{ it.aac011 ? $utils.queryCodeDesc('aac011', it.aac011) : '' }}</span>
                      <span v-if="it.acb00r">{{ it.acb00r ? $utils.queryCodeDesc('acb00r', it.acb00r) : '' }}</span>
                      <span v-if="it.acb469">{{ it.acb469 ? $utils.queryCodeDesc('acb469', it.acb469) : '' }}</span>
                      <span v-if="it.aab056">{{ it.aab056 ? $utils.queryCodeDesc('aab056', it.aab056) : '' }}</span>
                    </div>

                    <p v-if="it.aae044">{{ it.aae044.substr(0, 10) }}发布</p>
                  </div>
                  <div>
                    <div>
                      <image src="../../../static/images/waitPage/icon_unit.png" mode="aspectFit" class="icon_unit">
                      </image>
                      <span>{{ it.aab004 }}</span>
                    </div>
                    <div>{{ it.acb215PathDesc }}</div>
                  </div>
                </li>
              </ul>
              <div v-else class="nodata" style="height: 400px; margin-top: 130px">
                <div class="nodata-pic">
                  <div class="nodata-img"></div>
                  <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                </div>
              </div>
              <!-- 							<div class="list-con">
								<table class="table">
									<tr>
										<th>职位名称</th>
										<th style="width: 15%;">薪资情况</th>
										<th style="width: 25%;">公司名称</th>
										<th style="width: 30%">地址</th>
										<th style="width: 10%;text-align: center;">操作</th>
									</tr>
									<template v-if='jobList.length > 0'>
										<tr v-for="(item,index) in jobList" :key="index" >
											<td style="font-weight: bold;">{{item.acb213}}</td>
											<td style="width: 15%;">
												<span>{{item.acb21h&&item.acb21j ? item.acb21h + '~' + item.acb21j :''}}元/月</span>
												<span>{{item.acb21h&&!item.acb21j ? item.acb21h + '以上':''}}</span>
												<span>{{!item.acb21h&&item.acb21j ? item.acb21j + '以下':''}}</span>
												<span>{{!item.acb21h&&!item.acb21j ? '薪资面议' :''}}</span>
											</td>

											<td style="width: 25%;">{{item.aab004}}</td>
											<td style="width: 30%">{{item.acb217}}</td>
											<td style="width: 10%;text-align: center;color: #0C6AF7;cursor: pointer;" @click="toPage(item)">查看详情</td>
										</tr>
									</template>

									<template v-else>
										<tr class='nodata' style="height: calc(100% - 64px);">
											<td class="nodata-pic">
												<div class="nodata-img"></div>
												<div class="nodata-text">暂时检索不到你要的数据哦~</div>
											</td>
										</tr>
									</template>
								</table>
							</div> -->
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
  onLoad: function (option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    const currentLocation = uni.getStorageSync('currentLocation')
    if (currentLocation) {
      this.acb215 = currentLocation.areaCode || ''
      this.acb215Desc = currentLocation.areaName || ''
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
      aca111: '', //行业
      aca112: '', //行业
      acc034: '', //薪资范围
      acb469: '', //形式
      acb215: '', //招聘详细地址
      acb215Desc: '', //招聘详细地址
      sort: '',
      moneyType: 'ACC034LIMIT',
      collectList: [], // 总数组
      smallList: [], // 日新数组
      bigList: [], // 月薪数组
      kindList: ['推荐', '最新', '最热'],
      activeIndex: 1,
    }
  },
  methods: {
    toLogin() {
      this.$utils.navigateToLogin()
    },
    sortSearch(sortValue) {
      this.sort = sortValue
      this.init()
    },
    getAca111Value(val) {
      //获取弹窗数据设置
      this.aca111 = val.aca111
    },

    getAreaValue(val) {
      this.acb215 = val.areaCode
      this.acb215Desc = val.areaname
    },

    getSelectType(value) {
      this.acb469 = value
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
      this.acc034 = value
    },

    init() {
      this.currentPage = 1
      this.handleGetData()
    },
    // 查询数据
    handleGetData() {
      if (this.isLogin && this.activeIndex === 0) {
        let param = {
          aac147: this.userInfo.aac147,
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          paginationModel: 'mostCount',
          method: 'jy202_hrm1443',

          aca111: this.aca111,
          acc034: this.acc034,
          acb215: this.acb215,
          acb469: this.acb469,
        }
        // if (this.aca111) {
        //   param.aca111 = this.aca111
        // } else if (this.userInfo && this.userInfo.aca111) {
        //   param.aca111 = this.userInfo.aca111
        // }
        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
          let pageBean = res.pageBean
          if (pageBean.total > 0) {
            this.jobList = pageBean.list
            this.pageTotal = pageBean.total
          } else {
            this.jobList = []
          }
        })
      } else {
        let param = {
          method: 'jy202_hrm101',
          ycb211: '0',
          paginationModel: 'mostCount',
          pageNumber: this.currentPage,
          pageSize: this.pageSize,

          aca111: this.aca111,
          acc034: this.acc034,
          acb215: this.acb215,
          acb469: this.acb469,
          audit_status: '0', //职位审核通过
          cb21Sort: this.sort,
          aac001: this.userInfo.aac001,
        }
        //param.ycb213 = this.type.code;
        if (this.aca111) {
          param.aca111 = this.aca111
        } else if (this.userInfo && this.userInfo.aca111) {
          param.aca111 = this.userInfo.aca111
        }
        if (this.acb211 != undefined) {
          param.acb211 = this.acb211
        }

        this.$utils.request(null, param, true).then((res) => {
          let pageBean = res.pageBean
          if (pageBean.total > 0) {
            this.jobList = pageBean.list
            this.pageTotal = pageBean.total
          } else {
            this.jobList = []
            // this.$utils.showModal("提示", "尚未查询到相关的岗位信息", false, succ => {}, fail => {
            // })
          }
        })
      }
    },
    //分页返回页码
    currentChange(val) {
      //console.log("翻到第" + val + "页了");
      this.currentPage = val
      this.handleGetData()
    },

    toPage(item, type) {
      if (type === 1) {
        item.oddJob = false
        this.$utils.navigateTo(
          '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' + encodeURIComponent(JSON.stringify(item)),
        )
      } else {
        this.$utils.navigateTo(
          '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' + encodeURIComponent(JSON.stringify(item)),
        )
      }
    },

    resetInputAll: function () {
      this.aca111 = ''
      this.aca112 = ''
      this.acc034 = ''
      this.acb215 = ''
      this.acb215Desc = ''
      this.acb469 = ''
      this.handleGetData()
    },

    handleKind(index) {
      if (this.activeIndex === index) return
      this.activeIndex = index
      this.resetInputAll()
      if (index === 0) {
        this.sortSearch('0')
      }
      if (index === 1) {
        this.sortSearch('1')
      }
      if (index === 2) {
        this.sortSearch('3')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-blue {
  margin-left: 14px;
}

.tips {
  color: #999;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  image {
    width: 24px;
    height: 24px;
    margin: 0 2px;
  }
  span {
    color: #0c6af7;
    padding-right: 4px;
  }
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 300px;
    }

    > div:last-child {
      font-weight: bold;
      font-size: 18px;
      color: #eb3527;
      flex-shrink: 0;
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
      max-width: 200px;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
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

.kind-list {
  margin-right: -36px;
  span {
    color: #2b2b2b;
    font-size: 22px;
    &.active {
      border-bottom: 1px solid #0c6af7;
      color: #0c6af7;
    }
    &:not(:first-child) {
      margin-left: 12px;
    }
  }
}

// .modal-input /deep/ .is-disabled{
// 	border-color: #e5e5e5 !important;
// 	 background-color: #fff !important;
// }
// .modal-input /deep/ .is-disabled .uni-input-placeholder{
// 	color: #999  !important;
// }
</style>
