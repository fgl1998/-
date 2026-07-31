<template>
  <xu-common-shell :title="loginInfo.aab004">
    <div class="center">
      <div class="left">
        <div class="left-top">
          <xu-common-title zh="实时监控" en="/ monitor"></xu-common-title>
          <view class="total">
            <view
              >进场总人数：<span class="num1">{{ num1 }}</span
              >人</view
            >
            <view
              >总招聘人数：<span class="num2">{{ num2 }}</span
              >人</view
            >
          </view>
          <view class="list" v-if="personList.length > 0">
            <view v-for="(item, index) in personList" :key="index">
              {{ item.cid1 }}<span class="name">{{ item.name }}</span
              >进入人力资源市场
            </view>
          </view>
          <view v-else class="noData">
            <image src="../../static/images/img/publicImg/noData.png"></image>
            <view>暂无数据</view>
          </view>
        </div>
        <div class="left-bottom">
          <div class="title">
            <image src="../../static/images/img/recruitment/left-bottom-title.png" />
            <view>发现您可能满意的人才！</view>
          </div>
          <div class="data-list" v-if="cardPerson.length > 0">
            <view class="show-data">
              <view class="data-item" v-for="(item, index) in cardPerson" :key="index">
                <view class="top">
                  <view>
					  <view class="name">{{ item.aac003 }}</view>
					  <view class="ac">
					    <image src="../../static/images/nan.png" v-if="item.aac004 === '1'"></image>
					    <image src="../../static/images/women.png" v-if="item.aac004 === '2'"></image>
					  </view>
				  </view>
				  <view class="rate-box">
					  <view>匹配度：</view>
					  <view class="rate-line">
					  					  <view :style="{'width':item.rate+'%'}"></view>
					  </view>
					  <view class="rate">{{ item.rate }}%</view>
				  </view>
                </view>
                <view class="center">
                  <view>
                    <view>年龄:</view>
                    <view>{{ item.age }}岁</view>
                  </view>
                  <view class="line1"></view>
                  <view>
                    <view>匹配职位:</view>
                    <view>{{ item.aca112 }}</view>
                  </view>
                </view>
                <view class="line2"></view>
                <view class="btn">
                  <view @click="closeView(true, item)">点击邀请</view>
                </view>
              </view>
            </view>
            <view class="bottom" @click="onChangeCardPerson">
              <image src="../../static/images/shuaxin.png"></image>
              <view>换一批</view>
            </view>
          </div>
          <view v-else class="noData">
            <image src="../../static/images/img/publicImg/noData.png"></image>
            <view>暂无数据</view>
          </view>
        </div>
      </div>
      <div class="right">
        <xu-common-title zh="招聘岗位" en="/ Recruitment Positi"></xu-common-title>
        <div class="top">
          <view class="top-left">
            <image src="../../static/images/zongshu.png"></image>
            <view
              >招聘岗位总数：<span>{{ total }}</span
              >个</view
            >
          </view>
          <view class="top-center">
            <image src="../../static/images/touren.png"></image>
            <view
              >已投递人数：<span>{{ deliveryCount }}</span
              >人</view
            >
          </view>
          <view class="top-right">
            <!-- <button @click="openReleaseJob">新增岗位</button> -->
            <!-- <button @click="openLibrary">发布岗位</button> -->
          </view>
        </div>
        <div class="right-center">
          <div v-if="postList.length > 0" class="post-list">
            <div class="postion-item" v-for="(item, index) in postList" :key="index" @click="toPage(item)">
              <div class="postion-item-top">
                <div class="position-item-left">
                  <view class="position-title">{{ item.acb213 ? item.acb213 : '未知职位' }}</view>
                  <div class="position-type">
                    <span>{{ item.acc217Dsc ? item.acc217Dsc : '未知工作年限' }}</span>
                    <span>{{ item.aac011 ? $codeConfig.getCodeLabel('AAC011', item.aac011) : '未知学历要求' }}</span>
                    <span>{{ item.acb469 ? $codeConfig.getCodeLabel('ACB469', item.acb469) : '未知工作方式' }}</span>
                    <span>{{ item.acb21g ? item.acb21g : 0 }}人</span>
                  </div>
                  <div class="salary">
                    <span>薪资待遇：</span>
                    <span
                      >{{ item.acb21h ? getAbbreviatSalary(item.acb21h) : '0' }} -
                      {{ item.acb21j ? getAbbreviatSalary(item.acb21j) : '不限' }}
                    </span>
                    <span>元/月</span>
                  </div>
                </div>
                <div class="position-item-right">
                  <div @click.stop="positionApply(item)">
                    <image src="../../static/images/toujian.png"></image>
                    <view>投递简历</view>
                  </div>
                  <div>
                    <view>{{ item.cc30Total ? item.cc30Total : 0 }}</view>
                    <view>人已申请</view>
                  </div>
                </div>
              </div>

              <div class="position-item-bottom">
                <image src="../../static/images/img/unitCenterNew/ic_gsxx_active.png" />
                <span>{{ item.acb217 ? item.acb217 : '未知详细地址' }}</span>
              </div>
            </div>
          </div>

          <div v-else class="noData">
            <image src="../../static/images/img/publicImg/noData.png"></image>
            <view>暂无数据</view>
          </div>
          <view class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="changePage"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </view>
        </div>
      </div>
    </div>
    <release-job :visible="releaseShow" @onClose="onClose"></release-job>
    <position-library
      :visible="libraryShow"
      :addThisJobFair="loginInfo"
      @getDataList="getDataList"
      @onClose="closeLibrary"
    ></position-library>
    <common-position-apply
      @close="closeCommonPositionApply"
      :visible="commonPositionApplyVisible"
      :data="commonPositionApplyData"
    ></common-position-apply>
	<common-resume-invite
	  :visible="commonResumeInviteVisible"
	  @close="closeCommonResumeInvite"
	  :data="resumeInfo"
	></common-resume-invite>
  </xu-common-shell>
