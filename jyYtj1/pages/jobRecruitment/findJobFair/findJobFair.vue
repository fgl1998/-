<template>
  <div class="page">
    <!-- 招聘会列表 -->
    <common-header @cityChange="cityChange" :key="key"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">招聘会</text> 详情 </span> / 点击下方列表可查看
                </div>
              </div>
              <div class="title-rt">
                <uni-row class="demo-uni-row" width="1400" :gutter="20">
                  <uni-col :span="2" style="line-height: 50px; color: #0c6af7">
                    <!-- <a @click="sortHot">最热</a> -->
                    <span class="line" style="padding-left: 1px"></span>
                  </uni-col>
                  <uni-col :span="6">
                    <custom-select
                      placeholder="选择招聘会类型"
                      collect="ACB481"
                      @change="getSelectValue"
                      v-model="acb481"
                    ></custom-select>
                  </uni-col>
                  <uni-col :span="6">
                    <custom-select
                      placeholder="选择专场类型"
                      collect="ACB487"
                      :reverseFilter="false"
                      :filterCode="filterCode"
                      :disabled="disabled"
                      @change="getSelectValue"
                      v-model="acb487"
                    ></custom-select>
                  </uni-col>
                  <uni-col :span="4">
                    <custom-select
                      placeholder="选择状态"
                      :range="statusList"
                      @change="getSelectValue"
                      v-model="jobfairstate"
                    ></custom-select>
                  </uni-col>
                  <!-- <uni-col :span="6">
									<custom-select :defaultValue="status" placeholder="选择状态" :collect="statusList" ></custom-select>
									</uni-col> -->
                  <uni-col :span="3">
                    <button class="btn btn-white" @click="resetInputAll">重置</button>
                  </uni-col>
                  <uni-col :span="3">
                    <button class="btn btn-blue" @click="getInputAll">搜索</button>
                  </uni-col>
                </uni-row>
              </div>
            </div>

            <div class="wrap-list">
              <ul v-if="jobFairList.length > 0">
                <li v-for="(it, index) in jobFairList" :key="index" class="listItem" @click="toPage(it)">
                  <template v-if="it.ce23List">
                    <div style="text-align: center">
                      <image :src="$downLoadImgSrc + it.ce23List[0].aae707" mode="aspectFill" class="bg_jobFairt">
                      </image>
                    </div>
                  </template>
                  <template v-else>
                    <div v-if="it.acb487 == '3'">
                      <image
                        src="../../../static/images/findWork/bg_jobFairt1.png"
                        mode="aspectFill"
                        class="bg_jobFairt"
                      >
                      </image
                      >/
                    </div>
                    <div v-else-if="it.acb487 == '2'">
                      <image
                        src="../../../static/images/findWork/bg_jobFairt2.png"
                        mode="aspectFill"
                        class="bg_jobFairt"
                      >
                      </image>
                    </div>
                    <div v-else>
                      <image
                        src="../../../static/images/findWork/bg_jobFairt.png"
                        mode="aspectFill"
                        class="bg_jobFairt"
                      >
                      </image>
                    </div>
                  </template>
                  <div class="jobTitle">{{ it.acb331 }}</div>
                  <div class="jobNum">
                    <div>
                      <image src="../../../static/images/findWork/icon_units.png" mode="aspectFill" class="icon_units">
                      </image>
                      <span
                        ><span>{{ it.orderCount ? it.orderCount : 0 }}</span
                        >家用人单位</span
                      >
                    </div>
                    <div>
                      <image src="../../../static/images/findWork/icon_work.png" mode="aspectFill" class="icon_work">
                      </image>
                      <span
                        ><span>{{ it.personCount ? it.personCount : 0 }}</span
                        >招聘人数</span
                      >
                    </div>
                  </div>
                  <div class="jobTime">
                    时间：<span
                      >{{ $moment(it.acb333).format('YYYY/MM/DD HH:mm') }}~{{
                        $moment(it.acb334).format('YYYY/MM/DD HH:mm')
                      }}</span
                    >
                  </div>
                  <div class="jobTime">
                    地址：<span>{{ it.acb303 ? it.acb303 : '太原市' }}</span>
                  </div>
                  <div class="jobBtn">
                    <span v-show="it.jobfairstate == '0'" :class="['status', 'status0']">未开始</span>
                    <span v-show="it.jobfairstate == '1'" :class="['status', 'status1']">进行中</span>
                    <span v-show="it.jobfairstate == '2'" :class="['status', 'status2']">已结束</span>
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
										<th style="width: 10%;;text-indent: 20px;">状态</th>
										<th style="width: 22%;">招聘会名称</th>
										<th style="width: 32%;">地址</th>
										<th style="width: 26%;">起至时间</th>
										<th style="width: 10%;text-align: center;">操作</th>
									</tr>
									<template v-if='jobFairList.length > 0'>
										<tr v-for="(item,index) in jobFairList" :key="index">
											<td style="width: 10%;">
												<span v-show="item.jobfairstate=='0'"
													:class="['status','status0']">未开始</span>
												<span v-show="item.jobfairstate=='1'"
													:class="['status','status1']">进行中</span>
												<span v-show="item.jobfairstate=='2'"
													:class="['status','status2']">已结束</span>
											</td>
											<td style="width: 22%;font-weight: bold;">{{item.acb331}}</td>
											<td style="width: 32%;">{{item.acb303}}</td>
											<td style="width: 26%;">{{item.acb333+' 至 '+item.acb334}}	</td>
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
          <div class="wrap-page" v-if="jobFairList.length > 0">
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
  onShow: function () {
    this.key++
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
      // this.$utils.showToast("请登录")
      // setTimeout(()=>{
      // 	this.$utils.navigateToLogin();
      // },1000)
    }
    this.init()
  },
  data() {
    return {
      userInfo: {},
      currentPage: 1,
      pageSize: 4,
      pageTotal: 0,
      acb481: '',
      acb487: '',
      jobfairstate: '',
      status: {
        code: '',
        name: '全部',
      },
      statusList: [
        {
          value: '-1',
          text: '全部',
        },
        {
          value: '0',
          text: '未开始',
        },
        {
          value: '1',
          text: '进行中',
        },
        {
          value: '2',
          text: '已结束',
        },
      ],

      filterCode: [], //过滤数据
      jobFairList: [],
      disabled: true,
      firstClick: false, // 改变城市后是否是第一次点击过更多查询
      key: 0,
      hot: '',
    }
  },
  methods: {
    sortHot() {
      this.hot = '1'
      this.init()
    },
    init() {
      this.currentPage = 1
      this.handleGetData()
    },
    getSelectValue(value, collect) {
      if (collect == 'ACB481') {
        this.acb481 = value
        this.disabled = false
        if (value == '2') {
          this.filterCode = ['2']
        } else {
          this.filterCode = []
        }
      } else if (collect == 'ACB487') {
        this.acb487 = value
      } else {
        this.jobfairstate = value
      }
    },

    getInputAll() {
      this.handleGetData()
    },

    // 查询招聘会数据
    handleGetData() {
      let param = {
        method: 'jy204_hrm100',
        paginationModel: 'mostCount',
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        acb481: this.acb481,
        acb487: this.acb487,
        jobfairstate: this.jobfairstate,
        isAppoint: 1,
        sortPerson: this.hot,
      }
      this.$utils.request('', param, true).then((res) => {
        console.log(res, 'res')
        if (res.pageBean) {
          this.jobFairList = res.pageBean.list
          this.pageTotal = res.pageBean.total
        }
      })
    },
    //分页返回页码
    currentChange(val) {
      this.currentPage = val
      this.handleGetData()
    },

    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findJobFairDetail/findJobFairDetail?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },

    resetInputAll: function () {
      this.acb481 = ''
      this.acb487 = ''
      this.jobfairstate = ''
      this.$nextTick(() => {
        this.disabled = true
      })
      this.handleGetData()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-list {
  > ul {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 530px);
    gap: 25px;
    list-style-type: none;
    padding-inline-start: 0px;
  }
}

