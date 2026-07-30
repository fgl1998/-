<template>
    <div class="content">
        <van-radio-group v-model="selectData">
            <div class="card-list" v-for="(item, index) in listInfo" :key="index" @click="selectHouseInfo(item)">
                <van-radio :name="item">
                    {{ item.dkzh }}
                    <span class="radio_flag">未还清</span>
                </van-radio>
                <div class="card-item">
                    <div class="l">房屋坐落</div>
                    <div class="r">
                        {{ item.fwzl }}
                    </div>
                </div>
                <div class="card-item">
                    <div class="l">贷款银行</div>
                    <div class="r">
                        {{ item.swtyhdmDesc }}
                    </div>
                </div>
                <div v-show="selectData === item">
                    <div class="rang"/>
                    <div class="icon">
                        <van-icon name="success"/>
                    </div>
                </div>
            </div>
        </van-radio-group>
    </div>
</template>

<script>
export default {
    name: "loanInfo",
    props:['listInfo'],
    data(){
        return{
            selectData: undefined,
        }
    },
    methods: {
        selectHouseInfo(val) {
            this.selectData = val
            this.$emit('selectLoanInfo',val)
        },
    },
}
</script>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.card-list{
  //width: 100%;
  position: relative;
  margin: 16px;
  padding: 16px;
  background: #FFFFFF;
  box-shadow: 0px 4px 11px 1px #EFEFEF;
  border-radius: 12px;
  //border: 1px solid @theme;
  .van-radio__label{
    font-size: 16px !important;
  }
  .van-radio{
    margin-bottom: 14px !important;
  }
  .radio_flag{
    position: absolute;
    top: 14px;
    right: 18px;
    display: inline-block;
    color: #ff9841;
    padding: 2px 10px;
    border: 1px solid #FF9841;
    border-radius: 15px;
  }
  .rang{
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    right: 0;
    top: 0px;
    border-right: 15px solid #4788FE;
    border-bottom: 15px solid transparent;
    border-left:15px solid transparent;
    border-top: 15px solid #4788FE;
    border-top-right-radius: 8px;
  }
  .icon{
    color: white;
    position: absolute;
    right: 1px;
    top: 1px;
    font-size: 14px;
    display: inline-block;
  }
  .card-item{
    margin-top: 12px;
    padding-left: 28px;
    display: flex;
    font-size: 16px;
    .l{
      margin-right: 10px;
    }
    .r{
      flex: 2;
      text-align: right;
    }
  }
  .greyColor{
    color: #999;
  }
}
</style>
