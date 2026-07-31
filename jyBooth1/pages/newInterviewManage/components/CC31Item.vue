<!-- 单位面试 -->
<template>
  <view class="item">
    <view class="col1">
      <image src="../../../static/images/img/recruitTalents/male.png"/>
      <view>
        5k-11k
      </view>
    </view>
    <view class="col2">
      <view>
        <view>示例*熊茂森</view>
        <view>刚刚活跃</view>
        <view>
          <image src="../../../static/images/img/recruitTalents/male.png"/>
          <view>同事聊过</view>
        </view>
        <view>
          <image src="../../../static/images/img/recruitTalents/male.png"/>
          <view>吸纳就业补贴</view>
        </view>
      </view>
      <view>
        <view>23岁</view>
        <view>1年以内</view>
        <view>本科</view>
        <view>离职-随时到岗</view>
      </view>
      <view>
        <view>优势：</view>
        <view>工作积极务实,勇于承担责任,勇于承担责任,勇于承担责任...</view>
      </view>
    </view>
    <view class="col3">
      <view v-for="item in 3">
        <image src="../../../static/images/img/recruitTalents/male.png"/>
        <view>2022.09 - 2024.10</view>
        <view>纬创资通股份有限公司</view>
        <view>运维工程师</view>
      </view>
    </view>
    <view class="col4">
      <view>
        运维工程师
      </view>
      <view>
        面试职位
      </view>
    </view>
    <view class="col5">
      <view>
        线上面试
      </view>
      <view>
        面试方式
      </view>
    </view>
    <view class="col6">
      <view>
        2024-04-21 18:32:28
      </view>
      <view>
        面试时间
      </view>
    </view>
    <view class="col7">
      <image src="../../../static/images/img/recruitTalents/male.png"/>
    </view>
  </view>
</template>

<script>
export default {
  name: "CC31Item",
  props: {
    cc31: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      cc31_: this.cc31
    }
  },
  created() {

  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.item {
  height: 156px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #EEEEEE;

  display: flex;
  justify-content: space-between;
  align-items: center;

  * {
    box-sizing: border-box;
    //border: 1px solid red;
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

  .fontStyle2 {
    font-weight: bold;
  }

  > .col1 {
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

  > .col2 {
    width: 480px;
    padding: 5px 5px;

    > view {
      display: flex;
      align-items: center;
      padding: 8px 0;
    }

    > :first-child {

      > :first-child {
        @extend .fontStyle1;
        @extend .fontStyle2;
        font-size: 20px;

      }

      > :nth-child(2) {
        margin-left: 10px;
        @extend .fontStyle1
      }

      > :nth-child(3) {
        display: flex;
        align-items: center;
        margin-left: 10px;

        background: linear-gradient(270deg, #2E87FE 0%, #32AFFE 100%), linear-gradient(270deg, #006AFF 0%, #32AFFE 100%), #FEF1DB;
        border-radius: 12px;

        padding: 3px 5px;

        image {
          width: 20px;
          height: 20px;
          padding: 1px;
        }
      }

      > :nth-child(4) {
        display: flex;
        align-items: center;
        margin-left: 10px;

        background: linear-gradient(270deg, #FFA322 0%, #FEC432 100%), #FEF1DB;
        border-radius: 12px;

        padding: 3px 5px;


        image {
          width: 20px;
          height: 20px;
          padding: 1px;
        }
      }

    }

    > :nth-child(2) {
      > view {
        margin-left: 10px;
        @extend .fontStyle1
      }

      > :first-child {
        margin-left: 0;
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

  > .col3 {
    align-content: center;

    view {
      image {
        width: 20px;
        height: 20px;
        padding: 1px;
      }

      @extend .fontStyle1;
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 3px;
      margin-right: 10px;
    }
  }

  > .col4 {
    align-content: center;
    justify-content: center;
    padding: 3px 5px;

    > :first-child {
      @extend .fontStyle2;
    }

    > view {
      @extend .fontStyle1;
      text-align: center;
    }
  }

  > .col5 {
    @extend .col4;
  }

  > .col6 {
    @extend .col5;
  }

  > .col7 {
    align-content: center;
    text-align: center;
    padding: 20px 30px;

    image {
      width: 45px;
      height: 45px;
    }
  }
}
</style>
