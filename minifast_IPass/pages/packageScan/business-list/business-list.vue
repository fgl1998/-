<template>
  <div class="business-list-container">
    <div
      class="business-list-content"
      v-for="(item, index) in businessList"
      :key="index"
    >
      <div class="business-list-title" @click="showitem(index)">
        {{ item.chm741 }}
      </div>
      <div class="list-content">
        <block v-for="(child, i) in businessList[index].dataInfo" :key="i">
          <div
            @click="showdetail(index, i)"
            :class="[
              'business-list-item',
              item.isShowItem ? 'content-open' : 'content-close'
            ]"
          >
            {{ child.chm742 }}
          </div>
          <div
            :class="[
              'item-detail',
              item.isShowItem && child.isShowDetail
                ? 'content-open'
                : 'content-close'
            ]"
          >
            {{ child.chm743 }}
          </div>
        </block>
      </div>
    </div>
  </div>
</template>
<script>
import { requestB204 } from '@/service/api'
export default {
  name: 'pageBusinessList',
  data() {
    return {
      isShowitem: false,
      businessList: []
    }
  },
  components: {},
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  mounted() {
    this.requestData()
  },
  methods: {
    showitem(index) {
      for (let i = 0; i < this.businessList.length; i++) {
        if (index == i) {
          let item = this.businessList[i]
          item.isShowItem = !item.isShowItem
          //若为关闭则同时关闭该项目下的所有详情展示
          if(item.isShowItem == false){
            for (let j = 0; j < this.businessList[i].dataInfo.length; j++) {
                let item = this.businessList[i].dataInfo[j]
                item.isShowDetail = false
                this.businessList[i].dataInfo.splice(j, 1, item)
            }
          }
          this.businessList.splice(i, 1, item)
        }
      }
    },

    showdetail(parentIndex, childIndex) {
      for (let i = 0; i < this.businessList.length; i++) {
        for (let j = 0; j < this.businessList[i].dataInfo.length; j++) {
          if (parentIndex == i && childIndex == j) {
            let item = this.businessList[i].dataInfo[j]
            item.isShowDetail = !item.isShowDetail
            this.businessList[i].dataInfo.splice(j, 1, item) //立即更新数据this.$set
          }
        }
      }
    },

    formateData(list) {
      //合并同类
      let tempArr = []
      for (let i = 0; i < list.length; i++) {
        if (tempArr.indexOf(list[i].chm741) === -1) {
          this.businessList.push({
            chm741: list[i].chm741,
            dataInfo: [list[i]]
          })
          tempArr.push(list[i].chm741)
        } else {
          for (let j = 0; j < this.businessList.length; j++) {
            if (this.businessList[j].chm741 == list[i].chm741) {
              this.businessList[j].dataInfo.push(list[i])
              break
            }
          }
        }
      }
      //排序
      for (let i = 0; i < this.businessList.length; i++) {
        this.businessList[i].dataInfo.sort(function (a, b) {
          return a.chm744 - b.chm744
        })
      }

      //添加是否显示属性
      // for (let i = 0; i < this.businessList.length; i++) {
      //   i == 0
      //     ? (this.businessList[i].isShowItem = true)
      //     : (this.businessList[i].isShowItem = false)
      //   for (let j = 0; j < this.businessList[i].dataInfo.length; j++) {
      //     i == 0 && j == 0
      //       ? (this.businessList[i].dataInfo[j].isShowDetail = true)
      //       : (this.businessList[i].dataInfo[j].isShowDetail = false)
      //   }
      // }
      for (let i = 0; i < this.businessList.length; i++) {
        this.businessList[i].isShowItem = false
        for (let j = 0; j < this.businessList[i].dataInfo.length; j++) {
          this.businessList[i].dataInfo[j].isShowDetail = false
        }
      }

    },
    requestData() {
      requestB204().then((res) => {
        if (res.code == 200) {
          this.formateData(res.lists.hm74DomainList.list)
        }
      })

      //测试数据
      // this.businessList = [{
      //   chm741:'8888',
      //   isShowItem:false,
      //   dataInfo:[{
      //     isShowDetail:false,
      //     chm742:'1',
      //     chm743:'1',
      //     chm744:1
      //   },{
      //     isShowDetail:false,
      //     chm742:'2',
      //     chm743:'2',
      //     chm744:2
      //   }]
      // },{
      //   chm741:'99999',
      //   dataInfo:[
      //     {
      //     isShowDetail:false,
      //     chm742:'2',
      //     chm743:'2',
      //     chm744:3
      //     }
      //   ]
      // }]
    }
  }
}
</script>
<style lang="scss" scoped >
// 下拉过渡

.content-open {
  padding: 20rpx 10rpx;
  max-height: 500rpx;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.25, 1);
  border: 1px solid rgb(121, 121, 121);
}

.content-close {
  max-height: 0;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.25, 1);
  border: 0px solid rgb(76, 127, 245);
  overflow: hidden;
  // 收起时元素仍存在，有margin
  margin-top: 0 !important;
}

.business-list-container {
  width: 100%;
  background-color: rgb(76, 127, 245);
  .business-list-content {
    padding-top: 50rpx;
  }
  .business-list-title,
  .business-list-item,
  .item-detail {
    margin: 0 auto;
    text-align: center;
    background-color: #fff;
  }
  .business-list-title {
    width: 660rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 40rpx;
    border: 1px solid rgb(121, 121, 121);
    border-radius: 24rpx;
    font-weight: bold;
  }
  .business-list-item,
  .item-detail {
    width: 600rpx;
    font-size: 30rpx;
    border-radius: 24rpx;
    box-sizing: border-box;
    margin-top: 30rpx;
  }
  .item-detail {
    font-weight: normal;
    background-color: #eee;
  }
}
</style>