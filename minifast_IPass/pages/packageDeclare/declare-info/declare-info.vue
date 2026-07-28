<template>
  <div class="details-publicity">
    <div class="check-info-wrapper" v-if="checkList && checkList.length > 0">
      <div class="item-wrapper" v-for="item in checkList" :key="item.id">
        <ComponentPanel :title="item.name">
          <div class="panel-content">
            <block v-for="item2 in item.list" :key="item2.chb000">
              <div class="item d-f ai-c jc-sb" :class="[item2.isSuccess ? 'success' : 'fail']">
                <div class="left d-f ai-c">
                  <div class="iconimg"></div>
                  <div>{{ item2.chr023 }}</div>
                </div>
                <div class="right d-f ai-c">
                  <div class="tag" :class="[item2.chr032 === '1' ? '' : 'fail']">
                    {{ item2.chr032 === '1' ? '核验成功' : '核验失败' }}
                  </div>
                </div>
              </div>
              <div class="item-fail-tip d-f ai-c" v-if="!item2.isSuccess">
                <div class="iconimg"></div>
                <span>{{ item2.chr037 }}</span>
              </div>
            </block>
          </div>
        </ComponentPanel>
      </div>
    </div>

    <block v-if="queryResultList.length > 0">
      <div class="subsidy-item" v-for="(item, index) in queryResultList" :key="index">
        <div class="subsidy-con">
          <block v-for="(itemCell, indexCell) in item" :key="itemCell.id">
            <div class="cell details">
              <div class="key">{{ itemCell.key }}：</div>
              <div class="value">
                {{ itemCell.valueDesc ? itemCell.valueDesc : itemCell.value }}
              </div>
            </div>
          </block>
        </div>
        <div class="btn-wrapper">
          <div class="btn d-f ai-c jc-c" @click.stop="handleViewFiles(index)">
            <span>查看上传的资料</span>
            <i class="iconfont iconfont-arrow-right-double"></i>
          </div>
        </div>
      </div>
    </block>
    <block v-else>
      <ComponentNoData tip="未查询到相关数据" v-if="isRequestOver"></ComponentNoData>
    </block>
    <div class="load-more-wrapper" v-if="isExceedLimit">
      <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
    </div>
  </div>
