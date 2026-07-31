<template>
  <div class="page">
    <!-- 我的收藏 -->
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-box">
          <div class="wrap-con">
            <div class="wrap-title">
              <div class="title-lt">
                <div class="name">
                  <span>我的</span>
                  <label>收藏</label>
                </div>
                <div class="decr">/查看我收藏的职位</div>
              </div>
              <div class="title-rt">
                <div class="tab">
                  <div
                    :class="['tab-item', tabCur === index ? 'active' : '']"
                    v-for="(item, index) in tabList"
                    :key="index"
                    @click="tabChange(item)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <div class="search">
                  <input
                    class="uni-input search-inp"
                    confirmType="search"
                    :placeholder="tabList[tabCur].placeholder"
                    v-model="keyword"
                  />
                  <button type="primary" class="search-btn" @click="fnSearch">搜索</button>
                </div>
                <div class="navigation">
                  <i class="ic ic-home-blue"></i>
                  <label>首页 > 个人中心 > 我的收藏</label>
                </div>
              </div>
            </div>
            <div class="wrap-list">
              <!-- 职位 -->
              <div class="job" v-if="tabCur === 0">
                <div class="job-list" v-if="collectList.length > 0">
                  <div class="list-item" v-for="(item, index) in collectList" :key="index" @click="toPage(0, item)">
                    <div class="item-top">
                      <div class="top-lt">{{ item.acb213 }}</div>
                      <div class="top-rt money">{{ item.money }}</div>
                    </div>
                    <div class="tag-list">
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
                    <div class="item-bottom">
                      <div class="bottom-lt">
                        <i class="ic ic-unit"></i>
                        <span>{{ item.aab004 }}</span>
                      </div>
                      <div class="bottom-rt">
                        <span>{{ item.acb215PathDesc }}</span>
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

              <!-- 企业 -->
              <div class="unit" v-if="tabCur === 1">
                <div class="unit-list" v-if="collectList.length > 0">
                  <div class="list-item" v-for="(item, index) in collectList" :key="index" @click="toPage(1, item)">
                    <div class="item-top">
                      <div class="top-lt">
                        <image :src="item.unitHead" />
                      </div>
                      <div class="top-rt">
                        <div class="title">
                          <div class="name">{{ item.aab004 }}</div>
                          <div class="star"><i class="ic ic-star"></i></div>
                        </div>
                        <div class="tag-list">
                          <div class="tag-item">
                            {{ item.aab020 ? $utils.queryCodeDesc('aab020', item.aab020) : '未知' }}
                          </div>
                          <div class="tag-item">
                            {{ item.aab056 ? $utils.queryCodeDesc('aab056', item.aab056) : '规模未知' }}
                          </div>
                          <div class="tag-item">
                            {{ item.aab022 ? $utils.queryCodeDesc('aab022', item.aab022) : '行业未知' }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="item-bottom">{{ item.aab092 ? item.aab092 : '暂无简介' }}</div>
                  </div>
                </div>
                <div class="no-data" v-else>
                  <image :src="baseImgSrc + '/ic_no_data.png'" />
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-page" v-if="collectList.length > 0">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      isLogin: false,
      userInfo: {},

      keyword: '',
      pageNumber: 1,
      pageSize: 9,
      pageTotal: 0,
      collectList: [],
      collectListQY: [],

      acb234: '2',
      tabCur: 0,
      tabList: [
        {
          name: '收藏的职位',
          acb234: '2',
          type: 0,
          placeholder: '职位名称',
        },
        {
          name: '收藏的企业',
          acb234: '5',
          type: 1,
          placeholder: '企业名称',
        },
      ],
    }
  },
  onLoad() {
    //用onLoad不加载
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
      this.acb234 = '2'
      this.tabCur = 0
      this.init()
    }
  },
  methods: {
    init() {
      this.resetList()
    },
    tabChange(item) {
      if (this.tabCur !== item.type) {
        this.tabCur = item.type
        this.acb234 = item.acb234
        this.resetList()
      }
    },
    resetList() {
      this.pageNumber = 1
      this.pageTotal = 0
      this.collectList = []
      this.handleGetData()
    },
    fnSearch() {
      this.resetList()
    },
    // 分页查询我的收藏
    handleGetData() {
      let url = '/api/business/invoke'
      let param = {
        keyWords: this.keyword,
        acb231: this.userInfo.aac001,
        acb237: '1',
        acb234: this.tabCur === 0 ? '2' : '5',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        method: 'collect_com04',
        paginationModel: 'mostCount',
      }
      this.$utils.request(url, param, true, true, 'cipher').then((res) => {
        if (res.pageBean) {
          let result = res.pageBean
          result.list.map((item) => {
            if (item.aab092) {
              item.aab092 = this.removeHtmlTagsUsingDOM(item.aab092)
            }
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

            if (item.aae007) {
              item.unitHead = this.$downLoadImgSrc + item.aae007
            } else {
              item.unitHead = this.baseImgSrc + '/waitPage/icon_unit.png'
            }

            return item
          })
          this.collectList = result.list
          this.pageTotal = result.total
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
      this.pageNumber = val
      this.handleGetData()
    },
    toPage(type, item) {
      if (type == 0) {
        this.$utils.navigateTo(
          '/pages/jobRecruitment/findWorkDetail/findWorkDetail?item=' + encodeURIComponent(JSON.stringify(item)),
        )
      }
      if (type == 1) {
        this.$utils.navigateTo(
          '/pages/jobRecruitment/findUnitDetail/findUnitDetail?item=' + encodeURIComponent(JSON.stringify(item)),
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/common_sll.scss';
.tag-list {
  flex-wrap: nowrap;
}
</style>
