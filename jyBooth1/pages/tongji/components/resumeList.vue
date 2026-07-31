<template>
  <el-dialog
    title="简历列表"
    :visible="visible"
    :footer="null"
    @close="handleCancel"
    :modal-append-to-body="false"
    top="10%"
    width="70%"
  >
    <view class="resume-list">
      <view v-if="talentList.length > 0">
        <view class="resume-item" v-for="(item, index) in talentList" :key="index">
          <!-- 头部 -->
          <div class="item-h">
            <div class="job_name">投递职位: {{ item.cb21Info.acb213 }}</div>
            <div class="date">投递日期: {{ item.aae052 }}</div>
          </div>
          <div class="item-t">
            <!-- 左 -->
            <div class="item-tl">
              <!-- 一.头像和薪资 -->
              <div class="avatar_gain">
                <div class="avatar">
                  <img
                    :src="
                      item.aac004 == '1'
                        ? getRealImgUrl('img/recruitTalents/male.png')
                        : getRealImgUrl('img/recruitTalents/female.png')
                    "
                    alt=""
                  />
                </div>
                <div class="gain">{{ formatSalary(item.acb241, item.acb242) }}</div>
              </div>
              <!-- 二.基本信息 -->
              <div class="info">
                <div class="line1">
                  <div class="name">{{ getName(item) }}</div>
                </div>
                <div class="line2">
                  <span>{{ item.age }}岁</span>
                  <span>{{ item.acc217Desc ? item.acc217Desc : '经验未知' }}</span>
                  <span>{{ item.aac011Desc ? item.aac011Desc : '学历未知' }}</span>
                  <span>{{ item.acc04tDesc ? item.acc04tDesc : '状态未知' }}</span>
                </div>
                <!-- <div class="line3">
                  <span style="color: #999">期望地点:&nbsp;</span>
                  {{ item.acb202 ? item.acb202 : '地点未知' }}
                </div> -->
              </div>
            </div>
            <!-- 右 type=1 简历投递页面; 2 人才收藏页面; 3面试管理页面-->
            <div class="item-tr">
              <!-- <div class="btn" v-if="item.acc676 == 0 || item.acc676 == 1">邀请面试</div>
              <div class="btn" v-if="item.acc676 == 0 || item.acc676 == 1">不合适</div> -->
              <div class="interview" v-if="item.acc676 == 2">已安排面试</div>
              <div class="reject" v-if="item.acc676 == 3">
                <span>已拒绝</span>
              </div>
            </div>
          </div>
        </view>
        <!-- [分页器] -->
        <div class="list-page">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="changePage"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="3"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </view>
      <view v-else class="noData">
        <image src="../../../static/images/img/publicImg/noData.png" />
        <view>暂无数据</view>
      </view>
    </view>
  </el-dialog>
</template>

<script>
export default {
  name: 'resumeList',
  props: ['visible', 'rowData'],
  data() {
    return {
      talentList: [],
      currentPage: 1,
      total: 0,
      userInfo: {},
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.userInfo = this.$loginConfig.getLoginInfo()
          this.getDataList()
        })
      }
    },
  },
  methods: {
    getName(item) {
      let name = ''
      if (item.aac003 && item.aac004 == '1') {
        name = item.aac003.substr(0, 1) + '先生'
      } else if (item.aac003 && item.aac004 == '2') {
        name = item.aac003.substr(0, 1) + '女士'
      }
      return name
    },
    formatSalary(salary1, salary2) {
      if (!salary1 && !salary2) {
        return '面议'
      }
      if (salary1 && !salary2) {
        return '最低' + parseFloat((parseInt(salary1) / 1000).toFixed(1)) + 'K'
      }
      if (!salary1 && salary2) {
        return '最高' + parseFloat((parseInt(salary2) / 1000).toFixed(1)) + 'K'
      }
      return (
        parseFloat((parseInt(salary1) / 1000).toFixed(1)) +
        'K' +
        '--' +
        parseFloat((parseInt(salary2) / 1000).toFixed(1)) +
        'K'
      )
    },
    getDataList() {
      let param = {
        apiCode: 'jy201_hrm116',
        method: 'jy201_hrm116',
        aab001: this.userInfo.aab001,
        acc676: this.acc676,
        yae100: 25,
        pageSize: 3,
        pageNumber: this.currentPage,
        acb330: this.userInfo.acb330,
        acb210: this.rowData.acb210,
        paginationModel: 'mostCount',
      }
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm116', null, param, true)
        .then((responseData) => {
          console.log(responseData, '简历列表数据')

          let res = responseData ? responseData.data : {}
          console.log(res, 'res')

          if (res.pageBean.list !== null) {
            if (res.pageBean.list) {
              this.talentList = res.pageBean.list
              this.total = res.pageBean.total
              this.talentList.forEach((item) => {
                if (item.cc21Vo && item.cb21Info.acb241) {
                  item.acb241 = item.cb21Info.acb241
                }
                if (item.cc21Vo && item.cb21Info.acb242) {
                  item.acb242 = item.cb21Info.acb242
                }
                if (item.cc21Vo && item.cb21Info.acb202) {
                  item.acb202 = item.cb21Info.acb202
                }
              })
            }
          }
        })
    },
    handleCancel() {
      this.$emit('close')
    },
    // 换页
    changePage(curPage) {
      this.currentPage = curPage
      this.getDataList()
    },
  },
}
</script>

