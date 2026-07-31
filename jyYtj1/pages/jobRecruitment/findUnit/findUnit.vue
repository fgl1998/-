<template>
  <div class="page">
    <!-- 单位列表 -->
    <common-header @cityChange="cityChange" :key="key"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="lt-text">
                  <span><text style="color: #0c6af7 !important">找</text> 公司 </span> /设置条件，查找您感兴趣的公司
                </div>
              </div>
              <div class="title-rt" style="width: 1000px">
                <uni-row class="demo-uni-row" width="1000" :gutter="20">
                  <uni-col :span="8">
                    <modal-address
                      areaid="aab508"
                      :areaCode="aab508"
                      v-model="aab508Desc"
                      @setAreaValue="getAreaValue"
                      placeholder="选择地区"
                    ></modal-address>
                  </uni-col>

                  <uni-col :span="8">
                    <modal-unitType
                      moduleKey="aab022"
                      :moduleId="aab022"
                      v-model="aab022_dec"
                      @setModalValue="getAab022Value"
                    ></modal-unitType>
                  </uni-col>
                  <uni-col :span="4">
                    <button class="btn btn-white" @click="resetInputAll">重置</button>
                  </uni-col>
                  <uni-col :span="4">
                    <button class="btn btn-blue" @click="getInputAll">搜索</button>
                  </uni-col>
                </uni-row>
              </div>
            </div>
            <div class="wrap-list">
              <div class="list-con">
                <div class="jobList" v-if="companyList.length > 0">
                  <div v-for="(item, index) in companyList" :key="index" @click="toPage(item)">
                    <div class="unit-top">
                      <div>
                        <image :src="item.headImg" mode="aspectFit" class="icon_unit"> </image>
                      </div>
                      <div>
                        <div class="unit-name">{{ item.aab004 }}</div>
                        <div>
                          <span>{{ item.aab056 ? $utils.queryCodeDesc('aab056', item.aab056) : '未知规模' }}</span>
                          <span>{{ item.aab022 ? $utils.queryCodeDesc('aab022', item.aab022) : '行业未知' }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- <div class="unit-bot">公司简介：{{item.aab092?item.aab092:'暂无公司简介'}}</div> -->
                    <div class="unit-bot">
                      <span class="title">公司简介：</span>
                      <span class="aab092" v-if="item.aab092">{{ item.aab092 }}</span>
                      <span class="aab092" v-else>暂无公司简介</span>
                    </div>
                  </div>
                </div>
                <div class="nodata" style="height: 500px; margin: 0 auto; width: 100%" v-else>
                  <div class="nodata-pic">
                    <div class="nodata-img"></div>
                    <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                  </div>
                </div>
                <!-- <table class="table">
									<tr>
										<th style="width: 35%;">单位名称</th>
										<th style="width: 20%;">行业类别</th>
										<th style="width: 35%;">单位地址</th>
										<th style="width: 10%;text-align: center;">操作</th>
									</tr>
									<template v-if='companyList.length > 0'>
										<tr v-for="(item,index) in companyList" :key="index" >
											<td style="width: 35%;font-weight: bold;">{{item.aab004}}</td>
											<td style="width: 20%;">{{$utils.queryCodeDesc('aab022',item.aab022)}}</td>
											<td style="width: 35%;">{{item.aae006}}</td>
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
      pageSize: 9,
      pageTotal: 0,
      companyName: '',
      aab019: '',
      aab020: '',
      aae006: '',
      aab022: '',
      aab022_dec: '',
      aab508: '',
      aab508Desc: '',
      modalValue: {
        aab022_dec: '',
        aab022: '',
      },
      companyList: [],
      // 传递给输入框及键盘组件，输入框样式
      classStyle: 'inputArea',
      firstClick: false, // 改变城市后是否是第一次点击过更多查询
      key: 0,
    }
  },
  methods: {
    getAab022Value(val) {
      //获取弹窗数据设置
      this.aab022 = val.value
    },
    getAreaValue(val) {
      this.aab508 = val.areaCode
    },

    getInputAll() {
      this.handleGetData()
    },

    init() {
      // const currentLocation = uni.getStorageSync('currentLocation')
      // if (currentLocation) {
      //   this.aab508 = currentLocation.areaCode || ''
      //   this.aab508Desc = currentLocation.areaName || ''
      // }
      this.currentPage = 1
      this.handleGetData()
    },
    // 分页查询参会企业信息
    handleGetData() {
      let param = {
        method: 'jy202_hrm118',
        paginationModel: 'mostCount',
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        aab019: this.aab019,
        aab020: this.aab020,
        aae006: this.aae006,
        aab004: this.companyName,
        aab508: this.aab508,
        aab022: this.aab022,
        aae100: '1',
      }
      this.$utils.request(null, param, true).then((res) => {
        let companyList = res.pageBean
        if (companyList.list.length > 0) {
          this.companyList = companyList.list.map((item) => {
            const newObj = { ...item }
            if (item.aab092) {
              newObj.aab092 = this.removeHtmlTagsUsingDOM(item.aab092)
            }
            if (item.aae707) {
              newObj.headImg = this.$downLoadImgSrc + item.aae707
            } else {
              newObj.headImg = '../../../static/images/waitPage/icon_unit.png'
            }
            return newObj
          })
          this.pageTotal = companyList.total
        } else {
          this.companyList = []
          // this.$utils.showModal("提示", "尚未查询到相关的企业信息", false, succ => {}, fail => {

          // })
        }
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
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },

    resetInputAll: function () {
      this.aab508 = ''
      this.aab508Desc = ''
      this.aab022 = ''
      this.aab022_dec = ''
      this.handleGetData()
    },
  },
}
</script>

<style lang="scss" scoped>
.unit-name {
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.inputtext {
  width: 400px;
  height: 54px;
  line-height: 54px;
  background-color: #ffffff;
  box-shadow: inset 3px 5px 7px 0px rgba(0, 72, 127, 0.06);
  border-radius: 4px;
  border: solid 1px #cccccc;
  position: relative;
  margin-left: 14px;
  font-size: 22px;
  text-overflow: ellipsis;
}

.modal-input .input-placehoder,
.sitem-box .input-placeholder {
  color: #999 !important;
}

.modal-input .input-content {
  border: 1px solid #e5e5e5;
  background-color: #fff;
  width: 100%;
  height: 48px;
  font-size: 18px;
  border-radius: 4px;
  line-height: 48px;
  box-sizing: border-box;
  padding: 0 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

    .unit-bot {
      width: 470px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      display: flex;
      color: rgba(0, 0, 0, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
    }

    .icon_unit {
      width: 70px;
      height: 70px;
    }
  }
}
.aab092 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
