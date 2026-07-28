<template>
  <div class="query-publicity h5-page page-wrapper">
    <ComponentNavBar
      backgroundColor="#3882ff"
      title="个人补贴查询"
      color="#fff"
      fixed
      :shadow="false"
      left-icon="arrowleft"
      @clickLeft="back"></ComponentNavBar>
    <div class="main-wrapper">
      <div class="main">
        <ComponentPanel title="个人补贴查询">
          <div class="from">
            <block>
              <div class="input-wrapper">
                <label for="" class="label">姓名</label>
                <input
                  type="text"
                  maxlength="12"
                  placeholder="请输入姓名"
                  :disabled="disabledH5"
                  v-model="keywordUserName" />
              </div>
              <div class="input-wrapper">
                <label for="" class="label">身份证号</label>
                <input
                  type="idcard"
                  maxlength="18"
                  :disabled="disabledH5"
                  placeholder="请输入身份证号"
                  v-model="keywordIdCard" />
              </div>
            </block>
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
              <div class="subsidy-item" v-for="(item, index) in queryResultList" :key="item.id">
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
                <div class="btn-wrapper">
                  <div class="btn" @click.stop="handleViewProcess(index)">
                    <span>查询发放进度</span>
                    <i class="iconfont iconfont-arrow-right-double"></i>
                  </div>
                </div>
              </div>
            </block>
            <block v-else>
              <ComponentNoData v-if="isInquired" tip="未查询到相关补贴发放数据"></ComponentNoData>
            </block>
            <div class="load-more-wrapper" v-if="isExceedLimit && queryResultList.length > 0">
              <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
            </div>
          </div>
        </ComponentPanel>
      </div>
    </div>

    <ComponentQR top="118rpx" open></ComponentQR>
  </div>
</template>
<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentQR from '@/components/project/ez-qr/ez-qr.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentNavBar from '@/components/MUI/uni-nav-bar/uni-nav-bar.vue'
  import { M_UPDATE_USER_INFO, USER_INFO, M_UPDATE_USER_LIST } from '@/store/constants/index.js'
  import { showModal, navigateTo } from '@/utils/uni-api/index'
  import { requestB109, requestWXGetUserInfoByDzsb, requestFFGetStageTreatment } from '@/service/api'
  import { checkIDCard } from '@/utils/check'
  import { mapGetters } from 'vuex'

  export default {
    name: 'pageQueryPublicity',
    data() {
      return {
        type: '1', // 查询类型 1 个人 2 村组
        keywordUserName: '', // 查询关键字 姓名
        keywordIdCard: '', // 查询关键字 身份证号
        queryResultList: [], // 查询结果列表
        isInquired: false, // 是否已查询

        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        disabledH5: true // h5 版本禁止手动输入数据
      }
    },
    components: {
      ComponentButton,
      ComponentNoData,
      ComponentLoadMore,
      ComponentQR,
      ComponentPanel,
      ComponentNavBar
    },

    onLoad(e) {
      const { user_id } = this.userInfo
      if (!user_id) {
        this.getH5UserInfo()
      }
    },
    onShow() {},
    onReady() {},
    methods: {
      // 返回
      back() {
        window.location.href = 'https://dzxh.widthsoft.com/GeneralNews'
      },

      // 请求
      requestSavaSzvisit(data) {
        const { idCard, userName, chb015, chb017, chb018 } = data
        requestB109(idCard, userName, chb015, chb017, chb018, '三资', '补贴发放查询', false)
          .then(() => {})
          .finally(() => {})
      },
      // 获取用户信息 h5 使用
      getH5UserInfo() {
        requestWXGetUserInfoByDzsb()
          .then((res) => {
            const { aac002, aac003, channelNo } = res.data

            this.keywordIdCard = aac002
            this.keywordUserName = aac003

            const data = {
              ...res.data,
              userName: aac003,
              idCard: aac002,
              user_id: aac002,
              loginId: aac002,
              openId: aac002,
              openid: aac002,
              sessionId: aac002,
              tel: channelNo,
              userId: aac002
            }
            if (aac002) {
              this.$store.commit(M_UPDATE_USER_INFO, {
                ...data
              })
              this.$store.commit(M_UPDATE_USER_LIST, {
                aae012: aac003,
                aae018: aac003,
                cpb10d: aac002
              })
            } else {
              this.$store.commit(M_UPDATE_USER_INFO, {
                ...data
              })
            }
            this.requestSavaSzvisit(data)
          })
          .catch((err) => {})
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleQuery()
      },
      // 检测必输入项
      handleCheck() {
        const type = this.type
        if (type === '1') {
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
            const checkIDCardResult = checkIDCard(keywordIdCard)
            if (checkIDCardResult.status === '0') {
              showModal(checkIDCardResult.msg)
              return false
            }
          }
          return true
        }
        if (type === '2') {
          const unit = this.unit
          const subsidy = this.subsidy
          const { chb018 } = this.addressInfo
          if (!unit) {
            showModal('请选择主管单位')
            return false
          }
          if (!subsidy) {
            showModal('请选择补贴项目')
            return false
          }
          if (!chb018) {
            showModal('请选择地址')
            return false
          }
          return true
        }
      },
      // 查询
      handleQuery() {
        const type = this.type
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
      },

      // 发放进度
      handleViewProcess(index) {
        const data = this.queryResultList[index]
        const { chb010, chi031_desc } = data
        navigateTo('process', 'packageDeclare', { chb010, chi031_desc })
      }
    },
    computed: { ...mapGetters([USER_INFO]) },
    watch: {
      unit: {
        handler(val) {
          this.getSubsidyRange(val)
          this.subsidy = ''
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .query-publicity {
    width: 100%;
    .main-wrapper {
      padding: $spacing;
    }
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
    .btn-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
      padding: 20rpx 0;
      .btn {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 60rpx;
        .iconfont {
          font-size: 26rpx;
          padding-left: 4rpx;
        }
      }
    }
  }
</style>
