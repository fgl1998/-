<template>
  <div class="query-publicity h5-page page-wrapper">
    <ComponentPanel title="个人补贴查询">
      <div class="main">
        <div class="from">
          <div class="input-wrapper">
            <label for="" class="label">姓名</label>
            <input type="text" maxlength="12" placeholder="请输入姓名" v-model="keywordUserName" />
          </div>
          <div class="input-wrapper">
            <label for="" class="label">身份证号</label>
            <input type="idcard" maxlength="18" placeholder="请输入身份证号" v-model="keywordIdCard" />
          </div>
          <div class="button-wrapper">
            <ComponentButton
              type="primary"
              name="查询"
              height="68rpx"
              fontSize="28rpx"
              @click="handleQuery"></ComponentButton>
          </div>
        </div>
        <div class="query-result">
          <block v-if="queryResultList.length > 0">
            <div class="subsidy-item" v-for="item in queryResultList" :key="item.id">
              <div class="subsidy-name">
                <div class="iconimg iconimg-subsidy"></div>
                <div class="subsidy-name-text">{{ item.chi031_desc }}</div>
              </div>
              <div class="subsidy-con">
                <div class="cell">
                  <div class="key">业务状态：</div>
                  <div class="value tag">
                    <span>{{ item.chb01e_desc }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">姓名：</div>
                  <div class="value">
                    <span>{{ item.aac003 }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">身份证号：</div>
                  <div class="value">
                    <span>{{ item.aac002 }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.aae010">
                  <div class="key">银行卡号：</div>
                  <div class="value">
                    <span>{{ item.aae010 }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">发放金额：</div>
                  <div class="value">
                    <span>{{ item.aae019 }}元</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">发放期号：</div>
                  <div class="value primary">
                    <span>{{ item.aae209 }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">经办时间：</div>
                  <div class="value">
                    <span>{{ item.aae036 }}</span>
                  </div>
                </div>
                <div class="cell">
                  <div class="key">经办部门：</div>
                  <div class="value">
                    <span>{{ item.chi037_desc }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.chb204">
                  <div class="key">实发时间：</div>
                  <div class="value">
                    <span>{{ item.chb204 }}</span>
                  </div>
                </div>
                <div class="cell" v-if="item.chb017_desc">
                  <div class="key">申报乡镇：</div>
                  <div class="value">
                    <span>{{ item.chb017_desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </block>
          <block v-else>
            <ComponentNoData v-if="isInquired" tip="未查询到相关补贴发放数据"></ComponentNoData>
          </block>
          <div class="load-more-wrapper" v-if="isExceedLimit">
            <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
          </div>
        </div>
      </div>
    </ComponentPanel>
    <ComponentPopupNotice></ComponentPopupNotice>
  </div>
</template>
<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentPopupNotice from '@/components/common/ez-popup-notice/ez-popup-notice.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

  import { showModal } from '@/utils/uni-api'
  import { requestFFGetStageTreatment } from '@/service/api'
  import { checkIDCard } from '@/utils/check'

  export default {
    name: 'pageQueryPublicity',
    data() {
      return {
        keywordUserName: '', // 查询关键字 姓名
        keywordIdCard: '', // 查询关键字 身份证号
        queryResultList: [], // 查询结果列表
        isInquired: false, // 是否已查询
        time: '', // 时间段
        timeRange: [], // 时间段选择 下拉选
        unit: '', // 主管单位
        unitRange: [], // 主管单位选择 下拉选
        subsidy: '', // 补贴项目
        subsidyRange: [], // 补贴项目选择 下拉选
        address: '', // 地区
        addressInfo: {}, // 地区选择
        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true // 是否加载完成
      }
    },
    components: {
      ComponentPanel,
      ComponentButton,
      ComponentNoData,
      ComponentLoadMore,
      ComponentPicker,
      ComponentPopupNotice
    },

    onLoad(e) {},
    onShow() {},
    created() {},
    mounted() {},
    methods: {
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleQuery()
      },
      // 检测必输入项
      handleCheck() {
        const keywordUserName = this.keywordUserName
        const keywordIdCard = this.keywordIdCard
        if (!keywordUserName) {
          showModal('请输入姓名')
          return false
        }
        if (!keywordIdCard) {
          showModal('请输入身份证号')
          return false
        } else {
          const checkResult = checkIDCard(keywordIdCard)
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        return true
      },
      // 查询
      handleQuery() {
        const checkResult = this.handleCheck()
        if (!checkResult) {
          return
        }
        this.handleQueryPersonal()
      },
      // 查询 个人补贴
      handleQueryPersonal() {
        const keywordUserName = this.keywordUserName
        const keywordIdCard = this.keywordIdCard
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo

        requestFFGetStageTreatment(keywordIdCard, keywordUserName, '', '', pageNo, pageLimit)
          .then((res) => {
            const { list } = res
            if (res && list) {
              const len = list.length
              // 第一次加载
              if (pageNo < 2) {
                // 加载完成
                if (len < pageLimit) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                  this.isExceedLimit = true
                }
                this.queryResultList = [...list]
              } else {
                // 加载更多
                // 加载完成
                if (len < pageLimit) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                }
                this.queryResultList = [...this.queryResultList, ...list]
              }
            } else {
              this.isLoadOver = true
              if (pageNo < 2) {
                this.queryResultList = []
              } else {
                this.queryResultList = [...this.queryResultList]
              }
            }
          })
          .finally(() => {
            this.isShowSearchResult = true
            this.isInquired = true
          })
      }
    },
    computed: {},
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .query-publicity {
    width: 100%;
    padding: $spacing;
    /*  #ifdef  H5  */
    padding-bottom: $spacing + 100rpx;
    /*  #endif  */
    .main {
      background-color: #fff;
      border-radius: 8rpx;
    }
    .from {
      background-color: #fff;
      box-shadow: $box-shadow-base;
      padding: $spacing;
    }

    .query-result {
      padding: $spacing 0;
    }

    .button-wrapper {
      padding: $spacing 2 * $spacing;
    }
  }
</style>