</template>
<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'

  import { navigateTo, showModal } from '@/utils/uni-api'
  import { requestB013, requestB014, requestB015, requestB029 } from '@/service/api'

  import { USER_LIST } from '@/store/constants'
  import { mapGetters } from 'vuex'

  export default {
    name: 'pageDetailsPublicity',
    data() {
      return {
        renderArr: [], // 配置字段渲染数据
        queryResultList: [], // 查询结果列表
        resultList: [], // 未解析的数据 用于投诉
        pageNo: 1, // 查询页数
        pageLimit: 999, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        isRequestOver: false,
        chb000: '',
        chi031: '',
        // 校验列表
        checkList: []
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentPicker,
      ComponentNoData,
      ComponentLoadMore,
      ComponentMUIPopup
    },
    onLoad(e) {
      const { chi031, chb000, chb01b } = e

      if (chb000) {
        this.chb000 = chb000
        // 校验失败
        if (chb01b == '2') {
          this._requestB013(chb000).then((res) => {
            this.checkList = [{ id: chb000, name: '校验结果', list: res }]
          })
        }
      }

      if (chi031) {
        this.chi031 = chi031
        this._requestB014(chi031)
      }
    },
    created() {},
    mounted() {},
    methods: {
      // 请求 用于查询补贴项目补贴享受人员的校验结果
      _requestB013(chb000) {
        return new Promise((resolve, reject) => {
          requestB013(chb000, 1, 999, false)
            .then((res) => {
              const { list } = res.lists.hr03List
              if (list && list.length > 0) {
                const newList = []
                list.map((item) => {
                  item.isSuccess = false
                  // 1 校验通过，2 校验不通过
                  if (item.chr032 === '1') {
                    item.isSuccess = true
                  }
                  newList.push(item)
                  resolve(newList)
                })
              } else {
                reject(res)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 请求补贴项目需要显示的配置字段
      _requestB014(chi031) {
        requestB014(chi031).then((res) => {
          const { list } = res.lists.hi02List
          if (list) {
            const newList = []
            list.map((item) => {
              // chi02s 是否在扩展字段配置的时候选择了公示
              newList.push({
                id: item.chi022,
                value: item.chi022,
                key: item.chi023
              })
            })
            this.renderArr = [...newList]
            this._requestB015()
          }
        })
      },
      // 用于查询补贴项目申报的申报,不带相应的扩展
      _requestB015() {
        const chi031 = this.chi031
        const chb000 = this.chb000
        const pageNo = this.pageNo
        const pageLimit = this.pageLimit
        const renderArr = this.renderArr
        requestB015(chi031, '', chb000, '', '', '', '', '', pageNo, pageLimit)
          .then((res) => {
            const { list } = res.lists.hb00List
            if (res && list) {
              const newList = []
              const newResultList = []
              list.map((item) => {
                const temp = []
                newResultList.push(item)
                renderArr.map((item2) => {
                  const value = item2.value
                  let obj = {
                    id: value,
                    key: item2.key,
                    value: item[value] || '暂无',
                    valueDesc: item[value + 'Desc'] // 处理转码
                  }
                  temp.push(obj)
                })
                newList.push(temp)
              })
              this.resultList = [...this.resultList, ...newResultList]

              const len = newList.length
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
                this.queryResultList = [...newList]
                // console.log('queryResultList', this.queryResultList)
              } else {
                // 加载更多
                // 加载完成
                if (len < pageLimit) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                }
                this.queryResultList = [...this.queryResultList, ...newList]
                // console.log('queryResultList', this.queryResultList)
              }
            } else {
              this.isLoadOver = true
              if (pageNo < 2) {
                this.queryResultList = []
              } else {
                this.queryResultList = [...this.queryResultList]
              }
              // console.log('queryResultList', this.queryResultList)
            }
          })
          .finally(() => {
            this.isRequestOver = true
          })
      },
      // 用于查询个人的申报详情
      _requestB029(chb000, aae100) {
        requestB029(chb000, aae100, true, false)
          .then((res) => {
            const { lists, hb00BizMap } = res
            const { hi21List } = lists
            const fileList = hi21List.list
            const { chi031, aka131 } = hb00BizMap
            navigateTo('file-declare', 'packageDeclare', {
              fileList: JSON.stringify(fileList),
              chi031,
              aka131
            })
          })
          .catch((err) => {
            showModal('无效数据，无法查看上传材料！')
          })
      },
      // 查看附件
      handleViewFiles(index) {
        const data = this.resultList[index]
        const { chb000 } = data
        this._requestB029(chb000, '')
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this._requestB015()
      }
    },
    computed: {
      ...mapGetters([USER_LIST])
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .details-publicity {
    padding: $spacing;
    .subsidy-con {
      padding-bottom: 0;
      .cell {
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    .btn-wrapper {
      color: $primary;
      padding: 20rpx 0;
      border-top: 1px solid $border-color;
      .btn {
        font-size: 26rpx;
        line-height: 60rpx;
        margin-left: $spacing;
        .iconfont {
          font-size: 22rpx;
          padding-left: 4rpx;
        }
      }
    }
    .popup-content {
      width: 692rpx;
      margin: auto;
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 8rpx 40rpx 0;
      .title {
        font-size: 32rpx;
        font-weight: 700;
        line-height: 44rpx;
        padding: 18rpx 24rpx;
        color: #3d424d;
        position: relative;
        margin-top: 12rpx;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          width: 8rpx;
          height: 32rpx;
          background-color: #3882ff;
          border-radius: 2rpx;
        }
      }
      .cell-wrapper {
        width: 100%;
      }
      .cell {
        height: 90rpx;
        border-bottom: 1px solid $border-color;
        padding: 0 6rpx;
        font-size: 30rpx;
        font-weight: 700;
        color: $color;
        position: relative;
      }
      textarea {
        display: block;
        border-radius: 12rpx;
        padding: 16rpx 24rpx;
        font-size: 26rpx;
        line-height: 40rpx;
        color: $color;
        background-color: $page-background-color;
        height: 200rpx;
        margin-top: $spacing;
        box-sizing: border-box;
      }
      .button-wrapper {
        padding: 80rpx 0 40rpx;
      }
      .iconfont-close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 20rpx;
        color: #f00;
      }
    }
    .check-info-wrapper {
      margin-bottom: $spacing;
      .item-wrapper {
        margin-bottom: 0;
      }
      .panel-content {
        padding-top: $spacing;
        padding-right: 16rpx;
        padding-left: $spacing;
      }
      .item {
        font-size: 30rpx;
        font-weight: 500;
        line-height: 44rpx;
        color: #3d424d;
        &.success {
          margin-bottom: 36rpx;
        }
        &.fail {
          .iconimg {
            transform: rotate(90deg);
          }
        }
      }
      .iconimg {
        width: 44rpx;
        height: 44rpx;
        transition: all 0.3s;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAAyVBMVEUAAAA5gv9Ci/85g/84gv84g/84g//O4//h8P/O4v/O4//O4/84g//O4/85hP87hP87hf/////P5P/Q5f/O4//O4//O4//O4/84gv85gv/O4/84g//P4//P4/85hP/P5P/O5f/O4/87hP/R5//S6f/W6P/W7//N4v/O5P/O4/85g/85gv87hf9Gi//N4v84gv9Ulf5Eiv7K4f4/h/661v5cmv620v6kyP6XwP5/sP7H3/7A2f52qf5zqP7J3/6gxP6cwv56rf5upf6oaOj+AAAALnRSTlMAhxH8+OLb0Qf48eLRmHY+NgNBN+nKw7i1r62pjHFuXFFIMCMcFQ/dgntmXkkLocSkggAAAahJREFUWMPtmMlSAjEURWPT0CAziIIIiDgPr5nn0f//KNMPKDUxLrybWJVTxYbFKeo0neRFOBwOh8NS8hk/8yK+UgpSQQv2vvqhpO59ftNOkeTyHhRnQiZREEcCYh7KmDgmpfIT+k1xgA6kGpBYOk/y8VBS876JOQcoFl41MscLipjSZVAsRC7KEcspYqIGKhYFzlH1FDFd3IFi4dU4R14RyxyImGn6nINUnoqgWNwkQsloQaTmAMXCq0fm3oQUzkqImHnmN3zWJ4XHIiY25zi/BcXi7d2Qow2KBU0HP+e4KoJiGnc5x1DPAYppvuIcG1I4vQbFdMix03MkMfExR1fLUemAYlovI/Ngq+dAxMyWcyzXpJBNgmIa7nOMSSHogGLq7zjHVMvRQsTMphepV3M9Byim4YhzaOZKEhRTf8a/mVSykJiZyBw9UklbK96nWBpSwA9voT88K/9u5hfEzlfavAhZuWyaF3ortybzZmrn9m8+sFh5xDIfCq08xpoP3naOCn8YbqBxrGTnAGkcee0c0s3XCjZehPxydWPpZZPxeszhcDgc/5IPSiYfrzUN0WAAAAAASUVORK5CYII=);
      }
      .tag {
        font-size: 28rpx;
        font-weight: 500;
        line-height: 44rpx;
        color: #51d574;
        background-color: rgba(#4fd57b, 0.1);
        border-radius: 4rpx;
        width: 150rpx;
        text-align: center;
        &.fail {
          color: #ff6853;
          background-color: #ffe1dd;
        }
      }
      .item-fail-tip {
        font-size: 26rpx;
        color: #f00;
        line-height: 1.4;
        margin-bottom: 36rpx;
        padding-top: 12rpx;
        padding-left: 44rpx;
        font-weight: 500;
        .iconimg {
          width: 32rpx;
          height: 32rpx;
        }
        span {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
</style>
