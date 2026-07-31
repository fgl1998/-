<!-- 新人才搜索 -->
<template>
  <!-- 公用页面容器 -->
  <xu-common-shell :title="loginInfo.aab004">
    <view class="contentBox">
      <view class="content">
        <xu-common-title zh="人才搜索"></xu-common-title>
        <view v-if="pageInfo.totalNum > 0">
          <el-form ref="form" :model="param">
            <view class="search_input">
              <view>
                <el-form-item prop="words">
                  <el-input
                    v-model="param.words"
                    placeholder="请输入关键字或相关简历搜索"
                    @focus="openModalCC30List"
                  ></el-input>
                </el-form-item>
              </view>
              <view></view>
            </view>
          </el-form>

          <view class="search">
            <view v-for="(item, index) in listCC20" :key="index" @click="openResume(item)">
              <c-c20-item :key="index + 'item'" :cc20="item"></c-c20-item>
            </view>
          </view>

          <view class="pagination">
            <view>
              <view>共 {{ pageInfo.totalNum }} 条</view>
            </view>
            <view>
              <view @click="prevOrNext(-1)">上一页</view>
              <view
                v-for="(item, index) in pages"
                :key="index"
                class="page"
                :class="{ actived: item === pageInfo.currentPage }"
                @click="select(item)"
              >
                <span>{{ item }}</span>
              </view>
              <view @click="prevOrNext(1)">下一页</view>
            </view>
          </view>
        </view>
        <div v-else class="noData">
          <image src="../../static/images/img/publicImg/noData.png"></image>
          <view>暂无数据</view>
        </div>
      </view>
    </view>

    <c-c30-list :visible="showCC30List" @onClose="closeModalCC30List" @getData="getChoseCC30List" />
    <common-resume :data="cc20Item" :visible="commonResumeVisible" @close="commonResumeVisible = false"></common-resume>
  </xu-common-shell>
</template>

<script>
import CC20Item from './components/CC20Item.vue'
import CC30List from './components/CC30List.vue'
import commonResume from '../../components/common-resume/common-resume.vue'
export default {
  name: 'newSearchTalent',
  components: { CC30List, CC20Item, commonResume },
  data() {
    return {
      showCC30List: false,
      param: {
        words: '',
        aca111: '',
        aca112: '',
        agecode: '',
        age: '',
        aac011: '',
        acc035: '',
      },
      agecodeList: [],
      ageList: [],
      aac011List: [],
      acc035List: [],

      listCC20: [],
      loginInfo: {},
      cc20Item: {},
      commonResumeVisible: false,
      pageInfo: {
        totalPages: 1, // 总页数
        currentPage: 1, // 当前页
        pageSize: 9, // 每页记录数
        totalNum: 0, // 总记录数
      },

      options: [
        { value: '1', label: '选项一' },
        { value: '2', label: '选项二' },
        { value: '3', label: '选项三' },
      ],
    }
  },
  computed: {
    pages: {
      get() {
        const c = this.pageInfo.currentPage
        const t = this.pageInfo.totalPages
        const numArr = []
        if (t <= 7) {
          for (let i = 1; i <= t; i++) {
            numArr.push(i)
          }
          return numArr
        } else if (t > 7) {
          if (c <= 4) {
            return [1, 2, 3, 4, 5, '...', t]
          } else if (c >= t - 3) {
            return [1, '...', t - 4, t - 3, t - 2, t - 1, t]
          } else {
            return [1, '...', c - 1, c, c + 1, '...', t] // 第三种情况
          }
        }
      },
      set(v) {},
    },
  },
  mounted() {
    this.agecodeList = this.$codeConfig.getCode('acc217')
    this.ageList = this.$codeConfig.getCode('acc217')
    this.aac011List = this.$codeConfig.getCode('aac011')
    this.acc035List = this.$codeConfig.getCode('ACC035')

    this.loginInfo = this.$loginConfig.getLoginInfo() //加载登录后用户信息
    this.search(this.param)
  },
  watch: {
    param: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.search(newVal)
      },
    },
  },
  methods: {
    openResume(item) {
      console.log(item)
      this.cc20Item = item
      this.commonResumeVisible = true
    },
    prevOrNext(n) {
      let num = this.pageInfo.currentPage
      num = num + n
      if (num < 1) {
        num = 1
      }
      if (num > this.pageInfo.totalPages) {
        num = this.pageInfo.totalPages
      }
      if (this.pageInfo.currentPage === num) {
        return
      } else {
        this.pageInfo.currentPage = num
      }
      // 上一页、下一页 搜索
      this.search()
    },
    select(n) {
      if (n === this.pageInfo.currentPage) return
      if (typeof n === 'string') return
      this.pageInfo.currentPage = n
      // 选择指定页 搜索
      this.search()
    },

    /**
     * 获取职位类型
     * @param info
     * @param obj
     */
    getAca111(info, obj) {
      if (obj && JSON.stringify(obj) != '{}') {
        this.param.aca111 = obj.aca111 ? obj.aca111 : ''
        this.param.aca112 = obj.aca112 ? obj.aca112 : ''
      } else {
        this.param.aca111 = ''
        this.param.aca112 = ''
      }
    },

    openModalCC30List() {
      this.showCC30List = true
    },
    closeModalCC30List() {
      this.showCC30List = false
    },
    getChoseCC30List(values) {
      this.param.words = values.aca112
    },
    /**
     * 搜索
     * @param param
     */
    search(param) {
      param = param || {}
      param.apiCode = 'jy202_hrm220'
      param.method = 'jy202_hrm220'
      param = {
        ...param,
        ...this.pageInfo,
      }
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy202_hrm220', null, param, true)
        .then((responseData) => {
          let res = responseData ? responseData.data : {}
          const jobInfo = res.data.pageBean || {}
          this.listCC20 = jobInfo.list || []
          this.pageInfo.currentPage = jobInfo.pageNum
          this.pageInfo.totalPages = jobInfo.pages
          this.pageInfo.totalNum = jobInfo.total
        })
    },
  },
}
</script>

