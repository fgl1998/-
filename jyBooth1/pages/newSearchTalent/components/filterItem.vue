<!-- 筛选项页面 -->
<template>
  <div class="filterItem" >
    <div class="label">{{ label }}</div>
    <div class="check_btns">
      <div class="btn" :class="{btn_checked: isChecked(item)}" @click="handleBtnCheck(item,index)" v-for="(item, index) in codeList" :key="index">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "filterItem",
  props: {
    // 前面显示的label
    label: {
      type: String,
      default: "",
    },
    // 数据数组
    codeList: {
      type: Array,
      default: [],
    },
    // 是否为行内块样式
    isInline: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      // 当前选中项
      btnChecked: [],
      isExpandData: false,
    }
  },
  methods: {
    isChecked(item){
      if((!this.btnChecked || this.btnChecked.length === 0) && item.label === '不限') return true
      let obj = this.btnChecked.find(one => item === one)
      if(obj) {
        return true
      } else {
        return false
      }
    },
    // 选中数据并返回
    handleBtnCheck(item,index){
      if(item.label === '不限') {
        this.btnChecked = []
      } else {
        let obj = this.btnChecked.find(one => item === one)
        if(obj){
          this.btnChecked = this.btnChecked.filter(one => item !== one)
        } else {
          this.btnChecked.push(item)
        }
      }
      this.$emit('change',this.btnChecked)
    }
  }
};
</script>
<style lang="less" scoped>
.filterItem {
  padding: 6px 0;
  display: flex;
  > div {
    display: inline-block;
    vertical-align: middle;
  }
  .label {
    width: 90px;
    height: 28px;
    line-height: 28px;
    text-align: right;
  }
  .check_btns {
    display: flex;
    flex-wrap: wrap;
    padding-left: 13px;
    width: 1200px;
    .btn {
      min-width: 40px;
      padding: 8px 12px;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #666666;
      margin: 0 8px;
      height: 28px;
      cursor: pointer;
      &:hover {
        background-color: #1380ff;
        border-radius: 4px;
        color: #fff;
      }
    }
    .btn_checked {
      background-color: #1380ff;
      border-radius: 4px;
      color: #fff;
    }
  }
}
.expand {
  width: 48px;
  height: 100%;
  margin-top: 17.6px;
  cursor: pointer;
  > i {
    font-size: 14px;
    margin-right: 2px;
    color: #717d94;
  }
  > span {
    font-size: 14px;
    font-family: "Source Han Sans CN";
    font-weight: 500;
    color: #717d94;
  }
}
</style>
