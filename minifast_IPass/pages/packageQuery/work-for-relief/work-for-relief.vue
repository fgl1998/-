<template>
  <view class="work-for-relief">
    <!-- 搜索 -->
    <div class="search">
      <div :class="{ 'address-picker': isFocus }">
        <ComponentAddressPicker
          idName="address"
          type="address"
          :value="areaName_zh"
          @change="handleChangePicker"></ComponentAddressPicker>
      </div>
      <div class="search-input">
        <input
          v-model="queryInfo.chi934"
          type="text"
          @focus="isFocus = true"
          @blur="isFocus = false"
          class="input-box"
          placeholder="请输入关键字" />
        <button class="btn-box" @click="queryDataByKeyWords">搜索</button>
      </div>
    </div>
    <!-- 消息轮播 -->
    <div class="scroll">
      <img src="./images/notice.svg" class="img-n" alt="" />
      <view class="notice" v-if="noticeList.length > 0">
        <swiper class="swiper" :circular="true" :vertical="true" :autoplay="true" :interval="3000" :duration="1000">
          <swiper-item class="swiper-item" v-for="item in noticeList" :key="item.chi933">
            <view class="swiper-content">
              <span> {{ item.chb017_desc + '新上线了以工代赈项目' }}</span>
              <span class="swiper-click" @click="handleViewNewProject(item)">点我</span>
              <span>速览</span>
            </view>
          </swiper-item>
        </swiper>
      </view>
      <view class="no-notice" v-else>
        <span v-if="noticeLoadOver">暂无最新消息</span>
      </view>
    </div>
    <div class="introduce" @click="toggle">以工代赈介绍</div>
    <!-- 弹窗 -->
    <uni-popup ref="popup" type="center">
      <ComponentPanel title="以工代赈介绍">
        <div class="panel-content">
          <div class="introduce-title">1、什么是以工代赈？</div>
          <div class="title-answer">
            以工代赈，是指政府投资建设基础设施工程，受赈济者参加工程建设获得劳务报酬，以此取代直接救济的一种扶持政策。
          </div>
          <div class="introduce-title top-distance">2、参与以工代赈项目有什么好处？</div>
          <div class="title-answer">
            促进群众就近就业增收、提高劳动技能的一项重要政策，能为群众特别是农民工、脱贫人口等规模性提供务工岗位，是完善收入分配制度、支持人民群众通过劳动增加收入创造幸福生活的重要方式。
          </div>
          <div class="introduce-title top-distance">3、以工代赈项目宣传图片</div>
          <scroll-view class="scroll-view_H" scroll-x="true" scroll-left="120">
            <img src="./images/3.jpg" alt="" class="img-g" />
            <img src="./images/3.jpg" alt="" class="img-g" />
            <img src="./images/3.jpg" alt="" class="img-g" />
            <img src="./images/3.jpg" alt="" class="img-g" />
            <img src="./images/3.jpg" alt="" class="img-g" />
            <img src="./images/3.jpg" alt="" class="img-g" />
          </scroll-view>
          <div class="close-popup" @click="closePopup">关闭介绍</div>
        </div>
      </ComponentPanel>
    </uni-popup>
    <!-- 搜索内容卡片 -->
    <div class="content" v-if="isRequestOver">
      <block v-if="renderData.length > 0">
        <QueryResult :renderData="renderData"></QueryResult>
      </block>
      <block v-else>
        <ComponentNoData tip="未查询到相关数据"></ComponentNoData>
      </block>
    </div>
    <div class="load-more-wrapper" v-if="isExceedLimit">
      <ComponentLoadMore :isOver="isLoadOver" bgc="#f5f5f5" @click="handleClickLoadMore"></ComponentLoadMore>
    </div>
  </view>
</template>

