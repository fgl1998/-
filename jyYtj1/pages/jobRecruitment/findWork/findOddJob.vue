<template>
  <!-- 零工市场 -->
  <div class="page">
    <!-- 岗位列表 -->
    <common-header @cityChange="cityChange"></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="name">
                  <span>零工</span>
                  <label>市场</label>
                </div>
                <div class="decr">/设置条件，查找您感兴趣的零工</div>
              </div>
              <div class="title-rt">
                <div class="select-box">
                  <modal-address
                    areaid="acb215"
                    :areaCode="acb215"
                    v-model="acb215Desc"
                    @setAreaValue="getAreaValue"
                    placeholder="选择地区"
                  ></modal-address>
                </div>
                <div class="select-box">
                  <modal-oddType
                    moduleKey="aca111"
                    :moduleId="aca111"
                    v-model="aca112"
                    @setModalValue="getAca111Value"
                    placeholder="选择工种"
                  ></modal-oddType>
                </div>
                <div class="salary">
                  <uni-data-select
                    :clear="false"
                    v-model="selectType"
                    placeholder="薪资类型"
                    :localdata="range"
                    @change="changeSelect"
                  ></uni-data-select>
                </div>
                <div class="salary">
                  <uni-data-select
                    :clear="false"
                    v-model="acb2a3Min"
                    placeholder="最低薪资"
                    :localdata="smallList"
                    @change="getSelectValue"
                  ></uni-data-select>
                </div>
                <div class="salary">
                  <uni-data-select
                    :clear="false"
                    v-model="acb2a3Max"
                    placeholder="最高薪资"
                    :localdata="bigList"
                    @change="getSelectValue1"
                  ></uni-data-select>
                </div>
                <div class="search">
                  <input class="uni-input search-inp" confirmType="search" placeholder="搜索职位" v-model="keyword" />
                  <button type="primary" class="search-btn" @click="fnSearch">搜索</button>
                </div>
                <button class="reset-btn" @click="resetInputAll">重置</button>
              </div>
            </div>

            <div class="wrap-list">
              <!-- 职位 -->
              <div class="job">
                <div class="job-list" v-if="jobList.length > 0">
                  <div class="list-item" v-for="(item, index) in jobList" :key="index" @click="toPage(item)">
                    <div class="item-top">
                      <div class="top-lt" style="display: flex">
                        <div
                          class="urgency"
                          v-if="item.acb2a9 == '1'"
                          style="width: 30px; height: 20px; margin-left: 5px"
                        >
                          <image src="/static/images/zero/ic_tag_jp.png"></image>
                        </div>
                        <div class="name">{{ item.acb213 }}</div>
                        <div class="per-or-unit" v-if="item.acb2a7" style="width: 50px; height: 25px; margin-left: 5px">
                          <image src="/static/images/zero/ic_tag_per.png" v-if="item.acb2a7 === '1'" />
                          <image src="/static/images/zero/ic_tag_unit.png" v-if="item.acb2a7 === '2'" />
                        </div>
                      </div>
                      <div class="top-rt money">{{ item.money }}</div>
                    </div>
                    <div class="tag-list">
                      <div class="tag-item">
                        <div class="tag-item1">{{ item.acb2a4Desc ? item.acb2a4Desc : '方式面议' }}</div>
                        <div class="tag-item1" v-if="item.acb2a1_par">{{ item.acb2a1_par }}</div>
                        <div class="tag-item1" v-if="item.acb01hDesc">
                          {{ item.acb01hDesc }}
                        </div>
                      </div>
                      <!-- <template v-if="item.acb2a1Desc && item.acb2a1Desc.length > 0">
                        <div class="tag-item" v-for="(itemT,indexT) in item.acb2a1Desc" :key="indexT">
                          {{itemT}}
                        </div>
                      </template> -->
                      <div class="tag-time" v-if="item.aae036">
                        {{ item.aae036.split('-')[1] + '-' + item.aae036.split('-')[2] }}发布
                      </div>
                    </div>

                    <div class="item-bottom">
                      <div class="bottom-lt">
                        <div class="per-head">
                          <image class="head-img" :src="item.headImg" />
                        </div>
                        <div class="per">
                          <div class="name">{{ item.aae004 ? item.aae004 : '暂无发布人' }}</div>
                          <div class="addr">{{ item.acb217 ? item.acb217 : '暂无地址' }}</div>
                        </div>
                      </div>
                      <div class="bottom-rt">
                        <button class="btn" type="primary" plain @click.stop="getPhone(item)">联系方式</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-data" v-else>
                  <image :src="baseImgSrc + '/ic_no_data.png'" />
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-page" v-if="jobList.length > 0 && pages > 1">
            <common-pager
              :totals="pageTotal"
              :currentPage="pageNumber"
              :pageSize="pageSize"
              @currentChange="currentChange"
            ></common-pager>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>

    <!--联系方式-->
    <view class="container-modal-outLogin">
      <!-- 普通弹窗 -->
      <uni-popup ref="phonePopup">
        <div class="modal-part">
          <div class="part-top"><span @click="openClose"></span></div>
          <div class="part-bottom">
            <div class="part-bottom-text">联系电话</div>
            <div class="part-bottom-text-tip">{{ messageText }}</div>
            <div class="part-bottom-btn-box">
              <div class="part-bottom-btn btn-cancel" @click="openClose">取消</div>
              <div class="part-bottom-btn btn-verify" @click="openClose">确定</div>
            </div>
          </div>
        </div>
      </uni-popup>
    </view>

    <common-modal ref="modalPopup"></common-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      userInfo: {},
      isLogin: false,
      pageNumber: 1,
      pageSize: 9,
      pageTotal: 0,
      pages: 0, //总页数
      jobList: [],
      collectList: [], // 总数组
      smallList: [], // 日新数组
      bigList: [], // 月薪数组
      keyword: '',
      aca111: '', //行业
      aca112: '', //行业
      acb2a3Min: '', //最低薪资
      acb2a3Max: '', //最高薪资
      acb215: '', //招聘详细地址
      acb215Desc: '', //招聘详细地址
      messageText: '',
      moneyType: 'ACC034LIMIT',
      range: [
        {
          value: 5,
          text: '不限',
        },
        {
          value: 1,
          text: '日薪',
        },
        {
          value: 3,
          text: '月薪',
        },
      ],
      selectType: 5,

      smallList2: [
        {
          text: '2000',
          value: '2000',
        },
        {
          text: '3000',
          value: '3000',
        },
        {
          text: '4000',
          value: '4000',
        },
        {
          text: '5000',
          value: '5000',
        },
        {
          text: '6000',
          value: '6000',
        },
        {
          text: '7000',
          value: '7000',
        },
        {
          text: '8000',
          value: '8000',
        },
        {
          text: '9000',
          value: '9000',
        },
        {
          text: '10000',
          value: '10000',
        },
      ],
      bigList2: [
        {
          text: '2000',
          value: '2000',
        },
        {
          text: '3000',
          value: '3000',
        },
        {
          text: '4000',
          value: '4000',
        },
        {
          text: '5000',
          value: '5000',
        },
        {
          text: '6000',
          value: '6000',
        },
        {
          text: '7000',
          value: '7000',
        },
        {
          text: '8000',
          value: '8000',
        },
        {
          text: '9000',
          value: '9000',
        },
        {
          text: '10000以上',
          value: '10000',
        },
      ],
      smallList3: [
        {
          text: '100',
          value: '100',
        },
        {
          text: '200',
          value: '200',
        },
        {
          text: '300',
          value: '400',
        },
        {
          text: '500',
          value: '500',
        },
        {
          text: '600',
          value: '60',
        },
        {
          text: '700',
          value: '700',
        },
        {
          text: '800',
          value: '800',
        },
        {
          text: '900',
          value: '900',
        },
      ],
      bigList3: [
        {
          text: '100',
          value: '100',
        },
        {
          text: '200',
          value: '200',
        },
        {
          text: '300',
          value: '400',
        },
        {
          text: '500',
          value: '500',
        },
        {
          text: '600',
          value: '60',
        },
        {
          text: '700',
          value: '700',
        },
        {
          text: '800',
          value: '800',
        },
        {
          text: '900以上',
          value: '900',
        },
      ],
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    }
    const currentLocation = uni.getStorageSync('currentLocation')
    if (currentLocation) {
      this.acb215 = currentLocation.areaCode || ''
      this.acb215Desc = currentLocation.areaName || ''
    }
    this.currentPage = 1
    this.getCollect()
    this.init()
  },
  methods: {
    init() {
      this.resetList()
    },
    changeSelect(value) {
      // if (value == this.selectType) return
      this.selectType = value
      this.acb2a3Min = null
      this.acb2a3Max = null
      if (value == 1) {
        // this.selectAdjust(1)
        this.bigList = this.bigList3
        this.smallList = this.smallList3
      } else if (value == 3) {
        // this.selectAdjust(2)
        this.bigList = this.bigList2
        this.smallList = this.smallList2
      } else {
        this.bigList = []
        this.smallList = []
      }

      this.resetList(value)
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
      if (type === 1) {
        // 日薪
        this.collectList.forEach((item) => {
          item.text = item.label
          if (+item.value <= 1000) {
            this.smallList.push(item)
          }
          if (+item.value <= 1000 && +item.value > 100) {
            this.bigList.push(item)
          }
        })
        this.bigList.push(endObj)
      } else {
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
      }
    },
    // 获取薪资数值最小
    getSelectValue(value) {
      this.acb2a3Min = value
      this.resetList(this.selectType)
    },
    // 获取薪资数值最大
    getSelectValue1(value) {
      this.acb2a3Max = value
      this.resetList(this.selectType)
    },
    fnSearch() {
      this.resetList(this.selectType)
    },

    getAca111Value(val) {
      //获取弹窗数据设置
      this.aca111 = val.aca111
      this.resetList(this.selectType)
    },

    getAreaValue(val) {
      this.acb215 = val.areaCode
      this.resetList(this.selectType)
    },

    resetList(value) {
      this.pageNumber = 1
      this.pageTotal = 0
      this.handleGetData(value)
    },

    // 查询数据
    handleGetData(value) {
      let param = {
        //method:"jy217_flex205",
        method: 'jy218_flex208',
        //ycb211: "3",
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        paginationModel: 'mostCount',
        acb213: this.keyword,
        acb2a1: this.aca111,
        acb2a3Min: this.acb2a3Min,
        acb2a3Max: this.acb2a3Max,
        acb215: this.acb215,
        acb2ac: value == 5 ? undefined : value,
        acb2a4: value == 5 ? undefined : value,
        audit_status: '0', //职位审核通过
        aac001_cc3a: this.userInfo.aac001,
      }
      //param.ycb213 = this.type.code;
      this.$utils.request(null, param, true).then((res) => {
        let result = res.pageBean
        result.list.map((item) => {
          item.acc034l = item.acb2a3
          if (item.aae707) {
            item.headImg = this.$downLoadImgSrc + item.aae707
          } else {
            item.headImg = this.baseImgSrc + '/zero/ic_head_man.png'
          }
          if (item.acb2a1_desc) {
            let acb2a1Desc = []
            if (item.acb2a1_desc.indexOf(',') > -1) {
              acb2a1Desc = item.acb2a1_desc.split(',')
            } else {
              acb2a1Desc.push(item.acb2a1_desc)
            }

            item.acb2a1Desc = acb2a1Desc
          }
          let moneyType = ''
          if (item.acb2a4) {
            if (item.acb2a4 == '1') {
              moneyType = '日薪'
            }
            if (item.acb2a4 == '3' || item.acb2a4 == '0' || item.acb2a4 == '2') {
              moneyType = '月薪'
            }
          }

          if (item.acb2a4 === '4' && moneyType) {
            item.money = '面议/' + moneyType
          } else if (item.acb2a4 === '4' && !moneyType) {
            item.money = '面议'
          } else {
            if (moneyType) {
              if (item.acc034l && item.acc034h) {
                item.money = item.acc034l + '~' + item.acc034h + '/' + moneyType
              } else if (item.acc034l) {
                item.money = item.acc034l + '/' + moneyType
              } else if (item.acc034h) {
                item.money = item.acc034h + '/' + moneyType
              } else {
                item.money = '面议' + '/' + moneyType
              }
            } else {
              if (item.acc034l && item.acc034h) {
                item.money = item.acc034l + '~' + item.acc034h + '/面议'
              } else if (item.acc034l) {
                item.money = item.acc034l + '/面议'
              } else if (item.acc034h) {
                item.money = item.acc034h + '/面议'
              } else {
                item.money = '面议'
              }
            }
          }
          return item
        })
        this.jobList = result.list
        this.pageTotal = result.total
        this.pages = result.pages
      })
    },

    getPhone(item) {
      if (this.userInfo && this.userInfo.aac001) {
        const url = '/api/business/invoke'
        const param = {
          aac001_per: item.aac001,
          aab001_per: item.aab001,
          acb2a0: item.acb2a0,
          zpType: '2',
          aac001: this.userInfo.aac001,
          zpID: item.acb2a0,
          method: 'jy202_hrm156',
        }
        this.$utils.request(url, param, true, true, 'cipher').then((res) => {
          console.log(res)

          if (res && res.result && res.result.aae005) {
            this.messageText = res.result.aae005
            this.openPhone()
          } else {
            this.$utils.showToast('该人员暂未提供准确的联系方式')
          }
        })
      } else {
        this.$refs.modalPopup.open()
      }
    },

    openClose() {
      this.$refs.phonePopup.close()
    },

    openPhone() {
      this.$refs.phonePopup.open()
    },

    //分页返回页码
    currentChange(val) {
      this.pageNumber = val
      this.handleGetData(this.selectType)
    },

    toPage(item) {
      item.oddJob = true
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetails?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },

    resetInputAll: function () {
      this.keyword = ''
      this.aca111 = ''
      this.aca112 = ''
      this.acb2a3Min = ''
      this.acb2a3Max = ''
      this.acb215 = ''
      this.acb215Desc = ''
      this.selectType = 5
      this.resetList()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
.per {
  .name {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.wrap-title {
  .title-rt {
    .search {
      margin-right: 24px;

      .search-inp {
        width: 240px;
      }
    }
  }
}

.btn-blue {
  margin-left: 14px;
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

// .modal-input /deep/ .is-disabled{
// 	border-color: #e5e5e5 !important;
// 	 background-color: #fff !important;
// }
// .modal-input /deep/ .is-disabled .uni-input-placeholder{
// 	color: #999  !important;
// }
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

.tag-list {
  height: 28px;
  overflow: hidden;
  justify-content: space-between;
}
.tag-item {
  display: flex;
}
.tag-item1 {
  color: rgba(0, 0, 0, 0.6);
  padding: 4px 12px;
  background: #e4e8eb;
  border-radius: 2px;
}
.tag-time {
  color: rgba(0, 0, 0, 0.6);
}

.wrap-title .title-rt .search .search-btn {
  width: 70px;
}

.wrap-title .title-rt .reset-btn {
  width: 70px;
}
</style>
