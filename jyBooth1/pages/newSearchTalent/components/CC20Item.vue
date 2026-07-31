<!-- 个人求职意向 -->
<template>
  <view class="CC20Item">
    <view class="header">
      <view class="header-title">
        求职意向：
      </view>
      <view class="header-subtitle">
        {{ this.cc20_.aca112 }}
      </view>
    </view>
    <view class="content">
      <view class="left">
        <image :src="this.cc20_.aac004 ==2 ? getRealImgUrl('img/recruitTalents/female.png') : getRealImgUrl('img/recruitTalents/male.png')"/>
        <view>
          {{ this.cc20_.acb241_o ? getAbbreviatSalary(this.cc20_.acb241_o) : "0" }}
          -{{ this.cc20_.acb242_o ? getAbbreviatSalary(this.cc20_.acb242_o) : "不限" }}
        </view>
      </view>
      <view class="center">
        <view class="row1">
          <view>{{ this.cc20_.aac003 }}</view>
          <view>刚刚活跃</view>
        </view>
        <view class="row2">
          <view>{{ this.cc20_.age }}岁</view>
          <view>{{ this.cc20_.acc217_dsc }}</view>
          <view>{{ this.cc20_.aac011_dsc }}</view>
          <view>{{ this.cc20_.acc04t_dsc }}</view>
        </view>
        <view class="row3">
          <view>优势：</view>
          <view>{{ this.cc20_.acc209 }}</view>
        </view>
      </view>
      <view class="right">
        <view>
          <view>
            <view class="state1">
              {{ this.cc20_.sim }}
            </view>
            分
          </view>
          <view>
            匹配度得分
          </view>
        </view>
        <view class="state1">
          未聘用
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "CC20Item",
  props: {
    cc20: {
      type: Object,
      default: function () {
        return {
          aac003: "熊茂森", // 姓名
          age: 23,
          acc217: "1",// 从业年数
          acc217_dsc: "0-1年",
          acc04t: "1",
          acc04t_dsc: "在职-正在找工作",
          acb241: 1000,
          acb242: 12000,
          acc209: "本人具有良好语言表达能力及沟通协调能力;对工作认真细心用心、积极主动、敬业爱岗;",
          sim: 0,
          aac011: "",
          aac011_dsc: "",
        }
      },
    },
  },
  data() {
    return {
      cc20_: this.cc20
    }
  },
  created() {

  },
  methods: {},
};
</script>
<style lang="scss" scoped>
$header-height: 56px;

.CC20Item {
  //min-width: 580px;
  //min-height: 200px;

  width: 100%;
  min-height: 200px;

  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #EEEEEE;

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

  > .header {
    width: 100%;
    height: $header-height;

    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: 32px;

    background: #E7F2FC;
    border-radius: 7px 7px 0px 0px;

    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    text-align: left;
    font-style: normal;

    > view:first-child {
      color: #999999;
    }

    > view:last-child {
      color: #333333;
    }
  }

  > .content {
    height: calc(100% - $header-height);
    display: flex;

    > .left {
      width: calc(30px * 2 + 68px);
      padding: 20px 30px;

      > image {
        width: 68px;
        height: 68px;
      }

      > view {
        margin-top: 3px;
        background: #FF4645;
        border-radius: 14px;
        text-align: center;
        color: #FFFFFF;
      }
    }

    > .center {
      width: calc(100% - (30px * 2 + 68px) - (94px + 24px));
      padding: 5px 0;

      > view {
        display: flex;
        align-items: center;
        padding: 8px 0;
      }

      > :first-child {
        > :first-child {
          font-family: SourceHanSansCNBold, SourceHanSansCNBold;
          font-weight: bold;
          font-size: 20px;
          color: #333333;
          line-height: 30px;
          text-align: left;
          font-style: normal;
        }

        > :nth-child(2) {
          margin-left: 10px;
          @extend .fontStyle1
        }
      }

      > :nth-child(2) {
        > view {
          margin-left: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          @extend .fontStyle1
        }

        > :first-child {
          margin-left: 0;
          width: 50px;
        }

        > :nth-child(2) {
          width: 60px;
        }

        > :nth-child(3) {
          width: 100px;
        }

        > :nth-child(4) {
          width: 100px;
        }
      }

      > :nth-child(3) {
        @extend .fontStyle1;

        width: 280px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        :first-child {
        }

        :last-child {
          width: 100%;
        }
      }
    }

    > .right {
      width: calc(94px + 24px);

      > :first-child {
        > :first-child {
          display: flex;
          align-items: center;
          justify-content: center;

          > :first-child {
            font-family: SourceHanSansCNBold, SourceHanSansCNBold;
            font-weight: bold;
            font-size: 28px;
            color: #666666;
            line-height: 42px;
            text-align: left;
            font-style: normal;
          }

          > :nth-child(2) {
            margin-left: 5px;
            @extend .fontStyle1;
          }
        }

        > :nth-child(2) {
          margin-top: 10px;
          text-align: center;
        }
      }

      > :last-child {
        background: #E5EDF9;
        border-radius: 4px;
        border: 1px solid #C7D5E9;
        text-align: center;

        margin: 20px;
      }

      // 未聘用
      > .state1 {

      }

      // 已聘用
      > .state2 {
        color: #07B313;
      }

      // 面试邀请
      > .state3 {
        color: #FFFFFF;

        & {
          background: #0682FE;
        }
      }

      // 面试反馈
      > .state4 {
        color: #FE4E4E;

        & {
          background: #FFE2E2;
        }
      }
    }
  }
}
</style>