<style lang="less" scoped>
.noData {
  text-align: center;
  width: 100%;
  height: 80%;
  > image {
    width: 80%;
    height: 95%;
  }
}
.contentBox {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: auto;

  > * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  > .content {
    width: 100%;
    height: 100%;
    padding: 24px 32px;

    .search_input {
      display: flex;

      > :first-child {
        display: flex;
        justify-content: space-around;

        .el-form-item {
          width: 580px;
          height: 40px;
          margin-bottom: 0;
        }
      }

      > :last-child {
        width: calc(100% - (580px * 2));
        display: flex;
        justify-content: end;

        .el-form-item {
          width: 132px;
          height: 40px;
          margin-left: 10px;
          margin-bottom: 0;

          /deep/ .el-input {
            :first-child {
              background: #0682fe;
              border-radius: 5px;

              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 20px;
              color: #ffffff;
              line-height: 30px;
              text-align: center;
              font-style: normal;

              &::-webkit-input-placeholder {
                /* Edge */
                color: #ffffff !important;
              }

              &::-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #ffffff !important;
              }

              &:-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                color: #ffffff !important;
              }

              &::-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #ffffff !important;
              }

              &:-moz-placeholder {
                /* Mozilla Firefox 4 to 18 */
                color: #ffffff !important;
              }

              &::placeholder {
                color: #ffffff !important;
              }
            }

            :last-child {
              height: 80%;
            }
          }
        }
      }
    }

    > .search {
      margin-top: 10px;
      width: 100%;
      height: calc(100% - 46px - 46px - 51px);
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 200px 200px 200px;
      grid-column-gap: 20px;
      grid-row-gap: 20px;
      //grid-gap: 20px;

      > view {
        width: 100%;
      }
    }

    > .pagination {
      position: relative;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > view:first-child {
        font-size: 16px;
        font-weight: 400;
        color: #999999;

        > span {
          color: #007dee;
          font-weight: bolder;
        }
      }

      > view:last-child {
        display: flex;
        align-items: center;

        > view {
          width: 42px;
          height: 38px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #eeeeee;
          text-align: center;
          line-height: 38px;
          font-size: 16px;
          font-weight: 400;
          color: #999999;
          margin-right: 10px;
        }

        > view:first-child,
        > view:last-child {
          width: 65px;
        }

        > view:last-child {
          margin-right: 0;
        }

        > view.actived {
          color: #fff;
          background-color: #007dee !important;
        }
      }
    }
  }
}
</style>