.listItem {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  box-sizing: border-box;
  padding: 24px;
  position: relative;

  .bg_jobFairt {
    width: 347px;
    height: 220px;
  }

  .jobTitle {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 22px;
    color: rgba(0, 0, 0, 0.9);
    padding-top: 15px;
  }
  .jobNum {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    > div {
      > span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #999999;
        span {
          color: #0c6af7;
          margin: 0 6px;
        }
      }
    }
    .icon_units {
      width: 16px;
      height: 16px;
    }
    .icon_work {
      width: 16px;
      height: 16px;
    }
  }
  .jobTime {
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 12px;
    span {
      color: rgba(0, 0, 0, 0.9);
    }
  }
}
.jobBtn {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
}
.wrap-title {
  .title-rt {
    width: 1000px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .lt-search {
      padding-left: 20px;

      a {
        display: inline-block;
        color: #999999;
        background: url('../../../static/images/screen_more.png') left center no-repeat;
        background-size: 100% 100%;
        width: 150px;
        height: 58px;
        line-height: 58px;
        text-decoration: none;
        color: #ffffff;
        font-size: 24px;
        text-align: center;

        &:hover {
          box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.5);
          border-radius: 2px;
        }
      }
    }

    .rt-input {
      width: 100%;
    }
  }
}

.btn-blue {
  margin-left: 14px;
}

.status {
  display: inline-block;
  line-height: 45px;
  border-radius: 4px;
  font-size: 18px;
  text-align: center;
  width: 210px;
  height: 45px;
  font-family: PingFang SC, PingFang SC;
  margin: 0 auto;

  &.status0 {
    border-radius: 4px 4px 4px 4px;
    border: 1px solid #efa10f;
    color: #efa10f;
  }

  &.status1 {
    border: 1px solid #0c6af7;
    color: #0c6af7;
  }

  &.status2 {
    color: #929292;
    background: #eeeeee;
    border: 2px solid rgba(176, 176, 176, 0.36);
  }

  &.status3 {
    color: #eeeeee;
    background: #c43e1c;
    border: 2px solid rgba(196, 62, 28, 0.36);
  }
}
</style>
