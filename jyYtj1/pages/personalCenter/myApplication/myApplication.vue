<template>
  <div class="page">
    <!-- 我的投递 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="name">
                  <span>我的</span>
                  <label>投递</label>
                </div>
                <div class="decr">/查看我投递的职位</div>
              </div>
              <div class="title-rt">
                <div class="search">
                  <input class="uni-input search-inp" confirmType="search" placeholder="搜索职位" v-model="keyword" />
                  <button type="primary" class="search-btn" @click="fnSearch">搜索</button>
                </div>
                <div class="navigation">
                  <i class="ic ic-home-blue"></i>
                  <label>首页 > 个人中心 > 我的投递</label>
                </div>
              </div>
            </div>

            <div class="wrap-list">
              <!-- 职位 -->
              <div class="job">
                <div class="job-list" v-if="applyList.length > 0">
                  <div class="list-item" v-for="(item, index) in applyList" :key="index">
                    <div class="item-status">
                      <i class="ic ic-tag-green" v-if="item.acc676 == '0'">HR未阅</i>
                      <i class="ic ic-tag-blue" v-else-if="item.acc676 == '1'">HR已阅</i>
                      <i class="ic ic-tag-gray" v-else-if="item.acc676 == '2'">已安排面试</i>
                      <i class="ic ic-tag-gray" v-else>不合格</i>
                    </div>
                    <div class="item-top">
                      <div class="first">
                        <div class="top-lt" @click="toPage(item)">{{ item.acb213 }}</div>
                        <!-- <div class="top-lt btn">
                          <span class="cancel" @click="cancelApply(item)" v-if="item.acc676 == '0'">撤销</span>
                          <span class="again" @click="apply(item)" v-if="item.acb468 == '1'">再次投递</span>
                        </div> -->
                      </div>
                      <div class="top-rt money">{{ item.money }}</div>
                    </div>
                    <div class="tag-list" @click="toPage(item)">
                      <div class="tag-item" v-if="item.aac011">
                        {{ item.aac011 ? $utils.queryCodeDesc('aac011', item.aac011) : '' }}
                      </div>
                      <div class="tag-item" v-if="item.acc217">
                        {{ item.acc217 ? $utils.queryCodeDesc('acc217', item.acc217) : '' }}
                      </div>
                      <div class="tag-item" v-if="item.aab056">
                        {{ item.aab056 ? $utils.queryCodeDesc('aab056', item.aab056) : '' }}
                      </div>
                    </div>
                    <div class="item-bottom" @click="toPage(item)">
                      <div class="bottom-lt">
                        <i class="ic ic-unit"></i>
                        <span>{{ item.aab004 }}</span>
                      </div>
                      <div class="bottom-rt">
                        <span>{{ item.acb215Desc }}</span>
                        <i class="ic ic-star"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-data" v-else>
                  <img src="../../../static/images/ic_no_data.png" />
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-page" v-if="applyList.length > 0">
            <common-pager
              :totals="pageTotal"
              :currentPage="pageNumber"
              :pageSize="6"
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
  data() {
    return {
      userInfo: {},
      isLogin: false,

      keyword: '',
      pageNumber: 1,
      pageSize: 9,
      pageTotal: 0,
      applyList: [],
    }
  },
  onLoad() {
    //用onLoad不加载
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
      this.init()
    }
  },
  methods: {
    apply(data) {
      let param = {
        acc04u: '0',
        aac001: this.userInfo.aac001,
        acb210: data.acb210,
        acc200: this.userInfo.customMap.acc200,
        // aab001: this.workInfo.aab001,
        yae100: '14',
      }
      this.$utils.request('/api/businessCommon/getData/jy202_hrm100', param, true, false, 'cipher').then((res) => {
        if (!res.serviceSuccess) {
          this.$utils.showToast(res.errors[0].msg)
        } else {
          this.$utils.showToast('投递成功')
          setTimeout(() => {
            this.handleGetData()
          }, '1000')
        }
      })
    },
    cancelApply(data) {
      let url = '/api/businessCommon/getData/jy202_hrm502'
      let param = {
        acc300: data.acc300,
        aac001: this.userInfo.aac001,
      }
      this.$utils.request(url, param, true, false, 'cipher').then((res) => {
        if (!res.serviceSuccess) {
          this.$utils.showToast('调用服务异常')
          return
        } else {
          this.$utils.showToast('撤销成功！')
          this.handleGetData()
        }
      })
    },
    init() {
      this.resetList()
    },
    resetList() {
      this.pageNumber = 1
      this.pageTotal = 0
      this.handleGetData()
    },
    fnSearch() {
      this.resetList()
    },
    // 查询申请岗位
    handleGetData() {
      let url = '/api/business/invoke'
      let param = {
        acb213: this.keyword,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        aac001: this.userInfo.aac001,
        paginationModel: 'mostCount',
        method: 'jy202_hrm1232',
      }
      this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        if (res.pageBean) {
          let result = res.pageBean
          result.list.map((item) => {
            if (item.acb21h && item.acb21j) {
              item.money = item.acb21h + '~' + item.acb21j + '元/月'
            } else {
              if (!item.acb21h && !item.acb21j) {
                item.money = '薪资面议'
              } else {
                if (item.acb21j) {
                  item.money = item.acb21h + '以下'
                }
                if (item.acb21h) {
                  item.money = item.acb21h + '以上'
                }
              }
            }
            return item
          })
          this.applyList = result.list
          this.pageTotal = result.total
        }
      })
    },
    //分页返回页码
    currentChange(val) {
      this.pageNumber = val
      this.handleGetData()
    },
    toPage(item) {
      this.$utils.navigateTo(
        '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' + encodeURIComponent(JSON.stringify(item)),
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
</style>
