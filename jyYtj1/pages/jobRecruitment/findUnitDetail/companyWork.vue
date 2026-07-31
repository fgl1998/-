<template>
  <div class="page">
    <!-- 职位列表 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">岗位</text> 详情 </span> / 点击下方列表可查看
                </div>
              </div>

              <!-- <div class="title-rt">
								<custom-select placeholder="选择类型" :defaultValue="type" :selectList="typeList"
									@selectChange="selectChange1"></custom-select>
								<custom-select placeholder="选择薪资" :selectList="moneyList" @selectChange="selectChange2">
								</custom-select>
								<button class="btn btn-blue">搜索</button>
							</div> -->
            </div>
            <div class="wrap-list">
              <ul v-if="jobList.length > 0">
                <li v-for="it in jobList" :key="it.acb210" class="listItem" @click="toPage(it, 1)">
                  <div>
                    <div>{{ it.acb213 }}</div>
                    <div>
                      <span>{{
                        it.acb21h && it.acb21j
                          ? it.acb21h != it.acb21j
                            ? `${it.acb21h}~${it.acb21j}元/月`
                            : `${it.acb21h}元/月`
                          : ''
                      }}</span>
                      <span>{{ it.acb21h && !it.acb21j ? it.acb21h + '以上' : '' }}</span>
                      <span>{{ !it.acb21h && it.acb21j ? it.acb21j + '以下' : '' }}</span>
                      <span>{{ !it.acb21h && !it.acb21j ? '薪资面议' : '' }}</span>
                    </div>
                  </div>
                  <div>
                    <span v-if="it.aac011">{{ it.aac011 ? $utils.queryCodeDesc('aac011', it.aac011) : '' }}</span>
                    <span v-if="it.acb00r">{{ it.acb00r ? $utils.queryCodeDesc('acb00r', it.acb00r) : '' }}</span>
                    <span v-if="it.acb469">{{ it.acb469 ? $utils.queryCodeDesc('acb469', it.acb469) : '' }}</span>
                    <span v-if="it.aab056">{{ it.aab056 ? $utils.queryCodeDesc('aab056', it.aab056) : '' }}</span>
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
										<th style="width: 15%;">职位</th>
										<th style="width: 15%;">薪资<span class="text-gary">（元/月）</span></th>
										<th style="width: 25%;">福利待遇</th>
										<th style="width: 35%;">地址</th>
										<th style="text-align: center;width: 10%;">操作</th>
									</tr>
									<tr v-for="(item,index) in jobList" :key="index" >
										<td style="width: 15%;font-weight: bold;">{{item.acb213}}</td>
										<td style="width: 15%;">
											<span>{{item.acb21l&&item.acb21h ? item.acb21l + '~' + item.acb21h :''}}</span>
											<span>{{item.acb21l&&!item.acb21h ? item.acb21l + '以上':''}}</span>
											<span>{{!item.acb21l&&item.acb21h ? item.acb21h + '以下':''}}</span>
											<span>{{!item.acb21l&&!item.acb21h ? '薪资面议' :''}}</span>
										</td>
										<td style="width: 25%;"><span>{{item.acb214_desc?item.acb214_desc:'福利待遇面议'}}</span></td>
										<td style="width: 35%;">{{item.acb217}}</td>
										<td style="width: 10%;text-align: center;color: #0C6AF7;cursor: pointer;" @click="toPage(item)">查看详情</td>
									</tr>
								</table>
							</div> -->
            </div>
          </div>
          <div class="wrap-page">
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
    if(option.acb330){
    	this.acb330 = option.acb330
    	this.acz01v = option.acz01v
    	this.acz01t = option.acz01t
    }
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
      // this.$utils.showToast("请先登录")
    }
    this.aab001 = option.aab001
    this.init()
  },
  data() {
    return {
      acb330: '',
	  acz01v: '',
	  acz01t: '',
      userInfo: {},
      aab001: '',
      isLogin: false,
      currentPage: 1,
      pageSize: 9,
      pageTotal: 0,
      type: {
        code: '0',
        name: '全职',
      },
      typeList: [
        {
          code: 0,
          name: '全职',
        },
        {
          code: 1,
          name: '兼职',
        },
      ],
      // money: {},
      // moneyList: [{
      // 	code: 0,
      // 	name: '0-6000'
      // }, {
      // 	code: 1,
      // 	name: '6000-12000'
      // }],
      jobList: [],
    }
  },
  methods: {
    init() {
      this.currentPage = 1
	  if(this.acb330){
		  this.handleGetDataMore()
		  return
	  }
      this.handleGetData()
    },
    // 查询岗位数据
    handleGetData() {
      let param = {
        method: 'jy202_hrm101',
        aab001: this.aab001,
        // ycb211: "0",//上线的
        acb468: '1', //岗位是否上线（1：上线，0：下线）
        AAE100: '1', //岗位是否有效（1：有效，0：无效）
        audit_status: '0', //岗位审核通过的
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        paginationModel: 'mostCount',
      }
      if (this.acb330 != 'undefined' && this.acb330 != '') {
        param.acb330 = this.acb330
      }
      this.$utils.request(null, param).then((res) => {
        let jobList = res.pageBean
        this.jobList = jobList.list
        this.pageTotal = jobList.total
      })
    },
	// 查询招聘会报名岗位数据
	handleGetDataMore(){
		let param = {
		  method: 'jy201_hrm253',
		  aab001: this.aab001,
		  acb330: this.acb330,
		}
		this.$utils.request(null, param).then((res) => {
			debugger
		  let jobList = res.pageBean
		  this.jobList = jobList.list
		  this.pageTotal = jobList.total
		})
	},
    //分页返回页码
    currentChange(val) {
      //console.log("翻到第" + val + "页了");
      this.currentPage = val
      this.handleGetData()
    },
    //选中项改变
    selectChange1(val) {
      this.type.name = val.name
      this.type.code = val.code
    },
    //选中项改变
    selectChange2(val) {
      this.money.name = val.name
      this.money.code = val.code
    },
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' +
          encodeURIComponent(JSON.stringify(item)) +
          '&acb330=' +
          this.acb330+'&acz01v='+this.acz01v+'&acz01t='+this.acz01t
      )
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
</style>
