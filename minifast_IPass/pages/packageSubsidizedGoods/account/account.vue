<template>
  <div class="account h5-page">
    <!-- 商户 -->
    <block v-if="isRequestOver">
      <div class="header-wrapper">
        <div class="avatar-wrapper">
          <ComponentAvatar
            size="136rpx"
            :src="shopInfo.avatar"
          ></ComponentAvatar>
        </div>
        <div class="shop-name" v-if="isMerchant">{{ shopInfo.cht131 }}</div>
        <div class="cell-wrapper">
          <block v-if="isMerchant">
            <div class="cell d-f ai-c">
              <div class="key">法人姓名：</div>
              <div class="value">{{ shopInfo.aac003 | TMUserName }}</div>
            </div>
            <div class="cell d-f ai-c">
              <div class="key">法人身份证号：</div>
              <div class="value">{{ shopInfo.aac002 | TMIdcard }}</div>
            </div>
          </block>
          <block v-else>
            <div class="cell d-f ai-c">
              <div class="key">姓名：</div>
              <div class="value">{{ userInfo.userName | TMUserName }}</div>
            </div>
            <div class="cell d-f ai-c">
              <div class="key">身份证号：</div>
              <div class="value">{{ userInfo.idCard | TMIdcard }}</div>
            </div>
          </block>
          <img :src="imageBg" alt="" />
        </div>
      </div>
      <block v-if="isMerchant">
        <div class="panel-wrapper money-wrapper">
          <ComponentPanel title="店铺收款信息">
            <div class="panel-content">
              <div class="cell d-f ai-c">
                <div class="key">收款人：</div>
                <div class="value">{{ shopInfo.aae009 | TMUserName }}</div>
              </div>
              <div class="cell d-f ai-c">
                <div class="key">收款账户：</div>
                <div class="value">{{ shopInfo.aae010 | TMBankCard }}</div>
              </div>
              <div class="cell d-f ai-c">
                <div class="key">收款银行：</div>
                <div class="value">{{ shopInfo.aae008_desc }}</div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="panel-wrapper settlement-wrapper">
          <ComponentPanel title="店铺月度结算统计">
            <div class="panel-content">
              <div class="items d-f ai-c">
                <div class="item">
                  <div class="iconimg iconimg-completed"></div>
                  <div class="key">已结算</div>
                  <div class="value">{{ shopInfo.cht191_2_money || '0' }}</div>
                </div>
                <div class="item">
                  <div class="iconimg iconimg-processing"></div>
                  <div class="key">结算中</div>
                  <div class="value">{{ shopInfo.cht191_1_money || '0' }}</div>
                </div>
                <div class="item">
                  <div class="iconimg iconimg-untreated"></div>
                  <div class="key">待结算</div>
                  <div class="value">{{ shopInfo.cht191_0_money || '0' }}</div>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
        <div class="panel-wrapper order-wrapper">
          <ComponentPanel title="店铺订单统计">
            <div class="panel-content">
              <div class="items d-f ai-c jc-sb">
                <div class="item">
                  <div class="iconimg iconimg-statistics-blue"></div>
                  <div class="value PangMenZhengDao">
                    {{ shopInfo.ht19_sum || '0' }}
                  </div>
                  <div class="key">已下单订单</div>
                </div>
                <div class="item">
                  <div class="iconimg iconimg-statistics-red"></div>
                  <div class="value PangMenZhengDao">
                    {{ shopInfo.ht19_cancel || '0' }}
                  </div>
                  <div class="key">已取消订单</div>
                </div>
                <div class="item">
                  <div class="iconimg iconimg-statistics-green"></div>
                  <div class="value PangMenZhengDao">
                    {{ shopInfo.ht19_settled || '0' }}
                  </div>
                  <div class="key">已确定订单</div>
                </div>
              </div>
            </div>
          </ComponentPanel>
        </div>
      </block>
      <block v-else>
        <div class="card-items">
          <block v-if="ht16List && ht16List.length > 0">
            <div
              class="card-item"
              v-for="(item, index) in ht16List"
              :key="index"
            >
              <div class="cell d-f ai-c">
                <div class="key">补贴项目：</div>
                <div class="value">
                  {{ item.chi032 || '暂无' }}
                </div>
              </div>
              <div class="cell d-f ai-c last">
                <div class="key">账户余额：</div>
                <div class="value">{{ item.cht161 || '0' }}元</div>
              </div>
              <div class="tag" :class="[item.cht162 == '1' ? '' : 'fail']">
                {{ item.cht162Desc }}
              </div>
            </div>
          </block>
          <block v-else>
            <ComponentNoData
              v-if="isRequestOver"
              tip="未查询相关信息"
            ></ComponentNoData>
          </block>
        </div>
      </block>
    </block>
  </div>