</template>
<script>
import releaseJob from './component/releaseJob.vue'
import positionLibrary from './component/positionLibrary.vue'
import commonPositionApply from '../../components/common-position-apply/common-position-apply.vue'
import commmonResumeInvite from '../../components/common-resume-invite/common-resume-invite.vue'

export default {
  name: 'recruitment',
  components: {
    releaseJob,
    positionLibrary,
    commonPositionApply,
  },
  data() {
    return {
      commonPositionApplyVisible: false,
      commonPositionApplyData: {},
	  commonResumeInviteVisible: false,
	  resumeInfo: {},
      loginInfo: this.$loginConfig.getLoginInfo(),
      pageSize: 9,
      currentPage: 1,
      personList: [],
      num1: 0,
      num2: 0,
      deliveryCount: 0,
      postList: [],
      total: 0,
      cardPerson: [],
      releaseShow: false,
      libraryShow: false,
      pageNumber: 1,
      pages: 0,
    }
  },
  mounted() {
    this.personList.forEach((e) => {
      const str = e.cid.toString().slice(6, 14)
      e.cid1 = e.cid.toString().replace(str, '********')
    })
    this.searchPerson()
    this.getDataList()
  },
  methods: {
    closeCommonPositionApply() {
      this.commonPositionApplyVisible = false
      this.getDataList()
    },
    positionApply(data) {
      this.commonPositionApplyData = data
      this.commonPositionApplyVisible = true
    },
    onClose() {
      this.releaseShow = false
      //调用查询方法
      this.getDataList()
    },
	
	closeCommonResumeInvite() {
	  this.commonResumeInviteVisible = false
	  this.getDataList()
	},

    // 打开职位库
    openLibrary() {
      this.libraryShow = true
    },
    closeLibrary() {
      this.libraryShow = false
    },
    // 打开新增职位
    openReleaseJob() {
      this.releaseShow = true
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    changePage(curPage) {
      this.currentPage = curPage
      this.getDataList()
    },
    // 数据查询
    getDataList() {
      const param = {
        aab001: this.loginInfo.aab001,
        acb330: this.loginInfo.acb330,
        action: '1',
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        aae100: '1',
        yae421: '1',
        cb21_sort: '6',
        paginationModel: 'mostCount',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy204_hrm252', null, param, true).then((data) => {
        this.postList = data.data.pageBean.list
        this.total = data.data.pageBean.total
        let cb21s = data.data.data ? data.data.data : []
        this.deliveryCount = 0
        cb21s.forEach((item) => {
          this.deliveryCount += Number(item.cc30Total)
        })
      })
    },
    // 可能满意的人才
    searchPerson() {
      const param = {
        acb330: this.loginInfo.acb330,
        queryMap: JSON.stringify({
          aab001: this.loginInfo.aab001,
        }),
        pageSize: 2,
        pageNumber: this.pageNumber,
        paginationModel: 'mostCount',
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy202_hrm1082', null, param, true).then((res) => {
        const list = res.data.pageBean.list ? res.data.pageBean.list : []
        const pages = res.data.pageBean.pages
        this.pages = pages
        this.cardPerson = list.map((item)=>{
			const newObj = {...item}
			if(item.sim){
				newObj.rate = Number(item.sim)*100
			}else{
				newObj.rate = 0
			}
			return newObj
		})

        // this.cardPerson = []
        // if (list.length > 2) {
        //   for (let i = 0; i < 2; i++) {
        //     this.cardPerson.push(list[i])
        //   }
        // } else {
        //   for (let i = 0; i < list.length; i++) {
        //     this.cardPerson.push(list[i])
        //   }
        // }
      })
    },
    onChangeCardPerson() {
      this.pageNumber++
      if (this.pageNumber > this.pages) {
        this.pageNumber = 1
      }
      this.searchPerson()
    },
    closeView(type, user) {
	  if (user) {
		this.resumeInfo = user
	  }
	  this.$nextTick(()=>{
		  this.commonResumeInviteVisible = type
	  })
    },
    toPage(item) {
      this.$utils.navigateTo('/pages/recruitment/workDetail?item=' + encodeURIComponent(JSON.stringify(item)))
    },
  },
}
</script>