<script>
  import config from '@/config'
  import ComponentAddressPicker from './address-picker.vue'
  import QueryResult from './queryResult.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentLoadMore from '@/components/common/ez-load-more/ez-load-more.vue'
  import uniPopup from '@/components/common/ez-popup/ez-popup.vue'
  import { requestB161 } from '@/service/api'
  export default {
    name: 'WorkForRelief',
    components: {
      ComponentAddressPicker,
      ComponentPanel,
      uniPopup,
      ComponentNoData,
      ComponentLoadMore,
      QueryResult
    },
    data() {
      return {
        areaName_zh: '',
        isExceedLimit: false, // 加载条数是否超出限制
        isLoadOver: true, // 是否加载完成
        noticeLoadOver: false, // 最新消息是否加在完成
        isRequestOver: false, // 是否请求完成 用于控制未查询到数据的显示
        queryInfo: {
          pageNo: 1,
          pageSize: 5,
          chb015: '', // 区县
          chb017: '', // 乡镇
          aab301: config.areaCode, // 地市编码
          chi931: '', // 项目工程类别
          chi934: '', // 项目工程名称
          chi037: '' // 业务局
        },
        renderData: [], // 渲染数据
        noticeList: [], // 轮播消息列表
        isFocus: false
      }
    },
    onLoad(e) {
      const { areaCode, areaName_zh } = config
      this.areaName_zh = areaName_zh
      this.queryNoticeList()
      this.queryData()
    },
    methods: {
      handleChangePicker(id, value) {
        const len = value.length
        if (len === 2) {
          this.queryInfo.chb015 = value[0].orgid
          this.queryInfo.chb017 = value[1].orgid
        }
        if (len === 1) {
          this.queryInfo.chb015 = value[0].orgid
        }
      },
      // 打开弹窗
      toggle() {
        this.$refs.popup.open('center')
      },
      // 关闭弹窗
      closePopup() {
        this.$refs.popup.close()
      },
      // 第一次进入请求前三条数据用于消息轮播
      queryNoticeList() {
        const { aab301 } = this.queryInfo
        requestB161('', '', aab301, '', '', '', '1', '3')
          .then((res) => {
            const { list } = res.lists.hi93List
            if (list && list.length > 0) {
              this.noticeList = [...list]
            }
          })
          .finally(() => {
            this.noticeLoadOver = true
          })
      },
      // 速览新上线项目
      handleViewNewProject(item) {
        this.renderData = [{ ...item }]
        this.isLoadOver = true
      },
      // 查询
      queryData() {
        const { pageNo, pageSize, chb015, chb017, chi934, aab301 } = this.queryInfo
        requestB161(chb015, chb017, aab301, '', chi934, '', pageNo + '', pageSize + '')
          .then((res) => {
            const { list } = res.lists.hi93List
            if (list && list.length > 0) {
              const len = list.length
              // 第一次加载
              if (pageNo < 2) {
                // 加载完成
                if (len < pageSize) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                  this.isExceedLimit = true
                }
                this.renderData = [...list]
              } else {
                // 加载更多
                // 加载完成
                if (len < pageSize) {
                  this.isLoadOver = true
                } else {
                  // 加未载完成 还有文件待加载
                  this.isLoadOver = false
                }
                this.renderData = [...this.renderData, ...list]
              }
            } else {
              this.isLoadOver = true
              if (pageNo < 2) {
                this.renderData = []
              } else {
                this.renderData = [...this.renderData]
              }
            }
          })
          .finally(() => {
            this.isRequestOver = true
          })
      },
      // 搜索
      queryDataByKeyWords() {
        this.queryInfo.pageNo = 1
        this.queryInfo.pageSize = 5
        this.renderData = []
        this.isLoadOver = true
        this.isRequestOver = false
        this.queryData()
      },
      // 加载更多
      handleClickLoadMore() {
        this.queryInfo.pageNo++
        this.queryData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .work-for-relief {
    padding: $spacing;

    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 92rpx;
      padding: 0 30rpx;
      background-color: #fff;

      .address-picker {
        display: none;
      }

      .search-input {
        flex: 1;
        display: flex;
        align-items: center;
        width: 500rpx;
        height: 72rpx;
        padding: 10rpx;
        border-radius: 12rpx;
        border: solid 1rpx #999999;

        .input-box {
          flex: 1;
        }

        .btn-box {
          width: 130rpx;
          height: 50rpx;
          background-color: #3882ff;
          border-radius: 12rpx;
          text-align: center;
          line-height: 50rpx;
          font-size: 28rpx;
          color: #fff;
        }
      }
    }

    .scroll {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30rpx;
      width: 100%;
      height: 56rpx;
      padding: 0 30rpx;
      background-color: #fff;

      .img-n {
        width: 30rpx;
        height: 33rpx;
      }

      .notice {
        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        text-align: center;
        line-height: 56rpx;
        font-size: 28rpx;
        color: #000000;

        .swiper {
          width: 100%;
          height: 100%;

          .swiper-item {
            display: table;

            .swiper-content {
              display: table-cell;
              vertical-align: middle;
              font-size: 28rpx;

              .swiper-click {
                color: #006dec;
              }
            }
          }
        }
      }

      .no-notice {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 28rpx;
      }
    }

    .introduce {
      position: fixed;
      top: 240rpx;
      right: 0;
      width: 200rpx;
      height: 60rpx;
      background-color: #3882ff;
      box-shadow: 0rpx 3rpx 8rpx 0rpx rgba(0, 0, 0, 0.16);
      border-radius: 8rpx 0rpx 0rpx 8rpx;
      font-size: 28rpx;
      line-height: 60rpx;
      text-align: center;
      color: #ffffff;
    }

    .content {
      width: 100%;
      margin-top: 30rpx;
    }

    .panel-content {
      .introduce-title {
        font-size: 36rpx;
        color: #000000;
      }

      .top-distance {
        margin-top: 40rpx;
      }

      .title-answer {
        margin-top: 16rpx;
        font-size: 28rpx;
        color: #999999;
      }

      .scroll-view_H {
        margin-top: 16rpx;
        width: 100%;
        height: 160rpx;
        white-space: nowrap;

        .img-g {
          display: inline-block;
          width: 220rpx;
          height: 160rpx;

          &:not(:first-child) {
            margin-left: 30rpx;
          }
        }
      }

      .close-popup {
        margin-top: 80rpx;
        width: 100%;
        height: 88rpx;
        background-color: rgba(0, 109, 236, 0.05);
        border: solid 1rpx #006dec;
        font-size: 32rpx;
        line-height: 88rpx;
        color: #0076ff;
        text-align: center;
      }
    }
  }
</style>
