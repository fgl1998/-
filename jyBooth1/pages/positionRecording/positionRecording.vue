<template>
  <xu-common-shell :title="userInfo.aab004">
    <view id="positionRecording" :class="isFlag ? 'rotate' : ''">
      <!-- <image src="../../static/images/loginBack.png" class="loginBack"></image>
      <unit-header @checkRotate="checkRotate"></unit-header> -->
      <view class="content">
        <view class="navTop">
          <view
            v-for="(item, index) in navTopList"
            :class="currentIndex == index ? 'viewactive' : ''"
            @click="changeNav(index)"
            >{{ item.title }}</view
          >
        </view>
        <view class="partOne">
          <!-- <view class="title">
            <image src="../../static/images/tittle@2x.png"></image>
            <view v-show="currentIndex == 0">参会岗位补录<span>/ ADDITIONAL POSITION</span></view>
            <view v-show="currentIndex == 1">岗位补录结果<span>/ ADDITIONAL RESULT</span></view>
          </view> -->
          <xu-common-title v-if="currentIndex == 0" zh="参会岗位补录" en="/ ADDITIONAL POSITION"></xu-common-title>
          <xu-common-title v-if="currentIndex == 1" zh="岗位补录结果" en="/ ADDITIONAL RESULT"></xu-common-title>
          <view v-show="currentIndex == 0">
            <!-- 暂时屏蔽
					<view @click="toAdd()">
						新增岗位
					</view> -->
            <view @click="saveAll()"> 批量参会 </view>
          </view>
        </view>
        <!-- <view class="line">
          <view></view>
        </view> -->
        <view class="worldTree" v-show="currentIndex == 0">
          <view>
            <view style="width: 80px"></view>

            <view style="width: 300px">招聘职位</view>
            <view style="width: 200px">工作年限</view>
            <view style="width: 200px">学历要求</view>
            <view style="width: 300px">工作区域</view>
            <view style="width: 200px">工作性质</view>
            <view style="width: 200px">月薪范围</view>
            <view style="width: 200px">岗位审核状态</view>
          </view>
          <yt-none :isShow="showNone" tip="暂无相关信息"></yt-none>
          <view v-for="(item, index) in workList" :key="index" class="list-item">
            <view style="width: 80px">
              <checkbox-group @change="onChange($event, item.acb210)">
                <checkbox name="acb210" :value="item.acb210.toString()" v-if="checked"></checkbox>
              </checkbox-group>
            </view>
            <view style="width: 300px">{{ item.acb213 }}</view>
            <view style="width: 200px">{{ item.acc217 ? $codeConfig.getCodeLabel('acc217', item.acc217) : '' }}</view>
            <view style="width: 200px">{{ item.aac011 ? $codeConfig.getCodeLabel('aac011', item.aac011) : '' }}</view>
            <view style="width: 300px">{{ item.acb217 }}</view>
            <view style="width: 200px">{{ item.acb469 ? $codeConfig.getCodeLabel('acb469', item.acb469) : '' }}</view>
            <view class="money" style="width: 200px">{{ item.money }}</view>
            <view class="state" style="width: 200px">
              <view
                :class="
                  item.aae016 === '99'
                    ? 'text1'
                    : item.aae016 === '1'
                    ? 'text2'
                    : item.aae016 === '0'
                    ? 'text3'
                    : 'text4'
                "
              >
                {{ item.aae016Desc }}
              </view>
            </view>
          </view>
          <view class="pagination" v-if="workList.length > 0">
            <!-- <view>
              <view @click="prevOrNext(-1)">上一页</view>
              <view
                v-for="(item, index) in pages"
                :key="index"
                class="page"
                :class="{ actived: item === currentPage }"
                @click="select(item)"
              >
                <span>{{ item }}</span>
              </view>
              <view @click="prevOrNext(1)">下一页</view>
            </view> -->

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="changePage"
              :current-page="currentPage"
              :page-size="param.pageSize"
              layout="total, prev, pager, next"
              :total="total"
            >
            </el-pagination>
          </view>
        </view>

        <view class="worldTree" v-show="currentIndex == 1">
          <view>
            <view style="width: 300px">招聘职位</view>
            <view style="width: 200px">工作年限</view>
            <!-- 1 -->
            <view style="width: 200px">学历要求</view>
            <view style="width: 300px">工作区域</view>
            <view style="width: 200px">工作性质</view>
            <view style="width: 200px">月薪范围</view>
            <view style="width: 200px">补录审核状态</view>
            <view style="width: 150px"></view>
          </view>
          <yt-none :isShow="showNone1" tip="暂无相关信息"></yt-none>
          <view v-for="(item, index) in examineList" :key="index" class="list-item">
            <view style="width: 300px">{{ item.aca112 }}</view>
            <view style="width: 200px">{{ item.acc217 ? $codeConfig.getCodeLabel('acc217', item.acc217) : '' }}</view>
            <view style="width: 200px">{{ item.aac011 ? $codeConfig.getCodeLabel('aac011', item.aac011) : '' }}</view>
            <view style="width: 300px">{{ item.acb217 }}</view>
            <view style="width: 200px">{{ item.acb469 ? $codeConfig.getCodeLabel('acb469', item.acb469) : '' }}</view>
            <view class="money" style="width: 200px">{{ item.money }}</view>
            <view class="state" style="width: 200px">
              <view
                :class="
                  item.aae016Cb36 === '99'
                    ? 'text1'
                    : item.aae016Cb36 === '1'
                    ? 'text2'
                    : item.aae016Cb36 === '0'
                    ? 'text3'
                    : 'text4'
                "
              >
                {{ item.aae016Cb36Desc }}
              </view>
            </view>
            <view class="del" style="width: 150px" @click="handelDel(item.acb360)" v-show="item.aae016Cb36 === '99'">
              补录删除
            </view>
          </view>

          <view class="pagination" v-if="examineList.length > 0">
            <!-- <view>
              <view @click="prevOrNext1(-1)">上一页</view>
              <view
                v-for="(item, index) in pages1"
                :key="index"
                class="page"
                :class="{ actived: item === currentPage1 }"
                @click="select(item)"
              >
                <span>{{ item }}</span>
              </view>
              <view @click="prevOrNext1(1)">下一页</view>
            </view> -->
            <el-pagination
              @size-change="handleSizeChange1"
              @current-change="changePage1"
              :current-page="currentPage1"
              :page-size="param1.pageSize"
              layout="total, prev, pager, next"
              :total="total1"
            >
            </el-pagination>
          </view>
        </view>
      </view>
      <screen-addWork v-show="addFlag" @closeWork="closeWork"></screen-addWork>
    </view>
  </xu-common-shell>