<style lang="less" scoped>
.noData {
  width: 100%;
  height: 100%;
  > image {
    left: 25%;
    width: 50%;
    height: 95%;
  }
  > view {
    text-align: center;
  }
}
/deep/ .el-dialog {
  padding: 0 20px;
  border-radius: 8px;
}

/deep/ .el-dialog__body {
  padding: 0;
}

.resume-list {
  height: 560px;
}

.list-page {
  text-align: right;
  padding: 12px;
}

.resume-item {
  width: 100%;
  border-bottom: 1px solid #666;
  height: 150px;
  margin: 10px 0;
  background: #ffffff;
  border-radius: 8px;

  .item-h {
    height: 30px;
    padding: 4px 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #edf6fe;

    .job_name {
      font-size: 14px;
    }
  }

  .item-t {
    height: 100px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item-tl {
      width: 500px;
      display: flex;

      .avatar_gain {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 35px;

        .avatar {
          width: 40px;
          height: 40px;
          margin-bottom: 5px;
          position: relative;

          > img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .gender {
            width: 20px;
            height: 20px;
            position: absolute;
            top: 0;
            right: 0;
          }
        }

        .gain {
          padding: 0 4px;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          border-radius: 10px;
          background-color: #ff4645;
          color: #fff;
        }
      }

      .info {
        width: 320px;
        height: 70px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .line1 {
          display: flex;
          align-items: center;

          .name {
            color: #333333;
            font-size: 14px;
            font-weight: bold;
          }

          .tag_blue {
            width: 80px;
            height: 20px;
            line-height: 20px;
            background: linear-gradient(90deg, #32affe 0%, #006aff 100%);
            color: #fff;
            font-size: 10px;
            text-align: center;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;

            > img {
              margin-right: 1px;
            }
          }

          .tag_yellow {
            width: 104px;
            height: 20px;
            line-height: 20px;
            background: linear-gradient(90deg, #fec432 0%, #ffa322 100%);
            color: #fff;
            font-size: 12px;
            text-align: center;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;

            > img {
              margin-right: 1px;
            }
          }
        }

        .line2,
        .line3,
        .line4 {
          color: #666;
          font-size: 14px;
        }

        .line2 {
          > span:not(:last-of-type)::after {
            content: '|';
            color: #eeeeee;
            margin: 0 10px;
          }
        }
      }
    }

    .item-tc1 {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      padding: 10px 0;
      height: 100%;
      overflow: scroll;

      .item {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #999;
        // margin-top: 12px;
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .date {
        }

        .company {
          color: 666;
          margin: 0 24px;
        }

        .job {
        }
      }
    }

    .item-tc2 {
      width: 192px;
      height: 42px;
      margin-right: 80px;

      .attr {
        font-size: 14px;
        color: #999;
        margin-bottom: 21px;
      }

      .pic_num {
        display: flex;
        align-items: center;

        .out {
          width: 150px;
          height: 10px;
          border-radius: 5px;
          background-color: #f0f7ff;

          .inner {
            border-radius: 5px;
            height: 100%;
            background-color: #02ab4f; //热度条颜色
          }
        }

        .num {
          color: #02ab4f;
          font-size: 14px;
        }
      }
    }

    .item-tr {
      display: flex;
      align-items: center;

      .btn {
        margin-left: 30px;
        font-size: 16px;
        color: #006aff;
        cursor: pointer;
      }

      .interview {
        margin-left: 30px;
        font-size: 16px;
      }
    }
  }
}
</style>
