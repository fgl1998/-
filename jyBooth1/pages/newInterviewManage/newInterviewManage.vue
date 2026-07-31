<!-- 新面试管理 -->
<template>
  <!-- 公用页面容器 -->
  <xu-common-shell :title="loginInfo.aab004">
    <view class="contentBox">
      <view class="content">
        <xu-common-title zh="面试管理">
          <template slot="btn">
            <view>
              全部（100）
            </view>
            <view>
              全部（100）
            </view>
            <view>
              全部（100）
            </view>
          </template>
        </xu-common-title>
        <view class="list">
          <view v-for="item in 4">
            <c-c31-item :cc31="{}"></c-c31-item>
          </view>
        </view>

        <view class="pagination">
          <view>
            <view>共 {{ this.pageInfo.totalNum }} 条</view>
          </view>
          <view>
            <view @click="prevOrNext(-1)">上一页</view>
            <view v-for="(item,index) in this.pageInfo.pages" :key="index"
                  class="page"
                  :class="{actived:item===this.pageInfo.currentPage}"
                  @click="select(item)">
              <span>{{ item }}</span>
            </view>
            <view @click="prevOrNext(1)">下一页</view>
          </view>
        </view>
      </view>
    </view>
  </xu-common-shell>
</template>

<script>
import xuCommonShell from "../../components/xu-common-shell/xu-common-shell.vue";
import CC31Item from "./components/CC31Item.vue";

export default {
  components: {CC31Item, xuCommonShell},
  name: "newInterviewManage",
  data() {
    return {
      navList: [
        {
          name: "待确认",
        },
        {
          name: "待面试",
        },
        {
          name: "待评价",
        },
        {
          name: "已完成",
        }
      ],
      userInfo: {},
      pageInfo: {
        totalPages: 1,
        currentPage: 1,
        pageSize: 9,
      },
    };
  },
  created() {
    this.loginInfo = this.$loginConfig.getLoginInfo();
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据查询
    getDataList() {
      const param = {
        apiCode: "jy201_hrm121",
        method: "jy201_hrm121",
        aab001: this.userInfo.aab001,
        action: this.action,
        pageSize: 3,
        pageNumber: this.currentPage,
        yae100: '25'
      };
      this.$http.post(this.$requestConstant.businessRequestType, 'jy201_hrm121', null, param, true).then((responseData) => {

      })
    },
  },
};
</script>

<style lang="scss" scoped>
.contentBox {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 10px;
  }

  .fontStyle1 {
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    font-size: 18px;
    color: #666666;
    line-height: 27px;
    text-align: left;
    font-style: normal;
  }

  * {
    box-sizing: border-box;
    //border: 1px solid red;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 24px 32px;

    /deep/ .right_title {
      display: flex;

      view {
        width: 200px;
        height: 28px;
        margin-left: 10px;

        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 28px;
        color: #333333;
        line-height: 42px;
        text-align: left;
        font-style: normal
      }
    }

    > .list {
      > view {
        margin: 10px 0;
      }
    }

    > .pagination {
      position: relative;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      > view:first-child {
        font-size: 16px;
        font-weight: 400;
        color: #999999;

        > span {
          color: #007dee;
          font-weight: bolder;
        }
      }

      > view:last-child {
        display: flex;
        align-items: center;

        > view {
          width: 42px;
          height: 38px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #EEEEEE;
          text-align: center;
          line-height: 38px;
          font-size: 16px;
          font-weight: 400;
          color: #999999;
          margin-right: 10px;
        }

        > view:first-child,
        > view:last-child {
          width: 65px;
        }

        > view:last-child {
          margin-right: 0;
        }

        > view.actived {
          color: #fff;
          background-color: #007dee !important;
        }
      }
    }
  }
}

</style>
