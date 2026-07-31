<!-- 求职招聘/人才推荐 -->
<!-- 传入1出现查看简历按钮 -->
<template>
  <div class="tRecom">
    <div class="topMesg">
      <img v-if="talentRecomeMesg.aac004==2" :src="talentRecomeMesg.aae707?talentRecomeMesg.aae707:getRealImgUrl('img/recruitTalents/female.png')" alt="" />
      <img v-else :src="talentRecomeMesg.aae707?talentRecomeMesg.aae707:getRealImgUrl('img/recruitTalents/male.png')" alt=""/>
      <div>
        <div>
          <span>{{ talentRecomeMesg.aac003 | nameChange }}</span>
          <span
            >发布：{{
              moment(talentRecomeMesg.aae395).format("YYYY-MM-DD")
            }}</span
          >
        </div>
        <div>
          <span
            >学历：<span :title="talentRecomeMesg.aac011_dsc">{{ talentRecomeMesg.aac011_dsc }}</span></span
          >
          <span
            >经验：<span :title="talentRecomeMesg.acc217_dsc">{{ talentRecomeMesg.acc217_dsc }}</span></span
          >
        </div>
      </div>
    </div>
    <div class="bottomMesg">
      <div>
        <span>意向职位：</span>
        <div>
          <span>
            <span :title="talentRecomeMesg.aca112" >{{ talentRecomeMesg.aca112 }}</span>
          </span>
        </div>
      </div>
      <div v-if="isSeeResume == 1" @click="searchEvent" >查看简历</div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "talentRecom",
  props: {
    isSeeResume: {
      type: Number,
    },
    talentRecomeMesg: {
      type: Object,
    },
  },
  filters:{
    nameChange(val){
      return val?val.slice(0,1) + '**' : ''
    }
  },
  methods: {
    moment,

    searchEvent(){
      this.$parent.aac001 = this.talentRecomeMesg.aac001
    }
  },
};
</script>

<style lang="less" scoped>
// @import "../css/common.less";
.tRecom {
  padding: 23px 16px 18px 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: #999999;
  background-color: #ffffff;
  cursor: pointer;
  > .topMesg {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 17px;
    border-bottom: 1px dashed #dddddd;
    > img {
      width: 42px;
      height: 42px;
      margin-right: 12px;
    }
    > div {
      width: 214px;
      width: calc(100% - 54px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      >div:nth-of-type(2){
        >span:nth-of-type(1){
          width: 50%;
        }
        >span:nth-of-type(2){
          width: 40%;
        }
        >span{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      > div:nth-child(1) {
        > span:nth-child(1) {
          font-size: 16px;
          color: #333333;
        }
      }
      > div:nth-child(2) {
        > span {
          > span {
            color: #666666;
          }
        }
      }
    }
  }
  > .bottomMesg {
    height: calc(100% - 60px);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    > div:nth-of-type(1) {
      color: #333333;
      display: flex;
      >div{
        max-width: 170px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      > span {
        > span:nth-child(2) {
          margin: 0 2px;
        }
      }
      > span:nth-last-child(1) {
        > span:nth-child(2) {
          display: none;
        }
      }
    }
    > div:nth-of-type(2) {
      cursor: pointer;
      color: #007dee;
    }
    > div:nth-of-type(2):hover {
      font-weight: bold;
    }
  }
}

.tRecom:hover {
  border: 1px solid #007dee;
  box-shadow: 0 0 8px #007dee;
  > .topMesg {
    > div {
      > div:nth-child(1) {
        > span:nth-child(1) {
          color: #007dee;
        }
      }
    }
  }
}
</style>