</template>

<script>
import unitHeader from '../../components/common-unitHeader/common-unitHeader.vue'
export default {
  name: 'positionRecording',
  components: {
    unitHeader,
  },
  data() {
    return {
      isFlag: false,
      currentIndex: 0,
      navTopList: [{ title: '参会岗位补录' }, { title: '岗位补录结果' }],
      userInfo: this.$loginConfig.getLoginInfo(),
      //岗位列表
      workList: [],
      currentPage: 1,
      totalPages: 1,
      showNone: false,
      acb210s: [],
      checked: true,
      param: {
        apiCode: 'jy204_hrm125',
        method: 'jy204_hrm125',
        pageSize: 8,
        pageNumber: 1,
        paginationModel: 'mostCount',
      },

      //补录结果列表
      examineList: [],
      currentPage1: 1,
      totalPages1: 1,
      showNone1: false,
      param1: {
        apiCode: 'jy204_hrm129',
        method: 'jy204_hrm129',
        pageSize: 8,
        pageNumber: 1,
        paginationModel: 'mostCount',
      },

      addFlag: false,

      total: 0,
      total1: 0,
    }
  },
  onLoad() {
    // this.userInfo = uni.getStorageSync('userInfo')
    this.param.aab001 = this.param1.aab001 = this.userInfo.aab001
    this.param.acb330 = this.param1.acb330 = this.userInfo.acb330

    //根据招聘会编号和单位编号查询该单位参会的职位信息
    this.statistics()
  },

  methods: {
    changePage(curPage) {
      this.currentPage = curPage
      this.statistics()
    },
    handleSizeChange(val) {
      this.param.pageSize = val
    },
    changePage1(curPage) {
      this.currentPage1 = curPage
      this.statistics1()
    },
    handleSizeChange1(val) {
      this.param1.pageSize = val
    },
    //头部切换
    changeNav(index) {
      if (this.currentIndex === index) {
        return
      }

      this.currentIndex = index
      if (index == 0) {
        this.statistics()
      } else {
        this.statistics1()
      }
    },
    //翻转
    checkRotate() {
      if (this.isFlag) {
        this.isFlag = false
      } else {
        this.isFlag = true
      }
    },
    //岗位列表
    statistics() {
      this.acb210s = []
      this.param.pageNumber = this.currentPage
      console.log(this.param, 'param')

      this.$http.post(this.$requestConstant.businessRequestType, 'jy204_hrm125', null, this.param, true).then((res) => {
        this.totalPages = res.data.pageBean.pages
        // this.currentPage = res.data.pageBean.pageNum
        this.workList = res.data.pageBean.list
        this.total = res.data.pageBean.total
        for (let item of this.workList) {
			item.money = this.$utils.formatSalary(item.acb21h,item.acb21j)
        }
        this.reload()
        if (this.workList.length > 0) {
          this.showNone = false
        } else {
          this.showNone = true
        }
      })
    },

    // 上一页/下一页
    prevOrNext(n) {
      let num = this.currentPage
      num += n
      num < 1 ? (num = 1) : num > this.totalPages ? (num = this.totalPages) : null
      if (this.currentPage === num) return
      this.currentPage = num
      this.statistics()
    },
    //选择页
    select(n) {
      if (n === this.currentPage) return
      if (typeof n === 'string') return
      this.currentPage = n
      this.statistics()
    },

    //补录结果列表
    statistics1() {
      this.param1.pageNumber = this.currentPage1
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy204_hrm129', null, this.param1, true)
        .then((res) => {
          this.totalPages1 = res.data.pageBean.pages
          // this.currentPage1 = res.data.pageBean.pageNum
          this.total1 = res.data.pageBean.total
          this.examineList = res.data.pageBean.list
          if (this.examineList.length > 0) {
            this.showNone1 = false
          } else {
            this.showNone1 = true
          }
        })
    },

    // 上一页/下一页
    prevOrNext1(n) {
      let num = this.currentPage1
      num += n
      num < 1 ? (num = 1) : num > this.totalPages1 ? (num = this.totalPages1) : null
      if (this.currentPage1 === num) return
      this.currentPage1 = num
      this.statistics1()
    },
    //选择页
    select1(n) {
      if (n === this.currentPage1) return
      if (typeof n === 'string') return
      this.currentPage1 = n
      this.statistics1()
    },

    //多选设置
    onChange(e, acb210) {
      let checkedList = e.detail.value
      if (checkedList.length > 0) {
        this.acb210s.push(acb210)
      } else {
        this.acb210s = this.acb210s.filter((item) => item !== acb210)
      }
    },

    //强制刷新组件
    reload() {
      this.checked = false
      this.$nextTick(() => {
        this.checked = true
      })
    },

    //批量保存
    saveAll() {
      if (this.acb210s.length == 0) {
        uni.showToast({
          title: '请先选择岗位',
          icon: 'error',
        })
        return
      }
      let param = {
        apiCode: 'jy204_hrm126',
        method: 'jy204_hrm126',
        acb340: this.userInfo.acb340,
        acb330: this.userInfo.acb330,
        aab001: this.userInfo.aab001,
        aae400: '18',
        acb210StrJson: JSON.stringify(this.acb210s),
      }
      this.$http.post(this.$requestConstant.businessRequestType, 'jy204_hrm126', null, param, true).then((res) => {
        uni.showToast({
          title: '参会补录成功',
          icon: 'success',
        })

        this.statistics()
      })
    },

    //补录删除弹窗
    handelDel(acb360) {
      let _this = this
      uni.showModal({
        content: '确认删除？',
        success(res) {
          if (res.confirm) {
            _this.delEvent(acb360)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    },
    //补录删除
    delEvent(acb360) {
      let param = {
        apiCode: 'jy204_hrm127',
        method: 'jy204_hrm127',
        acb360: acb360,
      }

      this.$http.post(this.$requestConstant.businessRequestType, 'jy204_hrm127', null, param, true).then((res) => {
        this.statistics1()
      })
    },

    toAdd() {
      this.addFlag = true
    },

    closeWork() {
      this.addFlag = false
    },
  },
}
</script>

<style lang="scss" scoped>
#positionRecording {
  width: 100%;
  height: calc(100vh + 158px);
  position: relative;
  z-index: 0;
}

.rotate {
  -webkit-transform: rotateZ(180deg);
  transform: rotateZ(180deg);
}
.loginBack {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.content {
  width: 1772px;
  height: 858px;
  background: #ffffff;
  border-radius: 12px;
  margin: 0 auto;
  padding: 24px 32px 0px 32px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
  // > view:nth-child(5) {
  //   margin-top: 25px;
  // }
  // > view:last-child {
  //   margin-top: 25px;
  // }

  .navTop {
    display: flex;
    align-items: center;
    > view {
      width: 169px;
      height: 40px;
      border-radius: 4px;
      font-size: 20px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      background-color: #eaeff8;
      font-weight: 400;
      color: #333333;
      margin-right: 24px;
    }
    .viewactive {
      background-color: #1f8cff;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .partOne {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 25px;
    > view:last-child {
      display: flex;
      align-items: center;
      > view {
        width: 129px;
        height: 40px;
        border-radius: 4px;
        font-size: 20px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        background-color: #1f8cff;
        font-weight: 400;
        color: #ffffff;
        margin-left: 24px;
      }
    }

    .title {
      display: flex;
      align-items: center;
      > image {
        width: 12px;
        height: 32px;
        margin-right: 12px;
      }
      > view {
        font-size: 28px;
        font-weight: bold;
        color: #333333;
        > span {
          font-size: 20px;
          font-weight: 400;
          color: #999999;
          margin-left: 12px;
        }
      }
    }
  }

  .line {
    border-bottom: 1px solid #eeeeee;
    margin-top: 20px;
    > view {
      width: 138px;
      height: 4px;
      background: #0682fe;
      border-radius: 2px;
    }
  }

  .worldTree {
    margin-top: 24px;
    > view:first-child {
      width: 1772px;
      height: 64px;
      background: #f1f6fe;
      border-radius: 2px;
      display: flex;
      align-items: center;
      > view {
        font-size: 24px;
        font-weight: bolder;
        color: #333333;
        text-align: center;
      }
    }

    .list-item {
      display: flex;
      align-items: center;
      border-left: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      > view {
        font-size: 22px;
        font-weight: 400;
        height: 64px;
        line-height: 64px;
        text-align: center;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      > .del {
        color: #4592fe;
        cursor: pointer;
      }
      > .money {
        color: #fb3333;
      }

      > .state {
        > view.text1 {
          color: #666666;
        }
        > view.text2 {
          color: #11a824;
        }
        > view.text3 {
          color: #fb3333;
        }
        > view.text4 {
          color: #4592fe;
        }
      }
    }
  }

  .pagination {
    position: absolute;
    bottom: 165px;
    right: 72px;
    margin-top: 10px;
    > view {
      display: flex;
      align-items: center;
    }
    > view:first-child {
      > view {
        width: 118px;
        height: 36px;
        font-size: 18px;
        border-radius: 4px;
        font-weight: 400;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
      }
      > view:first-child {
        background: #f3f7ff;
        border: 1px solid #4693ff;
        color: #0682fe;
      }
      > view:last-child {
        background: #0682fe;
        border: 1px solid #0682fe;
        color: #ffffff;
        margin-left: 16px;
      }
    }
    > view:last-child {
      > view {
        width: 42px;
        height: 38px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #eeeeee;
        text-align: center;
        line-height: 38px;
        margin-left: 12px;
        font-weight: 400;
        color: #999999;
        font-size: 16px;
        cursor: pointer;
      }
      .actived {
        color: #fff;
        background-color: #007dee !important;
      }
      > view:first-child,
      > view:last-child {
        width: 65px;
      }
    }
  }
}

.content::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
