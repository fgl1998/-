<!-- 人才筛选框 -->
<template>
  <div class="searchCard" >
    <!-- <div class="more_add" >
      多选+
    </div> -->
    <filterItem label="工作年限:" :codeList="acc217List" v-on:change="changeAcc217" />
    <filterItem label="年龄:" :codeList="ageList"  v-on:change="changeAge"/>
    <filterItem label="求职状态:" :codeList="acc04tList"  v-on:change="changeAcc04t"/>
    <!-- <filterItem v-if="!showMore" label="简历亮点:" :codeList="lightList" v-on:change="changeAcc20c"/> -->
    <!-- <filterItem v-if="!showMore" label="公司行业:" :codeList="aab022List" v-on:change="changeAab022"/> -->

    <!-- <span class="show_more" v-if="showMore"  @click="handleShowMore()">展开更多选项<i class="el-icon-arrow-down" style="margin-left: 5px;" type="down" /></span> -->
    <!-- <span class="show_more" v-if="!showMore" @click="handleShowMore()">收起<i class="el-icon-arrow-up" style="margin-left: 5px;" type="up" /></span> -->
  </div>
</template>
<script>
import filterItem from './filterItem.vue'
export default {
  name: 'searchCard',
  components: {
    filterItem
  },

  props: {
    setParam: undefined,
    setParamList: undefined,
  },


  data(){
    return {
      // 公司行业
      aab022List: [],
      // 工作年限
      acc217List: [],
      // 求职状态
      acc04tList: [],
      // 简历亮点
      lightList: [
        {
          label: '不限',
          value: null
        },
        {
          label: '形象好',
          value: null
        },
        {
          label: '气质佳',
          value: null
        },
        {
          label: '高学历',
          value: null
        },
      ],
      // 年龄
      ageList: [
        {
          label: '不限',
          value: 5,
        },
        {
          label: '18-30',
          value: 1,
        },
        {
          label: '30-40',
          value: 2,
        },
        {
          label: '40-50',
          value: 3,
        },
        {
          label: '50以上',
          value: 4,
        },
      ],

      showMore:true
    }
  },
  mounted(){
    this.initCodeData()
  },

  methods: {

    // 获取筛选项相关码值
    initCodeData(){
      // 工作年限
      this.$codeConfig.getDictText('AAB022_1').then((codeList) => {
        this.aab022List = codeList
      })

      // 工作年限
      this.$codeConfig.getDictText('ACC217').then((codeList) => {
        this.acc217List = codeList
      })

      // 求职状态
      this.$codeConfig.getDictText('ACC04T').then((codeList) => {
        this.acc04tList = codeList
      })
    },

    changeAcc217(val){ // 工作经验
      let newVal = []
      val.forEach(item => {
        if(item.value){
          newVal.push(item.value)
        }
      })
      this.setParam("acc217",newVal.join(','))
    },

    changeAge(val){ // 年龄段
      let newVal = []
      val.forEach(item => {
        if(item.value){
          newVal.push(item.value)
        }
      })
      this.setParam("age",newVal.join(','))
    },

    changeAcc04t(val){ //求职状态
      let newVal = []
      val.forEach(item => {
        if(item.value){
          newVal.push(item.value)
        }
      })
      this.setParam("acc04t",newVal.join(','))
    },

    changeAcc20c(val){ //简历亮点
      let newVal = []
      val.forEach(item => {
        if(item.value){
          newVal.push(item.value)
        }
      })
      this.setParam("acc20c",newVal.join(','))
    },

    changeAab022(val){ // 行业
      let newVal = []
      val.forEach(item => {
        if(item.value){
          newVal.push(item.value)
        }
      })
      this.setParam("aab022",newVal.join(','))
    },

    handleShowMore(){
      this.showMore = !this.showMore
    }
  },

}
</script>
<style lang="less" scoped>
.searchCard{
  border-bottom: 1px solid #f6f7fa;
  padding: 14px 100px 14px 29px;
  position: relative;
  .more_add{
    position: absolute;
    width: 52px;
    height: 32px;
    background-color: #eef1f5;
    border-radius: 2px;
    top: 14px;
    right: 24px;
    z-index: 1;
    text-align: center;
    line-height: 32px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #858b94;
    cursor: pointer;
  }
  .show_more{
    position: absolute;
    right: 25px;
    bottom: 13px;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #1380ff;
    cursor: pointer;
  }
}
</style>
