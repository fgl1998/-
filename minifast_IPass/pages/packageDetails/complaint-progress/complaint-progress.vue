<template>
  <div class="complaint-progress h5-page">
    <div class="toolbar" v-if="isShowTabs">
      <block v-for="item in tabsData" :key="item.id">
        <div class="item" :class="[item.id == tabCurrentId ? 'active' : '']" @click="handleClickTab(item.id)">
          {{ item.name }}
        </div>
      </block>
    </div>
    <block v-if="complaintList.length > 0">
      <div class="subsidy-item" v-for="(item, index) in complaintList" :key="item.chb580">
        <div class="subsidy-name">
          <div class="iconimg iconimg-subsidy"></div>
          <div class="subsidy-name-text" v-if="tabCurrentId == 'ygsp'">
            {{ item.chb519 }}
          </div>
          <div class="subsidy-name-text" v-else>{{ item.chb589 }}</div>
        </div>
        <div class="subsidy-con">
          <div class="cell" v-if="areaCode != '510100'">
            <div class="key">补贴项目：</div>
            <div class="value">
              <span>{{ item.chi031Desc ? item.chi031Desc : item.chi031_desc }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">补贴金额：</div>
            <div class="value">
              <span>{{ item.aae019 || '暂无' }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">被投诉人：</div>
            <div class="value">
              <span>{{ item.aac003 }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">被投诉人身份证号：</div>
            <div class="value">
              <span>{{ item.aac002 || '暂无' }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">投诉时间：</div>
            <div class="value">
              <span v-if="tabCurrentId == 'ygsp'">{{ item.chb51e.substring(0, 19) }}</span>
              <span v-else>{{ item.aae036.substring(0, 19) }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">投诉处理状态：</div>
            <div class="value">
              <span v-if="tabCurrentId == 'ygsp'">
                {{ areaCode == '511100' ? (item.chb515_desc == '未处理' ? '申诉中' : '申诉完成') : item.chb515_desc }}
              </span>
              <span v-else>{{ item.hasHb59List === '1' ? '已回复' : '暂未回复' }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="key">投诉内容：</div>
            <div class="value con">
              <span v-if="tabCurrentId == 'ygsp'">{{ item.chb51a || '暂无' }}</span>
              <span v-else>{{ item.chb584 || '暂无' }}</span>
            </div>
          </div>
          <!-- 成都显示投诉处理回复 -->
          <div
            class="cell"
            v-if="(item.chb095 && tabCurrentId == 'ygsp') || (tabCurrentId == 'ygsp' && areaCode == '510100')">
            <div class="key">投诉处理回复：</div>
            <div class="value con">
              <span>{{ item.chb095 || '暂无' }}</span>
            </div>
          </div>
        </div>

        <!-- 乐山不显示 -->
        <block v-if="areaCode !== '511100'">
          <div class="reply-content" v-if="item.isShowReply">
            <block v-for="(replyItem, replyIndex) in item.replyList" :key="replyIndex">
              <div class="reply-user" :class="[replyIndex === 0 ? 'first' : '']">
                <div class="user-info d-f ai-c">
                  <div class="iconimg iconimg-avatar"></div>
                  <block v-if="tabCurrentId == 'ygsp'">
                    <div class="reply-name" v-if="replyItem.aae011">
                      {{ replyItem.aae011 }}
                    </div>
                    <!-- <div class="reply-name" v-else>
                      {{ replyItem.aae011_desc }}({{ replyItem.aae017_desc }})
                    </div> -->
                  </block>
                  <block v-else>
                    <div class="reply-name">{{ replyItem.aae011 }}({{ replyItem.aae017 }})</div>
                  </block>
                </div>
                <block>
                  <div class="handle-time d-f ai-c">
                    <div class="key">处理时间：</div>
                    <div class="value">
                      {{ replyItem.aae036.substring(0, 19) }}
                    </div>
                  </div>
                  <div class="handle-result-desc d-f ai-c">
                    <div class="key">处理回复：</div>
                    <div class="value" v-if="tabCurrentId == 'ygsp'">
                      {{ replyItem.cpb103 }}
                    </div>
                    <div class="value" v-else>
                      {{ replyItem.chb592 }}
                    </div>
                  </div>
                </block>
              </div>
            </block>
          </div>
          <!-- v-if="tabCurrentId == 'ygsp' && areaCode !== '511000' -->
          <block v-if="tabCurrentId == 'ygsp' && areaCode !== '511300' && areaCode !== '510100'">
            <!-- 0 首次未处理 1 首次处理结束 -->
            <!-- v-if="item.chb515 > 0" -->
            <div class="see-reply d-f ai-c jc-c" @click="hanlderViewReply(index)">
              <span>{{ item.isShowReply ? '收起回复情况' : '查看回复情况' }}</span>
              <div class="iconimg iconimg-arrow-down-double" :class="[item.isShowReply ? 'active' : '']"></div>
            </div>
            <!-- 
              v-if="item.isShowReply && item.chb515 === 1"
             -->
            <block v-if="item.isShowReply && isOpenSPComplaintFeedback">
              <div class="radioitem d-f ai-c">
                <div class="value">
                  <radio-group class="radio-group" @change="handleRadioChange($event, index)">
                    <label class="radio-label"><radio value="2" style="transform: scale(0.7)" />非常满意</label>
                    <label class="radio-label"><radio value="1" style="transform: scale(0.7)" />满意</label>
                    <label class="radio-label"><radio value="0" style="transform: scale(0.7)" />不满意</label>
                  </radio-group>
                </div>
              </div>
              <div class="textarea-content">
                <div class="label">意见反馈</div>
                <div class="input-wrapper">
                  <textarea @input="getChb101($event, index)" maxlength="1000" placeholder="请填写意见反馈"></textarea>
                </div>
              </div>
              <div class="button-wrapper d-f ai-c jc-sb">
                <button class="submit-sp" @click="handleClickButtonReply(index)">提交</button>
              </div>
            </block>
          </block>
          <block v-else>
            <div class="see-reply d-f ai-c jc-c" @click="hanlderViewReply(index)" v-if="item.hasHb59List === '1'">
              <span>{{ item.isShowReply ? '收起回复情况' : '查看回复情况' }}</span>
              <div class="iconimg iconimg-arrow-down-double"></div>
            </div>
            <div
              class="button-wrapper d-f ai-c jc-sb"
              v-if="item.isShowReply && item.chb593 !== '1' && item.replyList[item.replyList.length - 1].chb593 === ''">
              <button @click="handleClickButtonReply(index, '0')">不满意</button>
              <button class="full" @click="handleClickButtonReply(index, '1')">满意</button>
            </div>
          </block>
        </block>
      </div>
    </block>

    <block v-else>
      <ComponentNoData tip="未查询到相关投诉数据" v-if="isRequestOver"></ComponentNoData>
    </block>
  </div>
</template>
<script>
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'

  import { showModal } from '@/utils/uni-api'
  import {
    requestSPGetComplaintsListByInformant,
    requestFFGetHb58List,
    requestFFGetHb59List,
    requestFFSaveChb594,
    requestB207,
    requestB138
  } from '@/service/api'

  import { USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  import { useGetUserInfoH5 } from '@/mixins'
  import config from '@/config'
  const { areaCode, isOpenSPComplaintFeedback, complaintAndReportRecordIsQueryYGFF } = config
  export default {
    name: 'pageComplaintProgress',
    mixins: [useGetUserInfoH5],
    data() {
      return {
        tabsData: [
          {
            id: 'ygsp',
            name: '公示投诉'
          },
          {
            id: 'ygff',
            name: '发放投诉'
          }
        ],
        tabCurrentId: 'ygsp',
        isShowTabs: false,
        // 投诉数据列表
        complaintList: [],
        imgList: [],
        isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
        areaCode,
        isOpenSPComplaintFeedback
      }
    },
    components: {
      ComponentButton,
      ComponentNoData
    },
    onLoad(e) {
      // 只有开启发放系统查询才显示tab
      if (complaintAndReportRecordIsQueryYGFF) {
        this.isShowTabs = true
      } else {
        this.isShowTabs = false
      }
      // 宜宾
      if (areaCode === '511500') {
        this.tabsData.pop()
      }

      if (areaCode === '511000') {
        this.isShowTabs = false
      }
    },
    methods: {
      //审批满意度变化
      handleRadioChange(e, index) {
        const item = this.complaintList[index]
        item.feedBackSp.chb09b = e.detail.value
      },
      //反馈意见变化
      getChb101(e, index) {
        const item = this.complaintList[index]
        item.feedBackSp.chb101 = e.detail.value
      },
      // 获取投诉列表信息 审批系统
      getComplaintListYGSP(idCard, userName) {
        requestSPGetComplaintsListByInformant('', userName, idCard, 1, 999)
          .then((res) => {
            const { list } = res.lists.hb51List
            if (list) {
              const newList = []
              list.map((item) => {
                item.isShowReply = false
                item.chb515 = parseInt(item.chb515)
                //审批系统初始加入反馈信息
                item.feedBackSp = {
                  chb09b: '', //满意度
                  chb101: '' //反馈意见
                }
                newList.push(item)
              })
              this.complaintList = [...newList]
            }
          })
          .finally(() => {
            this.isRequestOver = true
          })
      },
      // 获取投诉列表信息 发放系统
      getComplaintListYGFF(idCard, userName) {
        requestFFGetHb58List(userName, idCard, 1, 999)
          .then((res) => {
            const { list } = res
            if (list) {
              const newList = []
              list.map((item) => {
                item.isShowReply = false
                newList.push(item)
              })
              this.complaintList = [...newList]
            }
          })
          .finally(() => {
            this.isRequestOver = true
          })
      },
      // 请求具体回复情况 审批系统
      requestGetComplaintsReportProcessYGSP(cpb100) {
        return new Promise((resolve, reject) => {
          requestB138(cpb100)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 请求具体回复情况 发放系统
      requestGetHb59List(chb580) {
        return new Promise((resolve, reject) => {
          requestFFGetHb59List(chb580)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
      // 请求 满意与否 审批系统
      requestFeedbackComplaintsReportYGSP(index) {
        const item = this.complaintList[index]
        const { chb510 } = item
        const { chb09b, chb101 } = item.feedBackSp
        if (!chb101) {
          showModal('反馈意见不能为空!')
          return
        }
        requestB207(chb510, chb09b, chb101).then((res) => {
          this.complaintList[index].isShowReply = false
          showModal('反馈成功')
        })
        //清空状态
        item.feedBackSp.chb101 = ''
        this.$set(this.complaintList, index, item)
      },
      // 请求 满意与否 发放系统
      requestSaveChb594(index, chb593) {
        const item = this.complaintList[index]
        const { chb580, replyList } = item
        const { chb590 } = replyList[replyList.length - 1]

        requestFFSaveChb594(chb580, chb590, chb593, '').then((res) => {
          showModal('处理成功').then(() => {
            this.complaintList[index].isShowReply = false
          })
        })
      },

      // 查看回复情况
      hanlderViewReply(index, isClose = true) {
        const item = this.complaintList[index]
        if (this.tabCurrentId == 'ygsp') {
          if (item.isShowReply && isClose) {
            //收起回复
            item.isShowReply = false
            this.$set(this.complaintList, index, item)
            return
          }
          this.requestGetComplaintsReportProcessYGSP(item.cpb100).then((res) => {
            //查询回复
            const { list } = res.lists.pb11List
            if (list && list.length > 0) {
              item.isShowReply = true
              item.replyList = [...list]
              if (!isClose) {
                item.chb515++
              }
              this.$set(this.complaintList, index, item)
            } else {
              showModal('暂无处理流程')
            }
          })
        } else {
          if (item.isShowReply) {
            item.isShowReply = false
            this.$set(this.complaintList, index, item)
          } else {
            this.requestGetHb59List(item.chb580).then((res) => {
              const { list } = res
              if (list && list.length > 0) {
                item.isShowReply = true
                item.replyList = [...list]
                this.$set(this.complaintList, index, item)
              } else {
                showModal('暂无处理流程')
              }
            })
          }
        }
      },
      // 点击 满意/不满意按钮
      handleClickButtonReply(index, chb522) {
        if (this.tabCurrentId == 'ygsp') {
          this.requestFeedbackComplaintsReportYGSP(index)
        } else {
          // 不满意
          if (chb522 === '0') {
            const item = this.complaintList[index]
            const { replyList } = item
            const len = replyList.length
            if (len < 2) {
              this.requestSaveChb594(index, chb522)
            } else {
              showModal(
                '1、政策问题，请您拨打12345电话反映。2、干部作风问题，请您拨打12388电话反映或通过“廉洁内江”微信公众号举报。'
              )
            }
          }
          // 满意
          if (chb522 === '1') {
            this.requestSaveChb594(index, chb522)
          }
        }
      },
      // 切换 tab
      handleClickTab(id) {
        this.tabCurrentId = id
      }
    },
    computed: {
      ...mapGetters([USER_INFO])
    },
    watch: {
      'userInfo.user_id': {
        handler(val) {
          if (val) {
            const { idCard, userName } = this.userInfo
            if (this.tabCurrentId == 'ygsp') {
              this.getComplaintListYGSP(idCard, userName)
              //this.complaintList = [{chi031Desc:'5555',aae019:'20',aac003:'1',aac002:'1',chb51e:'11111111111111111111111111111',chb515_desc:'555',chb584:'pppp',chb095:'2222'}]
            } else {
              this.getComplaintListYGFF(idCard, userName)
            }
          }
        },
        immediate: true
      },
      tabCurrentId: {
        handler(val) {
          if (val) {
            const { idCard, userName } = this.userInfo
            this.complaintList = []
            this.isRequestOver = false
            if (val == 'ygsp') {
              this.getComplaintListYGSP(idCard, userName)
              //this.complaintList = [{chi031Desc:'5555',aae019:'20',aac003:'1',aac002:'1',chb51e:'11111111111111111111111111111',chb515_desc:'555',chb584:'pppp',chb095:'2222'}]
            } else {
              this.getComplaintListYGFF(idCard, userName)
            }
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  $item-height: 100rpx;
  .textarea-content {
    width: 750rpx - $spacing * 2;
    padding: $spacing 0;
    overflow: hidden;
    .label {
      font-size: 30rpx;
      color: #333;
      font-family: inherit;
      font-weight: bold;
    }
    .label::before {
      content: '*';
      color: red;
      margin-right: 10rpx;
    }
    .input-wrapper {
      margin-top: $spacing;
      textarea {
        display: block;
        width: 90%;
        border-radius: 12rpx;
        padding: 16rpx 24rpx;
        font-size: 26rpx;
        line-height: 40rpx;
        color: $color;
        background-color: rgba(#f0f2f5, 0.58);
        height: 200rpx;
      }
    }
  }

  .radioitem {
    height: $item-height;
    // border-bottom: 1px solid $border-color;
    padding: 0 4rpx;
    font-size: 30rpx;
    font-weight: 700;
    color: $color;
    position: relative;
    .value {
      flex: 1;
      height: $item-height;
      overflow: hidden;
      .radio-group {
        width: 70%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .radio-label {
          margin-left: 60rpx;
          white-space: nowrap;
          &:first-child {
            margin-left: 190rpx;
          }
          &.checked {
            .icon-wrapper,
            .text {
              color: $primary;
            }
          }
        }
        .radio {
          width: 0;
          height: 0;
          display: none;
        }

        .text {
          transition: all 0.3s ease-in-out;
          color: $color;
          font-size: 28rpx;
          font-weight: 500;
          padding-left: 4rpx;
        }
      }
    }
  }

  .complaint-progress {
    padding: $spacing;
  }
  .reply-content {
    border-top: 1px solid $border-color;
    .reply-user {
      position: relative;
      margin-bottom: 40rpx;
      color: $color;
      font-size: 26rpx;
      line-height: 40rpx;
      padding-top: 40rpx;
      &:nth-of-type(2n + 1) {
        .user-info {
          justify-content: flex-start;
          .iconimg {
            margin-left: 0;
            margin-right: 14rpx;
            order: 1;
          }
          .reply-name {
            order: 2;
          }
        }
        .handle-time {
          justify-content: flex-start;
        }
        .handle-result {
          justify-content: flex-start;
        }
        .handle-result-desc {
          justify-content: flex-start;
          .key {
            text-align: left;
          }
          .value {
            background-color: rgba(#3882ff, 0.06);
          }
        }
      }
      .user-info {
        font-weight: 700;
        font-size: 28rpx;
        line-height: 1;
        justify-content: flex-end;
        .iconimg {
          margin-left: 14rpx;
          order: 2;
        }
        .reply-name {
          order: 1;
        }
      }
      .handle-time {
        margin-top: 12rpx;
        justify-content: flex-end;
      }
      .handle-result {
        margin-top: 12rpx;
        justify-content: flex-end;
      }
      .handle-result-desc {
        margin-top: 12rpx;
        justify-content: flex-end;
        align-items: flex-start;
        flex-wrap: wrap;
        .key {
          width: 100%;
          text-align: right;
        }
        .value {
          margin-top: 12rpx;
          max-width: 80%;
          overflow: hidden;
          background-color: rgba(#000, 0.04);
          border-radius: 8rpx;
          padding: 16rpx 24rpx;
          font-size: 26rpx;
          line-height: 36rpx;
        }
      }
    }
  }

  .see-reply {
    font-size: 28rpx;
    font-weight: 700;
    height: 96rpx;
    line-height: 80rpx;
    color: $primary;
    border-bottom: 1px solid rgba($primary, 0.06);
    border-top: 1px solid rgba($primary, 0.06);
    margin-top: 30rpx;
    span {
      margin-right: 10rpx;
    }
    .iconimg {
      transition: all 0.3s;
    }
  }
  .button-wrapper {
    padding: 30rpx;
    button {
      width: 144rpx;
      height: 48rpx;
      background-color: #ffffff;
      border: 1px solid #3882ff;
      border-radius: 8rpx;
      font-size: 24rpx;
      line-height: 44rpx;
      text-align: center;
      transition: all 0.3s;
      color: #3882ff;
      &.full {
        color: #fff;
        background-color: #3882ff;
      }
      &.button-hover {
        opacity: 0.9;
      }
    }
    .submit-sp {
      width: 184rpx !important;
      height: 72rpx !important;
      font-size: 30rpx !important;
      line-height: 72rpx !important;
      margin: 0 auto !important;
      &:hover {
        opacity: 0.9 !important;
      }
    }
  }
  .iconimg-arrow-down-double {
    width: 22rpx;
    height: 20rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAoCAYAAACFFRgXAAAAAXNSR0IArs4c6QAABDJJREFUWAntWE1oVFcU/u6b/CFKEtD+RbCFgl20UCiCmUlMoGqcLvoH/iyEtiCVWuyi0GqbRGMyIdWNtAuJbqRQrDTiwrZqQttEcZJV/dmVtlZpFaotqDGg4/je8btj7vS+1zczMXHi5g0M95zvnHvO9+49794zA0Sf8q6AMuEbe+VluOinPp/gvobn8OnAGuUa+2yOXSLOYAopCN4ThX9iDjam29Ww5vAf4R65JIKGPDGFIzULsXbkHXU7j82CkPxCqq/dwAGSfdOkI8k/x7apRVp3DEiHW3lZC4JXM39hqHW31PnwMirLP5Pa69cxaJOdTHfXpM0Tlgq8TXDcGPQoQHNmAiebe+VJGy+H3LpLnpjI4gRzttjxuboTzn1uOThfElqL98qLnofjZPq4PYnyxSqFlSc71W8B/KGojX3yrNzFEPM+Ywckuasx4JVT29TPBs+vsAZG29VZAgk6/mEcJsens0C6qVteCuAzVnMxs0gHyfLtulCp0GST1cl8hDUw2qnOz4khrhTOat18+EIucBWGc6eJAWc4Lu2R5Tomy+AxXyiFczXViIft6P8I64k/tqsrdbWsJYUROxBJzxMXRxtTstrGpyMnUrKWq/q9jmnP5+6emFuJlpGP1d82buRQwtp47AM1Xl+LVSR92DhPjlXi4WA8JZsC+JRVruxm1+PRBVT5JjFXXR3aftiqbvhwS+EDFf+s/kZil37BHm7bu0FPR2EHS6griBfTSVZfCO1BH5bg3rYObOpSygvabL0kYeO8tFt6KHcY3YwM0N/WifdLJdIPfvlX9PMU2mDmmpExunkxbDd6sXHKhHUQvZUcPucK+eZxdQ6x5tezjDJhyVr3Sw0voYPcpdcCds9xsHm0Q+0J4AVVX+KCXpYh3i3ruGdfEvLVH0n/5FTh9fQWddNyh74pMzdxhGSbbZz+GSZfz5I6ZOOl5AcmrAMmemWF5+IwScy1E5DEaVWD5OhH6mrOb6c85d3BcZ4EL9h+lMdjMT7cZEMTsBVVp0VYR4z3yRIvi6MU59sZGPB3HvgrvRgqXRdDJLvItrOYrihBkjV7xodPUZk2YR0/0SOLWR6DIaT+ZZ3zVkW9zYM7cJ4J2/TlZOMPIucJT7cf5iXSQHJ6258vlphkz8xxkNSXUjE/bSt7P9zUJ/VuFt+yphNhZEg29IUM852VfvjUJ+oaX78VJPZdkASxgYWLkQyeHkE/rc9qPzz2obpV3YQ32E4NkKSrv+TwFW+vdfypdSeMoI1F/XDUD7Meon446ofvl0HUD9vHo0+O+uGoH/YVhF+J+mH/ehTU8v1wQY8ShnL0w8VSFvwjpdgk2zbWoS7HKrCMT562cVtm56b74ZapNO/2vDB5xoR10IfVD4cRDGIzLgk7YOuwVNxO4wB/ZOb+PefPpq9XdeKtUn+y2DEi+VGvwD1HBULns0o8dgAAAABJRU5ErkJggg==);
    transition: all 0.3s;
    &.active {
      transform: rotate(180deg);
    }
  }

  .toolbar {
    display: flex;
    align-items: center;
    background-color: $primary;
    width: 100%;
    height: 80rpx;
    border-radius: 16rpx;
    color: #fff;
    padding: 8rpx;
    margin-bottom: 30rpx;
    .item {
      width: 50%;
      text-align: center;
      border-radius: 12rpx;
      line-height: 64rpx;

      &.active {
        background-color: #fff;
        color: $primary;
        font-weight: 500;
      }
    }
  }
</style>