<style lang="scss" scoped>
.noData {
  text-align: center;
}

.center {
  width: 100%;
  height: 100%;
  display: flex;

  .left {
    width: 480px;

    .left-top {
      width: 418px;
      height: 380px;
      background: #ffffff;
      border-radius: 12px;
      padding: 26px 32px;

      .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;

        > view {
          height: 16px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 16px;
          color: #999999;
          line-height: 24px;
          text-align: left;
          font-style: normal;

          .num1 {
            height: 16px;
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 16px;
            color: #ff6600;
            line-height: 24px;
            text-align: left;
            font-style: normal;
          }

          .num2 {
            height: 16px;
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 16px;
            color: #0682fe;
            line-height: 24px;
            text-align: left;
            font-style: normal;
          }
        }
      }

      .list {
        width: 418px;
        height: 270px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        line-height: 48px;
        text-align: left;
        font-style: normal;
        overflow: auto;

        .name {
          margin: 0 5px;
          color: #0682fe;
        }
      }
    }

    .left-bottom {
      margin-top: 24px;
      width: 430px;
      height: 410px;
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 25px;

      .title {
        display: flex;

        > image {
          width: 16px;
          height: 16px;
        }

        > view {
          height: 18px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #333333;
          line-height: 18px;
          text-align: left;
          font-style: normal;
          margin-left: 8px;
        }
      }

      .data-list {
        margin-top: 16px;

        .show-data {
          height: 335px;

          .data-item {
            height: 145px;
            border-radius: 8px;
            border: 1px solid #eeeeee;
            padding: 10px 14px 0 14px;
            margin-bottom: 10px;

            .top {
              display: flex;
			  align-items: center;
			  justify-content: space-between;
			  >view:nth-child(1){
				  display: flex;
				  align-items: center;
			  }
              .name {
                width: 54px;
                height: 25px;
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 18px;
                color: #333333;
                line-height: 25px;
                text-align: left;
                font-style: normal;
                flex-shrink: 0;
				margin-right: 5px;
              }

              .ac {
                width: 20px;
                height: 20px;
                background: #1776fb;
                border-radius: 2px;
                margin-right: 12px;
                flex-shrink: 0;

                > image {
                  width: 100%;
                  height: 100%;
                }
              }
			  .rate-box{
				  display: flex;
				  align-items: center;
				  height: 25px;
				  .rate-line {
				    width: 100px;
				    height: 12px;
				  	background-color: #e7e7e7;
				  	border-radius: 10px;
					margin-right: 6px;
				  	>view{
				  		height: 12px;
				  		border-radius: 10px;
				  		background-color: #0682fe;
				  	}
				  }
				  
				  .rate {
				    width: 42px;
				    height: 20px;
				    background: #00ba12;
				    border-radius: 2px;
				    color: #ffffff;
				    text-align: center;
				    line-height: 20px;
				    margin-top: 5px;
				    flex-shrink: 0;
				  }
			  }
            }

            .center {
              height: 40px;
              display: flex;
              margin-top: 10px;
              justify-content: space-between;
              align-items: center;

              .line1 {
                width: 1px;
                height: 40px;
                background: #eeeeee;
              }

              > view {
                > view:first-child {
                  width: 80px;
                  height: 16px;
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 400;
                  font-size: 16px;
                  color: #999999;
                  line-height: 30px;
                  text-align: left;
                  font-style: normal;
                }

                > view:last-child {
                  width: 180px;
                  height: 25px;
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 400;
                  font-size: 16px;
                  color: #333333;
                  text-align: left;
                  font-style: normal;
                  margin-top: 10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }

            .line2 {
              width: 100%;
              margin-top: 24px;
              // height: 1px;
              border: 1px solid #eeeeee;
            }

            .btn {
              display: flex;
			  justify-content: center;
              cursor: pointer;
              margin-top: 8px;

              .line1 {
                width: 1px;
                height: 33px;
                background: #eeeeee;
              }

              > view:first-child {
                width: 50%;
                height: 16px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 16px;
                color: #999999;
                line-height: 35px;
                text-align: center;
                font-style: normal;
              }

              > view:last-child {
                width: 50%;
                height: 16px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 16px;
                color: #0682fe;
                line-height: 35px;
                text-align: center;
                font-style: normal;
              }
            }
          }
        }

        .bottom {
          width: 100%;
          height: 38px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #eeeeee;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          > image {
            width: 18px;
            height: 16px;
          }

          > view {
            width: 48px;
            height: 16px;
            font-family: SourceHanSansCN, SourceHanSansCN;
            font-weight: 400;
            font-size: 16px;
            color: #999999;
            line-height: 18px;
            text-align: left;
            font-style: normal;
            margin-left: 8px;
          }
        }
      }

      .noData {
        width: 100%;
        height: 380px;

        > image {
          width: 100%;
          height: 340px;
        }
      }
    }
  }

  .right {
    width: 1295px;
    height: 842px;
    background: #ffffff;
    border-radius: 12px;
    margin-left: 24px;
    padding: 32px 26px;

    .top {
      width: 100%;
      height: 50px;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 20px;
      line-height: 70px;
      color: #999999;
      text-align: left;
      font-style: normal;
      display: flex;
      justify-content: space-between;

      .top-left {
        display: flex;

        > image {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          margin-top: 25px;
        }

        > view {
          > span {
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 20px;
            color: #0682fe;
            line-height: 20px;
            text-align: left;
            font-style: normal;
          }
        }
      }

      .top-center {
        display: flex;

        > image {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          margin-top: 25px;
        }

        > view {
          > span {
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 20px;
            color: #11a825;
            line-height: 20px;
            text-align: left;
            font-style: normal;
          }
        }
      }

      .top-right {
        display: flex;
        margin-top: 14px;

        > button {
          width: 120px;
          height: 38px;
          margin: 0 5px;
        }

        > button:first-child {
          background: #f3f7ff;
          border-radius: 4px;
          border: 1px solid #4693ff;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #0682fe;
          text-align: center;
          line-height: 35px;
          font-style: normal;
        }

        > button:last-child {
          border-radius: 4px;
          font-family: SourceHanSansCN, SourceHanSansCN;
          font-weight: 400;
          font-size: 18px;
          color: #999999;
          line-height: 35px;
          text-align: center;
          font-style: normal;

          > view {
            color: #0682fe;
          }
        }
      }
    }

    .right-center {
      margin-top: 16px;
      width: 100%;
      height: 702px;

      .post-list {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;

        .postion-item {
          width: 391px;
          height: 180px;
          margin: 8px 8px 8px 0;
          border-radius: 8px;
          border: 1px solid #eeeeee;
          padding: 12px;
          // display: flex;
          // flex-wrap: nowrap;  /* 不换行 */
          // justify-content: space-between;
          .postion-item-top {
            display: flex;

            .position-item-left {
              width: calc(100% - 20px);
              height: 150px;

              .position-title {
                width: 290px;
                height: 20px;
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 20px;
                color: #333333;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                margin-top: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .position-type {
                margin-top: 24px;
                display: flex;

                > span {
                  // width: 220px;
                  height: 20px;
                  background: #f8f8f8;
                  border-radius: 4px;
                  text-align: center;
                  font-family: SourceHanSansCN, SourceHanSansCN;
                  font-weight: 400;
                  font-size: 16px;
                  color: #666666;
                  line-height: 20px;
                  font-style: normal;
                  margin: 0 4px 0 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  // white-space: nowrap;
                }

                .position-apply {
                  width: 110px;
                  height: 20px;

                  > image {
                    width: 18px;
                    height: 18px;
                  }
                }

                .position-apply {
                  width: 110px;
                  height: 20px;

                  > image {
                    width: 18px;
                    height: 18px;
                  }
                }
              }

              .salary {
                // width: 90px;
                height: 18px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 18px;
                color: #999999;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                margin-top: 16px;

                > span:nth-child(2) {
                  color: #fe2c2c;
                }

                > span:last-child {
                  margin-left: 8px;
                }
              }

              .apply-count {
                height: 18px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 18px;
                color: #999999;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                margin-top: 16px;

                > span:nth-child(2) {
                  color: #0682fe;
                }
              }

              .area,
              .address,
              .release-time {
                height: 18px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 18px;
                color: #999999;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                margin-top: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .position-item-right {
              width: 40%;
              height: 150px;

              > div:first-child {
                cursor: pointer;
                width: 103px;
                height: 18px;
                font-family: SourceHanSansCNBold, SourceHanSansCNBold;
                font-weight: bold;
                font-size: 18px;
                color: #0682fe;
                text-align: left;
                font-style: normal;
                display: flex;
                margin-top: 50px;
                margin-bottom: 18px;

                > image {
                  width: 18px;
                  height: 19px;
                  margin-right: 10px;
                  margin-top: 4px;
                }
              }

              > div:last-child {
                display: flex;
                // width: 93px;
                height: 18px;
                font-family: SourceHanSansCN, SourceHanSansCN;
                font-weight: 400;
                font-size: 18px;
                text-align: left;
                font-style: normal;

                > view:first-child {
                  color: #0682fe;
                }

                > view:last-child {
                  color: #999999;
                  margin-left: 20px;
                }
              }
            }
          }

          .position-item-bottom {
            width: 391px;
            height: 50px;
            // padding: 20px 0 0 23px;
            // display: flex;
            > image {
              width: 18px;
              height: 18px;
              margin-right: 8px;
              background: #aaaaaa;
              position: relative;
              top: 4px;
            }

            > span {
              width: 252px;
              height: 20px;
              font-family: SourceHanSansCN, SourceHanSansCN;
              font-weight: 400;
              font-size: 18px;
              color: #666666;
              text-align: left;
              line-height: 18px;
              font-style: normal;
            }
          }
        }
      }

      .noData {
        text-align: center;
        height: 100%;
        width: 100%;

        > image {
          width: 100%;
          height: calc(100% - 20px);
        }
      }

      .pagination {
        text-align: right;
      }
    }
  }
}
</style>
