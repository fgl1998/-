<template>
  <view class="unitPreview">
    <image src="../../../static/images/loginBack.png" class="loginBack"></image>
    <view class="preview-box">
      <view class="preview-title">
        <text>欢迎您，光临久远银海智能展位招聘！</text>
      </view>
      <view class="preview-con">
        <view class="con-lt">
          <view class="info-title">
            <view class="title-box">
              <view class="title-tag">
                <image src="../../../static/images/ic_num_bg.png" class="tag-bg"></image>
                <view class="tag-text">摊位编号：{{ boothsInfo.acb32b }}</view>
              </view>
              <view class="title-name">{{ unitInfo.aab004 }}</view>
              <button type="primary" size="mini" @click="queueNumVisible = true" class="queue-btn">排号</button>
            </view>
            <!-- <view class="vr-box">
              <view class="vr-btn">
                <image src="@/static/images/guide/ic_vr.png" class="btn-img"></image>
                <text>VR全景展示</text>
              </view>
            </view> -->
          </view>
          <view class="info-con">
            <view class="info-lt">
              <view class="lt-top">
                <image :src="unitInfo.aae707" style="width: 100%"></image>
              </view>
              <view class="lt-bottom">
                <image src="../../../static/images/ic_code_bg.png"></image>
                <image src="../../../static/images/erweima.png" class="code"></image>
              </view>
            </view>
            <view class="info-rt">
              <view class="info-item">
                <view class="item-title">公司简介</view>
                <view class="item-decr" v-dompurify-html="unitInfo.brief || unitInfo.aab092"></view>
              </view>
              <view class="info-item">
                <view class="item-title">联系方式</view>
                <view class="item-decr decr-border">
                  <view><text>地址：</text>{{ unitInfo.aab601 }}</view>
                  <view><text>邮箱：</text>{{ unitInfo.aae159 }}</view>
                  <view
                    ><text>联系人：</text> {{ unitInfo.aae004 }} <text class="tel">{{ unitInfo.aae005 }}</text></view
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="con-rt">
          <view class="list-title"
            >招聘岗位：<text>{{ totalNum }}</text>个</view
          >
          <view class="list-con">
            <view class="list-top">
              <view class="list-name">分页页数：</view>
              <view class="list-page">
                <view
                  v-for="(item, index) in pages"
                  :key="index"
                  class="page"
                  :class="{ actived: item === currentPage }"
                  :style="{ color: item === currentPage ? '#2391FE' : '#999' }"
                  @click="select(item)"
                >
                  <span>{{ item }}</span>
                </view>
              </view>
            </view>
            <view class="list-bottom">
              <view class="list-item" v-for="(item, index) in jobList.list" :key="index">
                <view class="item-box">
                  <view class="item-top">
                    <view class="name-image">
                    	<view class="item-name">{{ item.acb213 }}</view>
                    	<image src="../../../static/images/remen.png" class="remen" v-if="item.acb218==1"></image>
                    </view>
                    <view class="item-decr">
                      <!-- {{item.acb214List}} -->
                      <view class="item-lt">
                        <!-- <text class="tag-item" v-for="(itemT,indexT) in item.acb214List" :key="indexL">{{itemT}}</text> -->
                        <text class="tag-item" v-if="item.acc217Desc">{{ item.acc217Desc }}</text>
                        <text class="tag-item" v-if="item.aac011Desc">{{ item.aac011Desc }}</text>
                        <text class="tag-item" v-if="item.acb217">{{ item.acb217 }}</text>
                        <text class="tag-item" v-if="item.acb469Desc">{{ item.acb469Desc }}</text>
                      </view>
                      <!-- <view class="item-rt edit-job" @click="openEdit({ type: true, acb210: item.acb210 })">
                        <image src="../../../static/images/toujian.png"></image>
                        <text>编辑职位</text>
                      </view> -->
                    </view>
                    <view class="item-decr">
                      <view class="item-lt money"
                        >薪资待遇：<text>{{ item.acb21h || 0 }}-{{ item.acb21j || '不限' }}</text
                        >元/月</view
                      >
                      <view class="item-rt ready"
                        >预招聘<text>{{ item.acb21g }}</text
                        >人</view
                      >
                    </view>
                  </view>
                  <view class="item-bottom">
                    <image src="../../../static/images/ic_company.png"></image>
                    <text>{{ item.aab004 }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="con-line"></view>
      </view>
    </view>

    <!--职位编辑-->
    <job-edit :editJob="editJob" :acb210="acb210" :aab001="aab001" @closeEdit="openEdit"></job-edit>
    <queueNum :visible="queueNumVisible" @close="closeQueueNum" :boothsInfo="boothsInfo"></queueNum>
  </view>
</template>

<script>
import jobEdit from './jobEdit'
import queueNum from './queueNum.vue'
export default {
  name: 'unitPreview',
  components: {
    jobEdit,
    queueNum,
  },
  props: {
    infoShow: {
      type: Boolean,
    },
    boothsInfo: {
      type: Object,
    },
  },
  data() {
    return {
      param1: {
        apiCode: 'jy201_hrm259',
        method: 'jy201_hrm259',
        aab001: '',
      },
      param2: {
        apiCode: 'jy201_hrm257',
        method: 'jy201_hrm257',
        aab001: '',
        pageSize: 2,
        pageNumber: 1,
        paginationModel: 'mostCount',
      },
      unitInfo: {},
      jobList: {},
      currentPage: 1,
      totalPages: 10,
	  totalNum: 0,
      editJob: false,
      acb210: '',
      queueNumVisible: false,
      aab001: '',

      bianhao: uni.getStorageSync('deviceInfo_4')?.ace711,
    }
  },
  watch: {
    infoShow(newVal, oldVal) {
      if (newVal) {
        this.unitInit()
        this.jobListShow()
      }
    },
  },
  computed: {
    pages: {
      get() {
        const c = this.currentPage
        const t = this.totalPages
        const numArr = []
        if (t <= 6) {
          for (let i = 1; i <= t; i++) {
            numArr.push(i)
          }
          return numArr
        } else if (t > 6) {
          if (c <= 3) {
            //return [1, 2, 3, 4, 5, '...', t]
            return [1, 2, 3, 4, '...']
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
  methods: {
    closeQueueNum() {
      this.queueNumVisible = false
    },
    select(n) {
      console.log(n, 8888)

      // if (n === this.currentPage) return
      if (typeof n === 'string') return
      this.currentPage = n
      // this.getDataList()
      this.param2.pageNumber = n
      this.jobListShow()
    },
    unitInit() {
      const param = {
        apiCode: 'jy201_hrm259',
        aab001: this.boothsInfo.aab001,
        acb330: this.boothsInfo.acb330,
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm259', null, param, true).then((res) => {
        this.unitInfo = res.data.ab01HrmVO
        this.unitInfo.aae707 = this.unitInfo.aae707
          ? this.$utils.getFileLoadUrl(this.unitInfo.aae707)
          : require('../../../static/images/loginBack.png')
      })
    },
    jobListShow() {
      this.param2.acb330 = this.boothsInfo.acb330
      const param = {
        ...this.param2,
        aab001: this.boothsInfo.aab001,
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm257', null, param, true).then((res) => {
        this.jobList = res.data.pageBean
        this.totalPages = this.jobList.pages
		this.totalNum = res.data.pageBean.total
      })
    },
    openEdit(obj) {
      this.editJob = obj.type
      this.acb210 = obj.acb210 + ''
      this.aab001 = obj.aab001 + ''
      if (!obj.type) {
        this.jobListShow()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.unitPreview {
  position: relative;
  height: 100%;
}

.loginBack {
  z-index: -1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.preview-title {
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  line-height: 54px;
  text-align: center;
  padding-top: 26px;
}

.preview-con {
  position: absolute;
  top: 98px;
  bottom: 36px;
  left: 100px;
  right: 100px;
  background: #ffffff;
  border-radius: 8px;

  .con-lt {
    width: calc(100% - 568px);
    height: 100%;
    overflow: hidden;
    padding: 42px 32px 2px;
    box-sizing: border-box;

    .info-title {
      position: relative;
      height: 58px;
      margin-bottom: 42px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-box {
        background: #f4f7fc;
        border-radius: 8px;
        border: 1px solid #eeeeee;

        .title-tag {
          float: left;
          position: relative;

          .tag-bg {
            width: 100%;
            height: 58px;
            position: absolute;
            left: 0;
            top: 0;
          }

          .tag-text {
            line-height: 58px;
            padding: 0 35px 0 15px;
            font-size: 28px;
            font-weight: 500;
            color: #ffffff;
            position: relative;
            z-index: 1;
          }
        }

        .title-name {
          height: 58px;
          line-height: 58px;
          font-size: 32px;
          font-weight: bold;
          color: #333333;
          padding: 0 52px;
          float: left;
        }
      }

      .vr-box {
        .vr-btn {
          background: #1586db;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 54px;
          line-height: 54px;
          padding: 0 14px;
          border-radius: 8px;
          cursor: pointer;
          .btn-img {
            width: 36px;
            height: 36px;
          }
          text {
            padding-left: 10px;
            color: #fefefe;
            font-size: 24px;
          }
        }
      }
    }

    .info-con {
      position: relative;
      height: calc(100% - 100px);

      .info-lt {
        background: #ffffff;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;

        .lt-top {
          width: 460px;
          // height: 220px;
          height: 46%;
          margin-bottom: 14px;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .lt-bottom {
          width: 460px;
          // height: 280px;
          height: 50%;
          border: 1px dashed #dddddd;
          position: relative;

          image {
            width: 100%;
            height: 100%;
          }

          .code {
            position: absolute;
            right: 10px;
            top: 2px;
            // width: 180px;
            // height: 146px;
            width: 40%;
            height: 50%;
          }
        }
      }

      .info-rt {
        padding-left: 500px;
        height: 100%;

        .info-item {
          margin-bottom: 14px;

          &:first-child {
            // height: 270px;
            height: 51%;
            overflow: hidden;
          }

          &:last-child {
            margin-bottom: 0;
          }

          .item-title {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            line-height: 36px;
            margin-bottom: 8px;
          }

          .item-decr {
            font-size: 20px;
            color: #333333;
            line-height: 32px;
            text-indent: 40px;
            text-align: justify;
            display: -webkit-box;
            -webkit-box-orient: vertical; //方向
            -webkit-line-clamp: 7; //设置在第几行添加省略号
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;

            &.decr-border {
              width: 400px;
              max-height: 180px;
              padding: 14px 30px;
              box-sizing: border-box;
              background: rgba($color: #f4f7fc, $alpha: 0.5);
              border-radius: 8px;
              text-indent: 0;

              view {
                font-size: 20px;
                margin-bottom: 8px;
                color: #666666;
              }

              text {
                font-size: 20px;
                font-weight: 400;
                color: #999999;
                line-height: 30px;

                &.tel {
                  color: #0682fe;
                  padding-left: 28px;
                }
              }
            }
          }
        }
      }
    }
  }

  .con-rt {
    width: 530px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
    padding: 50px 34px 74px;
    box-sizing: border-box;

    .list-title {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      line-height: 42px;
      margin-bottom: 16px;

      text {
        color: #0682fe;
      }
    }

    .list-con {
      .list-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .list-name {
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          line-height: 38px;
        }

        .list-page {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .page {
            width: 42px;
            height: 38px;
            line-height: 38px;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #eeeeee;
            font-size: 16px;
            color: #999999;
            text-align: center;
            margin-left: 12px;
          }
        }
      }

      .list-bottom {
        .list-item {
          margin-bottom: 16px;

          .item-box {
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #eeeeee;

            .item-top {
              padding: 0 24px;
			  .name-image{
			  	display: flex;
			  	align-items: center;
			  	.remen{
			  		width: 14px;
			  		height: 16px;
			  		margin-left: 6px;
			  		padding-bottom: 4px;
			  	}
			  }

              .item-name {
                font-size: 20px;
                font-weight: bold;
                color: #333333;
                line-height: 30px;
                margin-bottom: 12px;
                margin-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .item-decr {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;

                &:last-child {
                  margin-bottom: 24px;
                  // margin-bottom: 0;
                }

                .item-lt {
                  font-size: 16px;

                  .tag-item {
                    display: inline-block;
                    font-size: 16px;
                    color: #666666;
                    line-height: 32px;
                    height: 32px;
                    background: #f8f8f8;
                    border-radius: 4px;
                    padding: 0 8px;
                    margin-right: 8px;
                    max-width: 70px;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  &.money {
                    font-size: 18px;
                    color: #999999;
                    line-height: 28px;

                    text {
                      color: #fe2c2c;
                      padding-right: 8px;
                    }
                  }
                }

                .item-rt {
                  &.edit-job {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    image {
                      width: 20px;
                      height: 20px;
                    }

                    text {
                      font-size: 18px;
                      font-weight: bold;
                      color: #0682fe;
                      padding-left: 8px;
                    }
                  }

                  &.ready {
                    font-size: 18px;
                    color: #999999;

                    text {
                      color: #0682fe;
                    }
                  }
                }
              }
            }

            .item-bottom {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              padding: 20px 24px;

              image {
                width: 18px;
                height: 18px;
              }

              text {
                font-size: 18px;
                color: #666666;
                padding-left: 8px;
              }
            }
          }
        }
      }
    }
  }

  .con-line {
    width: 38px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 530px;
    bottom: 0;
    background: linear-gradient(270deg, #ffffff 0%, #f4f7fc 100%);
  }
  .title-box {
    position: relative;
  }
  .queue-btn {
    position: absolute;
    right: -80px;
    top: 15px;
  }
}
</style>
