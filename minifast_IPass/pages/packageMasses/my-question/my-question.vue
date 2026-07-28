<template>
  <view class="my-question h5-page">
    <div class="query-wrapper">
      <div class="cell-wrapper">
        <div class="cell d-f ai-c">
          <div class="label">问题类型</div>
          <div class="value">
            <picker
              class="picker"
              :range="questionRange"
              @change="handlePickerChangeQuestionType"
              :index="questionTypeIndex"
              range-key="name">
              <div class="picker-value" v-if="questionType">
                {{ questionRange[questionTypeIndex]['name'] }}
              </div>
              <div class="picker-placeholder" v-else>请选择问题类型</div>
              <div class="iconimg iconimg-arrow-right"></div>
            </picker>
          </div>
        </div>
      </div>
    </div>

    <div class="query-result">
      <block v-if="queryResultList.length > 0">
        <div
          class="item"
          :class="[item.isShowReply ? 'active' : '']"
          v-for="(item, index) in queryResultList"
          :key="index">
          <div class="tags d-f ai-c">
            <div class="tag green" v-if="item.replyed === '1'">已回复</div>
            <div class="tag" style="background-color: #dc0808; color: beige" v-else>暂未回复</div>
            <div class="tag red">
              {{ item.chb557_desc }}
            </div>
            <div class="tag">
              {{ item.chb55e == '0' ? '不公开' : '公开' }}
            </div>
          </div>
          <div class="name-wrapper">
            <div class="iconimg iconimg-triangle-title"></div>
            <div class="name">
              {{ item.chb55c }}
            </div>
          </div>
          <div class="latest-reply d-f ai-c jc-sb" v-if="!item.isShowReply">
            <div class="left d-f ai-c">
              <div class="iconimg iconimg-avatar-user"></div>
              <div>{{ item.chb551 }}</div>
              <span>{{ item.chb55b.substring(0, 10) }}</span>
            </div>
            <div class="right d-f ai-c">
              <div class="iconimg iconimg-view"></div>
              <span>{{ item.chb55d ? item.chb55d : 0 }}</span>
              <div class="iconimg iconimg-message"></div>
              <span>{{ item.replys.length }}</span>
            </div>
          </div>
          <div class="reply-content" v-else>
            <block v-for="(replyItem, replyIndex) in item.replys" :key="replyIndex">
              <div class="reply-user d-f ai-c" :class="[replyItem.chb563 === '1' ? 'first' : '']">
                <div class="iconimg iconimg-avatar"></div>
                <div class="con">{{ replyItem.chb565 }}</div>
                <div class="reply-name">
                  <span> {{ replyItem.chb563 === '1' ? item.chb551 : replyItem.chb568 }}</span>
                  <span class="time">
                    {{ replyItem.chb561.substring(0, 19) }}
                  </span>
                </div>
              </div>
            </block>
            <div class="button-wrapper">
              <ComponentButton
                name="继续咨询"
                width="180rpx"
                height="48rpx"
                type="primary"
                @click="handleQuestion(index)"></ComponentButton>
            </div>
          </div>
          <div class="see-reply d-f ai-c jc-c" @click="hanlderSeeReply(index)" v-if="item.replys.length > 0">
            <span>{{ item.isShowReply ? '收起问答' : '查看回答' }}</span>
            <div class="iconimg iconimg-arrow-down-double"></div>
          </div>
          <div class="see-reply d-f ai-c jc-c" style="color: #d1d6e0" v-else>
            <span>{{ '暂无回答' }}</span>
          </div>
        </div>
      </block>
      <block v-else>
        <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
      </block>
      <div class="load-more-wrapper" v-if="isExceedLimit">
        <ComponentLoadMore :isOver="isLoadOver" bgc="#f5f5f5" @click="handleClickLoadMore"></ComponentLoadMore>
      </div>
    </div>

    <!-- 提问弹窗 -->
    <ComponentMUIPopup ref="popup" type="center">
      <div class="popup-content">
        <div class="title">继续咨询</div>
        <div class="cell-wrapper">
          <textarea placeholder="请输入咨询内容" maxlength="100" v-model="messageContent"></textarea>
        </div>
        <div class="button-wrapper">
          <ComponentButton
            name="提交咨询"
            width="264rpx"
            height="72rpx"
            type="primary"
            @click="handleSubmit"></ComponentButton>
        </div>
        <div class="iconfont iconfont-close" @click="closePopup"></div>
      </div>
    </ComponentMUIPopup>
  </view>