</template>
<script>
import imageBg from './images/bg.png'

import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentAvatar from '@/components/common/ez-avatar/ez-avatar.vue'
import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'

import { getCodeListByCodeName } from '@/utils/custom-api'
import { requestB066 } from '@/service/api'

import {
  USER_INFO,
  USER_LIST,
  IS_MERCHANT,
  SHOP_INFO,
  UPDATE_SHOP_INFO,
} from '@/store/constants' // 常量

import { mapGetters } from 'vuex'

export default {
  name: 'pageAccount',
  data() {
    return {
      imageBg,
      ht16List: [],
      isRequestOver: false, // 是否请求完成
      aae008Range: [],
    }
  },
  components: {
    ComponentPanel,
    ComponentNoData,
    ComponentAvatar,
  },
  onLoad(e) {},
  onShow() {
    this.isRequestOver = false
    getCodeListByCodeName('aae008').then((res) => {
      this.aae008Range = [...res]
    })
    this._requestB066()
  },
  onReady() {},
  onHide() {},
  methods: {
    // 账户详情
    _requestB066() {
      const isMerchant = this.isMerchant
      const { cht130 } = this.shopInfo
      const { idCard } = this.userInfo

      requestB066(isMerchant ? cht130 : '', isMerchant ? '' : idCard)
        .then((res) => {
          if (isMerchant) {
            for (let i = 0, len = this.aae008Range.length; i < len; i++) {
              const item = this.aae008Range[i]
              if (res.aae008 === item.aaa102) {
                res.aae008_desc = item.aaa103
                break
              }
            }
            this.$store.commit(UPDATE_SHOP_INFO, res)
          } else {
            const { list } = res.lists.ht16List
            const newList = []
            list.map((item) => {
              const cht162 = item.cht162
              switch (cht162) {
                case '1':
                  item.cht162Desc = '正常'
                  break
                case '2':
                  item.cht162Desc = '禁用'
                  break
                case '3':
                  item.cht162Desc = '挂失'
                  break
                default:
                  item.cht162Desc = '未知状态'
                  break
              }
              newList.push(item)
            })
            this.ht16List = [...newList]
          }
        })
        .finally(() => {
          this.isRequestOver = true
        })
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST, IS_MERCHANT, SHOP_INFO]),
  },
  watch: {},
  // 分享给朋友
  onShareAppMessage(e) {
    return this.shareConfig
  },
  // 分享到朋友圈
  onShareTimeline(e) {
    return this.shareConfig
  },
}
</script>

