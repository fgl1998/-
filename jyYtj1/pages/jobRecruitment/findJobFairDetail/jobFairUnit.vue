<template>
  <div class="page">
    <!-- 单位列表 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">企业</text> 列表 </span> / 点击下方列表可查看
                </div>
              </div>
            </div>
            <div class="wrap-list">
              <div class="list-con">
                <div class="jobList" v-if="pageList.length > 0">
                  <div v-for="(item, index) in pageList" :key="index" @click="toPage(item)">
                    <div class="unit-top">
                      <div>
                        <image :src="item.headImg" mode="aspectFit" class="icon_unit"> </image>
                      </div>
                      <div>
                        <div>{{ item.aab004 }}</div>
                        <div>
                          <span>{{ item.aab056 ? $utils.queryCodeDesc('AAB056', item.aab056) : '未知规模' }}</span>
                          <!-- <span>{{ item.acb502 ? $utils.queryCodeDesc('ACB502', item.acb502) : '融资方式未知' }}</span> -->
                          <span>{{ item.aab022 ? $utils.queryCodeDesc('AAB022', item.aab022) : '行业未知' }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="unit-bot">公司简介：{{ item.aab092 ? item.aab092 : '暂无公司简介' }}</div>
                  </div>
                </div>
                <div class="nodata" style="height: 500px" v-else>
                  <div class="nodata-pic">
                    <div class="nodata-img"></div>
                    <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                  </div>
                </div>
                <!-- 								<table class="table">
									<tr>
										<th style="width: 30%;">单位名称</th>
										<th >单位性质</th>
										<th style="width: 40%;">单位地址</th>
										<th style="width: 10%;text-align: center;">操作</th>
									</tr>
									<template v-if='companyList.length > 0'>
										<tr v-for="(item,index) in companyList" :key="index" >
											<td style="width: 30%;">{{item.aab004}}</td>
											<td>{{$utils.queryCodeDesc('AAB022',item.aab022)}}</td>
											<td style="width: 40%;">{{item.aae006}}</td>
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
								</table> -->
              </div>
            </div>
          </div>
          <div class="wrap-page" v-if="companyList.length > 0">
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
      // this.$utils.showToast("请登录")
      // setTimeout(()=>{
      // 	this.$utils.navigateToLogin();
      // },1000)
    }
	if(option.acb330){
		this.acb330 = option.acb330
		this.acz01v = option.acz01v
		this.acz01t = option.acz01t
	}
    
    this.init()
  },
  data() {
    return {
      userInfo: {},
      currentPage: 1,
      pageSize: 9,
      pageTotal: 0,
      acb330: '',
	  acz01v: '',
	  acz01t: '',
      company: {},
      companyList: [],
      pageList: [],
    }
  },
  methods: {
    init() {
      this.currentPage = 1
      this.handleGetData()
    },
    // 分页查询参会企业信息
    handleGetData() {
      let param = {
        method: 'jy204_hrm102',
        aae100: '0', //有效
        aae033: '0', //审核通过
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        paginationModel: 'mostCount',
        aab001: this.company.code,
      }
      if (this.acb330 != 'undefined' && this.acb330 != '') {
        param.acb330 = this.acb330
      }
      this.$utils.request(null, param).then((res) => {
        let jobFairComList = res.pageBean
        if (jobFairComList.list.length > 0) {
          this.companyList = jobFairComList.list.map((item) => {
            const newObj = { ...item }
            if (item.aae707) {
              newObj.headImg = this.$downLoadImgSrc + item.aae707
            } else {
              newObj.headImg = '../../../static/images/waitPage/icon_unit.png'
            }
            if (newObj.aab092) {
              newObj.aab092 = this.removeHtmlTagsUsingDOM(newObj.aab092)
            }
            return newObj
          })
          this.companyList.forEach((item, index) => {
            item.code = item.aab001
            item.name = item.aab004
          })
          this.pageTotal = jobFairComList.total
        } else {
          this.companyList = []
          this.$utils.showToast('暂无符合条件单位')
        }
        this.getPaginatedData()
      })
    },
    removeHtmlTagsUsingDOM(text) {
      // 创建一个临时元素
      const tempElement = document.createElement('div')
      // 设置内容
      tempElement.innerHTML = text
      // 返回纯文本内容
      return tempElement.textContent || tempElement.innerText || ''
    },
    //分页返回页码
    currentChange(val) {
      this.currentPage = val
      this.handleGetData()
    },
    getPaginatedData() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      this.pageList = this.companyList.slice(start, end)
    },
    //选中项改变
    selectChange1(val) {
      this.company.name = item.name
      this.company.code = item.code
    },
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' +
          encodeURIComponent(JSON.stringify(item)) +
          '&acb330=' +this.acb330+'&acz01v='+this.acz01v+'&acz01t='+this.acz01t
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.btn-blue {
  height: 52px;
  line-height: 52px;
  margin-left: 14px;
}
.list-con {
  > div.jobList {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 159px);
    gap: 25px;
    > div {
      background-color: #f5f5f5;
      box-sizing: border-box;
      padding: 20px 30px 10px 30px;
    }

    .unit-top {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      > div:last-child {
        margin-left: 20px;

        > div:first-child {
          font-family: PingFang SC, PingFang SC;
          font-weight: 600;
          font-size: 22px;
          color: rgba(0, 0, 0, 0.9);
          margin-bottom: 15px;
        }

        > div:nth-child(2) {
          > span {
            display: inline-block;
            padding: 4px 12px;
            background-color: #e4e8eb;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6);
            margin-right: 10px;
          }

          > span:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .unit-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .unit-bot {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.6);
      width: 470px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon_unit {
      width: 70px;
      height: 70px;
    }
  }
}
</style>