</template>

<script>
  import ComponentMUIPopup from '@/components/common/ez-popup/ez-popup.vue'

  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

  import { showModal } from '@/utils/uni-api'
  import { requestSPQueryLevMsg, requestSPSaveHb56, requestSPAddMsgViewTime } from '@/service/api'

  import { USER_INFO } from '@/store/constants'
  import { mapGetters } from 'vuex'
  export default {
    name: 'pageMyQuestion',
    data() {
      return {
        // 问题类型
        questionRange: [
          {
            id: '1',
            value: '1',
            name: '业务咨询'
          },
          {
            id: '2',
            value: '2',
            name: '群众建议'
          },
          {
            id: '3',
            value: '3',
            name: '检举揭发'
          },
          {
            id: '4',
            value: '4',
            name: '其他'
          }
        ],
        questionType: '',
        questionTypeIndex: '0',
        messageContent: '', // 咨询内容
        selectInfo: {}, // 当前操作的留言
        queryResultList: [], // 数据明细
        pageNo: 1, // 查询页数
        pageLimit: 5, // 每页数据条数
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true // 是否加载完成
      }
    },
    components: {
      ComponentButton,
      ComponentLoadMore,
      ComponentNoData,
      ComponentMUIPopup
    },
    onLoad(e) {},
    onShow() {
      this.initQueryData()
      this.handleQuery()
    },
    onReady() {},
    onHide() {},
    methods: {
      // 打开留言弹窗
      openPopup() {
        this.$refs.popup.open()
      },
      // 关闭留言弹窗
      closePopup() {
        this.$refs.popup.close()
      },
      // 初始化查询数据
      initQueryData() {
        // 初始添加
        this.pageNo = 1
        this.isExceedLimit = false
        this.isLoadOver = true
      },
      // 问题类型 picker change
      handlePickerChangeQuestionType(e) {
        const { value } = e.target
        const questionRange = this.questionRange
        this.questionTypeIndex = value
        this.questionType = questionRange[value].value
        this.initQueryData()
        this.handleQuery()
      },
      // 查看回答
      hanlderSeeReply(index) {
        const queryResultList = [...this.queryResultList]
        const newQueryResultList = []
        queryResultList.forEach((item, i) => {
          if (i === index) {
            item.isShowReply = !item.isShowReply
            if (item.isShowReply) {
              this.requestAddMsgViewTime(item)
            }
          }
          newQueryResultList.push(item)
        })
        this.queryResultList = [...newQueryResultList]
      },
      // 继续咨询
      handleQuestion(index) {
        const item = this.queryResultList[index]
        this.selectInfo = { ...item }
        this.openPopup()
      },
      // 查询 获取结果
      handleQuery() {
        const { loginId } = this.userInfo
        const questionType = this.questionType
        const pageLimit = this.pageLimit
        const pageNo = this.pageNo

        requestSPQueryLevMsg(loginId, questionType, '3', pageNo, pageLimit).then((res) => {
          const { list } = res.lists.hb55List
          console.log(list, 12345)
          if (res && list) {
            const len = list.length
            const questionRange = this.questionRange

            const newList = []
            list.map((item) => {
              item.isShowReply = false
              item.replys = JSON.parse(item.replys)
              questionRange.map((e) => {
                if (e.value === item.chb557) {
                  item.chb557_desc = e.name
                }
              })

              newList.push(item)
            })
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
      },

      // 留言提交
      handleSubmit() {
        const messageContent = this.messageContent

        const selectInfo = this.selectInfo

        if (!messageContent) {
          showModal('请输入咨询内容')
          return
        }

        requestSPSaveHb56(selectInfo.chb550, '1', messageContent).then((res) => {
          const queryResultList = this.queryResultList
          const newQueryResultList = []
          queryResultList.map((item) => {
            if (item.chb550 === selectInfo.chb550) {
              item.replys.push(res)
            }
            newQueryResultList.push(item)
          })
          this.queryResultList = [...newQueryResultList]

          this.closePopup()
          showModal('提交成功，请耐心等待回复!')
        })
      },
      // 加载更多
      handleClickLoadMore() {
        this.pageNo++
        this.handleQuery()
      },
      // 微信留言次数增加
      requestAddMsgViewTime(item) {
        requestSPAddMsgViewTime(item.chb550).then(() => {})
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .my-question {
    padding: $spacing;
    .query-wrapper {
      background-color: #fff;
      border-radius: 12rpx;
      .cell-wrapper {
        padding: 0 40rpx;
      }
      .cell {
        height: 114rpx;
        border-bottom: 1px solid #ccc;
        padding: 0 6rpx;
        font-size: 30rpx;
        font-weight: 700;
        color: #4e5767;
        position: relative;
        .value {
          flex: 1;
          height: 100%;
          overflow: hidden;
          .picker {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            font-size: 28rpx;
            font-weight: 400;
            line-height: 112rpx;
            text-align: right;
            padding-right: 24rpx;
            .picker-placeholder {
              color: #b2b2b2;
            }
            .picker-value {
              color: #3d424d;
            }
          }
          .radio-group {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            // background-color: #f0f;
            .label {
              margin-left: 80rpx;
              white-space: nowrap;
              &:first-child {
                margin-left: 0;
              }
              &.checked {
                p {
                  color: #388eff;
                }
                .iconimg {
                  background-image: url(data:image/png;base64,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);
                }
              }
            }
            .radio {
              width: 0;
              height: 0;
              display: none;
            }
            .iconimg {
              position: static;
              left: 0;
              top: 0;
              transform: translate(0, 0);
              width: 32rpx;
              height: 32rpx;
              transition: all 0.3s ease-in-out;
              background: url(data:image/png;base64,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)
                no-repeat center center;
              background-size: 100% 100%;
              margin-right: 12rpx;
            }
            p {
              transition: all 0.3s ease-in-out;
              color: rgba(78, 87, 103, 1);
              font-size: 28rpx;
              font-weight: 500;
            }
          }
        }
        .iconimg {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
        &:last-child {
          border-bottom: 0;
        }
      }
    }
    .button-wrapper {
      padding: $spacing $spacing * 2;
    }
    .query-result {
      padding-top: 32rpx;
      .item {
        background-color: #ffffff;
        border-radius: 8rpx;
        padding: 0 32rpx;
        padding-top: 42rpx;
        margin-bottom: 32rpx;
        &.active {
          .name-wrapper {
            padding-left: 54rpx;
            .iconimg {
              display: block;
            }
          }
          .see-reply {
            .iconimg {
              transform: rotate(-180deg);
            }
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .tags {
        .tag {
          width: 122rpx;
          height: 36rpx;
          border-radius: 4rpx;
          font-weight: 500;
          font-size: 24rpx;
          line-height: 36rpx;
          text-align: center;
          margin-right: 16rpx;
          background-color: rgba(181, 181, 181, 0.16);
          color: #666666;
          &.green {
            color: #6ed700;
            background-color: rgba(109, 212, 0, 0.16);
          }
          &.violet {
            background-color: #efecff;
            color: #2825ff;
          }
          &.red {
            background-color: #ffe1dd;
            color: #ff6853;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .name-wrapper {
        font-size: 28rpx;
        font-weight: 700;
        color: $color;
        line-height: 40rpx;
        padding-top: 24rpx;
        padding-bottom: 72rpx;
        position: relative;
        .iconimg {
          display: none;
          position: absolute;
          top: 30rpx;
          left: 0;
        }
      }
      .latest-reply {
        height: 34rpx;
        font-size: 24rpx;
        font-weight: 700;
        color: rgba(102, 102, 102, 0.8);
        margin-bottom: 12rpx;
        .left {
          .iconimg {
            margin-right: 8rpx;
          }
          span {
            padding-left: 20rpx;
          }
        }
        .right {
          .iconimg {
            margin-right: 8rpx;
            margin-left: 20rpx;
          }
        }
      }
      .reply-content {
        .reply-user {
          position: relative;
          margin-bottom: 80rpx;
          &.first {
            .iconimg {
              order: 1;
              margin-left: 0;
              margin-right: 14rpx;
            }
            .reply-name {
              left: 54rpx;
              top: -36rpx;
            }
            .con {
              order: 2;
              background-color: rgba($primary, 0.06);
              margin-right: 80rpx;
              margin-left: 0;
            }
          }
        }
        .iconimg {
          margin-left: 14rpx;
          order: 2;
        }
        .reply-name {
          position: absolute;
          right: 54rpx;
          top: -36rpx;
          font-size: 24rpx;
          line-height: 1;
          font-weight: 700;
          color: $color;
          .time {
            padding-left: 10rpx;
            font-size: 18rpx;
            color: $color-placeholder;
            font-weight: 100;
          }
        }
        .con {
          order: 1;
          flex: 1;
          overflow: hidden;
          background-color: $page-background-color;
          border-radius: 8rpx;
          padding: 16rpx 24rpx;
          font-size: 26rpx;
          line-height: 36rpx;
          color: $color;
          margin-left: 80rpx;
        }
        .button-wrapper {
          padding-bottom: $spacing;
          height: auto;
          margin-bottom: 0;
        }
      }
      .see-reply {
        font-size: 28rpx;
        font-weight: 700;
        height: 96rpx;
        line-height: 80rpx;
        color: $primary;
        border-top: 1px solid rgba($primary, 0.06);
        span {
          margin-right: 10rpx;
        }
        .iconimg {
          transition: all 0.3s;
        }
      }
      .button-wrapper {
        height: 120rpx;
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
        background-color: $primary;
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
      .value {
        flex: 1;
        height: 100%;
        overflow: hidden;
        .picker {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
          font-size: 28rpx;
          font-weight: 400;
          line-height: 80rpx;
          text-align: right;
          padding-right: 24rpx;
          .picker-placeholder {
            color: #b2b2b2;
          }
          .picker-value {
            color: $color-placeholder;
          }
        }
      }
      .iconimg {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
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

  .iconimg-avatar {
    width: 40rpx;
    height: 40rpx;
    background-image: url(data:image/png;base64,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);
  }
  .iconimg-arrow-right {
    width: 12rpx;
    height: 22rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAsCAMAAABIQohxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURUdwTDiC/ziD/z2K/zmD/ziC/zmD/zyG/0mc/ziD/zmE/4Tg/zqE/ziC/ziE/ziD/zmD/ziC/ziD/ziE/ziC/wHdj6UAAAAUdFJOUwD87hGX3oIgB8wzAkf2X6hRvrVtxY6xvQAAAMBJREFUOMuVlMsWhCAMQ0VQ0OK7//+ts6KlaI6OS+8hxjSlC6l7fniKAHCfAWAeCQA+PQA8zACwuwBgtzW+x0Juvve+kH63JE5yyPqmFIQcje91KaT1PQ8MfKdN5KxvosuJXERyy27P+EPkgs2bxiLnjia5LDG0mUoMtzFQACCF/6TAx9Uun/V7/UFXD4Y0EltBDdEM32vspuZVsuuH0VZlMCXW+hiXdeHyp4o+u1RgXb4vDlg1B5YTrTO6ANCV8QNKQhtnQwET9AAAAABJRU5ErkJggg==);
  }
  .iconimg-triangle-title {
    width: 29rpx;
    height: 28rpx;
    background-image: url(data:image/png;base64,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);
  }
  .iconimg-view {
    width: 24rpx;
    height: 16rpx;
    background-image: url(data:image/png;base64,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);
  }
  .iconimg-message {
    width: 24rpx;
    height: 20rpx;
    background-image: url(data:image/png;base64,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);
  }
  .iconimg-arrow-down-double {
    width: 22rpx;
    height: 20rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAoCAYAAACFFRgXAAAAAXNSR0IArs4c6QAABDJJREFUWAntWE1oVFcU/u6b/CFKEtD+RbCFgl20UCiCmUlMoGqcLvoH/iyEtiCVWuyi0GqbRGMyIdWNtAuJbqRQrDTiwrZqQttEcZJV/dmVtlZpFaotqDGg4/je8btj7vS+1zczMXHi5g0M95zvnHvO9+49794zA0Sf8q6AMuEbe+VluOinPp/gvobn8OnAGuUa+2yOXSLOYAopCN4ThX9iDjam29Ww5vAf4R65JIKGPDGFIzULsXbkHXU7j82CkPxCqq/dwAGSfdOkI8k/x7apRVp3DEiHW3lZC4JXM39hqHW31PnwMirLP5Pa69cxaJOdTHfXpM0Tlgq8TXDcGPQoQHNmAiebe+VJGy+H3LpLnpjI4gRzttjxuboTzn1uOThfElqL98qLnofjZPq4PYnyxSqFlSc71W8B/KGojX3yrNzFEPM+Ywckuasx4JVT29TPBs+vsAZG29VZAgk6/mEcJsens0C6qVteCuAzVnMxs0gHyfLtulCp0GST1cl8hDUw2qnOz4khrhTOat18+EIucBWGc6eJAWc4Lu2R5Tomy+AxXyiFczXViIft6P8I64k/tqsrdbWsJYUROxBJzxMXRxtTstrGpyMnUrKWq/q9jmnP5+6emFuJlpGP1d82buRQwtp47AM1Xl+LVSR92DhPjlXi4WA8JZsC+JRVruxm1+PRBVT5JjFXXR3aftiqbvhwS+EDFf+s/kZil37BHm7bu0FPR2EHS6griBfTSVZfCO1BH5bg3rYObOpSygvabL0kYeO8tFt6KHcY3YwM0N/WifdLJdIPfvlX9PMU2mDmmpExunkxbDd6sXHKhHUQvZUcPucK+eZxdQ6x5tezjDJhyVr3Sw0voYPcpdcCds9xsHm0Q+0J4AVVX+KCXpYh3i3ruGdfEvLVH0n/5FTh9fQWddNyh74pMzdxhGSbbZz+GSZfz5I6ZOOl5AcmrAMmemWF5+IwScy1E5DEaVWD5OhH6mrOb6c85d3BcZ4EL9h+lMdjMT7cZEMTsBVVp0VYR4z3yRIvi6MU59sZGPB3HvgrvRgqXRdDJLvItrOYrihBkjV7xodPUZk2YR0/0SOLWR6DIaT+ZZ3zVkW9zYM7cJ4J2/TlZOMPIucJT7cf5iXSQHJ6258vlphkz8xxkNSXUjE/bSt7P9zUJ/VuFt+yphNhZEg29IUM852VfvjUJ+oaX78VJPZdkASxgYWLkQyeHkE/rc9qPzz2obpV3YQ32E4NkKSrv+TwFW+vdfypdSeMoI1F/XDUD7Meon446ofvl0HUD9vHo0+O+uGoH/YVhF+J+mH/ehTU8v1wQY8ShnL0w8VSFvwjpdgk2zbWoS7HKrCMT562cVtm56b74ZapNO/2vDB5xoR10IfVD4cRDGIzLgk7YOuwVNxO4wB/ZOb+PefPpq9XdeKtUn+y2DEi+VGvwD1HBULns0o8dgAAAABJRU5ErkJggg==);
  }
</style>
