<template>
  <div class="details-publicity h5-page">
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
        <!-- 查看详细 (广安种粮大户用) -->
        <block v-if="isShowdetail">
          <div class="showDetail">
            <div class="subsidy-con">
              <block v-for="(one, indexOne) in resultDetail" :key="one.chp020">
                <div class="cell details">
                  <div class="key">{{ one.n00039 | filterN00039(codeMap) }}：</div>
                  <div class="value">{{ one.n00128 }}亩</div>
                </div>
              </block>
            </div>
          </div>
          <div class="btn-wrapper" v-if="!showList[index]">
            <div class="btn" @click.stop="showDetail(index)">
              <span>展示详细</span>
            </div>
          </div>
        </block>

        <div class="btn-wrapper" v-if="isOpenYGFF">
          <div class="btn" @click.stop="handleComplaint(index)">
            <span>去投诉</span>
            <i class="iconfont iconfont-arrow-right-double"></i>
          </div>
        </div>
      </div>
    </block>
    <block v-else>
      <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
    </block>
    <div class="load-more-wrapper" v-if="isExceedLimit">
      <ComponentLoadMore :isOver="isLoadOver" @click="handleClickLoadMore"></ComponentLoadMore>
    </div>
    <view class="fiexed-wrapper d-f ai-c jc-c" @click="handleClickFixed">
      <div class="iconimg"></div>
      <div>申报须知</div>
    </view>
  </div>
</template>
<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'

import { navigateTo } from '@/utils/uni-api'
import config from '@/config'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { requestB014, requestB015, requestB029 } from '@/service/api'

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
      pageLimit: 5, // 每页数据条数
      isExceedLimit: false, // 加载条数是否超出限制
      isLoadOver: true, // 是否加载完成
      isOpenYGFF: true, // 是否开启阳光发放接口调用 针对投诉
      resultDetail: [], // 详情详细
      codeMap: {},
      showList: [], // 展示序号
      chi031: '',
      chi032: '',
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentPicker,
    ComponentNoData,
    ComponentLoadMore,
  },
  onLoad(e) {
    const { chi031, cpb100, chi032 } = e
    if (cpb100) {
      this.cpb100 = cpb100
    }
    if (chi032) {
      this.chi032 = chi032
    }
    if (chi031) {
      this.chi031 = chi031
      this._requestB014(chi031)
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 请求补贴项目需要显示的配置字段
    _requestB014(chi031) {
      requestB014(chi031).then((res) => {
        const { list } = res.lists.hi02List
        if (list) {
          const newList = []
          list.map((item) => {
            // chi02s 是否在扩展字段配置的时候选择了公示
            if (item.chi02s == '1') {
              newList.push({
                id: item.chi022,
                value: item.chi022,
                key: item.chi023,
              })
            }
          })
          this.renderArr = [...newList]
          // console.log('newList', newList)
          this.handleQueryData()
        }
      })
    },

    // 查询数据
    handleQueryData() {
      const chi031 = this.chi031
      const cpb100 = this.cpb100
      const pageNo = this.pageNo
      const pageLimit = this.pageLimit
      const renderArr = this.renderArr

      requestB015(chi031, cpb100, '', '04', '', '', '', '', pageNo, pageLimit)
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
                  valueDesc: item[value + 'Desc'], // 处理转码
                }
                if (item2.id === 'aac002') {
                  obj.value = this.TMIdcard(obj.value)
                }
                if (item2.id === 'aae005') {
                  obj.value = this.TMPhone(obj.value)
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
        .finally(() => {})
    },
    // 点击变化是否展示
    showDetail(index) {
      if (!this.showList || this.showList.length == 0) {
        this.resultList.forEach((item) => {
          this.showList.push(false)
        })
      }
      this.showList[index] = !this.showList[index]
      if (this.showList[index]) {
        this.getDetail(index)
      }
    },
    // 获取详细
    async getDetail(index) {
      let n00039 = [] // 作物类型

      try {
        n00039 = await getCodeListByCodeName('n00039')
      } catch (err) {
        console.log('code table n00039 error', err)
      }
      this.codeMap = {
        ...this.codeMap,
        n00039,
      }
      const { chb000, chb015, chb017, chb018, aab301 } = this.resultList[index]
      // const params = {
      //   methodName: 'B029',
      //   chb000,
      //   chb015,
      //   chb017,
      //   chb018,
      //   aab301,
      //   userList: JSON.stringify([this.userList]),
      // }
      requestB029(chb000, '')
        .then((res) => {
          this.resultDetail = res.lists.hp02List.list
        })
        .catch()
    },

    // 加载更多
    handleClickLoadMore() {
      this.pageNo++
      this.handleQueryData()
    },
    // 申报须知查看
    handleClickFixed() {
      const chi031 = this.chi031
      const chi032 = this.chi032
      navigateTo('notice', 'packageDeclare', {
        chi031,
        chi031_desc: chi032,
        chi04z: '0',
      })
    },
    // 投诉
    handleComplaint(index) {
      const item = this.resultList[index]
      const params = {
        ...item,
        chi031_desc: item.chi031Desc,
        aae209: item.aae209 || '暂无',
        aae019: item.aae019 || '暂无',
        type: 'yggs',
      }
      navigateTo('complaints', 'packageMasses', params)
    },
    // 脱敏身份证号
    TMIdcard(value) {
      if (!value) {
        return ''
      }
      let len = value.length
      let str = value.substr(0, 1) + '*'.repeat(len - 2) + value.substr(len - 1, len)
      return str
    },
    // 脱敏手机号码
    TMPhone(value) {
      if (!value) {
        return ''
      }
      const pat = /(\d{3})\d*(\d{4})/
      const str = value.replace(pat, '$1****$2')
      return str
    },
  },
  computed: {
    ...mapGetters([USER_LIST]),
    // 详细信息开启展示 (广安种粮大户用)
    isShowdetail() {
      let { orgid } = config.SPAddressRequestParams
      let res = false
      if (this.chi031 && this.chi031 == '20055' && orgid == '511600') {
        res = true
      }
      return res
    },
  },
  watch: {},
  filters: {
    // 数据过滤(广安种粮大户用)
    filterN00039(val, codeMap) {
      console.log(codeMap)
      let res = codeMap.n00039.find((item) => item.aaa102 == val)
      return res.aaa103
    },
  },
}
</script>
<style lang="scss" scoped>
.details-publicity {
  padding: $spacing;
  .subsidy-con {
    padding-bottom: 0;
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
.fiexed-wrapper {
  height: 64rpx;
  position: fixed;
  bottom: 142rpx;
  right: 0;
  z-index: 999;
  background-color: $primary;
  box-shadow: 0rpx 2rpx 10rpx 0rpx #0094ff;
  border-radius: 32px;
  padding: 0 30rpx;
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
  .iconimg {
    width: 32rpx;
    height: 32rpx;
    background-image: url(data:image/png;base64,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);
  }
}
</style>