<style lang="scss" scoped>
.account {
  padding-bottom: 30rpx;
  .header-wrapper {
    height: 276rpx;
    background-color: $primary;
    padding-top: 12rpx;
    color: #fff;
    position: relative;
    margin-bottom: 30rpx;
    .avatar-wrapper {
      width: 136rpx;
      height: 136rpx;
      border-radius: 50%;
      margin: 0 auto;
      border: 8rpx solid #d8e7ff;
      overflow: hidden;
      .img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .shop-name {
      font-size: 26rpx;
      font-weight: 700;
      text-align: center;
      padding-top: 8rpx;
    }
    .cell-wrapper {
      width: 692rpx;
      height: 202rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
      left: 50%;
      transform: translateX(-50%);
      position: absolute;
      bottom: -140rpx;
      padding: 60rpx 24rpx;
      .cell {
        font-size: 28rpx;
        line-height: 40rpx;
        margin-bottom: 10rpx;
        white-space: nowrap;
        color: $color-placeholder;
        margin-bottom: 16rpx;
        .value {
          color: $color;
          font-weight: 500;
        }
      }
      img {
        position: absolute;
        top: 14rpx;
        right: 6rpx;
        width: 176rpx;
        height: 132rpx;
      }
    }
  }
  .panel-wrapper {
    margin-bottom: 30rpx;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .money-wrapper {
    padding-top: 140rpx;
    .cell {
      font-size: 28rpx;
      line-height: 40rpx;
      white-space: nowrap;
      margin-bottom: 20rpx;
      .key {
        color: $color-placeholder;
        width: 132rpx;
      }
      .value {
        color: $color;
        font-weight: 500;
      }
    }
  }
  .settlement-wrapper {
    .item {
      width: 33.333%;
      text-align: center;
      line-height: 1.4;
      font-weight: 500;
      .key {
        font-size: 26rpx;
        color: $color-placeholder;
      }
      .value {
        font-size: 28rpx;
        color: $primary;
        font-weight: 700;
      }
      .iconimg {
        margin: 0 auto;
      }
    }
  }
  .order-wrapper {
    .items {
      .item {
        width: 184rpx;
        height: 184rpx;
        background-color: #ffffff;
        border-radius: 16rpx;
        border: solid 2rpx #eef4f9;
        font-size: 22rpx;
        font-weight: 500;
        color: rgba(8, 33, 85, 0.5);
        text-align: center;
        line-height: 1;
        padding-top: 20rpx;

        &:nth-child(n + 2) {
          .value {
            color: #ff6853;
          }
        }

        &:nth-child(n + 3) {
          .value {
            color: #00c290;
          }
        }
      }
      .iconimg {
        margin: 0 auto;
      }
      .value {
        font-size: 36rpx;
        font-weight: 700;
        color: #1b6eff;
        padding-top: 8rpx;
      }

      .key {
        line-height: 32rpx;
        padding-top: 14rpx;
      }
    }
  }
  .card-items {
    padding: 140rpx $spacing;
    .card-item {
      background-color: #ffffff;
      border-radius: 12rpx;
      margin-bottom: $spacing;
      padding: 24rpx;
      padding-right: 70rpx;
      position: relative;
      .tag {
        position: absolute;
        bottom: 20rpx;
        right: 20rpx;
        line-height: 1;
        font-size: 24rpx;
        background-color: #dcffe8;
        border-radius: 4px;
        padding: 12rpx 22rpx;
        font-weight: 400;
        color: #0cb54d;
        &.fail {
          color: #fff;
          background-color: #f00;
        }
      }
      .cell {
        font-size: 26rpx;
        color: $color-placeholder;
        line-height: 40rpx;
        margin-bottom: 20rpx;
        .value {
          flex: 1;
          overflow: hidden;
          color: $color;
          font-weight: 500;
        }
        &.last {
          margin-bottom: 0;
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
.iconimg-processing {
  width: 64rpx;
  height: 64rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURUdwTDiC/4y4/ziC/zmD/4e1/ziD/2uk/zmD/0+U/4i1/4i1/zmC/4i1/5bL/4e0/ziC//////P3/8fc/1uY/9/q/5i+/6/N/zLEhmQAAAAPdFJOUwC8I9iZ6sI/VxGvavPRBwBkEMMAAAHwSURBVHja7ZrploIwDEZl7cJWAfH933TG4sxgkcWalDme7/4XL03SpNXTCQAAAAAAAAD+MbHOmrfJdOz9/Q0RvgaaSkB7CmRUApmnQEMGBCAAAQhA4GMEuva8g7bjEujOO+mYBNq9Au2nChwegsOTEPsABCAAAQhAYKEZPWk+odtxF0ig3TuAVLoQsartQ5QodFiBqphdCYmAIagKwls6jyQs6hOnwOZl1M9aK5nmSVkmeSpVQIHqHnwZmQmRDCVQjcsvcuOQiyAC2fj+qXlCGkLAvqaKzFMixS5gy08lZoFEMQtU9hORWSRiFhCL8X8jD15dAGFWEZwC9uGT+rv1jUvvVCOjgL2Pl5MvG1uEswSST0A7Gdhbgcu7ebjRjCZN6BYBZbYEjKJux930RyG5LSCpB5J2mgLptkDKJVA5NbAkkHOFwK5Asi2QcCWhFSiNW4bnwREoucpwScDdi3gF5iG4cSUNwarAwyD0ly5tT5eEy9SzVjj8pstAV4brvUg+Jlz/swgN3Ua0Pg4pt+jGfeNCuBXvb0Z3rt8CPWUzWkbNY2DjMPRh2vE4kubrExHnQNJk9cEj2bgEBw6l93MR8Vj+0l84NMPBRHscjUiPZrHH4ZD0cPrqH5kE9fHcF7ILCn+IrmgAAAAAAAAAAIThC0d5Q9NpHtrNAAAAAElFTkSuQmCC);
}
.iconimg-untreated {
  width: 64rpx;
  height: 64rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURUdwTIi1/4q2/ziC/zmD/zmD/4i1/ziD/4e1/0qT/ziG/467/4e0/ziC//////H2/8fc/6LE/0exYbcAAAAMdFJOUwC0M9hXmWK/5RA7G4WQA7cAAAGsSURBVHja7ZrrkoMgDEZFuaoUff+X7Sy6o931SkPodL7zt516JIEESlUBAAAAAAAAwMdSC9u/jRV18vN7IrpEAUElIBIFLJWATRToyYAABCAAAQh8jcAQHhcIQy6B4XGRIZNAuCoQvlWgeAiKJyHWAQhAAAIQgMBOMdooPtzleGASCFcbECF03TkXf6SrteAVsPrfkVDNGAKrCU/pEpKQ8vEJ09D+jrWTyjTeN0ZJxyhg5+BL41cYySUgppdtXx4fFVoWgfn9ld9AcQjE+DvjNzEuu0DMf9f4HRqXWWA6DjZ+F5NZQO/G/408uDsArT+kzSmgTwKQFoSb5/HSnyDzCYgLA5AwBCfFaFWEfiLg/CmOuhwP6z+F5LmApG5IwjoF1LmAyiqwSoFx9c0wpifB5RBEgWUVHl+/tRg0uZIwCiwv+mekwvJJrmn4GQIcITgUYEjC450PwzQ87oYYFqLjYsiwFJcvRsc3BEqW4+INyTQRS7ZkxZvS+Z4IcVtub28MiDcmImFrRLo1u3mNR5NvTqvu3kWmmnp7ngrZAUU6REc0AAAAAAAAAAC4eALtgQUKBTsKmwAAAABJRU5ErkJggg==);
}
.iconimg-completed {
  width: 64rpx;
  height: 64rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABLUExURUdwTIi1/4q2/4i1/zmD/zmC/zmD/ziD/0qT/4e1/ziC/4i1/ziG/4i1/467/4e0/ziC/////8fc//P3/5K6/93p/1GS/7DN/2yi/1twmmQAAAAPdFJOUwBiM/lX95m/EOrYrzvRG6WCHF8AAAIYSURBVHja7ZrrcoMgEEbjFRSNBOPl/Z+0qRhHLRhFwE7mO3/SmSTdE3ZhgfF2AwAAAAAAAPxbQpZVp8lYaBw/qqwQmRqwyhLMUCCzJZAZClTWgAAEIAABCHyNgKgfO6iFKwHx2IlwJFDvFai/VeDyFFxehFgHIAABCEAAAppmpGg+vtuxziB64WVDstqARCULwjulwz+5hwHzK1AG9z+XTR5TUAYWb+mOF2FkM7zBNMzeY03jlORJkpM0ph4FyjH5MUn4REJiXwKl/LEF4StI4UUgk78/5QpSDwLyPpYSroRQ5wJD/dOca8ipY4Fy+AbhWohjgVCb/xN1cHQACr5J4VIg+JAAsyQcvI+P1XEr0bXyr9idANMPwNDBWrMh+NCMZk3otwRpoorfDR/t5KpMbbfjyeCuy0A3ftAsBx83JPW8BFJ9/MfTbCbuFijnJdALUa3iC8N5sDsFwwiMq3D/+0ZTzeM303rsqggHgbEGmzFoz5/r+DxxNA0jhcAr7vu1dS6wSEG3StMs/vkUbAqQ+cqjjH+6CPU5WEzDvtHEPz0Nt5vxbCGaJmy9iH96IdpuhouluFbFP70UH2hGnSK+hWakL4J1M2ibdf7dtmPFhqTtfW5I5ES8cksmh+DCTamsAtvb8kOPcDAHBxNmcDSyejQ79hjPeDlh83B68EGm8XEhi8dzU6xdUJhj6YoGAAAAAAAAAADwxQ+jfEOxmemRlwAAAABJRU5ErkJggg==);
}
.iconimg-statistics-green {
  width: 60rpx;
  height: 60rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABOUExURUdwTOb59PH//+b59Oj79eb69en8+Ob59Oj59ub59Ob59Ob59Ob59OX48wDCkEHSrCDKnmjbvdH064jiy1LWtDDOpazr2xXHmQvFlcPw5UuXz54AAAANdFJOUwDdDZU2ayLsT8a3+Kf3AH8wAAAD1UlEQVRo3s2b2ZaDIAyG60JBMaKC2/u/6HRsp4tFSNyY3Mz01ONXIAk/EC4XqsWpYEWeRRGXkkdRlhdMpPHlWLuyIoLJJHz+jQp2PQgas4KD03jBdm95LHIJCJO52JOdJhzQxpN0L2wORMv3QIsMVlgmtrZ2FXZCb2l1nMAGS1a7GeOwyThblywy2GzZiqQi+HYuSE52sgR2suT0bl7T3dcIdrQITU457GocGdJCws4mUS4m4AATgbgIciqPAUvPOF85HGT8el4cEaIqgwMtOyFPErOngINNnO1YHgfL4HCzDjM7ngvSoklifgIYeHy2Ry96dgonWXq+Z1n9ix7Co6oma7tNwUxvsCkf1m5psmeEG23UzfT0oVaT9X/g4f7Z3L7S0z+6wY+yez3YPSBm+qRKq1WvXujdvZ9jG9z8NQ4LLvsG2WR3DOuSCi41LpY9ScvQwQaXvjyxpD5fp+3g+h2scBGVk8B3352bBgL44V6xpIERg+IByxg1Hyrk6whP3mfHAvu6wZMZmgELLiYwx4JL5SQ3bw/6puVJaqE78JYZVL1oaijRYLhiJM9C4LrMC2aIIT4E/DvIUQhwdItiCAGGGCG27OBKmbo2qloJThGixwJu9fiUQLpdAxYIHf8FnsusrqWDmd+pv8DaMWWjwcUlJ4LtuqbrieAcoS8/wP24oHZ7Gjjzh/EHeFjUcd1AAkdEsEZIMySYU8BO8d5SwPwiKWCnYO4oYEkC2xs8toOeNRkDpnS1XvLnYTbKmK6mOJctlJrq2RXjUV7dL3Grxy/q0WAZURKIZYib9j2ptJQEQkiZysMlCOFbyixWgMdav756S2aKMkmwFV3dPl4941K6mlGEwNO5+rvGNvPk3VOEAEX6NO9puTXzXNaQpE+8JoE8pyJtnyYwYo8ib9V8EtTeB5flLUnQj5+S45M7EgU9ZQmjLFOD57nlJQxl0eaaF7uSuGgjLFOXJddMdKGWqfiF+RREC0vkpqKIvYK2FeEgNy1J3jLa5suysJ7JauTmC3q76bn7Mxvo0RCXMDlxg+2lrs1bqztDXrQJ3JaidZk6mFp3WtdmoC9TXyciybkL8wS5bWzoYIPdKXe6V00H18iNcneTx4HKHUb0AZBTa2oiedD48x93RI11W6GtrUfC8U+wA69wR3zBDjXDHeOecnAN7D8d1YcrTghWjhGuACVcyU24IqNgZVXhCsmOcm0p/m+xYLjyyHAFoeFKYMMV/YYrc96rsBv4itsDoUrZwxXvB7yuEO6CRsArKQEv4QS8dhTwolXAq2Vfl+m+ZoLjLtPtfH3wB0CNS6aGjWJFAAAAAElFTkSuQmCC);
}
.iconimg-statistics-blue {
  width: 60rpx;
  height: 60rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURUFu+kxy/B5v/1qA/0h1/kVw+0Nv/0dwTEJv/0Rw+0Bu/z9u/zpv/Dxu/j1w+z9u/Rxv/0Nu/xtu/0Nu/xtu/2lPDLwAAAATdFJOUzMKxQURH+UAxCmjtk2KQmfh1PEBoyknAAADjUlEQVRo3tXb7XKrIBAG4CWCFRGJtfd/rVWTNGoI7GtAztk/nUwdn0FBli/6gkNIpfQUNMX8Vykp8LsQai6eJ1CdD1dSUSSUrJLDcfVhp4QFU73bIhEsNIGhRQJYwuxCyw9hcYjllDoIV4o+CFUdhSV9GPIQXGn6OHSFw5KShERhRYlCQXCKxxx53JS2EfEblg8WlDgED5aUPCQHzuD6ZDrF9ciU+/2+e890kvsiU8Z2FGzPWzijO8nvYUVZQ72DJWUO6Ycryh6VF9b5Ye2DJZ0Q8hWu6JSoXmB1Dqz2sKCTQuxgfRastzBes7rLdYmLO1a/6GiBzc89LseKTJw33FvTTGGXH+1lie8H/H37baZ/2fkqY3vOWyZGgV09LmGWX5cfb1znp3C7rnaMIlO8wP3dZcNj3ceLTPE2bEcUHm28LS9wpBrhsAnf8QFH2lKzvZ31w+0abuItiuJfyx1M9uIJSwCsbnCse2iYD5APz10Fxb9aDfd2/CvlAivu7cbIl6EfubBaYHY5xiYo9w0bntV4h/i83/Sa27fR1CMfFhMsEZgZTbyLonjqkQPWE6xLwVQCnlhxEK6bqaKZdY2CYEHyCDzY7i8FssMRWJLC4WHX0bsBh9UB2Aa6bADWIOzPa1wNwhqF626V4brnJ7SrM8Or8k4Zwffzp8sLr95vv02qtQVhQuBhPZR4ZFqPGBCYMNiFYJcP3tzvBV4VOTVsw7CFYKRydWG4y1WrawrDVGeChxg8ZIIbD9zfA0yEJxboJMwr/BeXDoOh3mkIwD8Ge9QKSQTqEHzFKpeEUp9tPn/dwBYZScypz9fRDwj17W60aKFkD0lvm0QX3tJbJKHvgjNfYF6NDGEMa3TMHMJAg7bARJIbwUHbFwLXbx/2JuliDVOBgfn8EXkzRO4HJOdS2FREQN66zKmICoK9ifUurWZOvrCnm/7q9u5FdwYcwihwgu0Z7arUroUHbZI3pegfpprWOmdbc2SYypxETT4wV8xpY4PDhjltHO4oLA5b5kR5uMgdDnfcpYFwkR3qOvZiSKRFde1Qs2NoO2D5p9iCV7klvmKLmuWWcYstXJdbqi+3OaHYdoxyG1DKbblJuknwxa3+xW1V5TaSlds6V26zYLntkeU2hJbbAltu02+5bc7pqpj4f7ayl9u8X/C4QrkDGgWPpBQ8hFPw2FHBg1Ylj5bFDtPpfIfp7uVOdXzwFzYg3ei+s7NSAAAAAElFTkSuQmCC);
}
.iconimg-statistics-red {
  width: 60rpx;
  height: 60rpx;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4BAMAAADLSivhAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURf9pVUdwTP9pU/9sV/9oU/9rVv9oVP9uWv90Wf9pU/92Vf+AgP9pVP9oVP9oU/9oUzPPIb4AAAAPdFJOUzMAxCTmLnEVDZoHA0iz1DzjlDoAAAPBSURBVFjDrZlNSBtBFMcfhtlYzWURScheSugl0OIGDwq9lBI8lWY9WNRCCcVLT8nirb0o0rt4KAgVDUV6VaT0WooXD62lN6Ggh9JTISBBEDTT/UiyX+9tdnb6P0QZ9pe82Xnz3rw3oBLSPq5OLxhsYXrm9SH1DODDxVUDBmIzLQFY86MufpgUzusQUeZNMnjDAERsNgm8AYRmh8Mki9BheB9itBgPH0GsHsbBeSMeZiYNF3UYokyLhN/CUC1ScB4SyMTh4UaHDYeEq+RpGYMLRjKYrSPwGiTUaBTOQ2KZEXgtOTwahgsgoPUQvC8CLwfhoiECs1YAngAhVQKwLgZn/XABBGX64H1ReNkH66JwxoPzAKnsduBP4vDzAayLw5k+XIAUavXgyTTwfA8mN9TXarX6J2ZrWbBGTvmcc34ZM2mITvnkZ6kMcKdUKtUsmFt/f8BW6cH76L6EyKZ4ZiG3ACPc0yPbhk49sjkgMuVjjsP8SWTSEF5ltkvB15FJg6oZ0bcUgi/6g4FfObTgsGNPuc8t+eBN9L2bFjyBw+xlqa8yvmgVCz7A4eErPm7BTQSOeAY2mLVgHXmOfwmO5TgCZyzYwOD7ISfHYKZCEbOQd8o729tn272PrRoGQwvyKIwpApswkR6uwGR6eB4O0sPjsBcDPz7buRcDj0GThLvO9j9pk3CWhrt11wOUNg3rFLzZH1ii4AwJz7GBJ62Iwh3Pu1muRsEGDl/5hxo4zCjYHyqZIgZ3rX9W5qD/2SZgQGHbaufnFd6xnmrwmNwRgS8sg2r2VzRsGF4QMG72pvua6oprxJLQnO2FssGG++pyInDHWyF3zWo4jDpJ1/Vqb83aAh52OXCOq5h4LAk305tN7OdkLyxLhKFESzVGBMB60EkUIgDiofcuBNxzhAi9eNC/ceD+xoBTIujj6eYyuCWniHRTHB4MgAgGLSLFBs9Nx5xIsXhy511fes+1OZXcm3jo/euNfMdDb5Y40HD/aVGp4fA4cZSyddszPHdOZIwKcYhzaee3lXMq0ZnI8dFLsZ3yu1c7ZIp1jo/h1500uTsHV3UvHTyGHdZ3KfgaO6yHyoRTCr7ByoTQpBUKrmMFihaqE779riJ6+gstjcJFGcNLfQMvyooy5aBUISpXAksV31Jlv1zDQbj8Xvc3WZoSTRbtSLxs/0+NJamWllwzTaqNJ9dAlGpdyjVNpdq1co1i9XMSoytEf1uTaY7LteWlLgTkriLkLkHkrl9UTebiR1U/SFw5Wc4icdkld80md8GX9GrxH5oJMVGZJuMmAAAAAElFTkSuQmCC);
}
</style>
